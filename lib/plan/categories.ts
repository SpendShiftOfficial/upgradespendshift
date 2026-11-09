import type { CategoryKey } from "./types";

/*
 * Maps the existing 8-question free audit onto spending categories.
 *
 * The ranges below are copied from the existing free results page
 * (app/results/page.tsx) and the AI report prompt
 * (app/api/create-report/route.ts) so that every part of the product
 * starts from the same numbers. Nothing in the free audit changes.
 */

export type CategoryMeta = {
  key: CategoryKey;
  /** Index of the matching question in the 8-question audit. */
  auditIndex: number;
  title: string;
  shortTitle: string;
  /** How easy the task usually is. Used when picking the first 3 tasks. */
  ease: "easy" | "medium" | "involved";
  ranges: Record<string, [number, number]>;
};

/** Normalise apostrophes, dashes and case so answer matching is reliable. */
export function normaliseAnswer(answer: unknown): string {
  if (typeof answer !== "string") return "";
  return answer
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function table(entries: Array<[string, [number, number]]>) {
  const out: Record<string, [number, number]> = {};
  for (const [k, v] of entries) out[normaliseAnswer(k)] = v;
  return out;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "takeaway",
    auditIndex: 0,
    title: "Takeaway & Food Delivery",
    shortTitle: "Takeaway",
    ease: "easy",
    ranges: table([
      ["Never", [0, 0]],
      ["1–2 times/week", [600, 1000]],
      ["3–5 times/week", [1200, 2000]],
      ["Almost daily", [2500, 4000]],
    ]),
  },
  {
    key: "subscriptions",
    auditIndex: 1,
    title: "Subscriptions",
    shortTitle: "Subscriptions",
    ease: "easy",
    ranges: table([
      ["0–2", [0, 100]],
      ["3–5", [400, 700]],
      ["6–10", [800, 1400]],
      ["10+", [1500, 2500]],
      ["Not sure", [800, 1400]],
    ]),
  },
  {
    key: "insurance",
    auditIndex: 2,
    title: "Insurance Review",
    shortTitle: "Insurance",
    ease: "involved",
    ranges: table([
      ["I don’t currently have insurance", [0, 0]],
      ["Within 6 months", [0, 200]],
      ["6–12 months ago", [150, 400]],
      ["1–2 years ago", [300, 700]],
      ["Over 2 years ago", [500, 1200]],
      ["Never / not sure", [600, 1500]],
    ]),
  },
  {
    key: "convenience",
    auditIndex: 3,
    title: "Convenience Spending",
    shortTitle: "Convenience",
    ease: "easy",
    ranges: table([
      ["Rarely", [0, 200]],
      ["1–2 times/week", [400, 700]],
      ["3–5 times/week", [800, 1400]],
      ["Daily", [1500, 2500]],
    ]),
  },
  {
    key: "internet",
    auditIndex: 4,
    title: "Internet & Mobile Plan",
    shortTitle: "Internet & mobile",
    ease: "medium",
    ranges: table([
      ["Within 6 months", [0, 100]],
      ["6-12 months ago", [100, 200]],
      ["Over a year ago", [150, 400]],
      ["I honestly don't know", [150, 400]],
      ["I don't pay either of these bills", [0, 0]],
    ]),
  },
  {
    key: "energy",
    auditIndex: 5,
    title: "Electricity & Gas Plan",
    shortTitle: "Energy",
    ease: "medium",
    ranges: table([
      ["Within 6 months", [0, 100]],
      ["6-12 months ago", [100, 200]],
      ["Over a year ago", [150, 350]],
      ["I honestly don't know", [150, 350]],
      ["I don't pay these bills", [0, 0]],
    ]),
  },
  {
    key: "unplanned",
    auditIndex: 6,
    title: "Unplanned Purchases",
    shortTitle: "Unplanned buys",
    ease: "easy",
    ranges: table([
      ["Rarely", [0, 200]],
      ["1–2 times/week", [300, 600]],
      ["3–5 times/week", [600, 1200]],
      ["Almost daily", [1000, 2000]],
    ]),
  },
];

export const CATEGORY_BY_KEY: Record<CategoryKey, CategoryMeta> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
    CategoryKey,
    CategoryMeta
  >;

export const GOAL_INDEX = 7;

/** Same rounding the free results page uses: midpoint to the nearest $50. */
export function midpoint(min: number, max: number) {
  return Math.round((min + max) / 2 / 50) * 50;
}

/** Answers are stored as a JSON array of strings; older rows may be a string. */
export function parseAnswers(raw: unknown): string[] {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.map((v) => (typeof v === "string" ? v : ""));
}

export type AuditEstimate = {
  key: CategoryKey;
  answer: string;
  min: number;
  max: number;
  amount: number;
  /** false when the answer means the category does not apply (e.g. "I don't pay these bills"). */
  applies: boolean;
};

export function auditEstimate(
  key: CategoryKey,
  answers: string[],
): AuditEstimate {
  const meta = CATEGORY_BY_KEY[key];
  const answer = answers[meta.auditIndex] || "";
  const range = meta.ranges[normaliseAnswer(answer)] || [0, 0];
  return {
    key,
    answer,
    min: range[0],
    max: range[1],
    amount: midpoint(range[0], range[1]),
    applies: range[1] > 0,
  };
}

export function money(n: number) {
  return `$${Math.round(n).toLocaleString("en-AU")}`;
}
