"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Header from "@/components/Header";

import { trackEvent } from "@/lib/gtag";
import { trackTikTok } from "@/lib/tiktok";
import { trackMetaStandard } from "@/lib/meta";
import {
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  BarChart3,
  FileText,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    title: "Payment confirmed",
    text: "Your payment was successful.",
    icon: ShieldCheck,
  },
  {
    title:
      "Analysing spending patterns",
    text: "Reviewing your audit answers.",
    icon: BarChart3,
  },
  {
    title:
      "Calculating opportunities",
    text: "Estimating your biggest savings areas.",
    icon: Sparkles,
  },
  {
    title:
      "Building action plan",
    text: "Creating your personalised next steps.",
    icon: FileText,
  },
  {
    title:
      "Generating scripts",
    text: "Preparing negotiation and cancellation scripts.",
    icon: MessageSquareText,
  },
];

function SuccessContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [error, setError] =
    useState("");

  const [
    activeStep,
    setActiveStep,
  ] = useState(0);

  useEffect(() => {
    const stepTimer =
      setInterval(() => {
        setActiveStep((prev) => {
          if (
            prev >=
            steps.length - 1
          ) {
            return prev;
          }

          return prev + 1;
        });
      }, 5000);

    return () =>
      clearInterval(stepTimer);
  }, []);

  useEffect(() => {
  let cancelled = false;

  async function createReport() {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Missing payment session.");
      return;
    }

    try {
      const res = await fetch("/api/create-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      const data = await res.json();

      if (cancelled) return;

      if (!res.ok) {
        setError(
          data.error || "Could not generate report."
        );
        return;
      }

      if (!data.reportId) {
        setError(
          data.error || "Could not generate report."
        );
        return;
      }

      /* =========================
   GA4 + TIKTOK PURCHASE
========================= */

const purchaseKey =
  `purchase_tracked_${sessionId}`;

if (!localStorage.getItem(purchaseKey)) {
  // GA4
  trackEvent("purchase", {
    transaction_id: sessionId,
    value: 39,
    currency: "AUD",

    items: [
      {
        item_id: "spendshift_full_report",
        item_name: "SpendShift Full Savings Report",
        price: 39,
        quantity: 1,
      },
    ],
  });

  // TikTok
trackTikTok("Purchase", {
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

  // META AD TRACK EVENT
  trackMetaStandard("Purchase", {
  value: 39,
  currency: "AUD",
});

  localStorage.setItem(
    purchaseKey,
    "1"
  );

  console.log("GA4 + TikTok purchase fired", {
    transaction_id: sessionId,
    value: 39,
    currency: "AUD",
  });
}

      /* =========================
         GA4 PAID REPORT READY
      ========================= */

      const reportReadyKey =
        `paid_report_ready_tracked_${sessionId}`;

      if (!localStorage.getItem(reportReadyKey)) {
        trackEvent("paid_report_ready", {
          transaction_id: sessionId,
          report_id: data.reportId,
          value: 39,
          currency: "AUD",
        });

        localStorage.setItem(
          reportReadyKey,
          "1"
        );

        console.log(
          "GA4 paid_report_ready fired",
          {
            transaction_id: sessionId,
            report_id: data.reportId,
          }
        );
      }

      /*
        Give GA4 a moment to send both events
        before navigating away.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      if (!cancelled) {
        router.push(
          `/report/${data.reportId}`
        );
      }
    } catch (error) {
      console.error(
        "Report generation failed:",
        error
      );

      if (!cancelled) {
        setError(
          "Something went wrong while generating your report."
        );
      }
    }
  }

  createReport();

  return () => {
    cancelled = true;
  };
}, [router, searchParams]);

  return (
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

      <h1>
        Payment successful
      </h1>

      <p>
        We’re generating your
        personalised SpendShift
        report. This can take a
        little time while we build
        your insights and action
        plan.
      </p>

      <div className="reportLoader">
        <span />
      </div>

      <div className="reportSteps">
        {steps.map(
          (step, index) => {
            const Icon =
              step.icon;

            const done =
              index <
              activeStep;

            const active =
              index ===
              activeStep;

            return (
              <div
                className={`reportStep ${
                  done
                    ? "done"
                    : ""
                } ${
                  active
                    ? "active"
                    : ""
                }`}
                key={
                  step.title
                }
              >
                <div className="reportStepIcon">
                  {done ? (
                    <CheckCircle2
                      size={20}
                      fill="#059625"
                      stroke="white"
                    />
                  ) : active ? (
                    <LoaderCircle
                      size={20}
                      className="spin"
                      color="#059625"
                    />
                  ) : (
                    <Icon
                      size={20}
                    />
                  )}
                </div>

                <div>
                  <b>
                    {step.title}
                  </b>

                  <p>
                    {step.text}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>

      <p className="mini">
        Please don’t close this
        page. You’ll be redirected
        automatically when your
        report is ready.
      </p>

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="auditPage">
      <Header simple />

      <Suspense
        fallback={
          <p>
            Loading payment
            session...
          </p>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
