import {
  CATEGORIES,
  CATEGORY_BY_KEY,
  auditEstimate,
  money,
} from "./categories";
import type {
  BillPeriod,
  CategoryKey,
  Period,
  Personalisation,
  RecordedSaving,
  TaskProgressMap,
} from "./types";

/*
 * All money figures in the paid plan come from these rules.
 * The AI report may explain results, but it never produces these numbers.
 *
 * Three kinds of figure are kept strictly separate:
 *   1. Estimated saving        – from the 8 audit answers (category averages)
 *   2. More personal estimate  – from spending details the customer entered
 *   3. Savings recorded        – what the customer reports after taking action
 */

export const PER_YEAR: Record<Period, number> = {
  week: 52,
  month: 12,
  quarter: 4,
  year: 1,
};

export const BILL_PER_YEAR: Record<BillPeriod, number> = {
  month: 12,
  two_months: 6,
  quarter: 4,
};

/** Upper bound for any single amount a customer can enter. */
export const MAX_AMOUNT = 100000;

export function roundTo50(n: number) {
  return Math.round(n / 50) * 50;
}

/** Returns a safe, non-negative, finite number or null. */
export function cleanAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) return null;
  return Math.round(n * 100) / 100;
}

export type EstimateBasis = "audit" | "personal" | "excluded";

export type CategoryEstimate = {
  key: CategoryKey;
  title: string;
  basis: EstimateBasis;
  /** Yearly amount. 0 when excluded. */
  amount: number;
  /** The original audit-based figure, always kept for reference. */
  auditAmount: number;
  /** One-line plain-English explanation of how the figure was worked out. */
  explanation: string;
  /** Extra caution or "we need more info" note. */
  note?: string;
};

const AUDIT_EXPLANATION =
  "Based on your audit answer, Australian category averages and a conservative reduction target.";

function auditOnly(key: CategoryKey, answers: string[]): CategoryEstimate {
  const a = auditEstimate(key, answers);
  return {
    key,
    title: CATEGORY_BY_KEY[key].title,
    basis: a.applies ? "audit" : "excluded",
    amount: a.applies ? a.amount : 0,
    auditAmount: a.amount,
    explanation: a.applies
      ? AUDIT_EXPLANATION
      : "Excluded based on your audit answer.",
  };
}

function excluded(
  base: CategoryEstimate,
  explanation: string,
): CategoryEstimate {
  return { ...base, basis: "excluded", amount: 0, explanation };
}

function personal(
  base: CategoryEstimate,
  amount: number,
  explanation: string,
  note?: string,
): CategoryEstimate {
  return {
    ...base,
    basis: "personal",
    amount: Math.max(0, Math.round(amount)),
    explanation,
    note,
  };
}

/** A spend-based weekly target (takeaway, convenience). */
function weeklyTarget(
  base: CategoryEstimate,
  spend: number | null,
  reduction: number | null,
  label: string,
): CategoryEstimate {
  if (spend !== null && spend === 0) {
    return excluded(base, `You told us you spend $0 a week on ${label}.`);
  }
  if (reduction !== null && spend !== null && reduction > spend) {
    // Invalid combination – never claim more than they spend.
    reduction = spend;
  }
  if (reduction !== null && reduction > 0) {
    const yearly = reduction * 52;
    return personal(
      base,
      yearly,
      `Based on reducing ${label} by ${money(reduction)} a week, every week for 52 weeks (${money(reduction)} × 52 = ${money(yearly)}).`,
      spend !== null
        ? `Current spending you entered: ${money(spend)} a week.`
        : undefined,
    );
  }
  if (reduction === 0) {
    return personal(
      base,
      0,
      `You chose not to set a reduction target for ${label}, so we haven't included a saving.`,
    );
  }
  if (spend !== null && base.amount > spend * 52) {
    // Audit average is more than they actually spend: cap it.
    return personal(
      base,
      roundTo50(spend * 52 * 0.25),
      `Capped at a quarter of the ${money(spend * 52)} a year you told us you spend. Set a weekly target for a more exact figure.`,
    );
  }
  return base;
}

