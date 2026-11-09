-- =====================================================================
-- SpendShift: COMPLETE database setup for a NEW, empty Supabase project
-- =====================================================================
-- Creates everything the site needs:
--   1. reports        - paid reports (used by the existing site)
--   2. report_plans   - Action Centre, personalisation, tracker and
--                       reminders (the new features, Phases 1-4)
--
-- How to use:
--   Supabase Dashboard -> SQL Editor -> New query -> paste ALL of this
--   file -> Run. It is safe to run more than once.
--
-- Security: Row Level Security is ON for both tables with NO public
-- policies, so the data can only be read or written by the website's
-- server (service_role key). Nobody can read reports from the browser.
--
-- For an EXISTING database that already has the "reports" table, run
-- only supabase/migrations/20261109000000_report_plans.sql instead.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Paid reports
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  -- Private report ID used in the report link, e.g. /report/rpt_ab12cd34
  id                 text primary key,

  -- Stripe Checkout session that paid for this report.
  -- Unique, so one payment can never create two reports.
  stripe_session_id  text unique,

  -- The customer's 8 free-audit answers (array of strings)
  answers            jsonb not null default '[]'::jsonb,

  -- The AI-generated report text
  report             text not null,

  -- Customer email from Stripe checkout (used for the report email
  -- and optional reminders)
  email              text,

  created_at         timestamptz not null default now()
);

create index if not exists reports_created_at_idx
  on public.reports (created_at desc);

alter table public.reports enable row level security;


-- ---------------------------------------------------------------------
-- 2. Paid plan data (Phases 1-4), one row per report
-- ---------------------------------------------------------------------
create table if not exists public.report_plans (
  report_id              text primary key
                         references public.reports(id) on delete cascade,

  -- Phase 1: optional extra spending details
  personalisation        jsonb not null default '{}'::jsonb,

  -- Phase 2 + 3: task status, ticked steps and recorded savings
  tasks                  jsonb not null default '{}'::jsonb,

  -- Phase 4: 30-day reminder emails (opt-in only)
  reminders_enabled      boolean not null default false,
  reminders_started_at   timestamptz,
  reminders_token        text unique,
  reminder_day3_sent_at  timestamptz,
  reminder_day7_sent_at  timestamptz,
  reminder_day30_sent_at timestamptz,
  reminder_last_error    text,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists report_plans_reminders_idx
  on public.report_plans (reminders_enabled, reminders_started_at)
  where reminders_enabled = true;

alter table public.report_plans enable row level security;


-- ---------------------------------------------------------------------
-- 3. Lock down browser access (belt and braces on top of RLS)
-- ---------------------------------------------------------------------
revoke all on public.reports      from anon, authenticated;
revoke all on public.report_plans from anon, authenticated;
grant  all on public.reports      to service_role;
grant  all on public.report_plans to service_role;


-- ---------------------------------------------------------------------
-- 4. OPTIONAL: demo report for testing without making a payment
-- ---------------------------------------------------------------------
-- Opens at: https://<your-site>/report/rpt_demo0001
-- Safe to leave in place; delete it before going live with:
--   delete from public.reports where id = 'rpt_demo0001';
insert into public.reports (id, stripe_session_id, answers, report, email)
values (
  'rpt_demo0001',
  'demo_session_0001',
  '["3–5 times/week","6–10","Over 2 years ago","1–2 times/week","Over a year ago","Over a year ago","Rarely","Save more money"]'::jsonb,
  E'# Your SpendShift Savings Report\n\n## Estimated Annual Savings\n$4,750/year\n\n## Executive Summary\nThis is a demo report for testing the new paid features. Your biggest opportunity is takeaway and delivery, which could be costing approximately $1,600 per year.\n\n## Your Top Money Leaks\n\n### 01. Takeaway & Delivery\nImpact: High Impact\nEstimated saving: $1,600/year\nConfidence: High\n\nQuick win:\nPick two nights a week to cook a simple meal instead of ordering.\n\n## Your Savings Checklist\n\n☐ Review your subscriptions\n☐ Compare your energy plan\n☐ Set a weekly takeaway budget\n\n## Disclaimer:\nThis is demo content for testing only.',
  null
)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- Done. Check with:
--   select id, created_at from public.reports order by created_at desc;
-- ---------------------------------------------------------------------
