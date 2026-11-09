"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { money } from "@/lib/plan/categories";
import type { CategoryEstimate } from "@/lib/plan/calculations";
import { AU_STATES } from "@/lib/plan/guides";
import type {
  CategoryKey,
  Personalisation,
  SubscriptionItem,
} from "@/lib/plan/types";
import { Chips, MoneyField, SelectField, numToInput, parseMoneyInput } from "./shared";

/*
 * Phase 1: optional extra questions, grouped by category.
 * Only categories that apply to the customer are shown, biggest first.
 * Every question can be left blank. Nothing here is required.
 */

type Draft = Record<string, unknown>;

const LAST_COMPARED = [
  { value: "Within 6 months", label: "Within 6 months" },
  { value: "6-12 months ago", label: "6–12 months ago" },
  { value: "Over a year ago", label: "Over a year ago" },
  { value: "Never", label: "Never" },
  { value: "I don't know", label: "I don't know" },
];

const YNU = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No, I don't pay this bill" },
  { value: "unsure", label: "I don't know" },
];

const SUB_SUGGESTIONS = ["Netflix", "Spotify", "Disney+", "Stan", "Binge", "Kayo", "Amazon Prime", "YouTube Premium", "iCloud / Google storage", "Gym", "News", "Food delivery membership"];

function num(v: unknown) {
  return numToInput(typeof v === "number" ? v : null);
}

function moneyOut(v: string) {
  const n = parseMoneyInput(v);
  return n === "invalid" ? null : n;
}

function hasInvalid(values: string[]) {
  return values.some((v) => parseMoneyInput(v) === "invalid");
}

type SectionProps = {
  personalisation: Personalisation;
  busy: boolean;
  onSave: (data: Personalisation) => void;
};

function SaveRow({ busy, disabled, onSave, onClear }: { busy: boolean; disabled?: boolean; onSave: () => void; onClear: () => void }) {
  return (
    <div className="sspActions">
      <button type="button" className="sspBtn" disabled={busy || disabled} onClick={onSave}>
        {busy ? "Saving..." : "Save & Update My Plan"}
      </button>
      <button type="button" className="sspBtn sspBtnGhost" disabled={busy} onClick={onClear}>
        Clear my answers
      </button>
    </div>
  );
}

function EnergySection({ personalisation, busy, onSave }: SectionProps) {
  const d = (personalisation.energy || {}) as Draft;
  const [state, setState] = useState(String(d.state || ""));
  const [elec, setElec] = useState(String(d.paysElectricity || ""));
  const [gas, setGas] = useState(String(d.paysGas || ""));
  const [bill, setBill] = useState(num(d.billAmount));
  const [period, setPeriod] = useState(String(d.billPeriod || ""));
  const [last, setLast] = useState(String(d.lastCompared || ""));
  const noBills = elec === "no" && gas === "no";
  return (
    <>
      <SelectField label="What state or territory do you live in?" value={state} onChange={setState} options={AU_STATES} hint="We use this to link you to the right official comparison service." />
      <SelectField label="Do you pay electricity bills?" value={elec} onChange={setElec} options={YNU} />
      <SelectField label="Do you pay gas bills?" value={gas} onChange={setGas} options={YNU} />
      {!noBills && (
        <>
          <MoneyField label="How much is your electricity bill?" value={bill} onChange={setBill} hint="Use your most recent bill. Leave blank if you don't know." />
          <SelectField
            label="How often do you receive that bill?"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "month", label: "Every month" },
              { value: "two_months", label: "Every 2 months" },
              { value: "quarter", label: "Every 3 months" },
            ]}
          />
          <SelectField label="When did you last compare energy plans?" value={last} onChange={setLast} options={LAST_COMPARED} />
        </>
      )}
      {noBills && <p className="sspMuted">Got it. We won&rsquo;t recommend energy savings, because you don&rsquo;t pay these bills.</p>}
      <SaveRow
        busy={busy}
        disabled={hasInvalid([bill])}
        onSave={() =>
          onSave({
            energy: {
              state: state || null,
              paysElectricity: (elec || null) as never,
              paysGas: (gas || null) as never,
              billAmount: noBills ? null : moneyOut(bill),
              billPeriod: noBills ? null : ((period || null) as never),
              lastCompared: noBills ? null : last || null,
            },
          })
        }
        onClear={() => onSave({ energy: {} })}
      />
    </>
  );
}

