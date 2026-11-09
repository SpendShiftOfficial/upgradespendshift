"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Circle, Clock3, LifeBuoy, ListChecks, X } from "lucide-react";
import type { Guide } from "@/lib/plan/guides";
import type { TaskProgress } from "@/lib/plan/types";
import OutcomeForm, { type OutcomeSubmit } from "./OutcomeForm";
import { OutsideLink, ScriptBox, StatusChip } from "./shared";

/** Full-screen (mobile) / centred (desktop) step-by-step guide for one task. */
export default function TaskGuide({
  guide,
  progress,
  busy,
  error,
  onClose,
  onToggleStep,
  onOutcome,
  onEvent,
}: {
  guide: Guide;
  progress: TaskProgress | undefined;
  busy: boolean;
  error: string;
  onClose: () => void;
  onToggleStep: (index: number) => void;
  onOutcome: (v: OutcomeSubmit) => void;
  onEvent: (name: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const checked = new Set(progress?.checkedSteps || []);
  const status = progress?.status || "not_started";

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="sspOverlay" onClick={onClose}>
      <div
        className="sspDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ssp-guide-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sspDialogHead">
          <div>
            <StatusChip status={status} />
            <h2 id="ssp-guide-title">{guide.taskTitle}</h2>
            <p className="sspMuted">
              <Clock3 size={15} /> {guide.time}
            </p>
          </div>
          <button type="button" className="sspIconBtn" aria-label="Close guide" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="sspDialogBody">
          <section className="sspGuideBlock">
            <h3>Why we suggested this</h3>
            <p>{guide.why}</p>
          </section>

          <section className="sspGuideBlock">
            <h3>
              <ListChecks size={18} /> What you&rsquo;ll need
            </h3>
            <ul className="sspList">
              {guide.need.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          <section className="sspGuideBlock">
            <h3>Your steps</h3>
            <ol className="sspSteps">
              {guide.steps.map((step, i) => {
                const done = checked.has(i);
                return (
                  <li key={step.title} className={done ? "done" : ""}>
                    <button
                      type="button"
                      className="sspStepTick"
                      aria-pressed={done}
                      aria-label={done ? `Mark step ${i + 1} as not done` : `Mark step ${i + 1} as done`}
                      onClick={() => onToggleStep(i)}
                      disabled={busy}
                    >
                      {done ? <CheckCircle2 size={24} fill="#059625" stroke="#fff" /> : <Circle size={24} />}
                    </button>
                    <div>
                      <b>
                        Step {i + 1} — {step.title}
                      </b>
                      <p>{step.body}</p>
                      {step.checklist && (
                        <ul className="sspList sspListSmall">
                          {step.checklist.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      )}
                      {step.script && <ScriptBox script={step.script} onCopy={() => onEvent("action_script_copy")} />}
                      {step.link && (
                        <OutsideLink
                          link={step.link}
                          label="Open Comparison Website"
                          onOpen={() => onEvent("action_outside_link")}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {guide.help.length > 0 && (
            <section className="sspGuideBlock">
              <h3>
                <LifeBuoy size={18} /> Where to get help
              </h3>
              <div className="sspHelpLinks">
                {guide.help.map((l) => (
                  <OutsideLink key={l.url} link={l} onOpen={() => onEvent("action_outside_link")} />
                ))}
              </div>
            </section>
          )}

          <section className="sspGuideBlock sspGuideOutcome" id="ssp-record-outcome">
            <h3>Record what happened</h3>
            <OutcomeForm
              key={`${status}-${progress?.saving ? JSON.stringify(progress.saving) : "none"}`}
              question={guide.outcomeQuestion}
              note={guide.outcomeNote}
              progress={progress}
              busy={busy}
              onSubmit={onOutcome}
            />
            {error && (
              <p className="sspError" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
