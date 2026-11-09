/*
 * Shared types for the SpendShift paid plan (Phases 1–4).
 *
 * One "task" exists per spending category, so a saving can only ever be
 * recorded once per category. This is what stops double-counting.
 */

export type CategoryKey =
  | "takeaway"
  | "subscriptions"
  | "insurance"
  | "convenience"
  | "internet"
  | "energy"
  | "unplanned";

export const CATEGORY_KEYS: CategoryKey[] = [
  "takeaway",
  "subscriptions",
  "insurance",
  "convenience",
  "internet",
  "energy",
  "unplanned",
];

export type Period = "week" | "month" | "quarter" | "year";
export type BillPeriod = "month" | "two_months" | "quarter";
export type YesNoUnsure = "yes" | "no" | "unsure";

/* ---------- Phase 1: optional personalisation answers ---------- */

export type TakeawayDetails = {
  weeklySpend?: number | null;
  weeklyReduction?: number | null;
};

export type ConvenienceDetails = {
  weeklySpend?: number | null;
  weeklyReduction?: number | null;
  reduceTypes?: string[];
};

export type UnplannedDetails = {
  monthlySpend?: number | null;
  frequency?: string | null;
  monthlyReduction?: number | null;
};

export type SubscriptionItem = {
  name: string;
  cost: number;
  period: "week" | "month" | "year";
  rarelyUsed: boolean;
  considerCancelling: boolean;
};

export type SubscriptionsDetails = {
  items?: SubscriptionItem[];
};

export type InternetDetails = {
  pays?: "internet" | "mobile" | "both" | "neither" | null;
  monthlyCost?: number | null;
  happy?: YesNoUnsure | null;
  priority?: string | null;
};

export type EnergyDetails = {
  state?: string | null;
  paysElectricity?: YesNoUnsure | null;
  paysGas?: YesNoUnsure | null;
  billAmount?: number | null;
  billPeriod?: BillPeriod | null;
  lastCompared?: string | null;
};

export type InsuranceDetails = {
  types?: string[];
  premiumAmount?: number | null;
  premiumPeriod?: "month" | "year" | null;
  nextRenewal?: string | null;
  lastReviewed?: string | null;
};

export type Personalisation = {
  takeaway?: TakeawayDetails;
  convenience?: ConvenienceDetails;
  unplanned?: UnplannedDetails;
  subscriptions?: SubscriptionsDetails;
  internet?: InternetDetails;
  energy?: EnergyDetails;
  insurance?: InsuranceDetails;
  /** Categories the customer chose to skip entirely. */
  skipped?: CategoryKey[];
};

/* ---------- Phase 2 + 3: task progress and recorded savings ---------- */

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "completed_no_saving"
  | "completed_saving";

export type RecordedSaving =
  | {
      kind: "ongoing";
      before: number;
      after: number;
      period: Period;
      recordedAt: string;
    }
  | {
      kind: "one_off";
      amount: number;
      recordedAt: string;
    };

export type TaskProgress = {
  status: TaskStatus;
  checkedSteps: number[];
  saving: RecordedSaving | null;
  updatedAt: string;
};

export type TaskProgressMap = Partial<Record<CategoryKey, TaskProgress>>;

/* ---------- Phase 4: reminders (client-safe view) ---------- */

export type ReminderView = {
  enabled: boolean;
  available: boolean;
  maskedEmail: string | null;
  startedAt: string | null;
};

/* ---------- What the report page hands to the client ---------- */

export type PlanState = {
  personalisation: Personalisation;
  tasks: TaskProgressMap;
  reminders: ReminderView;
  /** false when the database table is missing or unreachable. */
  storageAvailable: boolean;
};
