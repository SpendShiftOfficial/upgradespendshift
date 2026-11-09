import { cleanAmount, validateSaving } from "./calculations";
import { AU_STATES } from "./guides";
import {
  CATEGORY_KEYS,
  type CategoryKey,
  type Personalisation,
  type RecordedSaving,
  type SubscriptionItem,
  type TaskProgress,
  type TaskStatus,
} from "./types";

/*
 * Everything the browser sends is untrusted. These functions accept only the
 * fields we expect, in the shapes we expect, and drop everything else.
 */

const STATUSES: TaskStatus[] = [
  "not_started",
  "in_progress",
  "completed_no_saving",
  "completed_saving",
];

const STATE_VALUES = AU_STATES.map((s) => s.value);

function str(v: unknown, max = 80): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/[<>]/g, "").trim().slice(0, max);
  return s || null;
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

function strList(v: unknown, maxItems = 12, maxLen = 40): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v.slice(0, maxItems)) {
    const s = str(item, maxLen);
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

const YNU = ["yes", "no", "unsure"] as const;

export function sanitisePersonalisation(input: unknown): Personalisation {
  const p = obj(input);
  const out: Personalisation = {};

  if (p.takeaway !== undefined) {
    const d = obj(p.takeaway);
    out.takeaway = {
      weeklySpend: cleanAmount(d.weeklySpend),
      weeklyReduction: cleanAmount(d.weeklyReduction),
    };
  }

  if (p.convenience !== undefined) {
    const d = obj(p.convenience);
    out.convenience = {
      weeklySpend: cleanAmount(d.weeklySpend),
      weeklyReduction: cleanAmount(d.weeklyReduction),
      reduceTypes: strList(d.reduceTypes),
    };
  }

  if (p.unplanned !== undefined) {
    const d = obj(p.unplanned);
    out.unplanned = {
      monthlySpend: cleanAmount(d.monthlySpend),
      frequency: str(d.frequency, 40),
      monthlyReduction: cleanAmount(d.monthlyReduction),
    };
  }

  if (p.subscriptions !== undefined) {
    const d = obj(p.subscriptions);
    const items: SubscriptionItem[] = [];
    if (Array.isArray(d.items)) {
      for (const raw of d.items.slice(0, 30)) {
        const i = obj(raw);
        const name = str(i.name, 40);
        const cost = cleanAmount(i.cost);
        const period = oneOf(i.period, ["week", "month", "year"] as const);
        if (!name || cost === null || !period) continue;
        items.push({
          name,
          cost,
          period,
          rarelyUsed: i.rarelyUsed === true,
          considerCancelling: i.considerCancelling === true,
        });
      }
    }
    out.subscriptions = { items };
  }

  if (p.internet !== undefined) {
    const d = obj(p.internet);
    out.internet = {
      pays: oneOf(d.pays, ["internet", "mobile", "both", "neither"] as const),
      monthlyCost: cleanAmount(d.monthlyCost),
      happy: oneOf(d.happy, YNU),
      priority: str(d.priority, 40),
    };
  }

  if (p.energy !== undefined) {
    const d = obj(p.energy);
    out.energy = {
      state: oneOf(d.state, STATE_VALUES),
      paysElectricity: oneOf(d.paysElectricity, YNU),
      paysGas: oneOf(d.paysGas, YNU),
      billAmount: cleanAmount(d.billAmount),
      billPeriod: oneOf(d.billPeriod, ["month", "two_months", "quarter"] as const),
      lastCompared: str(d.lastCompared, 40),
    };
  }

  if (p.insurance !== undefined) {
    const d = obj(p.insurance);
    const renewal = str(d.nextRenewal, 10);
    out.insurance = {
      types: strList(d.types),
      premiumAmount: cleanAmount(d.premiumAmount),
      premiumPeriod: oneOf(d.premiumPeriod, ["month", "year"] as const),
      nextRenewal: renewal && /^\d{4}-\d{2}(-\d{2})?$/.test(renewal) ? renewal : null,
      lastReviewed: str(d.lastReviewed, 40),
    };
  }

  if (p.skipped !== undefined) {
    out.skipped = Array.isArray(p.skipped)
      ? (p.skipped.filter((k) => CATEGORY_KEYS.includes(k as CategoryKey)) as CategoryKey[])
      : [];
  }

  return out;
}

export type TaskUpdateResult =
  | { ok: true; key: CategoryKey; progress: TaskProgress }
  | { ok: false; error: string };

/** Validates one task update sent from the browser. */
export function sanitiseTaskUpdate(input: unknown): TaskUpdateResult {
  const t = obj(input);
  const key = oneOf(t.key, CATEGORY_KEYS);
  if (!key) return { ok: false, error: "Unknown task." };

  const status = oneOf(t.status, STATUSES);
  if (!status) return { ok: false, error: "Unknown task status." };

  const checkedSteps = Array.isArray(t.checkedSteps)
    ? Array.from(
        new Set(
          t.checkedSteps.filter(
            (n): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < 20,
          ),
        ),
      ).sort((a, b) => a - b)
    : [];

  let saving: RecordedSaving | null = null;
  if (status === "completed_saving") {
    const s = obj(t.saving);
    const result = validateSaving({
      kind: s.kind,
      before: s.before,
      after: s.after,
      period: s.period,
      amount: s.amount,
    });
    if (!result.ok) return { ok: false, error: result.error };
    saving = result.saving;
    if (typeof s.recordedAt === "string" && !Number.isNaN(Date.parse(s.recordedAt))) {
      saving = { ...saving, recordedAt: new Date(s.recordedAt).toISOString() };
    }
  }

  return {
    ok: true,
    key,
    progress: {
      status,
      checkedSteps,
      // Savings only exist on "Completed — saving recorded". Changing the
      // status removes the saving, so nothing is ever counted by mistake.
      saving,
      updatedAt: new Date().toISOString(),
    },
  };
}

/** Defensive read of stored task data (handles old or malformed rows). */
export function readStoredTasks(raw: unknown) {
  const src = obj(raw);
  const out: Partial<Record<CategoryKey, TaskProgress>> = {};
  for (const key of CATEGORY_KEYS) {
    if (!src[key]) continue;
    const r = sanitiseTaskUpdate({ ...obj(src[key]), key });
    if (r.ok) out[key] = { ...r.progress, updatedAt: String(obj(src[key]).updatedAt || r.progress.updatedAt) };
  }
  return out;
}

export function isValidReportId(id: unknown): id is string {
  return typeof id === "string" && /^rpt_[a-z0-9]{1,40}$/i.test(id);
}
