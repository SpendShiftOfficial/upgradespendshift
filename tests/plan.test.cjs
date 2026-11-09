/*
 * Tests for the paid-plan rules (Phases 1–4). No extra packages needed.
 *
 * Run:
 *   npx tsc -p tests/tsconfig.json && node --test tests/plan.test.cjs
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const B = path.join(__dirname, ".build");
const { estimateCategory, estimateAll, estimateTotals, summariseSaving, validateSaving, trackerTotals } = require(`${B}/calculations.js`);
const { parseAnswers, auditEstimate } = require(`${B}/categories.js`);
const { pickTopTasks, applicableKeys } = require(`${B}/tasks.js`);
const { getGuide, energyCompareLink } = require(`${B}/guides.js`);
const { sanitisePersonalisation, sanitiseTaskUpdate, readStoredTasks, isValidReportId } = require(`${B}/sanitise.js`);
const { dueReminder, buildReminder } = require(`${B}/reminders.js`);

// Answers exactly as the existing audit stores them.
const ANSWERS = [
  "3–5 times/week", // takeaway
  "6–10", // subscriptions
  "Over 2 years ago", // insurance
  "1–2 times/week", // convenience
  "Over a year ago", // internet
  "Over a year ago", // energy
  "Rarely", // unplanned
  "Save more money",
];

const NO_BILLS = [...ANSWERS];
NO_BILLS[4] = "I don't pay either of these bills";
NO_BILLS[5] = "I don't pay these bills";

/* ---------------- Audit mapping matches the free results page ---------------- */

test("audit estimates use the same midpoints as the free results page", () => {
  assert.equal(auditEstimate("takeaway", ANSWERS).amount, 1600);
  assert.equal(auditEstimate("subscriptions", ANSWERS).amount, 1100);
  assert.equal(auditEstimate("insurance", ANSWERS).amount, 850);
  assert.equal(auditEstimate("energy", ANSWERS).amount, 250);
});

test("straight and curly apostrophes both exclude bills the customer doesn't pay", () => {
  const curly = [...ANSWERS];
  curly[4] = "I don’t pay either of these bills";
  curly[5] = "I don’t pay these bills";
  for (const a of [NO_BILLS, curly]) {
    assert.equal(auditEstimate("internet", a).applies, false);
    assert.equal(auditEstimate("energy", a).applies, false);
  }
});

test("answers stored as a JSON string (older rows) are parsed", () => {
  assert.deepEqual(parseAnswers(JSON.stringify(ANSWERS)), ANSWERS);
  assert.deepEqual(parseAnswers(JSON.stringify(JSON.stringify(ANSWERS))), ANSWERS);
  assert.deepEqual(parseAnswers(null), []);
  assert.deepEqual(parseAnswers("not json"), []);
});

/* ---------------- Phase 1: personal estimates ---------------- */

test("brief example 1: A$25/week takeaway reduction = A$1,300/year", () => {
  const e = estimateCategory("takeaway", ANSWERS, { takeaway: { weeklySpend: 100, weeklyReduction: 25 } });
  assert.equal(e.basis, "personal");
  assert.equal(e.amount, 1300);
  assert.match(e.explanation, /52/);
});

test("updating the takeaway answer updates the estimate", () => {
  const before = estimateCategory("takeaway", ANSWERS, { takeaway: { weeklySpend: 100, weeklyReduction: 25 } });
  const after = estimateCategory("takeaway", ANSWERS, { takeaway: { weeklySpend: 70, weeklyReduction: 10 } });
  assert.equal(before.amount, 1300);
  assert.equal(after.amount, 520);
});

test("a reduction bigger than spending is capped at spending", () => {
  const e = estimateCategory("takeaway", ANSWERS, { takeaway: { weeklySpend: 20, weeklyReduction: 50 } });
  assert.equal(e.amount, 20 * 52);
});

test("brief example 2: cancelling a A$25/month subscription = A$300/year", () => {
  const e = estimateCategory("subscriptions", ANSWERS, {
    subscriptions: { items: [
      { name: "Stream", cost: 25, period: "month", rarelyUsed: true, considerCancelling: true },
      { name: "Music", cost: 12, period: "month", rarelyUsed: false, considerCancelling: false },
    ] },
  });
  assert.equal(e.amount, 300);
});

