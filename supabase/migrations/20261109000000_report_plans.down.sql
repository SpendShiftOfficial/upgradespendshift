-- Reverses 20261109000000_report_plans.sql.
-- WARNING: deletes customers' saved extra answers, task progress and
-- reminder settings. Existing reports in "reports" are NOT affected.
drop table if exists public.report_plans;
