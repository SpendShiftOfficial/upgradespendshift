"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Smartphone,
  Search,
  ChartNoAxesCombined,
  FileText,
  CheckCircle2,
  MoveRight,
  ShieldCheck,
  Clock3,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Complete the free audit",
    text: "Answer eight simple questions about your everyday spending habits. The audit takes approximately two minutes and does not require bank access.",
    points: [
      "No signup required",
      "No bank connection",
      "No credit card for free results",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "We analyse your answers",
    text: "SpendShift reviews your responses to identify patterns that could indicate recurring costs, overpayments or avoidable spending.",
    points: [
      "Australian category averages",
      "Conservative savings estimates",
      "Personalised to your answers",
    ],
  },
  {
    number: "03",
    icon: ChartNoAxesCombined,
    title: "See your free results",
    text: "You receive an immediate overview of your strongest savings opportunities, including estimated ranges and your top money leaks.",
    points: [
      "Top three opportunities",
      "Estimated savings range",
      "Clear personalised insights",
    ],
  },
  {
    number: "04",
    icon: FileText,
    title: "Unlock your full report",
    text: "Upgrade to receive a detailed personalised report with deeper insights, practical scripts and a clear 30-day action plan.",
    points: [
      "Priority money leaks",
      "Negotiation and cancellation scripts",
      "30-day action plan",
    ],
  },
];

export default function HowItWorksPage() {

  return (
    <div className="innerPage">
      <Header />

      <main>
        <section className="innerHero">
          <div className="container innerHeroGrid">
            <div className="innerHeroContent reveal-left delay-1">
              <span className="innerEyebrow">
                <Sparkles size={17} />
                How SpendShift Works
              </span>

              <h1>
                From a two-minute audit to <span>clear savings actions.</span>
              </h1>

              <p>
                SpendShift turns a few simple answers into practical insights
that help you understand where money could be quietly
disappearing. You can also explore our{" "}
<Link
href="/save-money-australia"
style={{
color: "inherit",
fontWeight: 700,
textDecoration: "underline",
textUnderlineOffset: "3px",
}}
>
practical ways to save money in Australia
</Link>.    
              </p>

              <div className="innerHeroChecks">
                <span>
                  <Clock3 size={19} />
                  Approximately two minutes
                </span>

                <span>
                  <ShieldCheck size={19} />
                  No bank access required
                </span>
              </div>

              <Link href="/audit" className="btn">
                Start Your Free Audit
                <MoveRight size={18} />
              </Link>
            </div>

            <div className="howHeroCard reveal-right delay-1">
              <span className="howHeroLabel">Simple process</span>

              <strong>4 steps</strong>

              <p>
                Complete the audit, view your free results and unlock your
                personalised action plan when you are ready.
              </p>

              <div className="howHeroMiniSteps">
                {steps.map((step) => (
                  <div key={step.number}>
                    <span>{step.number}</span>
                    <p>{step.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="howProcessSection">
          <div className="container">
            <div className="sectionIntro reveal-up">
              <span className="sectionEyebrow">The Process</span>

              <h2 className="sectionTitle">
                Simple from start
                <br />
                <span>to finish.</span>
              </h2>

              <p>
                No spreadsheets, no complex setup and no need to connect your
                bank account.
              </p>
            </div>

            <div className="howProcessList">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article className="howProcessCard reveal-up" key={step.number}>
                    <div className="howProcessNumber">{step.number}</div>

                    <div className="howProcessIcon">
                      <Icon size={36} strokeWidth={1.5} />
                    </div>

                    <div className="howProcessContent">
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>

                      <div className="howProcessPoints">
                        {step.points.map((point) => (
                          <span key={point}>
                            <CheckCircle2
                              size={18}
                              fill="#059625"
                              stroke="white"
                            />
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="howTrustSection">
          <div className="container howTrustGrid">
            <div className="howTrustContent reveal-left">
              <span className="sectionEyebrow">Designed for clarity</span>

              <h2>Useful insight without the complexity of a budgeting app.</h2>

              <p>
                SpendShift focuses on recurring habits and everyday spending
                patterns. It gives you clear recommendations without asking you
                to build a budget or connect financial accounts.
              </p>
            </div>

            <div className="howTrustCards">
              <div className="reveal-up delay-1">
                <ShieldCheck size={28} />
                <h3>Private</h3>
                <p>No bank account connection is required.</p>
              </div>

              <div className="reveal-up delay-2">
                <Clock3 size={28} />
                <h3>Fast</h3>
                <p>Complete the full audit in approximately two minutes.</p>
              </div>

              <div className="reveal-up delay-3">
                <Sparkles size={28} />
                <h3>Personalised</h3>
                <p>Every report is generated from the answers you provide.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div className="reveal-left">
                <h2>Find your biggest money leaks today.</h2>
                <p>
                  Start with the free audit and see your top opportunities in
                  approximately two minutes.
                </p>
              </div>

              <div className="reveal-right">
                <Link href="/audit" className="btn white">
                  Start Your Free Audit
                  <MoveRight size={18} />
                </Link>

                <p className="noCard">No credit card required.</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <ScrollReveal />
      </main>
    </div>
  );
}
