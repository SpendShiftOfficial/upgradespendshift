import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { parseAnswers } from "@/lib/plan/categories";
import {
  buildReminder,
  dueReminder,
  reminderHtml,
  reminderText,
  type ReminderDay,
} from "@/lib/plan/reminders";
import { readStoredTasks, sanitisePersonalisation } from "@/lib/plan/sanitise";
import type { PlanRow } from "@/lib/plan/store";

/*
 * Phase 4: sends the Day 3 / Day 7 / Day 30 reminder emails.
 *
 * Runs once a day via Vercel Cron (see vercel.json). Vercel sends
 * "Authorization: Bearer <CRON_SECRET>", so CRON_SECRET must be set in the
 * Vercel project settings. Without it this route refuses to run.
 *
 * Duplicate protection: each reminder is "claimed" with a conditional
 * database update (only if not already sent) before the email is sent.
 * If sending fails the claim is released so the next run can retry.
 *
 * Dry run (no emails sent, nothing changed): add ?dryRun=1
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COLUMN: Record<ReminderDay, keyof PlanRow> = {
  3: "reminder_day3_sent_at",
  7: "reminder_day7_sent_at",
  30: "reminder_day30_sent_at",
};

const BATCH_LIMIT = 200;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.spendshift.com.au";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dryRun) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
  }
  const resend = apiKey ? new Resend(apiKey) : null;

  // Only plans started in the last 40 days can have a reminder due.
  const since = new Date(Date.now() - 40 * 86400000).toISOString();
  const { data: rows, error } = await supabaseAdmin
    .from("report_plans")
    .select("*")
    .eq("reminders_enabled", true)
    .gte("reminders_started_at", since)
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("REMINDER_QUERY_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const summary = { checked: 0, sent: 0, skipped: 0, failed: 0, dryRun, details: [] as unknown[] };

  for (const row of (rows || []) as PlanRow[]) {
    summary.checked++;
    const day = dueReminder(row.reminders_started_at, {
      day3: row.reminder_day3_sent_at,
      day7: row.reminder_day7_sent_at,
      day30: row.reminder_day30_sent_at,
    });
    if (!day) continue;

    const { data: report } = await supabaseAdmin
      .from("reports")
      .select("id, email, answers")
      .eq("id", row.report_id)
      .maybeSingle();

    const content = report
      ? buildReminder(
          day,
          parseAnswers(report.answers),
          sanitisePersonalisation(row.personalisation),
          readStoredTasks(row.tasks),
        )
      : null;

    if (dryRun) {
      summary.details.push({ report: row.report_id, day, subject: content?.subject || "(skip)" });
      continue;
    }

    // Claim this reminder so it can never be sent twice.
    const column = COLUMN[day];
    const claimedAt = new Date().toISOString();
    const { data: claimed } = await supabaseAdmin
      .from("report_plans")
      .update({ [column]: claimedAt })
      .eq("report_id", row.report_id)
      .eq("reminders_enabled", true)
      .is(column, null)
      .select("report_id");

    if (!claimed || claimed.length === 0) continue;

    if (!report?.email || !content || !row.reminders_token) {
      // Nothing useful to send (e.g. every task finished). Stays marked so it isn't retried.
      summary.skipped++;
      continue;
    }

    const reportUrl = `${site}/report/${row.report_id}`;
    const unsubscribeUrl = `${site}/reminders/unsubscribe?token=${row.reminders_token}`;
    const oneClickUrl = `${site}/api/reminders/unsubscribe?token=${row.reminders_token}`;

    try {
      const result = await resend!.emails.send({
        from: "SpendShift <info@spendshift.com.au>",
        to: report.email,
        subject: content.subject,
        html: reminderHtml(content, reportUrl, unsubscribeUrl, `${site}/logo.png`),
        text: reminderText(content, reportUrl, unsubscribeUrl),
        headers: {
          "List-Unsubscribe": `<${oneClickUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (result.error) throw new Error(result.error.message);
      summary.sent++;
      await supabaseAdmin
        .from("report_plans")
        .update({ reminder_last_error: null })
        .eq("report_id", row.report_id);
    } catch (e: unknown) {
      summary.failed++;
      const message = e instanceof Error ? e.message : String(e);
      console.error("REMINDER_SEND_ERROR:", row.report_id, day, message);
      // Release the claim so tomorrow's run can retry (still inside the window).
      await supabaseAdmin
        .from("report_plans")
        .update({ [column]: null, reminder_last_error: `Day ${day}: ${message}`.slice(0, 500) })
        .eq("report_id", row.report_id)
        .eq(column, claimedAt);
    }
  }

  console.log("REMINDER_RUN:", JSON.stringify({ ...summary, details: undefined }));
  return NextResponse.json(summary);
}