test("brief example 3: electricity bill is never treated as the saving", () => {
  const e = estimateCategory("energy", ANSWERS, {
    energy: { state: "NSW", paysElectricity: "yes", billAmount: 450, billPeriod: "quarter" },
  });
  // A$1,800/year bill → at most 10% (A$200) and never more than the audit figure (A$250).
  assert.equal(e.amount, 200);
  assert.ok(e.amount < 1800);
  assert.match(e.note || "", /tariff/);
});

test("personal estimates are never bigger than the original audit estimate for bills", () => {
  const e = estimateCategory("internet", ANSWERS, { internet: { pays: "both", monthlyCost: 500 } });
  assert.ok(e.amount <= e.auditAmount);
});

test("no savings for bills the customer doesn't pay", () => {
  const p = { energy: { paysElectricity: "no", paysGas: "no" }, internet: { pays: "neither" } };
  assert.equal(estimateCategory("energy", ANSWERS, p).amount, 0);
  assert.equal(estimateCategory("internet", ANSWERS, p).amount, 0);
  const keys = applicableKeys(estimateAll(ANSWERS, p));
  assert.ok(!keys.includes("energy"));
  assert.ok(!keys.includes("internet"));
});

test("WA and NT get no switching saving", () => {
  const e = estimateCategory("energy", ANSWERS, { energy: { state: "WA", billAmount: 600, billPeriod: "quarter" } });
  assert.equal(e.amount, 0);
  assert.equal(energyCompareLink("WA"), null);
  assert.match(energyCompareLink("VIC").url, /compare\.energy\.vic\.gov\.au/);
  assert.match(energyCompareLink("QLD").url, /energymadeeasy/);
});

test("skipping everything leaves the original estimates unchanged", () => {
  const plain = estimateTotals(estimateAll(ANSWERS, {}));
  const skipped = estimateTotals(estimateAll(ANSWERS, { skipped: ["takeaway", "energy"], takeaway: { weeklyReduction: 99 } }));
  assert.equal(plain.currentTotal, plain.auditTotal);
  assert.equal(skipped.currentTotal, plain.currentTotal);
});

test("missing or junk answers don't throw", () => {
  assert.doesNotThrow(() => estimateAll([], {}));
  assert.doesNotThrow(() => estimateAll(ANSWERS, sanitisePersonalisation({ takeaway: { weeklySpend: "abc" }, energy: "x", insurance: { premiumAmount: -5 } })));
});

/* ---------------- Sanitising browser input ---------------- */

test("invalid spending amounts are rejected", () => {
  const p = sanitisePersonalisation({
    takeaway: { weeklySpend: -10, weeklyReduction: "1e9" },
    energy: { state: "XYZ", billPeriod: "fortnight" },
    hacker: { evil: true },
  });
  assert.equal(p.takeaway.weeklySpend, null);
  assert.equal(p.takeaway.weeklyReduction, null);
  assert.equal(p.energy.state, null);
  assert.equal(p.energy.billPeriod, null);
  assert.equal(p.hacker, undefined);
});

test("report ids are validated", () => {
  assert.ok(isValidReportId("rpt_ab12cd34"));
  assert.ok(!isValidReportId("rpt_../../x"));
  assert.ok(!isValidReportId("abc"));
});

/* ---------------- Phase 2: task selection ---------------- */

test("top tasks match the customer's answers and include a quick win", () => {
  const top = pickTopTasks(estimateAll(ANSWERS, {}), {});
  assert.equal(top.length, 3);
  assert.ok(top.includes("takeaway"));
  assert.ok(top.some((k) => ["takeaway", "subscriptions", "convenience", "unplanned"].includes(k)));
});

test("completed tasks drop out and the next task moves up", () => {
  const est = estimateAll(ANSWERS, {});
  const first = pickTopTasks(est, {});
  const tasks = { [first[0]]: { status: "completed_no_saving", checkedSteps: [], saving: null, updatedAt: "" } };
  const next = pickTopTasks(est, tasks);
  assert.ok(!next.includes(first[0]));
});

