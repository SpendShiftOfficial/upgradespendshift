-- SpendShift upgrade: paid plan data for Phases 1–4.
--
-- Safe, additive change:
--   * Creates ONE new table. The existing "reports" table is not altered.
--   * Old reports keep working: a report with no row here simply shows a
--     fresh plan (no saved answers, all tasks "Not started").
--   * Row Level Security is ON with no public policies, so the table can only
--     be read or written by the server (service role key), never from the
--     browser with the anon key.
--
-- How to apply: Supabase Dashboard → SQL Editor → paste this file → Run.
-- How to reverse: see 20261109000000_report_plans.down.sql

create table if not exists public.report_plans (
  report_id              text primary key references public.reports(id) on delete cascade,

  -- Phase 1: optional extra spending details
  personalisation        jsonb not null default '{}'::jsonb,

  -- Phase 2 + 3: task status, checked steps and recorded savings, keyed by category
  tasks                  jsonb not null default '{}'::jsonb,

  -- Phase 4: 30-day reminder emails (opt-in)
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
-- Intentionally no policies: only the service role (server) can access rows.
