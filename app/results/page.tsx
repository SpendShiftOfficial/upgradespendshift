"use client";

import Link from "next/link";
import Header from "@/components/Header";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { trackTikTok } from "@/lib/tiktok";
import {
  trackMeta,
  trackMetaStandard,
} from "@/lib/meta";
import ScrollReveal from "@/components/ScrollReveal";
import { trackEvent } from "@/lib/gtag";

import {
  CheckCircle,
  Lock,
  ShieldCheck,
  Circle,
  LoaderCircle,
  Wallet,
  BarChart3,
  Search,
  Info,
  FileClock,
  Lightbulb,
  Zap,
  ChartNoAxesCombined,
} from "lucide-react";

import { BsCheckCircleFill } from "react-icons/bs";

type Leak = {
  impact: string;
  title: string;
  amount: number;
  min: number;
  max: number;
  answer: string;
  insight: string;
};

function money(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

function midpoint(
  min: number,
  max: number
) {
  return (
    Math.round(
      (min + max) / 2 / 50
    ) * 50
  );
}

function impact(amount: number) {
  if (amount >= 1000) {
    return "HIGH IMPACT";
  }

  if (amount >= 400) {
    return "MEDIUM IMPACT";
  }

  return "LOW IMPACT";
}

function rangeFor(
  answer: string,
  map: Record<string, [number, number]>
) {
  return map[answer] || [0, 0];
}

function getSavingsComparison(
  amount: number
) {
  if (amount >= 4000) {
    return "That could be enough for a family holiday, several weeks of groceries, or a meaningful emergency buffer.";
  }

  if (amount >= 2500) {
    return "That could cover several weeks of groceries or multiple household bills.";
  }

  if (amount >= 1500) {
    return "That could cover multiple utility bills or give your savings buffer a real boost.";
  }

  if (amount >= 500) {
    return "That could still make a meaningful difference across the year with only a few small changes.";
  }

  return "Small changes can still create useful savings over time.";
}

function buildLeaks(
  answers: string[]
): Leak[] {
  const takeaway = answers[0] || "";
  const subscriptions = answers[1] || "";
  const insurance = answers[2] || "";
  const convenience = answers[3] || "";
  const mobile = answers[4] || "";
  const recurring = answers[5] || "";
  const unplanned = answers[6] || "";

  function createLeak({
    title,
    answer,
    range,
    copy,
  }: {
    title: string;
    answer: string;
    range: [number, number];
    copy: (amount: number) => string;
  }): Leak {
    const amount = midpoint(
      range[0],
      range[1]
    );

    return {
      title,
      answer,
      min: range[0],
      max: range[1],
      amount,
      impact: impact(amount),
      insight: copy(amount),
    };
  }

  const leaks: Leak[] = [
    createLeak({
      title:
        "Takeaway & Food Delivery",

      answer: takeaway,

      range: rangeFor(takeaway, {
        Never: [0, 0],
        "1–2 times/week": [600, 1000],
        "3–5 times/week": [
          1200,
          2000,
        ],
        "Almost daily": [2500, 4000],
      }),

      copy: (amount) =>
        takeaway === "Never"
          ? "You said you do not rely on takeaway often, so this is unlikely to be your biggest leak."
          : `You said you order takeaway ${takeaway}. Reducing just part of that habit could save approximately ${money(
              amount
            )} per year.`,
    }),

    createLeak({
      title: "Subscriptions",

      answer: subscriptions,

      range: rangeFor(
        subscriptions,
        {
          "0–2": [0, 100],
          "3–5": [400, 700],
          "6–10": [800, 1400],
          "10+": [1500, 2500],
          "Not sure": [800, 1400],
        }
      ),

      copy: (amount) =>
        subscriptions === "0–2"
          ? "You have a low subscription count, so there may only be a small saving here."
          : `You told us you pay for ${subscriptions} subscriptions. A quick cleanup could save approximately ${money(
              amount
            )} per year.`,
    }),

    createLeak({
      title: "Insurance Overpayment",

      answer: insurance,

      range: rangeFor(insurance, {
        "Within 6 months": [0, 200],
        "6–12 months ago": [
          150,
          400,
        ],
        "1–2 years ago": [
          300,
          700,
        ],
        "Over 2 years ago": [
          500,
          1200,
        ],
        "Never / not sure": [
          600,
          1500,
        ],
        "I don’t currently have insurance":
          [0, 0],
      }),

      copy: (amount) =>
        insurance ===
        "I don’t currently have insurance"
          ? "You said you do not currently have insurance, so this area has been excluded from your savings estimate."
          : insurance ===
              "Within 6 months"
          ? "You reviewed insurance recently, so this may not be your highest opportunity."
          : `You said you last compared insurance ${insurance}. That could mean approximately ${money(
              amount
            )} per year in potential overpayment.`,
    }),

    createLeak({
      title: "Convenience Spending",

      answer: convenience,

      range: rangeFor(
        convenience,
        {
          Rarely: [0, 200],
          "1–2 times/week": [
            400,
            700,
          ],
          "3–5 times/week": [
            800,
            1400,
          ],
          Daily: [1500, 2500],
        }
      ),

      copy: (amount) =>
        convenience === "Rarely"
          ? "Convenience spending looks fairly controlled from your answer."
          : `You said you buy convenience items ${convenience}. Small repeat purchases could add up to approximately ${money(
              amount
            )} per year.`,
    }),

    createLeak({
      title:
        "Internet & Mobile Plan",

      answer: mobile,

      range: rangeFor(mobile, {
"Within 6 months": [0, 100],
"6-12 months ago": [100, 200],
"Over a year ago": [150, 400],
"I honestly don't know": [150, 400],
"I don’t pay either of these bills": [0, 0],
}),

copy: (amount) =>
mobile === "I don’t pay either of these bills"
? "You told us you don’t pay the household internet or mobile bills, so we’ve excluded this area from your savings estimate."
: mobile === "Within 6 months"
? "Your plan was reviewed recently, so the saving may be smaller here."
: `You said you last compared your plan ${mobile}. Older plans could be costing around ${money(
amount
)} per year more than newer offers.`,
}),

    createLeak({
title: "Energy Plan Comparison",

answer: recurring,

range: rangeFor(recurring, {
"Within 6 months": [0, 100],
"6-12 months ago": [100, 200],
"Over a year ago": [150, 350],
"I honestly don't know": [150, 350],
"I don’t pay these bills": [0, 0],
}),

copy: (amount) =>
recurring === "I don’t pay these bills"
? "You told us you don’t pay the household energy bills, so we’ve excluded this area from your savings estimate."
: recurring === "Within 6 months"
? "You compared your energy plan recently, so there may be less room to save here."
: recurring === "I honestly don't know"
? `You’re not sure when you last compared your energy plan. A quick comparison could potentially uncover around ${money(
amount
)} per year in savings.`
: `You said you last compared your energy plan ${recurring.toLowerCase()}. A quick comparison could potentially uncover around ${money(
amount
)} per year in savings.`,
}),

    createLeak({
      title: "Unplanned Purchases",

      answer: unplanned,

      range: rangeFor(
        unplanned,
        {
          Rarely: [0, 200],
          "1–2 times/week": [
            300,
            600,
          ],
          "3–5 times/week": [
            600,
            1200,
          ],
          "Almost daily": [
            1000,
            2000,
          ],
        }
      ),

      copy: (amount) =>
        unplanned === "Rarely"
          ? "Unplanned purchases do not look like a major leak from your answer."
          : `You said you make unplanned purchases ${unplanned}. Adding a little friction could save approximately ${money(
              amount
            )} per year.`,
    }),
  ];

  return leaks
    .filter(
      (item) => item.amount > 0
    )
    .sort(
      (a, b) =>
        b.amount - a.amount
    );
}

export default function Results() {
  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [answers, setAnswers] =
    useState<string[]>([]);

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "spendshift_answers"
      );

    if (stored) {
      try {
        setAnswers(
          JSON.parse(stored)
        );
      } catch {
        setAnswers([]);
      }
    }
  }, []);

  useEffect(() => {
    let current = 0;

    const progressTimer =
      setInterval(() => {
        current += 3;

        if (current >= 72) {
          current = 72;

          clearInterval(
            progressTimer
          );
        }

        setProgress(current);
      }, 70);

    const loadingTimer =
      setTimeout(() => {
        setLoading(false);
      }, 2300);

    return () => {
      clearInterval(
        progressTimer
      );

      clearTimeout(
        loadingTimer
      );
    };
  }, []);

  // GA4 + TikTok: FREE RESULTS VIEW
