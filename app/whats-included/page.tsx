"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FileText,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

const reportFeatures = [
  {
    icon: CircleDollarSign,
    title: "Estimated Annual Savings",
    text: "See approximately how much you could save each year based on your answers and conservative reduction targets.",
  },
  {
    icon: Target,
    title: "Priority Money Leaks",
    text: "Understand which spending areas could have the biggest impact and what to focus on first.",
  },
  {
    icon: Search,
    title: "Hidden Savings Opportunities",
    text: "Discover recurring costs and everyday spending patterns that are easy to overlook.",
  },
  {
    icon: MessageSquareText,
    title: "Negotiation Scripts",
    text: "Use practical scripts when asking insurers, mobile providers or other services for a better price.",
  },
  {
    icon: FileText,
    title: "Cancellation Scripts",
    text: "Get ready-to-use wording for cancelling subscriptions and unwanted recurring services.",
  },
  {
    icon: CalendarDays,
    title: "30-Day Action Plan",
    text: "Follow a simple four-week plan that turns your recommendations into manageable actions.",
  },
  {
    icon: ListChecks,
    title: "Savings Checklist",
    text: "Tick off your recommended actions and clearly see what you have already completed.",
  },
  {
    icon: FileCheck2,
    title: "Saved Personalised Report",
    text: "Return to your report through your saved link whenever you want to review your next steps.",
  },
];

const freeFeatures = [
  "Complete 8-question savings audit",
  "Your biggest money leaks",
  "Estimated savings range",
  "Top three opportunities",
  "No signup required",
  "No bank connection required",
];

const fullFeatures = [
  "Everything included in the free audit",
  "Full personalised savings report",
  "Estimated annual savings",
  "Priority money leaks",
  "Hidden savings opportunities",
  "Negotiation scripts",
  "Cancellation scripts",
  "30-day action plan",
  "Interactive savings checklist",
  "Saved report access",
];

export default function WhatsIncludedPage() {

  return (
    <div className="innerPage">
      <Header />

      <main>
        {/* HERO */}
        <section className="includedPageHero">
          <div className="container includedPageHeroGrid">
            <div className="includedPageHeroContent reveal-left delay-1">
              <span className="innerEyebrow">
                <Sparkles size={17} />
                What’s Included
              </span>

              <h1>
                Everything you need to turn insight into{" "}
                <span>practical action.</span>
              </h1>

              <p>
                SpendShift gives you clear savings estimates, personalised
recommendations and simple actions based on the answers you
provide. For practical examples, explore our{" "}
<Link
href="/save-money-australia"
style={{
color: "inherit",
fontWeight: 700,
textDecoration: "underline",
textUnderlineOffset: "3px",
}}
>
guide to saving money in Australia
</Link>.
              </p>

              <div className="includedHeroPoints">
                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Personalised to your answers
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Built for Australian spending habits
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  No subscription or recurring fee
                </span>
              </div>

              <Link href="/audit" className="btn">
                Start Your Free Audit
                <ArrowRight size={18} />
              </Link>
            </div>

            <aside className="includedHeroSummary reveal-right delay-2">
              <span className="includedSummaryLabel">
                Full personalised report
              </span>

              <h2>A$39</h2>

              <p className="includedSummaryPayment">
                One-time payment. No subscription.
              </p>

              <div className="includedSummaryList">
                <span>
                  <CheckCircle2 size={18} />
                  Annual savings estimate
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Priority and hidden money leaks
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Negotiation and cancellation scripts
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  30-day action plan
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Interactive savings checklist
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Saved report access
                </span>
              </div>

              <div className="includedSummaryTrust">
                <LockKeyhole size={18} />
                Secure payment through Stripe
              </div>
            </aside>
          </div>
        </section>

        {/* FULL REPORT FEATURES */}
        <section className="reportFeaturesSection">
          <div className="container">
            <div className="sectionIntro reveal-up">
              <span className="sectionEyebrow">Inside Your Report</span>

              <h2 className="sectionTitle">
                Clear insights.
                <br />
                <span>Useful next steps.</span>
              </h2>

              <p>
                Every part of your report is designed to help you understand
                what could be costing you money and what to do next.
              </p>
            </div>

            <div className="reportFeaturesGrid">
              {reportFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article className="reportFeatureCard reveal-up delay-1" key={feature.title}>
                    <div className="reportFeatureIcon">
                      <Icon size={31} strokeWidth={1.5} />
                    </div>

                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FREE VS FULL */}
        <section className="includedComparisonSection">
          <div className="container">
            <div className="sectionIntro reveal-up">
              <span className="sectionEyebrow">Choose Your Level</span>

              <h2 className="sectionTitle">
                Start with useful free insights.
                <br />
                <span>Unlock the complete plan when ready.</span>
              </h2>
            </div>

            <div className="includedComparisonGrid">
              <article className="includedPlanCard reveal-left">
                <div className="includedPlanHeader">
                  <span>Free Savings Audit</span>
                  <strong>A$0</strong>

                  <p>
                    Understand your biggest opportunities before paying
                    anything.
                  </p>
                </div>

                <div className="includedPlanList">
                  {freeFeatures.map((feature) => (
                    <span key={feature}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn includedPlanButton">
                  Start Free Audit
                  <ArrowRight size={18} />
                </Link>

                <p className="includedPlanNote">No credit card required.</p>
              </article>

              <article className="includedPlanCard fullIncludedPlan reveal-right">
                <span className="includedPopularLabel">
                  Complete Savings Plan
                </span>

                <div className="includedPlanHeader">
                  <span>Full Personalised Savings Report</span>
                  <strong>A$39</strong>

                  <p>
                    Get the detailed recommendations, scripts and action plan
                    needed to start making changes.
                  </p>
                </div>

                <div className="includedPlanList">
                  {fullFeatures.map((feature) => (
                    <span key={feature}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn includedPlanButton">
                  Start My Free Audit
                  <ArrowRight size={18} />
                </Link>

                <div className="includedPaymentNotes">
                  <span>One-time payment</span>
                  <span>No subscription</span>
                  <span>Instant access</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* REPORT FLOW */}
        <section className="includedFlowSection">
          <div className="container includedFlowGrid">
            <div className="includedFlowContent reveal-left">
              <span className="sectionEyebrow">Designed for action</span>

              <h2>Your report does more than identify a problem.</h2>

              <p>
                Each recommendation explains why the opportunity matters, how
                much you could save and the simplest action to take next.
              </p>

              <Link href="/how-it-works">
                See How SpendShift Works
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="includedFlowSteps">
              <div className="reveal-up delay-1">
                <span>01</span>
                <div>
                  <h3>Understand the opportunity</h3>
                  <p>
                    See which habits or recurring costs could have the greatest
                    impact.
                  </p>
                </div>
              </div>

              <div className="reveal-up delay-2">
                <span>02</span>
                <div>
                  <h3>Know what to do next</h3>
                  <p>
                    Get a quick win, a longer-term next step and an estimated
                    completion time.
                  </p>
                </div>
              </div>

              <div className="reveal-up delay-3">
                <span>03</span>
                <div>
                  <h3>Track your actions</h3>
                  <p>
                    Use the savings checklist and 30-day plan to stay focused
                    without feeling overwhelmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div className="reveal-left delay-1">
                <h2>See what your spending habits could be costing you.</h2>
                <p>
                  Complete the free audit and receive your first insights in
                  approximately two minutes.
                </p>
              </div>

              <div className="reveal-right delay-1">
                <Link className="btn white" href="/audit">
                  Start Your Free Audit
                  <ArrowRight size={18} />
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
