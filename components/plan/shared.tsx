"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { GuideLink } from "@/lib/plan/guides";
import type { TaskStatus } from "@/lib/plan/types";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed_no_saving: "Completed — No Saving Found",
  completed_saving: "Completed — Saving Recorded",
};

export function StatusChip({ status }: { status: TaskStatus }) {
  return <span className={`sspStatus sspStatus-${status}`}>{STATUS_LABEL[status]}</span>;
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy copy */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function ScriptBox({ script, onCopy }: { script: string; onCopy?: () => void }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <div className="sspScript">
      <p>“{script}”</p>
      <button
        type="button"
        className="sspBtn sspBtnGhost"
        onClick={async () => {
          const ok = await copyText(script);
          setState(ok ? "copied" : "failed");
          if (ok) onCopy?.();
          window.setTimeout(() => setState("idle"), 2500);
        }}
      >
        {state === "copied" ? <Check size={16} /> : <Copy size={16} />}
        {state === "copied" ? "Copied" : state === "failed" ? "Select the text to copy" : "Copy My Script"}
      </button>
    </div>
  );
}

export function OutsideLink({ link, label, onOpen }: { link: GuideLink; label?: string; onOpen?: () => void }) {
  let host = link.url;
  try {
    host = new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw url */
  }
  return (
    <div className="sspOutside">
      <a
        className="sspBtn sspBtnOutline"
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
      >
        <ExternalLink size={16} />
        {label || link.label}
      </a>
      <small>
        Opens {host} in a new tab. You&rsquo;re leaving SpendShift.
        {link.note ? ` ${link.note}` : ""}
      </small>
    </div>
  );
}

/** Parses a typed dollar amount. Empty means "I don't know / skip". */
export function parseMoneyInput(v: string): number | null | "invalid" {
  const t = v.replace(/[$,\s]/g, "");
  if (t === "") return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0 || n > 100000) return "invalid";
  return Math.round(n * 100) / 100;
}

export function MoneyField({
  label,
  value,
  onChange,
  hint,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  suffix?: string;
}) {
  const parsed = parseMoneyInput(value);
  return (
    <label className="sspField">
      <span className="sspFieldLabel">{label}</span>
      <span className="sspMoney">
        <span>$</span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Leave blank if you don't know"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={parsed === "invalid"}
        />
        {suffix && <em>{suffix}</em>}
      </span>
      {parsed === "invalid" ? (
        <small className="sspError">Enter a number between 0 and 100,000.</small>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  hint?: string;
}) {
  return (
    <label className="sspField">
      <span className="sspFieldLabel">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Skip this question</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Chips({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="sspField">
      <span className="sspFieldLabel">{label}</span>
      <div className="sspChips">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              type="button"
              key={o}
              className={`sspChip ${on ? "on" : ""}`}
              aria-pressed={on}
              onClick={() => onChange(on ? selected.filter((s) => s !== o) : [...selected, o])}
            >
              {on && <Check size={14} />} {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function numToInput(n: number | null | undefined) {
  return n === null || n === undefined ? "" : String(n);
}
