"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  CircleDollarSign,
  Clock3,
  Info,
  Lightbulb,
  ListTodo,
  PencilLine,
  Sparkles,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import { CATEGORY_BY_KEY, auditEstimate, money } from "@/lib/plan/categories";
import { estimateAll, estimateTotals, summariseSaving, trackerTotals } from "@/lib/plan/calculations";
import { getGuide, type Guide } from "@/lib/plan/guides";
import { applicableKeys, isDone, pickTopTasks, rankTasks } from "@/lib/plan/tasks";
import type { CategoryKey, Personalisation, PlanState, TaskProgress, TaskStatus } from "@/lib/plan/types";
import OutcomeForm, { type OutcomeSubmit } from "./OutcomeForm";
import PersonaliseForm from "./PersonaliseForm";
import TaskGuide from "./TaskGuide";
import { StatusChip } from "./shared";

type Props = {
  reportId: string;
  answers: string[];
  initialPlan: PlanState;
};

type SaveBody =
  | { type: "personalisation"; data: Personalisation }
  | { type: "task"; data: { key: CategoryKey } & Omit<TaskProgress, "updatedAt"> }
  | { type: "reminders"; enabled: boolean };

export default function PlanWorkspace({ reportId, answers, initialPlan }: Props) {
  const [plan, setPlan] = useState<PlanState>(initialPlan);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<{ where: string; message: string } | null>(null);
  const [openTask, setOpenTask] = useState<CategoryKey | null>(null);
  const [showPersonalise, setShowPersonalise] = useState(false);
  const [editing, setEditing] = useState<CategoryKey | null>(null);
  const [notice, setNotice] = useState("");

  const estimates = useMemo(() => estimateAll(answers, plan.personalisation), [answers, plan.personalisation]);
  const totals = useMemo(() => estimateTotals(estimates), [estimates]);
  const taskKeys = useMemo(() => applicableKeys(estimates), [estimates]);
  const top = useMemo(() => pickTopTasks(estimates, plan.tasks), [estimates, plan.tasks]);
  const allRanked = useMemo(() => rankTasks(estimates, plan.tasks), [estimates, plan.tasks]);
  const tracker = useMemo(() => trackerTotals(plan.tasks, taskKeys), [plan.tasks, taskKeys]);
  // Categories the customer can add details for: any that applied in the free audit.
  const personaliseKeys = useMemo(
    () =>
      estimates
        .filter((e) => auditEstimate(e.key, answers).applies)
        .sort((a, b) => b.auditAmount - a.auditAmount)
        .map((e) => e.key),
    [estimates, answers],
  );

  const guides = useMemo(() => {
    const out: Partial<Record<CategoryKey, Guide>> = {};
    for (const e of estimates) {
      out[e.key] = getGuide(e.key, {
        answer: answers[CATEGORY_BY_KEY[e.key].auditIndex] || "",
        estimate: e,
        p: plan.personalisation,
      });
    }
    return out as Record<CategoryKey, Guide>;
  }, [estimates, answers, plan.personalisation]);

  useEffect(() => {
    const key = `paid_plan_view_${reportId}`;
    try {
      if (!sessionStorage.getItem(key)) {
        trackEvent("paid_plan_view", { tasks_available: taskKeys.length });
        sessionStorage.setItem(key, "1");
      }
    } catch {
      /* storage blocked: skip tracking */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const save = useCallback(
    async (where: string, body: SaveBody): Promise<boolean> => {
      setBusyKey(where);
      setError(null);
      try {
        const res = await fetch(`/api/plan/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.plan) {
          setError({ where, message: data.error || "We couldn't save that just now. Please try again." });
          return false;
        }
        setPlan(data.plan);
        return true;
      } catch {
        setError({ where, message: "You seem to be offline. Your changes weren't saved. Please try again." });
        return false;
      } finally {
        setBusyKey(null);
      }
    },
    [reportId],
  );

  function progressOf(key: CategoryKey): TaskProgress | undefined {
    return plan.tasks[key];
  }

  async function updateTask(key: CategoryKey, patch: Partial<Omit<TaskProgress, "updatedAt">>, where = `task_${key}`) {
    const current = progressOf(key);
    const next = {
      status: (patch.status ?? current?.status ?? "not_started") as TaskStatus,
      checkedSteps: patch.checkedSteps ?? current?.checkedSteps ?? [],
      saving: patch.saving !== undefined ? patch.saving : current?.saving ?? null,
    };
    if (next.status !== "completed_saving") next.saving = null;
    const ok = await save(where, { type: "task", data: { key, ...next } });
    if (ok && patch.status && patch.status !== current?.status) {
      trackEvent("action_task_update", { task_category: key, task_status: patch.status });
    }
    return ok;
  }

  const closeGuide = useCallback(() => setOpenTask(null), []);

  function startTask(key: CategoryKey) {
    setOpenTask(key);
    trackEvent("action_task_open", { task_category: key });
    if (plan.storageAvailable && (!progressOf(key) || progressOf(key)?.status === "not_started")) {
      void updateTask(key, { status: "in_progress" });
    }
  }

  function toggleStep(key: CategoryKey, index: number) {
    if (!plan.storageAvailable) return;
    const current = progressOf(key);
    const steps = new Set(current?.checkedSteps || []);
    if (steps.has(index)) steps.delete(index);
    else steps.add(index);
    const status = !current || current.status === "not_started" ? "in_progress" : current.status;
    void updateTask(key, { checkedSteps: Array.from(steps).sort((a, b) => a - b), status });
  }

  async function submitOutcome(key: CategoryKey, v: OutcomeSubmit) {
    const ok = await updateTask(key, { status: v.status, saving: v.saving });
    if (ok) {
      setEditing(null);
      setNotice(
        v.status === "completed_saving"
          ? "Saved. Your tracker has been updated."
          : v.status === "completed_no_saving"
            ? "Saved. Task marked as completed with no saving."
            : "Progress saved.",
      );
      window.setTimeout(() => setNotice(""), 4000);
    }
  }

  async function savePersonal(key: CategoryKey, data: Personalisation) {
    const ok = await save(`personal_${key}`, { type: "personalisation", data });
    if (ok) {
      trackEvent("personalisation_saved", { task_category: key });
      setNotice("Saved. Your estimates and tasks have been updated.");
      window.setTimeout(() => setNotice(""), 4000);
    }
  }

  async function toggleReminders(enabled: boolean) {
    const ok = await save("reminders", { type: "reminders", enabled });
    if (ok) trackEvent("reminders_toggle", { enabled });
  }

  const errorFor = (where: string) => (error && error.where === where ? error.message : "");
  const anyTaskError = error && error.where.startsWith("task_") ? error.message : "";

  /* -------------------- Fallback for reports without audit answers -------------------- */
  if (answers.length < 7) {
    return (
      <section className="sspSection" id="action-centre">
        <div className="sspNotice">
          <Info size={20} />
          <p>
            Your Savings Action Centre needs the answers from your original audit, which aren&rsquo;t available for this report. Your full
            report below still has your savings opportunities, scripts and 30-day plan. Need help? Email{" "}
            <a href="mailto:info@spendshift.com.au">info@spendshift.com.au</a>.
          </p>
        </div>
      </section>
    );
  }

  const recorded = taskKeys.filter((k) => plan.tasks[k]?.status === "completed_saving" && plan.tasks[k]?.saving);

  return (
    <div className="sspWorkspace">
      {!plan.storageAvailable && (
        <div className="sspNotice">
          <Info size={20} />
          <p>Saving progress is temporarily unavailable. You can still read your plan and guides. Please try again later to save changes.</p>
        </div>
      )}

      {notice && (
        <div className="sspToast" role="status">
          {notice}
        </div>
      )}

      {/* ============================ PHASE 2: ACTION CENTRE ============================ */}
      <section className="sspSection" id="action-centre">
        <span className="sspEyebrow">
          <Target size={16} /> Your Savings Action Centre
        </span>
        <h2>Start With Your 3 Biggest Savings Opportunities</h2>
        <p className="sspLead">We&rsquo;ve picked three useful steps to help you get started.</p>

        {top.length === 0 ? (
          <div className="sspEmpty">
            {taskKeys.length > 0 && tracker.remaining === 0 ? (
              <>
                <Trophy size={28} color="#059625" />
                <p>
                  <b>You&rsquo;ve worked through every task in your plan.</b> Your results are in the Savings Tracker below.
                </p>
              </>
            ) : (
              <p>
                Based on your answers, we didn&rsquo;t find clear savings opportunities to turn into tasks. Rather than invent some, we&rsquo;d
                suggest adding a few spending details below so we can take a closer look.
              </p>
            )}
          </div>
        ) : (
          <div className="sspCards">
            {top.map((key, i) => {
              const g = guides[key];
              const e = estimates.find((x) => x.key === key)!;
              const p = progressOf(key);
              const status = p?.status || "not_started";
              const quick = CATEGORY_BY_KEY[key].ease === "easy";
              return (
                <article className="sspCard" key={key}>
                  <div className="sspCardTop">
                    <span className="sspTaskNo">Task {i + 1}</span>
                    <StatusChip status={status} />
                  </div>
                  <h3>{g.taskTitle}</h3>
                  {quick && (
                    <span className="sspQuick">
                      <Sparkles size={14} /> Quick win
                    </span>
                  )}
                  <div className="sspCardRow">
                    <Lightbulb size={18} color="#f59e0b" />
                    <div>
                      <b>Why this matters</b>
                      <p>{g.why}</p>
                    </div>
                  </div>
                  <div className="sspCardRow">
                    <ArrowRight size={18} color="#2563eb" />
                    <div>
                      <b>What to do</b>
                      <p>{g.whatToDo}</p>
                    </div>
                  </div>
                  <div className="sspCardRow">
                    <Clock3 size={18} color="#7c3aed" />
                    <div>
                      <b>Estimated time</b>
                      <p>{g.time}</p>
                    </div>
                  </div>
                  {e.amount > 0 && (
                    <details className="sspEstimate">
                      <summary>
                        <CircleDollarSign size={18} color="#059625" />
                        <span>
                          {e.basis === "personal" ? "More personal estimate" : "Estimated saving"}: <b>~{money(e.amount)}/year</b>
                        </span>
                      </summary>
                      <p>
                        {e.explanation}
                        {e.note ? ` ${e.note}` : ""} This is an estimate, not a confirmed saving.
                      </p>
                    </details>
                  )}
                  <div className="sspCardBtns">
                    <button type="button" className="sspBtn" onClick={() => startTask(key)}>
                      {status === "not_started" ? "Start This Task" : "View My Steps"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {top.length > 0 && top.length < 3 && (
          <p className="sspMuted">
            We only found {top.length === 1 ? "one clear opportunity" : "two clear opportunities"} worth acting on right now. Rather than invent
            more, we&rsquo;ve kept your list short.
          </p>
        )}
        <a className="sspJump" href="#full-report">
          <ArrowDown size={16} /> Jump to your full report, scripts and 30-day plan
        </a>
      </section>

      {/* ============================ PHASE 1: PERSONALISATION ============================ */}
      <section className="sspSection" id="personalise">
        <span className="sspEyebrow">
          <PencilLine size={16} /> Optional
        </span>
        <h2>Make Your Savings Plan More Personal</h2>
        <p className="sspLead">Add a few more details about your spending to help us make your savings plan more accurate.</p>

        <div className="sspTotals">
          <div>
            <span>Estimated savings</span>
            <b>{money(totals.auditTotal)}/year</b>
            <small>From your 8 audit answers and Australian category averages.</small>
          </div>
          <div className={totals.personalCount > 0 ? "on" : ""}>
            <span>Updated estimate</span>
            <b>{money(totals.currentTotal)}/year</b>
            <small>
              {totals.personalCount > 0
                ? `Uses your own spending details in ${totals.personalCount} ${totals.personalCount === 1 ? "area" : "areas"}.`
                : "Add details below to make this more personal."}
            </small>
          </div>
        </div>
        <p className="sspMuted sspSmallPrint">
          Both are estimates, not confirmed savings. Your full report below was written from your original answers; updated figures appear here
          and in your Action Centre.
        </p>

        {!showPersonalise ? (
          <div className="sspActions">
            <button type="button" className="sspBtn" onClick={() => setShowPersonalise(true)}>
              Improve My Savings Plan
            </button>
            <a className="sspLinkBtn" href="#tracker">
              Skip for now
            </a>
          </div>
        ) : (
          <>
            <PersonaliseForm
              keys={personaliseKeys}
              estimates={estimates}
              personalisation={plan.personalisation}
              busyKey={busyKey?.startsWith("personal_") ? busyKey.replace("personal_", "") : null}
              onSave={savePersonal}
            />
            {error?.where.startsWith("personal_") && (
              <p className="sspError" role="alert">
                {error.message}
              </p>
            )}
          </>
        )}
      </section>

      {/* ============================ PHASE 3: SAVINGS TRACKER ============================ */}
      <section className="sspSection" id="tracker">
        <span className="sspEyebrow">
          <ListTodo size={16} /> My Savings Tracker
        </span>
        <h2>My Savings Progress</h2>

        <div className="sspStats">
          <div>
            <span>Tasks completed</span>
            <b>{tracker.completed}</b>
          </div>
          <div>
            <span>Tasks still to do</span>
            <b>{tracker.remaining}</b>
          </div>
          <div className="wide">
            <span>Customer-reported ongoing savings</span>
            <b>{money(tracker.yearly)} per year</b>
          </div>
          {tracker.oneOff > 0 && (
            <div className="wide">
              <span>One-off savings recorded</span>
              <b>{money(tracker.oneOff)}</b>
            </div>
          )}
        </div>
        <p className="sspMuted sspSmallPrint">
          Savings recorded are amounts you enter after taking action. Estimates are never counted here automatically.
        </p>

        {recorded.length > 0 && (
          <div className="sspRecorded">
            <h3>Savings recorded</h3>
            {recorded.map((k) => {
              const s = summariseSaving(plan.tasks[k]!.saving);
              return (
                <div className="sspRecordedRow" key={k}>
                  <span>{guides[k].taskTitle}</span>
                  <b>{s.oneOff > 0 ? `${money(s.oneOff)} one-off` : `${money(s.yearly)} per year`}</b>
                </div>
              );
            })}
            <div className="sspRecordedRow total">
              <span>Total recorded ongoing savings</span>
              <b>{money(tracker.yearly)} per year</b>
            </div>
          </div>
        )}

        <div className="sspTaskList">
          {allRanked.map((key) => {
            const p = progressOf(key);
            const status = p?.status || "not_started";
            const s = summariseSaving(p?.saving);
            const isEditing = editing === key;
            return (
              <div className={`sspTaskRow ${isDone(status) ? "done" : ""}`} key={key}>
                <div className="sspTaskRowHead">
                  <div>
                    <b>{guides[key].taskTitle}</b>
                    <StatusChip status={status} />
                    {status === "completed_saving" && (
                      <small className="sspRecordedLine">
                        {s.oneOff > 0 ? `${money(s.oneOff)} one-off saving recorded` : `${money(s.yearly)} per year recorded`}
                      </small>
                    )}
                    {status === "completed_no_saving" && <small className="sspRecordedLine">$0 saving recorded</small>}
                  </div>
                  <div className="sspTaskRowBtns">
                    <button type="button" className="sspBtn sspBtnGhost" onClick={() => startTask(key)}>
                      View Steps
                    </button>
                    <button type="button" className="sspBtn sspBtnOutline" onClick={() => setEditing(isEditing ? null : key)}>
                      {isEditing ? "Close" : "Mark Progress"}
                    </button>
                  </div>
                </div>
                {isEditing && (
                  <OutcomeForm
                    question={guides[key].outcomeQuestion}
                    progress={p}
                    busy={busyKey === `task_${key}`}
                    onSubmit={(v) => submitOutcome(key, v)}
                    onCancel={() => setEditing(null)}
                  />
                )}
                {status === "completed_saving" && (
                  <button
                    type="button"
                    className="sspLinkBtn sspDanger"
                    disabled={busyKey === `task_${key}`}
                    onClick={() => {
                      if (window.confirm("Remove this saving? The task will move back to In Progress.")) {
                        void updateTask(key, { status: "in_progress", saving: null });
                      }
                    }}
                  >
                    <Trash2 size={14} /> Remove this saving
                  </button>
                )}
                {errorFor(`task_${key}`) && !openTask && (
                  <p className="sspError" role="alert">
                    {errorFor(`task_${key}`)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================ PHASE 4: REMINDERS ============================ */}
      <section className="sspSection sspReminders" id="reminders">
        <span className="sspEyebrow">
          <BellRing size={16} /> 30-Day Savings Companion
        </span>
        <h2>Want Help Staying on Track?</h2>
        <p className="sspLead">We can remind you about your savings tasks over the next 30 days.</p>
        <ul className="sspList sspListSmall">
          <li>Day 3: a reminder about your next unfinished task</li>
          <li>Day 7: a quick progress check</li>
          <li>Day 30: a check-in on what you&rsquo;ve finished</li>
        </ul>
        {!plan.reminders.available ? (
          <p className="sspMuted">
            Reminders aren&rsquo;t available for this report{plan.storageAvailable ? " because we don't have an email address for it" : " right now"}.
          </p>
        ) : plan.reminders.enabled ? (
          <>
            <p className="sspOn">
              <BellRing size={18} /> Reminders are on. We&rsquo;ll email {plan.reminders.maskedEmail}.
            </p>
            <button type="button" className="sspBtn sspBtnGhost" disabled={busyKey === "reminders"} onClick={() => toggleReminders(false)}>
              {busyKey === "reminders" ? "Saving..." : "Turn Off Reminders"}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="sspBtn" disabled={busyKey === "reminders"} onClick={() => toggleReminders(true)}>
              {busyKey === "reminders" ? "Saving..." : "Turn On My Reminders"}
            </button>
            <p className="sspMuted sspSmallPrint">
              Emails go to {plan.reminders.maskedEmail}. Only reminders about your plan, never marketing. Turn them off here or with the link in
              any email.
            </p>
          </>
        )}
        {errorFor("reminders") && (
          <p className="sspError" role="alert">
            {errorFor("reminders")}
          </p>
        )}
      </section>

      {openTask && (
        <TaskGuide
          guide={guides[openTask]}
          progress={progressOf(openTask)}
          busy={busyKey === `task_${openTask}`}
          error={anyTaskError || ""}
          onClose={closeGuide}
          onToggleStep={(i) => toggleStep(openTask, i)}
          onOutcome={(v) => submitOutcome(openTask, v)}
          onEvent={(name) => trackEvent(name, { task_category: openTask })}
        />
      )}
    </div>
  );
}