useEffect(() => {
  if (
    !loading &&
    !sessionStorage.getItem(
      "free_results_view_tracked"
    )
  ) {
    // GA4
    trackEvent(
      "free_results_view",
      {
        page_location:
          window.location.href,
      }
    );

    // TikTok
    trackTikTok("free_results_view");
    trackMeta("free_results_view");

    sessionStorage.setItem(
      "free_results_view_tracked",
      "1"
    );
  }
}, [loading]);

  const leaks = useMemo(
    () => buildLeaks(answers),
    [answers]
  );

  const totalMin =
    leaks.reduce(
      (sum, item) =>
        sum + item.min,
      0
    );

  const totalMax =
    leaks.reduce(
      (sum, item) =>
        sum + item.max,
      0
    );

  const totalMid =
    leaks.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const topLeaks =
    leaks.slice(0, 3);

  const savingsComparison =
    getSavingsComparison(
      totalMid
    );

  async function pay() {
    if (!acceptedTerms) {
      alert(
        "Please accept the Terms & Conditions, Privacy Policy and Financial Information & AI Disclaimer before continuing."
      );

      return;
    }

    if (busy) return;

    try {
      setBusy(true);

      const storedAnswers =
        localStorage.getItem(
          "spendshift_answers"
        ) || "[]";

      const res = await fetch(
        "/api/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            answers:
              storedAnswers,
          }),
        }
      );

      const data =
        await res.json();

      if (data.url) {
  // GA4: BEGIN CHECKOUT
  trackEvent(
    "begin_checkout",
    {
      currency: "AUD",
      value: 39,

      items: [
        {
          item_id:
            "spendshift_full_report",

          item_name:
            "SpendShift Full Savings Report",

          price: 39,

          quantity: 1,
        },
      ],
    }
  );

  // TikTok: BEGIN CHECKOUT
trackTikTok("InitiateCheckout", {
contents: [
{
content_id: "spendshift_full_report",
content_name: "SpendShift Full Savings Report",
quantity: 1,
price: 39,
},
],
content_type: "product",
value: 39,
currency: "AUD",
});

  // Meta BEGIN CHECKOUT
  trackMetaStandard("InitiateCheckout", {
  value: 39,
  currency: "AUD",
});
        // Give analytics events time to flush before leaving for Stripe
await new Promise((resolve) => setTimeout(resolve, 500));

  location.href =
    data.url;

  return;
}