function InternetSection({ personalisation, busy, onSave }: SectionProps) {
  const d = (personalisation.internet || {}) as Draft;
  const [pays, setPays] = useState(String(d.pays || ""));
  const [cost, setCost] = useState(num(d.monthlyCost));
  const [happy, setHappy] = useState(String(d.happy || ""));
  const [priority, setPriority] = useState(String(d.priority || ""));
  return (
    <>
      <SelectField
        label="Do you pay for internet, mobile, or both?"
        value={pays}
        onChange={setPays}
        options={[
          { value: "internet", label: "Internet only" },
          { value: "mobile", label: "Mobile only" },
          { value: "both", label: "Both" },
          { value: "neither", label: "I don't pay this bill" },
        ]}
      />
      {pays !== "neither" && (
        <>
          <MoneyField label="Approximately how much do you pay each month (in total)?" value={cost} onChange={setCost} suffix="per month" />
          <SelectField
            label="Are you happy with your current service?"
            value={happy}
            onChange={setHappy}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unsure", label: "Not sure" },
            ]}
          />
          <SelectField
            label="What matters most to you when choosing a plan?"
            value={priority}
            onChange={setPriority}
            options={["Lowest price", "Speed", "Data allowance", "Reliability", "Coverage", "Customer service"].map((v) => ({ value: v, label: v }))}
          />
        </>
      )}
      <SaveRow
        busy={busy}
        disabled={hasInvalid([cost])}
        onSave={() =>
          onSave({
            internet: {
              pays: (pays || null) as never,
              monthlyCost: pays === "neither" ? null : moneyOut(cost),
              happy: (happy || null) as never,
              priority: priority || null,
            },
          })
        }
        onClear={() => onSave({ internet: {} })}
      />
    </>
  );
}

type SubRow = { name: string; cost: string; period: "week" | "month" | "year"; rarelyUsed: boolean; considerCancelling: boolean };

