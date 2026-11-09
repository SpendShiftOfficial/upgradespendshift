# SpendShift upgrade: five-phase product improvement

This branch adds the five phases from the "SpendShift Five-Phase Product Improvement Plan"
to the existing site. It builds on the existing code. Nothing was rebuilt from scratch.

- No dependencies or libraries were added, removed or upgraded (`package.json` and
  `package-lock.json` are unchanged).
- The free audit, Stripe checkout, AI report generation, report email, saved reports,
  legal pages and cookie consent work exactly as before.
- No new AI calls. Every new number comes from fixed rules in `lib/plan/`, so updates
  are instant and AI costs don't change.

---

## 1. Before going live (setup checklist)

1. **Run the database migration** (one new table; the existing `reports` table is not changed).
   Supabase Dashboard → SQL Editor → paste `supabase/migrations/20261109000000_report_plans.sql` → Run.
   To undo: `supabase/migrations/20261109000000_report_plans.down.sql`.
   If the migration hasn't been run yet, paid reports still open normally. The new sections
   show a "saving is temporarily unavailable" message instead of an error.
2. **Add `CRON_SECRET`** in Vercel → Project → Settings → Environment Variables
   (any long random string). Vercel Cron sends it automatically. Without it, the reminder job refuses to run.
3. **Check `RESEND_API_KEY` and `NEXT_PUBLIC_SITE_URL`** are set. Both already exist for the report email.
4. **Deploy to a Vercel Preview first** and run the test plan in section 4. `vercel.json` schedules the
   reminder job daily at 23:00 UTC (about 9–10am in eastern Australia).
5. **GA4 internal traffic:** visit the site once with `?ss_internal=1` on each device you test from.
   Events from that browser are then tagged `traffic_type=internal`. In GA4, go to Admin → Data filters →
   Internal traffic and set it to *Active*. Use `?ss_internal=0` to remove the tag.
6. **Click-check the outside links** in `lib/plan/guides.ts`: Energy Made Easy, Victorian Energy Compare,
   privatehealth.gov.au, Moneysmart, AFCA and the TIO. They're official home pages, but some
   government sites block automated checks, so please confirm each one opens.

---

## 2. What was built, by phase

### Phase 1: More personal savings report
- New section in the paid report: **"Make Your Savings Plan More Personal"**, with an
  **"Improve My Savings Plan"** button. It's optional, and the report works fully without it.
- Questions only appear for categories that applied in the customer's free audit, biggest first.
  Every question can be left blank or skipped. Each category also has "Skip this section" and "Clear my answers".
- Rules (`lib/plan/calculations.ts`):
  - Takeaway and convenience: weekly reduction × 52. Unplanned purchases: monthly reduction × 12.
    A reduction can never be larger than the amount the customer spends.
  - Subscriptions: yearly cost of the ones the customer would consider cancelling. If they keep them all, the estimate is $0.
  - Internet/mobile: the lower of the audit figure and 15% of the yearly bill.
  - Energy: the lower of the audit figure and 10% of the yearly bill. **The full bill is never treated as a saving**,
    and the plan says the customer still needs their tariff and usage for a real comparison. WA and NT get no switching
    estimate, because most households there can't change retailer.
  - Insurance: the lower of the audit figure and 10% of premiums, with a general-information note.
  - "I don't pay this bill" excludes that category everywhere: estimates, tasks and reminders.