alert(
  data.error ||
    "Stripe checkout failed"
);
    } catch (error) {
      console.error(
        "Checkout failed:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="auditPage">
        <Header simple />

        <div className="container">
          <div className="progressWrap">
            <div className="progressMeta">
              <b>Audit Progress</b>

              <span>
                Question 8 of 8
              </span>
            </div>

            <div className="bar">
              <span
                style={{
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div className="analysisCard">
            <div
              className="icon"
              style={{
                margin:
                  "0 auto 20px",
              }}
            >
              <ShieldCheck />
            </div>

            <h2>
              Analysing your
              Answers...
            </h2>

            <p>
              We're scanning your
              answers to estimate
              your biggest money
              leaks.
            </p>

            <div
              className="circle"
              style={{
                background: `conic-gradient(#059625 ${
                  progress * 3.6
                }deg, #e5e7eb 0deg)`,
              }}
            >
              <div>
                <strong>
                  {progress}%
                </strong>

                <br />

                <span>
                  Analysing
                </span>
              </div>
            </div>

            <div className="checksList">
              <div className="checkRow">
                <div className="left">
                  <div className="iconWrap">
                    <Wallet
                      size={18}
                    />
                  </div>

                  <span>
                    Reviewing your
                    spending patterns
                  </span>
                </div>

                <CheckCircle
                  size={20}
                  fill="#059625"
                  color="#fff"
                />
              </div>

              <div className="checkRow">
                <div className="left">
                  <div className="iconWrap">
                    <BarChart3
                      size={18}
                    />
                  </div>

                  <span>
                    Comparing against
                    category averages
                  </span>
                </div>

                {progress >= 30 ? (
                  <CheckCircle
                    size={20}
                    fill="#059625"
                    color="#fff"
                  />
                ) : (
                  <LoaderCircle
                    size={20}
                    color="#059625"
                    className="spin"
                  />
                )}
              </div>

              <div className="checkRow">
                <div className="left">
                  <div className="iconWrap">
                    <Search
                      size={18}
                    />
                  </div>

                  <span>
                    Identifying
                    overpayment
                    opportunities
                  </span>
                </div>

                {progress >= 55 ? (
                  <CheckCircle
                    size={20}
                    fill="#059625"
                    color="#fff"
                  />
                ) : progress >=
                  35 ? (
                  <LoaderCircle
                    size={20}
                    color="#059625"
                    className="spin"
                  />
                ) : (
                  <Circle
                    size={16}
                    fill="#9CA3AF"
                    color="#9CA3AF"
                  />
                )}
              </div>

              <div className="checkRow">
                <div className="left">
                  <div className="iconWrap">
                    <Lightbulb
                      size={18}
                    />
                  </div>

                  <span>
                    Calculating your
                    potential savings
                  </span>
                </div>

                {progress >= 72 ? (
                  <CheckCircle
                    size={20}
                    fill="#059625"
                    color="#fff"
                  />
                ) : progress >=
                  60 ? (
                  <LoaderCircle
                    size={20}
                    color="#059625"
                    className="spin"
                  />
                ) : (
                  <Circle
                    size={16}
                    fill="#9CA3AF"
                    color="#9CA3AF"
                  />
                )}
              </div>
            </div>

            <div className="safe">
              <div className="trend-ng-class">
                <Lock
                  color="#059625"
                  size={81}
                />
              </div>

              <div>
                <b>
                  Your data is safe
                  with us
                </b>

                <p className="mini">
                  We do not need bank
                  access to estimate
                  your savings
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auditPage">
      <Header simple />

      <main className="container">
        <div className="main-section-results">
          <section className="resultsHero">
            <div className="content-wrap-first reveal-left delay-1">
              <h1
                style={{
                  fontSize: 55,
                }}
              >
                We found your <br />

                <span
                  style={{
                    color:
                      "#059625",
                  }}
                >
                  biggest money leaks
                </span>
              </h1>

              <p>
                Based on your answers,
                we identified areas
                where you could be
                overpaying every year.
              </p>

              <div className="audit-page-label">
                <div>
                  <ShieldCheck
                    size={34}
                  />
                </div>

                <div>
                  <p>
                    Your data is
                    private & secure
                  </p>
                </div>
              </div>

              <div className="audit-page-label">
                <div>
                  <ChartNoAxesCombined
                    size={34}
                  />
                </div>

                <div>
                  <p>
                    Real insights.
                    Real savings.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="greenPanel reveal-right delay-2"
              style={{
                backgroundImage:
                  "url('/result/panelbg.png')",
              }}
            >
              <span className="badge">
                Total Recoverable Cash
                Found
              </span>

              <h2
                style={{
                  fontSize: 65,
                }}
              >
                {money(totalMin)} -{" "}
                {money(totalMax)}
                /year
              </h2>

              <p className="conclu-para">
                <Info size={34} />

                Based on your answers,
                we estimated your
                annual savings using
                category averages and
                conservative reduction
                targets.
              </p>

              <p
                className="mini"
                style={{
                  color: "#fff",
                  marginTop: 12,
                }}
              >
                {savingsComparison}
              </p>

              <a
  href="#unlock-full-report"
  className="btn white"
  onClick={() => {
    // GA4
    trackEvent("upgrade_click", {
      location: "results_hero",
      value: 39,
      currency: "AUD",
    });

 
    trackTikTok("upgrade_click");
    trackMeta("upgrade_click");
  }}
>
  Get My Full Report
</a>
            </div>
          </section>

          <div className="leakTabs reveal-up">
            {leaks
              .slice(0, 5)
              .map((l) => (
                <div
                  className="leakTab"
                  key={l.title}
                >
                  <small>
                    {l.impact}
                  </small>

                  <strong>
                    {money(
                      l.amount
                    )}
                  </strong>

                  <span>
                    {l.title}
                  </span>
                </div>
              ))}

            <div className="leakTab">
              <small>LOCKED</small>

              <strong>
                Unlock
              </strong>

              <span>
                Full personalised
                action plan
              </span>
            </div>
          </div>
        </div>

        <h2 className="reveal-up">
          Your Top 3 money leaks
        </h2>

        <section className="mainResults reveal-up">
          <div>
            {topLeaks.map(
              (l, idx) => (
                <article
                  className="panel leak"
                  key={l.title}
                >
                  <span className="pill">
                    0{idx + 1}{" "}
                    {l.impact}
                  </span>

                  <h3>
                    {l.title}
                  </h3>

                  <div className="add-bg">
                    <p>
                      {l.insight}
                    </p>

                    <div className="savings">
                      <span>
                        Save
                      </span>{" "}

                      {money(
                        l.amount
                      )}{" "}

                      <span>
                        per year
                      </span>
                    </div>
                  </div>

                  <p className="mini">
                    The full report
                    shows exactly what
                    to do next,
                    including scripts
                    and a 30-day
                    action plan.
                  </p>
                </article>
              )
            )}

            <div className="safe">
              <div className="trend-ng-class">
                <Zap
                  color="#059625"
                  size={81}
                />
              </div>

              <div>
                <b>
                  These are just the
                  big ones.
                </b>

                <p className="mini">
                  Your full report
                  includes deeper
                  personalised
                  insights, hidden
                  leaks, scripts, and
                  action steps.
                </p>
              </div>
            </div>
          </div>

          <aside
            className="panel reportBox"
            id="unlock-full-report"
          >
            <span className="pill">
              <BsCheckCircleFill
                size={20}
                color="#059625"
              />

              {" "}
              Unlock Your{" "}

              <span>
                Full Potential
              </span>
            </span>

            <h2>
              Get your personalised
              action plan
            </h2>

            <p className="list-item">
              <BsCheckCircleFill
                size={15}
                color="#059625"
              />

              {" "}
              See all your money leaks
            </p>

            <p className="list-item">
              <BsCheckCircleFill
                size={15}
                color="#059625"
              />

              {" "}
              Get your estimated
              savings
            </p>

            <p className="list-item">
              <BsCheckCircleFill
                size={15}
                color="#059625"
              />

              {" "}
              Step-by-step action plan
            </p>

            <p className="list-item">
              <BsCheckCircleFill
                size={15}
                color="#059625"
              />

              {" "}
              Scripts you can use
            </p>

            <p className="list-item">
              <BsCheckCircleFill
                size={15}
                color="#059625"
              />

              {" "}
              Save more, stress less
            </p>

            <div className="card unlock-card">
              <h5>
                <FileClock
                  size={25}
                  color="#059625"
                />

                Your Full Report
              </h5>

              <p>
                <FileClock
                  size={25}
                  color="#fff"
                />

                Potential annual
                savings
              </p>

              <div className="savings">
                {money(totalMid)}
              </div>

              <div className="top-bar-leaks">
                <div className="item">
                  <span>
                    Top leaks found:
                  </span>

                  <span>
                    {leaks.length}
                  </span>
                </div>

                <div className="item">
                  <span>
                    Action plan steps:
                  </span>

                  <span>
                    18
                  </span>
                </div>
              </div>
            </div>

            <div className="checkoutConsent">
              <label className="checkoutConsentLabel">
                <input
                  type="checkbox"
                  checked={
                    acceptedTerms
                  }
                  onChange={(e) =>
                    setAcceptedTerms(
                      e.target.checked
                    )
                  }
                />

                <span>
                  I agree to the{" "}

                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                  >
                    Terms &amp;
                    Conditions
                  </Link>
                  ,{" "}

                  <Link
                    href="/privacy-policy"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>{" "}

                  and{" "}

                  <Link
                    href="/financial-information-ai-disclaimer"
                    target="_blank"
                  >
                    Financial
                    Information &amp;
                    AI Disclaimer
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={pay}
              disabled={
                !acceptedTerms ||
                busy
              }
              className="unlock flex items-center justify-center gap-2"
            >
              <Lock
                size={20}
                color="#fff"
              />

              <span>
                {busy
                  ? "Redirecting..."
                  : "Unlock My Full Report — A$39"}
              </span>
            </button>

            <p className="mini">
              Estimates are based on
              your answers and typical
              spending patterns.
              Actual savings may vary.
              This is general
              information, not
              financial advice.
            </p>
          </aside>
        </section>

        <ScrollReveal />
      </main>
    </div>
  );
}
