import { CATEGORY_BY_KEY } from "./categories";
import type { CategoryEstimate } from "./calculations";
import type { CategoryKey, TaskProgressMap } from "./types";

/*
 * Chooses the customer's three Action Centre tasks (Phase 2).
 *
 * - Only categories that apply to the customer become tasks (never a bill
 *   they told us they don't pay).
 * - Value is weighted by how easy the task is, so a quick win can beat a
 *   slightly larger but harder task.
 * - At least one easy task is included when one exists.
 * - Finished tasks drop out so the next most useful task moves up.
 */

const EASE_WEIGHT = { easy: 1.25, medium: 1, involved: 0.8 } as const;

export function isDone(status?: string) {
  return status === "completed_no_saving" || status === "completed_saving";
}

/** Categories that become tasks for this customer (estimate > 0 or personalised). */
export function applicableKeys(estimates: CategoryEstimate[]): CategoryKey[] {
  return estimates
    .filter((e) => e.basis !== "excluded" && (e.amount > 0 || e.auditAmount > 0))
    .map((e) => e.key);
}

export function scoreTask(e: CategoryEstimate) {
  const meta = CATEGORY_BY_KEY[e.key];
  // Use the audit figure as a floor for ranking when the customer chose a 0 target,
  // so the order stays meaningful, but still rank lower.
  const value = e.amount > 0 ? e.amount : e.auditAmount * 0.25;
  return value * EASE_WEIGHT[meta.ease];
}

export function rankTasks(
  estimates: CategoryEstimate[],
  tasks: TaskProgressMap,
): CategoryKey[] {
  const keys = applicableKeys(estimates);
  const byKey = Object.fromEntries(estimates.map((e) => [e.key, e]));
  return keys.sort((a, b) => {
    const doneA = isDone(tasks[a]?.status) ? 1 : 0;
    const doneB = isDone(tasks[b]?.status) ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    return scoreTask(byKey[b]) - scoreTask(byKey[a]);
  });
}

/** The three tasks shown at the top of the plan. */
export function pickTopTasks(
  estimates: CategoryEstimate[],
  tasks: TaskProgressMap,
): CategoryKey[] {
  const ranked = rankTasks(estimates, tasks).filter((k) => !isDone(tasks[k]?.status));
  const top = ranked.slice(0, 3);
  const hasEasy = top.some((k) => CATEGORY_BY_KEY[k].ease === "easy");
  if (!hasEasy && top.length === 3) {
    const easy = ranked.slice(3).find((k) => CATEGORY_BY_KEY[k].ease === "easy");
    if (easy) top[2] = easy;
  }
  return top;
}