export function estimateCategory(
  key: CategoryKey,
  answers: string[],
  p: Personalisation,
): CategoryEstimate {
  const base = auditOnly(key, answers);
  if (base.basis === "excluded") return base;
  if (p.skipped?.includes(key)) return base;

  switch (key) {
    case "takeaway": {
      const d = p.takeaway || {};
      return weeklyTarget(
        base,
        cleanAmount(d.weeklySpend),
        cleanAmount(d.weeklyReduction),
        "takeaway and delivery",
      );
    }

    case "convenience": {
      const d = p.convenience || {};
      return weeklyTarget(
        base,
        cleanAmount(d.weeklySpend),
        cleanAmount(d.weeklyReduction),
        "convenience purchases",
      );
    }

    case "unplanned": {
      const d = p.unplanned || {};
      const spend = cleanAmount(d.monthlySpend);
      let reduction = cleanAmount(d.monthlyReduction);
      if (spend === 0) {
        return excluded(base, "You told us you spend $0 a month on unplanned purchases.");
      }
      if (reduction !== null && spend !== null && reduction > spend) reduction = spend;
      if (reduction !== null && reduction > 0) {
        const yearly = reduction * 12;
        return personal(
          base,
          yearly,
          `Based on spending ${money(reduction)} less on unplanned purchases each month for 12 months (${money(reduction)} × 12 = ${money(yearly)}).`,
          spend !== null ? `Current spending you entered: ${money(spend)} a month.` : undefined,
        );
      }
      if (reduction === 0) {
        return personal(base, 0, "You chose not to set a reduction goal, so we haven't included a saving.");
      }
      if (spend !== null && base.amount > spend * 12) {
        return personal(
          base,
          roundTo50(spend * 12 * 0.25),
          `Capped at a quarter of the ${money(spend * 12)} a year you told us you spend. Set a monthly goal for a more exact figure.`,
        );
      }
      return base;
    }

    case "subscriptions": {
      const items = (p.subscriptions?.items || []).filter(
        (i) => cleanAmount(i.cost) !== null,
      );
      if (items.length === 0) return base;
      const yearlyOf = (i: (typeof items)[number]) =>
        (cleanAmount(i.cost) || 0) * PER_YEAR[i.period];
      const toCancel = items.filter((i) => i.considerCancelling);
      const yearly = toCancel.reduce((s, i) => s + yearlyOf(i), 0);
      const totalYearly = items.reduce((s, i) => s + yearlyOf(i), 0);
      if (toCancel.length === 0) {
        return personal(
          base,
          0,
          `You listed ${items.length} subscription${items.length === 1 ? "" : "s"} (${money(totalYearly)} a year) and chose to keep them all, so we haven't included a saving.`,
        );
      }
      return personal(
        base,
        yearly,
        `Based on the ${toCancel.length} subscription${toCancel.length === 1 ? "" : "s"} you'd consider cancelling, assuming they stay cancelled for 12 months.`,
        `All subscriptions you listed cost about ${money(totalYearly)} a year.`,
      );
    }

    case "internet": {
      const d = p.internet || {};
      if (d.pays === "neither") {
        return excluded(base, "You told us you don't pay internet or mobile bills, so this is excluded.");
      }
      const monthly = cleanAmount(d.monthlyCost);
      if (monthly === null) return base;
      if (monthly === 0) {
        return excluded(base, "You entered $0 a month for internet and mobile, so this is excluded.");
      }
      const yearlySpend = monthly * 12;
      const cap = roundTo50(yearlySpend * 0.15);
      const amount = Math.min(base.auditAmount, cap);
      return personal(
        base,
        amount,
        `You pay about ${money(monthly)} a month (${money(yearlySpend)} a year). We use the lower of the category average and 15% of your yearly cost.`,
        d.happy === "yes"
          ? "You're happy with your current service, so only switch if a new plan matches the speed, data and coverage you need."
          : "A cheaper plan is only worth it if it still meets your needs for speed, data and coverage.",
      );
    }

    case "energy": {
      const d = p.energy || {};
      if (d.paysElectricity === "no" && d.paysGas === "no") {
        return excluded(base, "You told us you don't pay electricity or gas bills, so this is excluded.");
      }
      if (d.state === "WA" || d.state === "NT") {
        return excluded(
          base,
          `Most households in ${d.state} can't switch energy retailer, so we haven't included a switching saving. Your task focuses on checking your tariff, concessions and usage instead.`,
        );
      }
      const bill = cleanAmount(d.billAmount);
      if (bill === null || !d.billPeriod || !BILL_PER_YEAR[d.billPeriod]) {
        return {
          ...base,
          note: "For a reliable comparison you'll need your tariff, usage (kWh) and plan details from a recent bill.",
        };
      }
      if (bill === 0) {
        return excluded(base, "You entered a $0 energy bill, so this is excluded.");
      }
      const yearlySpend = bill * BILL_PER_YEAR[d.billPeriod];
      const cap = roundTo50(yearlySpend * 0.1);
      const amount = Math.min(base.auditAmount, cap);
      return personal(
        base,
        amount,
        `You pay about ${money(yearlySpend)} a year for energy. We use the lower of the category average and 10% of that. Your full bill is never counted as a saving.`,
        "We'd still need your tariff, usage and plan details to know what you could actually save by switching.",
      );
    }

    case "insurance": {
      const d = p.insurance || {};
      const types = d.types || [];
      if (types.includes("none")) {
        return excluded(base, "You told us you don't currently pay for insurance, so this is excluded.");
      }
      const premium = cleanAmount(d.premiumAmount);
      if (premium === null || !d.premiumPeriod) return base;
      if (premium === 0) {
        return excluded(base, "You entered $0 in premiums, so this is excluded.");
      }
      const yearlySpend = premium * (d.premiumPeriod === "month" ? 12 : 1);
      const cap = roundTo50(yearlySpend * 0.1);
      const amount = Math.min(base.auditAmount, cap);
      return personal(
        base,
        amount,
        `Your premiums total about ${money(yearlySpend)} a year. We use the lower of the category average and 10% of that.`,
        "This is general information only. Never cancel or reduce cover without checking what you'd lose.",
      );
    }
  }
}

