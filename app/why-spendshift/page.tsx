"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  EyeOff,
  MapPin,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

const benefits = [
  {
    icon: WalletCards,
    title: "Unlike Budgeting Apps",
    text: "SpendShift focuses on identifying money that could be quietly disappearing through everyday habits.",
    points: [
      "No spreadsheets",
      "No detailed budgeting",
      "No bank connection required",
      "Practical ways to save more",
    ],
  },
  {
    icon: MapPin,
    title: "Built for Australians",
    text: "Our recommendations are shaped around Australian pricing, providers and everyday spending habits.",
    points: [
      "Australian pricing context",
      "Local providers and services",
      "Relevant spending categories",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Private",
    text: "You never need to connect your bank account or provide access to your financial accounts.",
    points: [
      "No bank login required",
      "No transaction syncing",
      "Secure payment through Stripe",
    ],
  },
  {
    icon: Clock3,
    title: "Fast",
    text: "Complete your free savings audit in approximately two minutes.",
    points: [
      "Eight simple questions",
      "Immediate free results",
      "No complicated setup",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Actionable",
    text: "Every recommendation explains what to do next and how long the action could take.",
    points: [
      "Clear quick wins",
      "Practical next steps",
      "Estimated completion times",
    ],
  },
  {
    icon: Bot,
    title: "AI Powered",
    text: "Every report is generated specifically from the answers you provide during the audit.",
    points: [
      "Personalised report structure",
      "Relevant savings opportunities",
      "Tailored scripts and action plan",
    ],
  },
];

const differences = [
  {
    traditional: "Detailed spreadsheets",
    spendshift: "Eight simple questions",
  },
  {
    traditional: "Bank account connections",
    spendshift: "No bank access required",
  },
  {
    traditional: "Manual transaction categorisation",
    spendshift: "Automatic personalised insights",
  },
  {
    traditional: "Complex monthly budgeting",
    spendshift: "Clear savings opportunities",
  },
  {
    traditional: "General financial advice",
    spendshift: "Recommendations based on your answers",
  },
];

export default function WhySpendShiftPage() {

  return (
    <div className="innerPage">
      <Header />

      <main>
        {/* HERO */}
        <section className="whyPageHero">
          <div className="container whyPageHeroGrid">
            <div className="whyPageHeroContent reveal-left delay-1">
              <span className="innerEyebrow">
                <Sparkles size={17} />
                Why SpendShift
              </span>

              <h1>
                A simpler way to find money that could be{" "}
                <span>quietly disappearing.</span>
              </h1>

              <p>
                Unlike traditional budgeting apps, SpendShift focuses on
identifying practical savings opportunities without asking you
to build spreadsheets, track every transaction or connect your
bank account. For more ideas, explore our{" "}
<Link
href="/save-money-australia"
style={{
color: "inherit",
fontWeight: 700,
textDecoration: "underline",
textUnderlineOffset: "3px",
}}
>
Australian money-saving guide
</Link>.
              </p>

              <div className="whyHeroChecks">
                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  No spreadsheets
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  No bank connection
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Practical next steps
                </span>
              </div>

              <Link href="/audit" className="btn">
                Start Your Free Audit
                <ArrowRight size={18} />
              </Link>
            </div>

            <aside className="whyHeroPanel reveal-right delay-2">
              <span className="whyHeroPanelLabel">
                SpendShift is designed to be
              </span>

              <div className="whyHeroPanelItems">
                <div>
                  <EyeOff size={26} />
                  <span>
                    <strong>Private</strong>
                    No bank access required
                  </span>
                </div>

                <div>
                  <Clock3 size={26} />
                  <span>
                    <strong>Fast</strong>
                    Approximately two minutes
                  </span>
                </div>

                <div>
                  <MapPin size={26} />
                  <span>
                    <strong>Australian</strong>
                    Relevant to local spending habits
                  </span>
                </div>

                <div>
                  <ClipboardCheck size={26} />
                  <span>
                    <strong>Actionable</strong>
                    Clear recommendations and next steps
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="whyBenefitsSection">
          <div className="container">
            <div className="sectionIntro reveal-up">
              <span className="sectionEyebrow">Designed Differently</span>

              <h2 className="sectionTitle">
                Less complexity.
                <br />
                <span>More practical clarity.</span>
              </h2>

              <p>
                SpendShift is designed for people who want to understand where
                they could save without managing another complicated financial
                tool.
              </p>
            </div>

            <div className="whyBenefitsGrid reveal-up">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article className="whyBenefitCard" key={benefit.title}>
                    <div className="whyBenefitIcon">
                      <Icon size={32} strokeWidth={1.5} />
                    </div>

                    <h3>{benefit.title}</h3>
                    <p>{benefit.text}</p>

                    <div className="whyBenefitPoints">
                      {benefit.points.map((point) => (
                        <span key={point}>
                          <CheckCircle2
                            size={17}
                            fill="#059625"
                            stroke="white"
                          />
                          {point}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="whyComparisonSection">
          <div className="container">
            <div className="sectionIntro reveal-up">
              <span className="sectionEyebrow">
                SpendShift vs Traditional Budgeting
              </span>

              <h2 className="sectionTitle">
                You do not need another
                <br />
                <span>complicated finance app.</span>
              </h2>

              <p>
                SpendShift removes the setup and tracking normally associated
                with budgeting tools.
              </p>
            </div>

            <div className="whyComparisonTable">
              <div className="whyComparisonHeader">
                <span className="reveal-left">Traditional budgeting tools</span>
                <span className="reveal-right">SpendShift</span>
              </div>

              {differences.map((item) => (
                <div className="whyComparisonRow" key={item.traditional}>
                  <div className="whyComparisonTraditional reveal-up">
                    <span className="comparisonMinus">−</span>
                    {item.traditional}
                  </div>

                  <div className="whyComparisonSpendShift reveal-up">
                    <CheckCircle2 size={19} fill="#059625" stroke="white" />
                    {item.spendshift}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUSTRALIAN SECTION */}
        <section className="whyAustralianSection">
          <div className="container whyAustralianGrid">
            <div className="whyAustralianContent reveal-left">
              <span className="sectionEyebrow">Built for Australians</span>

              <h2>
                Recommendations that feel relevant to everyday Australian life.
              </h2>

              <p>
                SpendShift uses Australian category averages, common local
                providers and typical spending patterns to create estimates and
                recommendations that better match the market you live in.
              </p>

              <div className="whyAustralianPoints">
                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Australian dollars and pricing
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Relevant local providers
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Australian English throughout
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Practical everyday comparisons
                </span>
              </div>
            </div>

            <div className="whyAustralianCard reveal-right">
              <MapPin size={40} />

              <span>Australian focused</span>

              <strong>
                Local context creates more useful recommendations.
              </strong>

              <p>
                Your report is designed to provide general savings information
                based on the answers you submit and spending patterns relevant
                to Australian consumers.
              </p>
            </div>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="whyPrivacySection">
          <div className="container whyPrivacyGrid">
            <div className="whyPrivacyCard reveal-left">
              <ShieldCheck size={44} />

              <h3>No bank connection required</h3>

              <p>
                SpendShift generates your results from the answers you provide.
                We do not need access to your bank account or transaction
                history.
              </p>
            </div>

            <div className="whyPrivacyContent reveal-right">
              <span className="sectionEyebrow">Privacy First</span>

              <h2>
                Understand your spending without handing over your financial
                accounts.
              </h2>

              <p>
                Your audit answers are used to generate your personalised
                insights and report. Payment details are securely processed by
                Stripe and are not stored by SpendShift.
              </p>

              <Link href="/privacy-policy">
                Read Our Privacy Policy
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div className="reveal-left">
                <h2>Find your biggest savings opportunities today.</h2>

                <p>
                  Complete the free audit in approximately two minutes. No bank
                  connection or credit card required.
                </p>
              </div>

              <div className="reveal-right">
                <Link href="/audit" className="btn white">
                  Start Your Free Audit
                  <ArrowRight size={18} />
                </Link>

                <p className="noCard">Free results. No signup required.</p>
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