test("few opportunities → fewer tasks, never invented ones", () => {
  const low = ["Never", "0–2", "I don’t currently have insurance", "Rarely", "I don't pay either of these bills", "I don't pay these bills", "Rarely", "Reduce stress"];
  const top = pickTopTasks(estimateAll(low, {}), {});
  assert.ok(top.length <= 3);
  for (const k of top) assert.ok(["subscriptions", "convenience", "unplanned"].includes(k));
});

test("every category has a useful guide (no empty pages)", () => {
  const est = estimateAll(ANSWERS, {});
  for (const e of est) {
    const g = getGuide(e.key, { answer: "", estimate: e, p: {} });
    assert.ok(g.taskTitle.length > 5, e.key);
    assert.ok(g.steps.length >= 4, e.key);
    assert.ok(g.need.length >= 1, e.key);
    for (const s of g.steps) assert.ok(s.body.length > 10, `${e.key}: ${s.title}`);
  }
});

/* ---------------- Phase 3: recorded savings ---------------- */

test("brief tracker example: A$95 → A$75 per month = A$240/year", () => {
  const s = summariseSaving({ kind: "ongoing", before: 95, after: 75, period: "month", recordedAt: "" });
  assert.equal(s.perPeriod, 20);
  assert.equal(s.yearly, 240);
});

test("weekly, quarterly and yearly savings are calculated correctly", () => {
  assert.equal(summariseSaving({ kind: "ongoing", before: 50, after: 30, period: "week", recordedAt: "" }).yearly, 1040);
  assert.equal(summariseSaving({ kind: "ongoing", before: 450, after: 400, period: "quarter", recordedAt: "" }).yearly, 200);
  assert.equal(summariseSaving({ kind: "ongoing", before: 900, after: 800, period: "year", recordedAt: "" }).yearly, 100);
});

test("one-off savings are kept separate from ongoing savings", () => {
  const tasks = {
    subscriptions: { status: "completed_saving", checkedSteps: [], saving: { kind: "ongoing", before: 25, after: 0, period: "month", recordedAt: "" }, updatedAt: "" },
    internet: { status: "completed_saving", checkedSteps: [], saving: { kind: "one_off", amount: 60, recordedAt: "" }, updatedAt: "" },
    energy: { status: "completed_no_saving", checkedSteps: [], saving: null, updatedAt: "" },
  };
  const t = trackerTotals(tasks, ["subscriptions", "internet", "energy", "takeaway"]);
  assert.equal(t.yearly, 300);
  assert.equal(t.oneOff, 60);
  assert.equal(t.completed, 3);
  assert.equal(t.remaining, 1);
});

test("completing a task without a saving records A$0", () => {
  const t = trackerTotals({ energy: { status: "completed_no_saving", checkedSteps: [], saving: null, updatedAt: "" } }, ["energy"]);
  assert.equal(t.yearly, 0);
  assert.equal(t.completed, 1);
});

test("a saving is dropped if the status is no longer 'saving recorded' (no stale double counting)", () => {
  const r = sanitiseTaskUpdate({ key: "subscriptions", status: "in_progress", saving: { kind: "one_off", amount: 50 } });
  assert.ok(r.ok);
  assert.equal(r.progress.saving, null);
});

test("estimates are never counted as achieved savings", () => {
  const t = trackerTotals({}, applicableKeys(estimateAll(ANSWERS, {})));
  assert.equal(t.yearly, 0);
  assert.equal(t.oneOff, 0);
});

test("negative, zero and missing values are handled safely", () => {
  assert.equal(validateSaving({ kind: "ongoing", before: 20, after: 30, period: "month" }).ok, false);
  assert.equal(validateSaving({ kind: "ongoing", before: 20, after: 20, period: "month" }).ok, false);
  assert.equal(validateSaving({ kind: "ongoing", before: -5, after: 0, period: "month" }).ok, false);
  assert.equal(validateSaving({ kind: "ongoing", before: 20, after: null, period: "month" }).ok, false);
  assert.equal(validateSaving({ kind: "one_off", amount: 0 }).ok, false);
  assert.equal(validateSaving({ kind: "ongoing", before: 30, after: 20, period: "fortnight" }).ok, false);
  assert.equal(summariseSaving({ kind: "ongoing", before: 10, after: 50, period: "month" }).yearly, 0);
});

