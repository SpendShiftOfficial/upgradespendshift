"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  BellRing,
  CheckCircle2,
  Circle,
  Clock3,
  Copy,
  CreditCard,
  FileText,
  HelpCircle,
  ListTodo,
  Lock,
  RotateCcw,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { trackEventOnce } from "@/lib/gtag";
import { CATEGORY_BY_KEY } from "@/lib/plan/categories";
import { estimateAll } from "@/lib/plan/calculations";
import { getGuide } from "@/lib/plan/guides";
import { pickTopTasks } from "@/lib/plan/tasks";
import { REVIEWS } from "@/lib/reviews";

/*
 * Phase 5: explains free vs paid, previews the paid plan (matched to the
 * customer's own audit results where possible), and answers trust questions.
 * One call-to-action only; it scrolls to the existing checkout box.
 */

const FREE_ITEMS = [
  "Find possible money-saving opportunities",
  "See an estimated savings range",
  "Understand areas worth checking",
];

export const PAID_ITEMS = [
  "Improve your savings estimates",
  "Get your three main money-saving tasks",
  "Follow simple action guides",
  "Use helpful scripts",
  "Track your progress and savings",
  "Optional reminders to stay on track",
];

export default function UpgradeValue({ answers }: { answers: string[] }) {
  const { tasks, example } = useMemo(() => {
    const estimates = estimateAll(answers, {});
    const keys = pickTopTasks(estimates, {});
    const guides = keys.map((key) =>
      getGuide(key, {
        answer: answers[CATEGORY_BY_KEY[key].auditIndex] || "",
        estimate: estimates.find((e) => e.key === key)!,
        p: {},
      }),
    );
    // Fall back to a fixed example if the audit gave no opportunities.
    const fallbackKey = "subscriptions" as const;
    const exampleGuide =
      guides[0] ||
      getGuide(fallbackKey, {
        answer: "",
        estimate: estimates.find((e) => e.key === fallbackKey)!,
        p: {},
      });
    return { tasks: guides, example: exampleGuide };
  }, [answers]);

  const scriptStep = example.steps.find((s) => s.script);

  return (
    <section className="sspUpgrade" aria-labelledby="ssp-upgrade-title">
      <div className="sspUpgradeIntro">
        <h2 id="ssp-upgrade-title">
          You&rsquo;ve Found Your Savings Opportunities. <span>Now Let Us Help You Take Action.</span>
        </h2>
        <p>Your full SpendShift plan gives you personal steps, useful tools, and a way to track your progress.</p>
      </div>

      <div className="sspCompare">
        <div className="sspCompareCol">
          <span className="sspCompareTag">Free SpendShift</span>
          <h3>Find out where you might be losing money.</h3>
          {FREE_ITEMS.map((i) => (
            <p className="sspCompareItem" key={i}>
              <Search size={16} /> {i}
            </p>
          ))}
          <p className="sspCompareDone">
            <CheckCircle2 size={16} /> You&rsquo;ve already done this
          </p>
        </div>
        <div className="sspCompareCol paid">
          <span className="sspCompareTag">Paid SpendShift — A$39</span>
          <h3>Get your personal plan to help you take action.</h3>
          {PAID_ITEMS.map((i) => (
            <p className="sspCompareItem" key={i}>
              <BsCheckCircleFill size={15} color="#059625" /> {i}
            </p>
          ))}
        </div>
      </div>
      <p className="sspTagline">Free helps you find possible savings. Paid helps you take action.</p>

      <h3 className="sspPreviewTitle">A look inside your paid plan</h3>
      <p className="sspMuted sspCenter">Previews use examples based on your answers. Your real plan is personalised to you.</p>

      <div className="sspPreviews">
        <div className="sspPreview">
          <span className="sspPreviewLabel">
            <Target size={15} /> Savings Action Centre
          </span>
          <b className="sspPreviewHead">Start With Your 3 Biggest Savings Opportunities</b>
          {(tasks.length ? tasks : [example]).slice(0, 3).map((g, i) => (
            <div className="sspMiniCard" key={g.key}>
              <small>Task {i + 1}</small>
              <b>{g.taskTitle}</b>
              <span>
                <Clock3 size={13} /> {g.time.replace(" to get started.", "")}
              </span>
            </div>
          ))}
        </div>

        <div className="sspPreview">
          <span className="sspPreviewLabel">
            <FileText size={15} /> Example task guide
          </span>
          <b className="sspPreviewHead">{example.taskTitle}</b>
          <ol className="sspMiniSteps">
            {example.steps.slice(0, 3).map((s, i) => (
              <li key={s.title}>
                {i === 0 ? <CheckCircle2 size={16} fill="#059625" stroke="#fff" /> : <Circle size={16} />} Step {i + 1} — {s.title}
              </li>
            ))}
          </ol>
          {scriptStep?.script && (
            <div className="sspMiniScript">
              <Copy size={13} /> &ldquo;{scriptStep.script.split(". ")[0]}...&rdquo;
            </div>
          )}
        </div>

        <div className="sspPreview">
          <span className="sspPreviewLabel">
            <ListTodo size={15} /> Savings Tracker
          </span>
          <b className="sspPreviewHead">My Savings Progress</b>
          <div className="sspMiniRow">
            <span>Cancelled A$25 monthly subscription</span>
            <b>A$300/yr</b>
          </div>
          <small className="sspMuted">A$25 × 12 months = possible yearly saving of A$300.</small>
          <span className="sspExampleTag">Example only. Not a real customer&rsquo;s result.</span>
        </div>

        <div className="sspPreview">
          <span className="sspPreviewLabel">
            <BellRing size={15} /> Optional reminders
          </span>
          <b className="sspPreviewHead">Stay on track for 30 days</b>
          <p className="sspMuted">Choose to get a few helpful emails about your next unfinished task. Turn them off any time.</p>
        </div>
      </div>

      {REVIEWS.length > 0 && (
        <div className="sspReviews">
          <h3>What customers say</h3>
          <div className="sspReviewGrid">
            {REVIEWS.map((r) => (
              <figure key={`${r.name}-${r.date}`}>
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption>
                  {r.name}
                  {r.location ? `, ${r.location}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="sspTrust">
        <h3>
          <HelpCircle size={20} /> Before you buy
        </h3>
        <div className="sspTrustGrid">
          <p>
            <CreditCard size={18} />
            <span>
              <b>A$39, one time.</b> No subscription and no ongoing charges.
            </span>
          </p>
          <p>
            <FileText size={18} />
            <span>
              <b>What you get:</b> your full report plus the Action Centre, guides, scripts, tracker and optional reminders.
            </span>
          </p>
          <p>
            <Lock size={18} />
            <span>
              <b>Access:</b> your plan opens straight after payment, and we email you a private link to return any time.
            </span>
          </p>
          <p>
            <ShieldCheck size={18} />
            <span>
              <b>Payment:</b> secure checkout by Stripe. We never see or store your card details.
            </span>
          </p>
          <p>
            <ShieldCheck size={18} />
            <span>
              <b>Privacy:</b> no bank logins needed. See our{" "}
              <Link href="/privacy-policy" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </p>
          <p>
            <RotateCcw size={18} />
            <span>
              <b>Refunds:</b> read our{" "}
              <Link href="/refund-policy" target="_blank">
                Refund Policy
              </Link>
              . Questions? <a href="mailto:info@spendshift.com.au">info@spendshift.com.au</a>
            </span>
          </p>
        </div>
      </div>

      <div className="sspUpgradeCta">
        <a
          href="#unlock-full-report"
          className="btn"
          onClick={() =>
            trackEventOnce("upgrade_click", {
              location: "value_section",
              value: 39,
              currency: "AUD",
            })
          }
        >
          Unlock My Personal Savings Plan — A$39
        </a>
        <small>One-time payment. No subscription.</small>
      </div>
    </section>
  );
}
