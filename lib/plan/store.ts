import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { readStoredTasks, sanitisePersonalisation } from "./sanitise";
import type {
  CategoryKey,
  Personalisation,
  PlanState,
  TaskProgress,
} from "./types";

/*
 * Server-only access to the "report_plans" table.
 *
 * If the table hasn't been created yet (migration not run) or Supabase is
 * unreachable, every read falls back to an empty plan so the existing paid
 * report still opens. Writes return a clear error instead of throwing.
 */

const TABLE = "report_plans";

export type PlanRow = {
  report_id: string;
  personalisation: unknown;
  tasks: unknown;
  reminders_enabled: boolean;
  reminders_started_at: string | null;
  reminders_token: string | null;
  reminder_day3_sent_at: string | null;
  reminder_day7_sent_at: string | null;
  reminder_day30_sent_at: string | null;
  reminder_last_error: string | null;
};

export function maskEmail(email: string | null | undefined): string | null {
  if (!email || !email.includes("@")) return null;
  const [user, domain] = email.split("@");
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"•".repeat(Math.max(1, Math.min(6, user.length - visible.length)))}@${domain}`;
}

export function newToken() {
  return randomBytes(24).toString("hex");
}

export async function loadPlanRow(reportId: string): Promise<{ row: PlanRow | null; available: boolean }> {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("report_id", reportId)
      .maybeSingle();
    if (error) {
      console.error("PLAN_LOAD_ERROR:", error.message);
      return { row: null, available: false };
    }
    return { row: (data as PlanRow) || null, available: true };
  } catch (e) {
    console.error("PLAN_LOAD_FATAL:", e);
    return { row: null, available: false };
  }
}

export function toPlanState(
  row: PlanRow | null,
  available: boolean,
  email: string | null,
): PlanState {
  return {
    personalisation: row ? sanitisePersonalisation(row.personalisation) : {},
    tasks: row ? readStoredTasks(row.tasks) : {},
    reminders: {
      enabled: Boolean(row?.reminders_enabled),
      available: Boolean(email) && available,
      maskedEmail: maskEmail(email),
      startedAt: row?.reminders_started_at || null,
    },
    storageAvailable: available,
  };
}

/** Confirms a report exists and returns its email + answers. */
export async function loadReportBasics(reportId: string) {
  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("id, email, answers")
    .eq("id", reportId)
    .maybeSingle();
  if (error || !data) return null;
  return data as { id: string; email: string | null; answers: unknown };
}

async function upsert(reportId: string, patch: Partial<PlanRow>) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .upsert(
      { report_id: reportId, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "report_id" },
    )
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PlanRow;
}

export async function savePersonalisation(
  reportId: string,
  current: PlanRow | null,
  incoming: Personalisation,
) {
  const merged = {
    ...(current ? sanitisePersonalisation(current.personalisation) : {}),
    ...incoming,
  };
  return upsert(reportId, { personalisation: merged });
}

export async function saveTask(
  reportId: string,
  current: PlanRow | null,
  key: CategoryKey,
  progress: TaskProgress,
) {
  const tasks = { ...(current ? readStoredTasks(current.tasks) : {}), [key]: progress };
  return upsert(reportId, { tasks });
}

export async function setReminders(
  reportId: string,
  current: PlanRow | null,
  enabled: boolean,
) {
  const patch: Partial<PlanRow> = { reminders_enabled: enabled };
  if (enabled) {
    // The 30-day schedule starts the first time reminders are turned on.
    if (!current?.reminders_started_at) patch.reminders_started_at = new Date().toISOString();
    if (!current?.reminders_token) patch.reminders_token = newToken();
  }
  return upsert(reportId, patch);
}