- Personal estimates are never higher than the original audit estimate for bills. They are more accurate, not bigger.
- Each figure has a "How?" explanation. Three labels are always kept separate:
  **Estimated saving** (from audit answers), **More personal estimate** (from the customer's details) and
  **Savings recorded** (what the customer reports after taking action).

### Phase 2: Savings Action Centre
- Shown first in the paid report: **"Start With Your 3 Biggest Savings Opportunities"**.
- Tasks are ranked by estimated value, weighted by how easy each task is, with at least one quick win. Finished tasks
  drop out and the next task moves up. If there are fewer than three real opportunities, the plan says so
  instead of making some up.
- Every category has a full guide: why it was suggested, what you'll need, numbered steps you can tick off, scripts with
  a **Copy My Script** button, **Open Comparison Website** (the right official site for the customer's state),
  a "you're leaving SpendShift" note on outside links, where to get help, and a way to record the outcome.
- Progress saves to the database, so a customer can leave and come back on any device.
- The original AI report, scripts, checklist and 30-day plan are unchanged, below the new sections.

### Phase 3: Savings Tracker
- **"My Savings Progress"** shows tasks completed, tasks still to do, customer-reported ongoing savings per year and
  one-off savings (kept separate). It also lists each recorded saving and the total.
- Statuses: Not Started, In Progress, Completed — No Saving Found, and Completed — Saving Recorded. Customers can change a status at any time.
- Saving form: cost before, cost now and how often (weekly, monthly, quarterly or yearly), or a one-off amount.
  It shows the calculation (e.g. $95 − $75 = $20/month × 12 = $240/year).
- Protections: one saving per task, so nothing is counted twice. Negative, zero, missing and "higher than before" values
  are rejected with a clear message. A saving only counts while the task is "Saving Recorded". Customers can edit or
  remove a saving. An estimate is never counted as a recorded saving.

### Phase 4: 30-Day Savings Companion
- **"Want Help Staying on Track?"**, with a **"Turn On My Reminders"** button (opt-in only). It shows the masked email address,
  shows whether reminders are on, and lets the customer turn them off.
- Day 3, Day 7 and Day 30 emails use the customer's saved progress. They name the next unfinished task, skip Day 3
  and Day 7 if everything is done, and only mention money the customer actually recorded.
- Each reminder is sent at most once, using a database "claim" step. If sending fails, the claim is released and the
  error is logged, so the next daily run retries. Late reminders aren't sent outside their window.
- Unsubscribe works from a link in every email (a confirm page, so email scanners can't trigger it) and with one-click
  unsubscribe in mail apps (`List-Unsubscribe` header). Emails identify the sender and say they are service reminders.
- Health check: `GET /api/cron/reminders?dryRun=1` with header `Authorization: Bearer <CRON_SECRET>` lists what would be
  sent today without sending anything.

### Phase 5: Free-to-paid upgrade
- New section on the free results page, under the top 3 leaks:
  - "You've Found Your Savings Opportunities. Now Let Us Help You Take Action."
  - Free vs paid comparison, ending with "Free helps you find possible savings. Paid helps you take action."
  - Four previews: Action Centre (using **the customer's own top tasks**), an example task guide (for their top
    opportunity), a tracker example clearly marked "Example only", and reminders.
  - A short "Before you buy" section covering price, what's included, access, payment, privacy, refunds and contact.
  - One button: **"Unlock My Personal Savings Plan — A$39"**, with "One-time payment. No subscription." under it.
- The checkout box now lists the paid features, and its button reads "Unlock My Personal Savings Plan — A$39".
- Reviews: add genuine, permitted reviews to `lib/reviews.ts`. The section stays hidden while that list is empty.
  There are no fake testimonials, countdown timers or popups.

---

## 3. Funnel tracking

All events go through the existing `trackEvent`, so they follow the existing cookie-consent settings.
No spending amounts or personal details are sent to analytics.

| Funnel step | Event | Notes |
|---|---|---|
| 1. Starts audit | `audit_start` | existing, unchanged |
| 2. Finishes audit | `audit_complete` | existing, unchanged |
| Sees free results | `free_results_view` | existing, unchanged |
| 3. Sees the paid offer | `paid_offer_view` | **new**: the checkout box was actually on screen |
| 4. Clicks upgrade | `upgrade_click` | now **once per session** (with `location`), so it isn't double-counted |
| 5. Starts checkout | `begin_checkout` | existing, unchanged |
| 6. Completes payment | `purchase` | existing, unchanged |
| Opens paid plan | `paid_plan_view` | **new** |
| Uses the Action Centre | `action_task_open`, `action_task_update`, `action_script_copy`, `action_outside_link` | **new** (category and status only) |
| Personalises / reminders | `personalisation_saved`, `reminders_toggle` | **new** |

`paid_offer_view`, `paid_plan_view` and `action_task_open` are also sent to Microsoft Clarity as funnel events.

---

## 4. Testing

**Automated** (the calculation, task, sanitising and reminder rules; 33 tests):

```bash
npx tsc -p tests/tsconfig.json && node --test tests/plan.test.cjs
```

**Already verified on this branch:** type-check and production build pass. The report page, the save API, the
reminder job and unsubscribe were run end to end against a local mock database, at iPhone and desktop sizes. That run
had no console errors and no sideways scrolling, saves persisted after a reload, older reports fell back safely,
duplicate reminders were blocked and a failed send was retried.

**Manual test plan on Vercel Preview** (from the brief, Part 7):
1. Free audit → free results → preview section and checkout box look right on a phone.
2. Pay with a Stripe test card → report generates → report email arrives.
3. In the report: add details in two categories, skip the rest, edit one answer and check the estimates update.
4. Open each of the 3 tasks: tick steps, copy a script, open a comparison link.
5. Record a saving (monthly), a one-off saving, and "completed — no saving". Edit one and remove one, and check the totals.
6. Close the browser, reopen the report link on another device, and check everything is still there.
7. Turn reminders on. In Supabase, set `reminders_started_at` to 3 days ago, then call the cron URL with `?dryRun=1`
   and then without it. Check the email and its unsubscribe link.
8. Open an **older** report: it should still open with the original report.
9. Reject cookies and repeat step 1. The site should still work.

---

## 5. Things to review (security, compliance, recommendations)

- **Report links are the key.** As before, anyone with a report link can view it, and now also update that plan's
  progress. All updates are validated, and each one only affects the report in the URL. The database table is locked
  so only the server can access it.
  *Recommendation:* new report IDs are currently `rpt_` plus 8 random characters (`Math.random`). We suggest switching
  `makeReportId()` in `app/api/create-report/route.ts` to `rpt_${crypto.randomBytes(12).toString("hex")}`
  (28 characters) once you've confirmed the `reports.id` column has no length limit. This was not changed, to avoid
  any risk to the payment → report flow. Old links would keep working.
- **Insurance (compliance):** the guide only helps customers prepare a like-for-like review. It never recommends a
  product or tells anyone to cancel cover, and it shows a general-information warning. Please have this wording reviewed
  (Part 5.5 of the brief).
- **Reminder emails:** these are opt-in service messages with sender identification and a working unsubscribe, in line
  with the Spam Act 2003. Please confirm the wording with your adviser.
- **Personal estimate rules** (15% and 10% caps) are deliberately conservative. You can change them in one place:
  `lib/plan/calculations.ts`.
- The free results checkout box still shows the existing "Action plan steps: 18" figure. This was left unchanged;
  consider removing it if it doesn't match the real report.

## 6. Files

New:
- `lib/plan/*`: calculation rules, task guides, task ranking, input validation, reminder logic and database access
- `components/plan/*`: Action Centre, task guide, personalisation form, tracker and reminders UI
- `components/upgrade/UpgradeValue.tsx`: free-to-paid section
- `app/api/plan/[id]/route.ts`: saves answers, progress and reminder settings
- `app/api/cron/reminders/route.ts`, `app/api/reminders/unsubscribe/route.ts`, `app/reminders/unsubscribe/*`
- `supabase/migrations/*`, `vercel.json`, `lib/reviews.ts`, `tests/*`, `docs/UPGRADE_NOTES.md`

Changed (small, additive edits):
- `app/report/[id]/page.tsx`: adds the quick links and the new plan sections above the existing report
- `app/results/page.tsx`: paid feature list, button wording, the new section and funnel events
- `lib/gtag.ts`: internal-traffic tag, the `trackEventOnce` helper and extra Clarity funnel events
- `app/globals.css`: new styles appended at the end (all prefixed `ssp`)
- `.gitignore`: ignores the test build folder