function SubscriptionsSection({ personalisation, busy, onSave }: SectionProps) {
  const initial: SubRow[] = (personalisation.subscriptions?.items || []).map((i) => ({ ...i, cost: String(i.cost) }));
  const [rows, setRows] = useState<SubRow[]>(initial.length ? initial : []);
  const update = (i: number, patch: Partial<SubRow>) => setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = (name = "") => setRows([...rows, { name, cost: "", period: "month", rarelyUsed: false, considerCancelling: false }]);
  const missing = rows.some((r) => r.name.trim() && (r.cost.trim() === "" || parseMoneyInput(r.cost) === "invalid"));
  return (
    <>
      <p className="sspMuted">List the subscriptions you pay for. Tick any you rarely use or would consider cancelling.</p>
      <div className="sspChips">
        {SUB_SUGGESTIONS.filter((s) => !rows.some((r) => r.name === s)).map((s) => (
          <button type="button" key={s} className="sspChip" onClick={() => add(s)}>
            <Plus size={14} /> {s}
          </button>
        ))}
      </div>
      {rows.map((r, i) => (
        <div className="sspSubRow" key={i}>
          <input aria-label="Subscription name" placeholder="Name" value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
          <span className="sspMoney">
            <span>$</span>
            <input aria-label="Cost" inputMode="decimal" placeholder="Cost" value={r.cost} onChange={(e) => update(i, { cost: e.target.value })} />
          </span>
          <select aria-label="How often" value={r.period} onChange={(e) => update(i, { period: e.target.value as SubRow["period"] })}>
            <option value="week">per week</option>
            <option value="month">per month</option>
            <option value="year">per year</option>
          </select>
          <label className="sspCheck">
            <input type="checkbox" checked={r.rarelyUsed} onChange={(e) => update(i, { rarelyUsed: e.target.checked })} /> Rarely use
          </label>
          <label className="sspCheck">
            <input type="checkbox" checked={r.considerCancelling} onChange={(e) => update(i, { considerCancelling: e.target.checked })} /> Would consider cancelling
          </label>
          <button type="button" className="sspIconBtn" aria-label="Remove subscription" onClick={() => setRows(rows.filter((_, idx) => idx !== i))}>
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button type="button" className="sspBtn sspBtnGhost" onClick={() => add()}>
        <Plus size={16} /> Add a subscription
      </button>
      {missing && <small className="sspError">Add a cost (a number) for each subscription, or remove it.</small>}
      <SaveRow
        busy={busy}
        disabled={missing}
        onSave={() =>
          onSave({
            subscriptions: {
              items: rows
                .filter((r) => r.name.trim() && typeof parseMoneyInput(r.cost) === "number")
                .map((r) => ({ ...r, name: r.name.trim(), cost: parseMoneyInput(r.cost) as number })) as SubscriptionItem[],
            },
          })
        }
        onClear={() => {
          setRows([]);
          onSave({ subscriptions: {} });
        }}
      />
    </>
  );
}

function WeeklySection({
  keyName,
  personalisation,
  busy,
  onSave,
  spendLabel,
  reduceLabel,
  types,
}: SectionProps & { keyName: "takeaway" | "convenience"; spendLabel: string; reduceLabel: string; types?: string[] }) {
  const d = (personalisation[keyName] || {}) as Draft;
  const [spend, setSpend] = useState(num(d.weeklySpend));
  const [reduce, setReduce] = useState(num(d.weeklyReduction));
  const [picked, setPicked] = useState<string[]>(Array.isArray(d.reduceTypes) ? (d.reduceTypes as string[]) : []);
  const s = parseMoneyInput(spend);
  const r = parseMoneyInput(reduce);
  const tooBig = typeof s === "number" && typeof r === "number" && r > s;
  return (
    <>
      <MoneyField label={spendLabel} value={spend} onChange={setSpend} suffix="per week" />
      <MoneyField label={reduceLabel} value={reduce} onChange={setReduce} suffix="per week" hint="Pick an amount you could realistically cut, not your whole spend." />
      {tooBig && <small className="sspError">Your reduction can&rsquo;t be more than you spend each week.</small>}
      {typeof r === "number" && r > 0 && !tooBig && (
        <p className="sspCalcInline">
          {money(r)} × 52 weeks = <b>{money(r * 52)} a year</b>, if you keep it up every week.
        </p>
      )}
      {types && <Chips label="What types of purchases do you want to reduce?" options={types} selected={picked} onChange={setPicked} />}
      <SaveRow
        busy={busy}
        disabled={tooBig || hasInvalid([spend, reduce])}
        onSave={() =>
          onSave({
            [keyName]: { weeklySpend: moneyOut(spend), weeklyReduction: moneyOut(reduce), ...(types ? { reduceTypes: picked } : {}) },
          } as Personalisation)
        }
        onClear={() => onSave({ [keyName]: {} } as Personalisation)}
      />
    </>
  );
}

function UnplannedSection({ personalisation, busy, onSave }: SectionProps) {
  const d = (personalisation.unplanned || {}) as Draft;
  const [spend, setSpend] = useState(num(d.monthlySpend));
  const [freq, setFreq] = useState(String(d.frequency || ""));
  const [reduce, setReduce] = useState(num(d.monthlyReduction));
  const s = parseMoneyInput(spend);
  const r = parseMoneyInput(reduce);
  const tooBig = typeof s === "number" && typeof r === "number" && r > s;
  return (
    <>
      <MoneyField label="Approximately how much do you spend on unplanned purchases each month?" value={spend} onChange={setSpend} suffix="per month" />
      <SelectField
        label="How often does this happen?"
        value={freq}
        onChange={setFreq}
        options={["A few times a month", "Weekly", "A few times a week", "Most days"].map((v) => ({ value: v, label: v }))}
      />
      <MoneyField label="What would be a realistic monthly goal to cut?" value={reduce} onChange={setReduce} suffix="per month" />
      {tooBig && <small className="sspError">Your goal can&rsquo;t be more than you spend each month.</small>}
      {typeof r === "number" && r > 0 && !tooBig && (
        <p className="sspCalcInline">
          {money(r)} × 12 months = <b>{money(r * 12)} a year</b>, if you keep it up every month.
        </p>
      )}
      <SaveRow
        busy={busy}
        disabled={tooBig || hasInvalid([spend, reduce])}
        onSave={() => onSave({ unplanned: { monthlySpend: moneyOut(spend), frequency: freq || null, monthlyReduction: moneyOut(reduce) } })}
        onClear={() => onSave({ unplanned: {} })}
      />
    </>
  );
}

function InsuranceSection({ personalisation, busy, onSave }: SectionProps) {
  const d = (personalisation.insurance || {}) as Draft;
  const [types, setTypes] = useState<string[]>(Array.isArray(d.types) ? (d.types as string[]).filter((t) => t !== "none") : []);
  const [none, setNone] = useState(Array.isArray(d.types) && (d.types as string[]).includes("none"));
  const [premium, setPremium] = useState(num(d.premiumAmount));
  const [period, setPeriod] = useState(String(d.premiumPeriod || ""));
  const [renewal, setRenewal] = useState(String(d.nextRenewal || ""));
  const [last, setLast] = useState(String(d.lastReviewed || ""));
  return (
    <>
      <p className="sspMuted">
        We&rsquo;ll help you prepare for a review. We don&rsquo;t recommend specific insurance products, and you should never reduce cover without
        checking what you&rsquo;d lose.
      </p>
      <label className="sspCheck">
        <input type="checkbox" checked={none} onChange={(e) => setNone(e.target.checked)} /> I don&rsquo;t pay for any insurance
      </label>
      {!none && (
        <>
          <Chips label="What types of insurance do you currently pay for?" options={["Car", "Home", "Contents", "Health", "Life", "Income protection", "Pet", "Travel", "Landlord"]} selected={types} onChange={setTypes} />
          <MoneyField label="Approximately how much are your premiums in total?" value={premium} onChange={setPremium} />
          <SelectField
            label="Is that per month or per year?"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "month", label: "Per month" },
              { value: "year", label: "Per year" },
            ]}
          />
          <label className="sspField">
            <span className="sspFieldLabel">When is your next renewal?</span>
            <input type="month" value={renewal} onChange={(e) => setRenewal(e.target.value)} />
            <small>Leave blank if you don&rsquo;t know.</small>
          </label>
          <SelectField label="When did you last review your cover?" value={last} onChange={setLast} options={LAST_COMPARED} />
        </>
      )}
      <SaveRow
        busy={busy}
        disabled={hasInvalid([premium])}
        onSave={() =>
          onSave({
            insurance: none
              ? { types: ["none"] }
              : { types, premiumAmount: moneyOut(premium), premiumPeriod: (period || null) as never, nextRenewal: renewal || null, lastReviewed: last || null },
          })
        }
        onClear={() => onSave({ insurance: {} })}
      />
    </>
  );
}