test("editing a saving replaces it, so totals update", () => {
  const v1 = trackerTotals({ internet: { status: "completed_saving", checkedSteps: [], saving: { kind: "ongoing", before: 100, after: 70, period: "month" }, updatedAt: "" } }, ["internet"]);
  const v2 = trackerTotals({ internet: { status: "completed_saving", checkedSteps: [], saving: { kind: "ongoing", before: 100, after: 80, period: "month" }, updatedAt: "" } }, ["internet"]);
  assert.equal(v1.yearly, 360);
  assert.equal(v2.yearly, 240);
});

test("stored task data is re-validated when read back", () => {
  const tasks = readStoredTasks({
    takeaway: { status: "completed_saving", saving: { kind: "ongoing", before: 50, after: 100, period: "week" } },
    bogus: { status: "completed_saving" },
    internet: { status: "in_progress", checkedSteps: [1, 1, 99, -1, 2] },
  });
  assert.equal(tasks.takeaway, undefined);
  assert.equal(tasks.bogus, undefined);
  assert.deepEqual(tasks.internet.checkedSteps, [1, 2]);
});

/* ---------------- Phase 4: reminders ---------------- */

const DAY = 86400000;
const start = new Date("2026-11-01T00:00:00Z");
const at = (d) => new Date(start.getTime() + d * DAY);
const none = { day3: null, day7: null, day30: null };

test("reminders are due on day 3, 7 and 30 only once each", () => {
  assert.equal(dueReminder(start.toISOString(), none, at(1)), null);
  assert.equal(dueReminder(start.toISOString(), none, at(3.2)), 3);
  assert.equal(dueReminder(start.toISOString(), { ...none, day3: "x" }, at(4)), null);
  assert.equal(dueReminder(start.toISOString(), { ...none, day3: "x" }, at(7.1)), 7);
  assert.equal(dueReminder(start.toISOString(), { day3: "x", day7: "x", day30: null }, at(30.5)), 30);
  assert.equal(dueReminder(start.toISOString(), { day3: "x", day7: "x", day30: "x" }, at(31)), null);
  assert.equal(dueReminder(start.toISOString(), none, at(60)), null);
  assert.equal(dueReminder(null, none, at(3)), null);
});

test("a missed day-3 reminder is not sent late on day 10", () => {
  assert.equal(dueReminder(start.toISOString(), none, at(10)), 7);
});

test("reminders mention the next unfinished task, not a completed one", () => {
  const est = estimateAll(ANSWERS, {});
  const first = pickTopTasks(est, {})[0];
  const firstTitle = getGuide(first, { answer: "", estimate: est.find((e) => e.key === first), p: {} }).taskTitle.toLowerCase();
  const done = { [first]: { status: "completed_no_saving", checkedSteps: [], saving: null, updatedAt: "" } };
  const r = buildReminder(3, ANSWERS, {}, done);
  assert.ok(r);
  assert.ok(!r.paragraphs.join(" ").toLowerCase().includes(firstTitle));
});

test("no day 3/7 reminder when every task is finished", () => {
  const keys = applicableKeys(estimateAll(ANSWERS, {}));
  const all = Object.fromEntries(keys.map((k) => [k, { status: "completed_no_saving", checkedSteps: [], saving: null, updatedAt: "" }]));
  assert.equal(buildReminder(3, ANSWERS, {}, all), null);
  assert.equal(buildReminder(7, ANSWERS, {}, all), null);
  const d30 = buildReminder(30, ANSWERS, {}, all);
  assert.ok(d30);
  assert.ok(!/next task/i.test(d30.paragraphs.join(" ")));
});

test("day 30 never claims savings that weren't recorded", () => {
  const r = buildReminder(30, ANSWERS, {}, {});
  assert.ok(!/recorded ongoing savings/i.test(r.paragraphs.join(" ")));
  const withSaving = buildReminder(30, ANSWERS, {}, {
    subscriptions: { status: "completed_saving", checkedSteps: [], saving: { kind: "ongoing", before: 25, after: 0, period: "month" }, updatedAt: "" },
  });
  assert.match(withSaving.paragraphs.join(" "), /\$300 a year/);
});
