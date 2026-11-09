import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const freeFeatures = [
  "Complete 8-question savings audit",
  "Biggest money leaks",
  "Estimated savings range",
  "Top three opportunities",
  "Immediate free results",
  "No signup required",
  "No bank connection required",
];

const paidFeatures = [
  "Everything included in the free audit",
  "Full personalised savings report",
  "Estimated annual savings",
  "Priority money leaks",
  "Hidden savings opportunities",
  "Negotiation scripts",
  "Cancellation scripts",
  "30-day action plan",
  "Interactive savings checklist",
  "Estimated completion times",
  "Savings confidence indicators",
  "Saved report access",
  "Email report delivery",
];

const trustPoints = [
  {
    icon: CreditCard,
    title: "One-time payment",
    text: "Pay A$39 once. There are no subscriptions or recurring charges.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Payments are securely processed through Stripe.",
  },
  {
    icon: Clock3,
    title: "Fast access",
    text: "Your report begins generating immediately after payment.",
  },
  {
    icon: LockKeyhole,
    title: "Private",
    text: "SpendShift never stores your card details or requires bank access.",
  },
];

export default function PricingPage() {
  
  return (
    <div className="innerPage">
      <Header />

      <main>
        {/* HERO */}
        <section className="pricingPageHero">
          <div className="container pricingPageHeroContent">
            <span className="innerEyebrow reveal-up delay-1">
              <Sparkles size={17} />
              Simple Pricing
            </span>

            <h1 className="reveal-up delay-2">
              Start free.
              <br />
              <span>Unlock the full plan when you are ready.</span>
            </h1>

            <p className="reveal-up delay-3">
              Complete your free savings audit first. Upgrade only when you want
              the complete personalised report, scripts, checklist and 30-day
              action plan.
            </p>

            <div className="pricingHeroTrust">
              <span className="reveal-up delay-1">
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                No subscription
              </span>

              <span className="reveal-up delay-2">
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                One-time payment
              </span>

              <span className="reveal-up delay-3">
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                Secure Stripe checkout
              </span>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="pricingPlansSection">
          <div className="container">
            <div className="pricingPageGrid">
              {/* FREE PLAN */}
              <article className="pricingPageCard reveal-up">
                <div className="pricingPageCardHeader">
                  <div className="pricingPageIcon">
                    <FileText size={30} strokeWidth={1.5} />
                  </div>

                  <span className="pricingPageLabel">Free Audit</span>

                  <div className="pricingPageAmount">
                    <strong>A$0</strong>
                  </div>

                  <p>
                    Get an immediate overview of your strongest savings
                    opportunities without paying anything.
                  </p>
                </div>

                <div className="pricingPageList">
                  {freeFeatures.map((feature) => (
                    <span key={feature}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn pricingPageButton">
                  Start Free Audit
                  <ArrowRight size={18} />
                </Link>

                <p className="pricingPageFinePrint">No credit card required.</p>
              </article>

              {/* PAID PLAN */}
              <article className="pricingPageCard pricingPageFeatured reveal-up">
                <span className="pricingPagePopular">
                  Full Personalised Report
                </span>

                <div className="pricingPageCardHeader">
                  <div className="pricingPageIcon">
                    <CircleDollarSign size={30} strokeWidth={1.5} />
                  </div>

                  <span className="pricingPageLabel">
                    Full Personalised Savings Report
                  </span>

                  <div className="pricingPageAmount">
                    <strong>A$39</strong>
                    <small>one-time payment</small>
                  </div>

                  <p>
                    Unlock your complete personalised savings report and
                    practical action plan.
                  </p>
                </div>

                <div className="pricingPageList">
                  {paidFeatures.map((feature) => (
                    <span key={feature}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn pricingPageButton">
                  Start My Free Audit
                  <ArrowRight size={18} />
                </Link>

                <div className="pricingPageTrustLine">
                  <span>One-time payment</span>
                  <span>No subscription</span>
                  <span>Instant access</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* WHY PAY */}
        <section className="pricingValueSection">
          <div className="container pricingValueGrid">
            <div className="pricingValueContent reveal-left delay-1">
              <span className="sectionEyebrow">
                What the full report unlocks
              </span>

              <h2>More than a savings number.</h2>

              <p>
                The full report explains where money could be disappearing, what
to fix first, how much you could save and exactly what action to
take next. If you want practical ideas before upgrading, explore our{" "}
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

              <div className="pricingValuePoints">
                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Ranked savings opportunities
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Practical scripts you can use immediately
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  30-day implementation roadmap
                </span>

                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Interactive checklist to track progress
                </span>
              </div>
            </div>

            <div className="pricingValuePanel reveal-right delay-2">
              <span>Example report value</span>

              <strong>A$3,050/year</strong>

              <p>
                A personalised report could reveal enough potential savings to
                cover weeks of groceries, household bills or build a stronger
                emergency buffer.
              </p>

              <div className="pricingValueMiniList">
                <span>
                  <ListChecks size={19} />
                  Clear action checklist
                </span>

                <span>
                  <FileText size={19} />
                  Personalised scripts
                </span>

                <span>
                  <Clock3 size={19} />
                  Estimated action times
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="pricingTrustSection">
          <div className="container">
            <div className="sectionIntro reveal-up delay-2">
              <span className="sectionEyebrow">Simple and secure</span>

              <h2 className="sectionTitle">
                No hidden fees.
                <br />
                <span>No ongoing commitment.</span>
              </h2>
            </div>

            <div className="pricingTrustGrid">
              {trustPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <article className="pricingTrustCard reveal-up" key={item.title}>
                    <div className="pricingTrustIcon">
                      <Icon size={29} strokeWidth={1.5} />
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* REFUND */}
        <section className="pricingRefundSection">
          <div className="container">
            <div className="pricingRefundCard">
              <div className="pricingRefundIcon reveal-up">
                <ShieldCheck size={42} />
              </div>

              <div>
                <span className="sectionEyebrow reveal-up">
                  30-day satisfaction promise
                </span>

                <h2 className="reveal-up">Buy with confidence.</h2>

                <p className="reveal-up">
                  If you do not believe your report helped you identify
                  meaningful savings opportunities, contact SpendShift within 30
                  days and we will review your refund request.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ PREVIEW */}
        <section className="pricingFaqPreview">
          <div className="container pricingFaqGrid reveal-left delay-1">
            <div>
              <span className="sectionEyebrow">Pricing questions</span>

              <h2>Still deciding?</h2>

              <p>
                Start with the free audit. You only pay when you choose to
                unlock the full personalised report.
              </p>
            </div>

            <div className="pricingFaqItems reveal-right delay-2">
              <div>
                <h3>Is this a subscription?</h3>
                <p>No. The A$39 price is a one-time payment.</p>
              </div>

              <div>
                <h3>Can I view free results first?</h3>
                <p>
                  Yes. Complete the audit and view your top insights before
                  deciding whether to upgrade.
                </p>
              </div>

              <div>
                <h3>Is payment secure?</h3>
                <p>Yes. Payments are processed securely by Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div className="reveal-left delay-1">
                <h2>Start free and see your biggest opportunities.</h2>
                <p>Complete the savings audit in approximately two minutes.</p>
              </div>

              <div className="reveal-up delay-2">
                <Link href="/audit" className="btn white">
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