const QUESTION_TITLES: Record<CategoryKey, string> = {
  energy: "Electricity and gas",
  internet: "Internet and mobile phones",
  subscriptions: "Subscriptions",
  takeaway: "Takeaway and food delivery",
  convenience: "Convenience spending",
  insurance: "Insurance",
  unplanned: "Unplanned purchases",
};

export default function PersonaliseForm({
  keys,
  estimates,
  personalisation,
  busyKey,
  onSave,
}: {
  keys: CategoryKey[];
  estimates: CategoryEstimate[];
  personalisation: Personalisation;
  busyKey: string | null;
  onSave: (key: CategoryKey, data: Personalisation) => void;
}) {
  const [open, setOpen] = useState<CategoryKey | null>(keys[0] || null);
  const skipped = personalisation.skipped || [];

  return (
    <div className="sspAccordion">
      {keys.map((key) => {
        const e = estimates.find((x) => x.key === key)!;
        const isOpen = open === key;
        const props: SectionProps = {
          personalisation,
          busy: busyKey === key,
          onSave: (data) => onSave(key, { ...data, skipped: skipped.filter((k) => k !== key) }),
        };
        return (
          <div className={`sspAccItem ${isOpen ? "open" : ""}`} key={key}>
            <button type="button" className="sspAccHead" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
              <span>
                <b>{QUESTION_TITLES[key]}</b>
                <small>
                  {e.basis === "personal" ? "More personal estimate" : e.basis === "excluded" ? "Excluded" : "Estimated saving"}:{" "}
                  {e.basis === "excluded" ? "$0" : `${money(e.amount)}/year`}
                  {skipped.includes(key) ? " · skipped" : ""}
                </small>
              </span>
              <ChevronDown size={20} />
            </button>
            {isOpen && (
              <div className="sspAccBody">
                <p className="sspExplain">
                  <b>How this is worked out:</b> {e.explanation}
                  {e.note ? ` ${e.note}` : ""}
                </p>
                {key === "energy" && <EnergySection {...props} />}
                {key === "internet" && <InternetSection {...props} />}
                {key === "subscriptions" && <SubscriptionsSection {...props} />}
                {key === "takeaway" && (
                  <WeeklySection
                    {...props}
                    keyName="takeaway"
                    spendLabel="Approximately how much do you spend on takeaway each week?"
                    reduceLabel="How much would you realistically like to reduce that by each week?"
                  />
                )}
                {key === "convenience" && (
                  <WeeklySection
                    {...props}
                    keyName="convenience"
                    spendLabel="Approximately how much do you spend on convenience purchases each week?"
                    reduceLabel="How much would you realistically like to cut each week?"
                    types={["Coffee", "Drinks", "Snacks", "Quick lunches", "Convenience store buys"]}
                  />
                )}
                {key === "insurance" && <InsuranceSection {...props} />}
                {key === "unplanned" && <UnplannedSection {...props} />}
                {!skipped.includes(key) && (
                  <button
                    type="button"
                    className="sspLinkBtn"
                    onClick={() => {
                      onSave(key, { skipped: [...skipped, key] });
                      setOpen(null);
                    }}
                  >
                    Skip this section
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p className="sspMuted sspSmallPrint">
        We never ask for bank logins, passwords or card details. Every question is optional.
      </p>
    </div>
  );
}