export function estimateAll(
  answers: string[],
  p: Personalisation,
): CategoryEstimate[] {
  return CATEGORIES.map((c) => estimateCategory(c.key, answers, p));
}

export function estimateTotals(estimates: CategoryEstimate[]) {
  // auditAmount is already 0 for categories the audit answers excluded.
  const auditTotal = estimates.reduce((s, e) => s + e.auditAmount, 0);
  const currentTotal = estimates.reduce((s, e) => s + e.amount, 0);
  const personalCount = estimates.filter((e) => e.basis === "personal").length;
  return { auditTotal, currentTotal, personalCount };
}

/* ------------------------------------------------------------------ */
/* Phase 3: recorded savings                                           */
/* ------------------------------------------------------------------ */

export type SavingSummary = {
  /** Yearly value of an ongoing saving, else 0. */
  yearly: number;
  /** Per-period difference for an ongoing saving, else 0. */
  perPeriod: number;
  /** Amount of a one-off saving, else 0. */
  oneOff: number;
};

export function summariseSaving(s: RecordedSaving | null | undefined): SavingSummary {
  if (!s) return { yearly: 0, perPeriod: 0, oneOff: 0 };
  if (s.kind === "one_off") {
    const amount = cleanAmount(s.amount) || 0;
    return { yearly: 0, perPeriod: 0, oneOff: amount };
  }
  const before = cleanAmount(s.before);
  const after = cleanAmount(s.after);
  const perYear = PER_YEAR[s.period];
  if (before === null || after === null || !perYear || after >= before) {
    return { yearly: 0, perPeriod: 0, oneOff: 0 };
  }
  const perPeriod = Math.round((before - after) * 100) / 100;
  return {
    perPeriod,
    yearly: Math.round(perPeriod * perYear * 100) / 100,
    oneOff: 0,
  };
}

export type ValidationResult =
  | { ok: true; saving: RecordedSaving }
  | { ok: false; error: string };

/** Validates a saving entered by the customer. */
export function validateSaving(input: {
  kind: unknown;
  before?: unknown;
  after?: unknown;
  period?: unknown;
  amount?: unknown;
}): ValidationResult {
  const now = new Date().toISOString();
  if (input.kind === "one_off") {
    const amount = cleanAmount(input.amount);
    if (amount === null) return { ok: false, error: "Enter the amount you saved (a number between $0 and $100,000)." };
    if (amount === 0) return { ok: false, error: "A $0 saving doesn't need to be recorded. Choose “Completed — no saving found” instead." };
    return { ok: true, saving: { kind: "one_off", amount, recordedAt: now } };
  }
  if (input.kind === "ongoing") {
    const before = cleanAmount(input.before);
    const after = cleanAmount(input.after);
    const period = input.period as Period;
    if (before === null) return { ok: false, error: "Enter how much it cost before (a number between $0 and $100,000)." };
    if (after === null) return { ok: false, error: "Enter how much it costs now. Enter 0 if you cancelled it." };
    if (!PER_YEAR[period]) return { ok: false, error: "Choose how often you pay it." };
    if (after > before) return { ok: false, error: "The new cost is higher than before, so there's no saving to record." };
    if (after === before) return { ok: false, error: "The cost hasn't changed, so there's no saving to record. Choose “Completed — no saving found” instead." };
    return { ok: true, saving: { kind: "ongoing", before, after, period, recordedAt: now } };
  }
  return { ok: false, error: "Choose whether this is an ongoing or one-off saving." };
}

export function trackerTotals(
  tasks: TaskProgressMap,
  applicableKeys: CategoryKey[],
) {
  let completed = 0;
  let inProgress = 0;
  let yearly = 0;
  let oneOff = 0;
  for (const key of applicableKeys) {
    const t = tasks[key];
    if (!t) continue;
    if (t.status === "completed_no_saving" || t.status === "completed_saving") completed++;
    if (t.status === "in_progress") inProgress++;
    // A saving only counts while the task is marked "Completed — saving recorded".
    if (t.status === "completed_saving") {
      const s = summariseSaving(t.saving);
      yearly += s.yearly;
      oneOff += s.oneOff;
    }
  }
  return {
    completed,
    inProgress,
    remaining: applicableKeys.length - completed,
    yearly: Math.round(yearly * 100) / 100,
    oneOff: Math.round(oneOff * 100) / 100,
  };
}
