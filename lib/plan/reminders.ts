import { CATEGORY_BY_KEY, money } from "./categories";
import { estimateAll, trackerTotals } from "./calculations";
import { getGuide } from "./guides";
import { applicableKeys, pickTopTasks } from "./tasks";
import type { Personalisation, TaskProgressMap } from "./types";

/*
 * Decides which 30-day reminder (if any) is due, and what it should say,
 * using the customer's saved task progress (Phase 3).
 */

export type ReminderDay = 3 | 7 | 30;

/** A reminder is only sent inside its window, so a late re-enable never sends stale emails. */
const WINDOWS: Record<ReminderDay, [number, number]> = {
  3: [3, 7],
  7: [7, 14],
  30: [30, 38],
};

export type ReminderSentFlags = {
  day3: string | null;
  day7: string | null;
  day30: string | null;
};

export function dueReminder(
  startedAt: string | null,
  sent: ReminderSentFlags,
  now: Date = new Date(),
): ReminderDay | null {
  if (!startedAt) return null;
  const start = Date.parse(startedAt);
  if (Number.isNaN(start)) return null;
  const days = (now.getTime() - start) / 86400000;
  for (const day of [3, 7, 30] as ReminderDay[]) {
    const [from, to] = WINDOWS[day];
    const flag = day === 3 ? sent.day3 : day === 7 ? sent.day7 : sent.day30;
    if (days >= from && days < to && !flag) return day;
  }
  return null;
}

export type ReminderContent = {
  subject: string;
  paragraphs: string[];
  cta: string;
};

/**
 * Returns the email content, or null when there is nothing useful to say
 * (e.g. Day 3 or Day 7 when every task is already finished).
 */
export function buildReminder(
  day: ReminderDay,
  answers: string[],
  p: Personalisation,
  tasks: TaskProgressMap,
): ReminderContent | null {
  const estimates = estimateAll(answers, p);
  const keys = applicableKeys(estimates);
  const next = pickTopTasks(estimates, tasks)[0];
  const nextTitle = next
    ? getGuide(next, {
        answer: answers[CATEGORY_BY_KEY[next].auditIndex] || "",
        estimate: estimates.find((e) => e.key === next)!,
        p,
      }).taskTitle.toLowerCase()
    : null;
  const totals = trackerTotals(tasks, keys);

  if (day === 3) {
    if (!nextTitle) return null;
    return {
      subject: "Your First SpendShift Savings Task",
      paragraphs: [
        "Hi,",
        "Your SpendShift savings plan is ready whenever you are.",
        `Your next task is to ${nextTitle}.`,
        "We've saved the steps and script inside your report.",
        "Open your plan when you're ready.",
      ],
      cta: "Open my savings plan",
    };
  }

  if (day === 7) {
    if (!nextTitle) return null;
    return {
      subject: "How Is Your Savings Plan Going?",
      paragraphs: [
        "Hi,",
        totals.completed > 0
          ? `You've finished ${totals.completed} task${totals.completed === 1 ? "" : "s"} so far. Nice work.`
          : "Have you had a chance to complete your first savings task?",
        `Your next task is to ${nextTitle}.`,
        "You can open SpendShift to update your progress and record any money you've saved.",
      ],
      cta: "Update my progress",
    };
  }

  const paragraphs = ["Hi,", "It's been 30 days since you started your SpendShift plan."];
  if (totals.completed > 0) {
    paragraphs.push(
      `You've finished ${totals.completed} of ${keys.length} task${keys.length === 1 ? "" : "s"}.`,
    );
  }
  // Only mention money the customer actually recorded. Never estimates.
  if (totals.yearly > 0) {
    paragraphs.push(
      `You've recorded ongoing savings of about ${money(totals.yearly)} a year, based on the amounts you entered.`,
    );
  }
  if (totals.oneOff > 0) {
    paragraphs.push(`You've also recorded ${money(totals.oneOff)} in one-off savings.`);
  }
  paragraphs.push(
    nextTitle
      ? `When you're ready, your next task is to ${nextTitle}.`
      : "You've worked through every task in your plan. You can open your report any time to review your progress.",
  );
  if (totals.completed === 0) {
    paragraphs.push("You can open your report to see your tasks and check what you'd like to work on first.");
  }
  return {
    subject: "Your 30-Day SpendShift Check-In",
    paragraphs,
    cta: "Open my savings plan",
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Email HTML in the same style as the existing report email. */
export function reminderHtml(content: ReminderContent, reportUrl: string, unsubscribeUrl: string, logoUrl: string) {
  const body = content.paragraphs
    .map((p) => `<p style="margin:0 0 16px; font-size:16px; line-height:1.7; color:#2A2A24;">${escapeHtml(p)}</p>`)
    .join("");
  return `<body style="margin:0; padding:0; background-color:#EDEBE3;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EDEBE3;"><tr><td align="center" style="padding:40px 16px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;"><tr><td align="center" style="padding-bottom:28px;"><img width="150" src="${logoUrl}" alt="SpendShift"></td></tr><tr><td style="background:#FFFFFF; border-radius:20px; padding:40px 40px 32px; font-family:'Poppins', Arial, sans-serif;">${body}<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 8px;"><tr><td align="center" style="background:#059625; border-radius:999px;"><a href="${reportUrl}" target="_blank" style="display:inline-block; padding:15px 36px; font-family:'Poppins', Arial, sans-serif; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:999px;">${escapeHtml(content.cta)} &rarr;</a></td></tr></table><p style="margin:16px 0 0; font-size:12.5px; line-height:1.6; color:#8B8A80;">Button not working? Paste this link into your browser:<br><a href="${reportUrl}" style="color:#3B6D11; word-break:break-all;">${reportUrl}</a></p></td></tr><tr><td align="center" style="padding:28px 24px 0; font-family:'Poppins', Arial, sans-serif;"><p style="margin:0 0 8px; font-size:12px; line-height:1.6; color:#8B8A80;">You're receiving this because you turned on savings reminders in your SpendShift plan. These are service reminders about the plan you purchased, not marketing.</p><p style="margin:0 0 8px; font-size:12px; line-height:1.6; color:#8B8A80;"><a href="${unsubscribeUrl}" style="color:#8B8A80;">Stop these reminders</a> &middot; This is general information only, not financial advice.</p><p style="margin:16px 0 0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#B3B2A6;">SpendShift &middot; info@spendshift.com.au &middot; Australia</p></td></tr></table></td></tr></table></body>`;
}

export function reminderText(content: ReminderContent, reportUrl: string, unsubscribeUrl: string) {
  return [...content.paragraphs, "", `${content.cta}: ${reportUrl}`, "", `Stop these reminders: ${unsubscribeUrl}`, "SpendShift · info@spendshift.com.au"].join("\n");
}
