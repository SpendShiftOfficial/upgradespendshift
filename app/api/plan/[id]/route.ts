import { NextResponse } from "next/server";
import {
  isValidReportId,
  sanitisePersonalisation,
  sanitiseTaskUpdate,
} from "@/lib/plan/sanitise";
import {
  loadPlanRow,
  loadReportBasics,
  savePersonalisation,
  saveTask,
  setReminders,
  toPlanState,
} from "@/lib/plan/store";

/*
 * Saves the customer's paid-plan data (Phases 1–4).
 *
 * Access model: the same private report link that already unlocks the paid
 * report. A request can only change the plan for the report ID in the URL,
 * and every field is validated before it's saved. No AI calls happen here,
 * so updates are instant and add no AI cost.
 */

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidReportId(id)) return fail("Report not found.", 404);

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 20000) return fail("That's more information than we can save at once.", 413);
    body = JSON.parse(text);
  } catch {
    return fail("We couldn't read that update. Please try again.");
  }

  try {
    const report = await loadReportBasics(id);
    if (!report) return fail("Report not found.", 404);

    const { row, available } = await loadPlanRow(id);
    if (!available) {
      return fail("Saving isn't available right now. Your report is safe. Please try again shortly.", 503);
    }

    let saved = row;

    if (body.type === "personalisation") {
      const clean = sanitisePersonalisation(body.data);
      saved = await savePersonalisation(id, row, clean);
    } else if (body.type === "task") {
      const result = sanitiseTaskUpdate(body.data);
      if (!result.ok) return fail(result.error);
      saved = await saveTask(id, row, result.key, result.progress);
    } else if (body.type === "reminders") {
      if (typeof body.enabled !== "boolean") return fail("Unknown reminder setting.");
      if (body.enabled && !report.email) {
        return fail("We don't have an email address for this report, so reminders can't be turned on.");
      }
      saved = await setReminders(id, row, body.enabled);
    } else {
      return fail("Unknown update.");
    }

    return NextResponse.json({ plan: toPlanState(saved, true, report.email) });
  } catch (e) {
    console.error("PLAN_SAVE_ERROR:", e);
    return fail("We couldn't save that just now. Your report is safe. Please try again.", 500);
  }
}
