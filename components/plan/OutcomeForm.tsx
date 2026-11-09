"use client";

import { useId, useState } from "react";
import { money } from "@/lib/plan/categories";
import { PER_YEAR, summariseSaving, validateSaving } from "@/lib/plan/calculations";
import type { Period, RecordedSaving, TaskProgress, TaskStatus } from "@/lib/plan/types";
import { MoneyField, STATUS_LABEL, numToInput, parseMoneyInput } from "./shared";

const PERIOD_LABEL: Record<Period, string> = {
  week: "per week",
  month: "per month",
  quarter: "per quarter",
  year: "per year",
};

const PERIOD_NAME: Record<Period, string> = {
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Yearly",
};

export type OutcomeSubmit = {
  status: TaskStatus;
  saving: RecordedSaving | null;
};

/**
 * Records what happened with a task (Phase 3).
 * A completed task does not mean money was saved: the two are separate choices.
 */
export default function OutcomeForm({
  question,
  note,
  progress,
  busy,
  onSubmit,
  onCancel,
}: {
  question: string;
  note?: string;
  progress: TaskProgress | undefined;
  busy: boolean;
  onSubmit: (v: OutcomeSubmit) => void;
  onCancel?: () => void;
}) {
  const existing = progress?.saving || null;
  const [status, setStatus] = useState<TaskStatus>(progress?.status || "not_started");
  const [kind, setKind] = useState<"ongoing" | "one_off">(existing?.kind || "ongoing");
  const [before, setBefore] = useState(existing?.kind === "ongoing" ? numToInput(existing.before) : "");
  const [after, setAfter] = useState(existing?.kind === "ongoing" ? numToInput(existing.after) : "");
  const [period, setPeriod] = useState<Period>(existing?.kind === "ongoing" ? existing.period : "month");
  const [amount, setAmount] = useState(existing?.kind === "one_off" ? numToInput(existing.amount) : "");
  const [error, setError] = useState("");
  const radioName = useId();

  const b = parseMoneyInput(before);
  const a = parseMoneyInput(after);
  const preview =
    status === "completed_saving" && kind === "ongoing" && typeof b === "number" && typeof a === "number" && a < b
      ? summariseSaving({ kind: "ongoing", before: b, after: a, period, recordedAt: "" })
      : null;

  function submit() {
    setError("");
    if (status !== "completed_saving") {
      onSubmit({ status, saving: null });
      return;
    }
    const result = validateSaving({
      kind,
      before: parseMoneyInput(before),
      after: parseMoneyInput(after),
      period,
      amount: parseMoneyInput(amount),
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Keep the original date if this is an edit of the same saving.
    const saving = existing ? { ...result.saving, recordedAt: existing.recordedAt } : result.saving;
    onSubmit({ status, saving });
  }

  const statuses: TaskStatus[] = ["not_started", "in_progress", "completed_no_saving", "completed_saving"];

  return (
    <div className="sspOutcome">
      <p className="sspOutcomeQ">{question}</p>
      <div className="sspRadioGroup" role="radiogroup" aria-label="Task progress">
        {statuses.map((s) => (
          <label key={s} className={`sspRadio ${status === s ? "on" : ""}`}>
            <input type="radio" name={radioName} checked={status === s} onChange={() => setStatus(s)} />
            <span>{STATUS_LABEL[s]}</span>
          </label>
        ))}
      </div>

      {status === "completed_no_saving" && (
        <p className="sspMuted">
          That&rsquo;s a useful result. Your saving for this task will be recorded as $0. We never add a saving just
          because a task was completed.
        </p>
      )}

      {status === "completed_saving" && (
        <div className="sspSavingForm">
          <div className="sspToggle" role="tablist">
            <button type="button" className={kind === "ongoing" ? "on" : ""} onClick={() => setKind("ongoing")}>
              Ongoing (a bill or regular cost went down)
            </button>
            <button type="button" className={kind === "one_off" ? "on" : ""} onClick={() => setKind("one_off")}>
              One-off (a refund or single saving)
            </button>
          </div>

          {kind === "ongoing" ? (
            <>
              <label className="sspField">
                <span className="sspFieldLabel">How often do you pay it?</span>
                <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
                  {(Object.keys(PER_YEAR) as Period[]).map((p) => (
                    <option key={p} value={p}>
                      {PERIOD_NAME[p]}
                    </option>
                  ))}
                </select>
              </label>
              <MoneyField label="How much was the cost before?" value={before} onChange={setBefore} suffix={PERIOD_LABEL[period]} />
              <MoneyField
                label="How much is the cost now?"
                value={after}
                onChange={setAfter}
                suffix={PERIOD_LABEL[period]}
                hint="Enter 0 if you cancelled it."
              />
              {preview && (
                <div className="sspCalc">
                  <div>
                    <span>{PERIOD_NAME[period]} saving</span>
                    <b>{money(preview.perPeriod)}</b>
                  </div>
                  <div>
                    <span>Possible yearly saving</span>
                    <b>{money(preview.yearly)}</b>
                  </div>
                  <small>
                    {money(b as number)} − {money(a as number)} = {money(preview.perPeriod)} {PERIOD_LABEL[period]}, × {PER_YEAR[period]} ={" "}
                    {money(preview.yearly)} a year. Assumes the cost stays at the new amount for 12 months.
                  </small>
                </div>
              )}
            </>
          ) : (
            <MoneyField label="How much did you save?" value={amount} onChange={setAmount} hint="One-off savings are shown separately from ongoing savings." />
          )}
        </div>
      )}

      {note && <p className="sspMuted">{note}</p>}
      {error && (
        <p className="sspError" role="alert">
          {error}
        </p>
      )}

      <div className="sspActions">
        <button type="button" className="sspBtn" disabled={busy} onClick={submit}>
          {busy ? "Saving..." : "Save Progress"}
        </button>
        {onCancel && (
          <button type="button" className="sspBtn sspBtnGhost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
