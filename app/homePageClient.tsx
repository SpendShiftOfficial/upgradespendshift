"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {  useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRightCircle,
  Bot,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  EyeOff,
  Lightbulb,
  ListChecks,
  MapPin,
  MessageSquareLock,
  MoveRight,
  PieChart,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";

const faqs = [
  {
    question: "What is SpendShift?",
    answer:
      "SpendShift is a personalised savings report that helps identify where you could be overspending and highlights practical ways to reduce everyday expenses. It provides tailored suggestions based on the answers you submit.",
  },
  {
    question: "How does it work?",
    answer:
      "Complete the free audit and see your initial savings insights. If you want the full personalised report, you can unlock it for a one-time A$39 payment.",
  },
  {
    question: "How much does it cost?",
    answer:
      "The SpendShift audit is free. The full personalised savings report costs A$39 as a one-time payment, with no subscription or ongoing fees.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. You only pay once for the full personalised report. There are no recurring charges.",
  },
  {
    question: "When will I receive my report?",
    answer:
      "Most reports are generated and delivered within minutes after your payment is successfully processed.",
  },
  {
    question: "Is my report personalised?",
    answer:
      "Yes. Your report is generated using the information you provide during the questionnaire, making the recommendations specific to your situation.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Yes. Payments are securely processed using Stripe, including support for Apple Pay where available. SpendShift never stores your payment details.",
  },
  {
    question: "What if I’m not satisfied?",
    answer:
      "If you don’t believe your report helped you identify meaningful savings, contact us within 30 days and we’ll review your refund request.",
  },
  {
    question: "Will this create a budget for me?",
    answer:
      "No. SpendShift focuses on identifying potential savings opportunities and practical actions rather than creating a detailed budget.",
  },
  {
    question: "Is this suitable for everyone?",
    answer:
      "SpendShift is designed for Australian adults who want to better understand their spending and discover practical ways to save money.",
  },
  {
    question: "Do I need to download anything?",
    answer:
      "No. Everything is delivered digitally and your saved report can be accessed through its secure report link.",
  },
  {
    question: "Can I use SpendShift more than once?",
    answer:
      "Yes. You can complete the audit again whenever your spending habits or financial situation changes.",
  },
];

const whyCards = [
  {
    icon: WalletCards,
    title: "Unlike Budgeting Apps",
    text: "SpendShift focuses on money quietly disappearing through everyday habits.",
    points: [
      "No spreadsheets",
      "No detailed budgeting",
      "No bank connection",
      "Practical savings actions",
    ],
  },
  {
    icon: MapPin,
    title: "Built for Australians",
    text: "Recommendations are shaped around Australian pricing, providers and spending habits.",
  },
  {
    icon: EyeOff,
    title: "Private",
    text: "We never require access to your bank account or financial transactions.",
  },
  {
    icon: Clock,
    title: "Fast",
    text: "Complete your free savings audit in approximately two minutes.",
  },
  {
    icon: ClipboardCheck,
    title: "Actionable",
    text: "Every recommendation clearly explains what to do next.",
  },
  {
    icon: Bot,
    title: "AI Powered",
    text: "Every report is generated specifically from the answers you provide.",
  },
];

const includedCards = [
  {
    icon: CircleDollarSign,
    title: "Understand Your Savings Potential",
    text: "See approximately how much money you could recover each year.",
  },
  {
    icon: Target,
    title: "Know What to Fix First",
    text: "Your highest-impact money leaks are ranked by potential value.",
  },
  {
    icon: MessageSquareLock,
    title: "Take Action With Confidence",
    text: "Use practical negotiation and cancellation scripts immediately.",
  },
  {
    icon: CalendarDays,
    title: "Follow a Clear 30-Day Plan",
    text: "Turn your recommendations into manageable weekly actions.",
  },
];

const paidOutcomes = [
  "Find where your money may be quietly disappearing",
  "Know exactly what to fix first",
  "See approximately how much you could save each year",
  "Get practical words to use when cancelling or negotiating",
  "Follow a clear 30-day savings roadmap",
  "Track completed actions with your savings checklist",
];

export default function Home() {
  
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="heroShell" id="home">
          <div className="container hero">
            <div className="heroCopy reveal-left delay-1">
              <span className="badge">
                <CheckCircle2
                  className="text-[#059625]"
                  fill="currentColor"
                  stroke="white"
                  size={20}
                />
                Built for Australians. Based on your answers.
              </span>

              <h1>
                Find your biggest money leaks in under <span>2 minutes.</span>
              </h1>

              <p>
                We analyse your answers to identify likely money leaks and show
                you where practical savings opportunities may exist.
              </p>

              <div className="checks">
                <span>
                  <CheckCircle2
                    className="text-[#059625]"
                    fill="currentColor"
                    stroke="white"
                    size={20}
                  />
                  Takes 2 minutes
                </span>

                <span>
                  <CheckCircle2
                    className="text-[#059625]"
                    fill="currentColor"
                    stroke="white"
                    size={20}
                  />
                  No signup required
                </span>

                <span>
                  <CheckCircle2
                    className="text-[#059625]"
                    fill="currentColor"
                    stroke="white"
                    size={20}
                  />
                  Private and secure
                </span>
              </div>

              <Link className="btn premiumButton" href="/audit">
                Start Your Free Audit
                <MoveRight size={18} strokeWidth={2.5} />
              </Link>

              <div className="spacer50" />

              <div className="hero-bottom-text reveal">
                <p className="margin-zero">
                  Free results in under 2 minutes. No credit card required.
                </p>

                <p className="margin-zero">
                  <span>Built for Australians. Private and secure.</span>
                </p>
              </div>
            </div>

            <div
              className="heroVisual"
              aria-label="SpendShift mobile results preview"
            >
              <div className="floatCard leftCard microFloat">
                <ShieldCheck size={34} />
                <b>Your data is private and secure</b>
                <p>No bank connection or payment details required.</p>
              </div>

              <div className="phoneFrame1 reportDevicePreview soft-float">
                <Image
                  src="/home/Device.svg"
                  alt="SpendShift mobile results preview"
                  width={408}
                  height={800}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="floatCard rightCard microFloat delayedFloat">
                <ChartNoAxesCombined size={38} />
                <b>Real insights. Real savings.</b>
                <p>Practical recommendations based on your answers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STATS */}
        <section className="stats-section">
          <div className="container">
            <div className="stats">
              <div className="stat interactiveCard reveal-up">
                <div>
                  <Clock size={50} />
                </div>
                <div>
                  <strong>2 Minutes</strong>
                  <span>
                    Complete the audit
                    <br />
                    in approximately 2 minutes
                  </span>
                </div>
              </div>

              <div className="stat interactiveCard reveal-up">
                <div>
                  <ShieldCheck size={50} />
                </div>
                <div>
                  <strong>Private</strong>
                  <span>
                    No bank access
                    <br />
                    required
                  </span>
                </div>
              </div>

              <div className="stat interactiveCard reveal-up">
                <div>
                  <WalletCards size={50} />
                </div>
                <div>
                  <strong>No Signup</strong>
                  <span>
                    Start instantly
                    <br />
                    with no account
                  </span>
                </div>
              </div>

              <div className="stat interactiveCard reveal-up">
                <div>
                  <MapPin size={50} />
                </div>
                <div>
                  <strong>Australia</strong>
                  <span>
                    Built around Australian
                    <br />
                    spending habits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SPENDSHIFT */}
        <section className="whySpendshiftSection" id="why">
          <div className="container">
            <div className="sectionIntro revealSection">
              <span className="sectionEyebrow reveal-up">Why SpendShift</span>

              <h2 className="sectionTitle reveal-up">
                Save more without building
                <br />
                <span>another complicated budget.</span>
              </h2>

              <p className="reveal-up">
                Unlike budgeting apps, SpendShift focuses on identifying money
that quietly disappears through everyday habits. For practical
examples, explore our{" "}
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
            </div>

            <div className="whySpendshiftGrid">
              {whyCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="whySpendshiftCard interactiveCard reveal-up"
                    key={item.title}
                  >
                    <div className="icon animatedIcon">
                      <Icon size={34} strokeWidth={1.5} />
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>

                    {item.points && (
                      <div className="whyPoints">
                        {item.points.map((point) => (
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
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container stepsSection" id="works">
          <div className="sectionIntro revealSection">
            <span className="sectionEyebrow reveal-up">How It Works</span>

            <h2 className="sectionTitle reveal-up">
              From quick audit to
              <br />
              <span>clear next steps.</span>
            </h2>
          </div>

          <div className="steps">
            <div className="interactiveCard reveal-up">
              <div className="stepNum">01</div>
              <div className="stepIconWrapper animatedIcon">
                <Smartphone className="stepIcon" strokeWidth={1} size={67} />
              </div>
              <h3>Answer 8 simple questions</h3>
              <p>Tell us about your everyday spending habits.</p>
            </div>

            <div className="interactiveCard reveal-up">
              <div className="stepNum">02</div>
              <div className="stepIconWrapper animatedIcon">
                <Search className="stepIcon" strokeWidth={1} size={67} />
              </div>
              <h3>We analyse your answers</h3>
              <p>Your responses are compared with relevant spending patterns.</p>
            </div>

            <div className="interactiveCard reveal-up">
              <div className="stepNum">03</div>
              <div className="stepIconWrapper animatedIcon">
                <PieChart className="stepIcon" strokeWidth={1} size={67} />
              </div>
              <h3>See your top money leaks</h3>
              <p>Get immediate insight into your strongest opportunities.</p>
            </div>

            <div className="interactiveCard reveal-up">
              <div className="stepNum">04</div>
              <div className="stepIconWrapper animatedIcon">
                <MessageSquareLock
                  className="stepIcon"
                  strokeWidth={1}
                  size={67}
                />
              </div>
              <h3>Unlock your full plan</h3>
              <p>Receive detailed actions, scripts and a 30-day roadmap.</p>
            </div>
          </div>
        </section>

        {/* REPORT PREVIEW */}
        <section className="reportPreviewSection" id="report-preview">
          <div className="container reportPreviewGrid">
            <div className="reportPreviewContent revealSection">
              <span className="sectionEyebrow reveal-left">
                Your Personalised Report
              </span>

              <h2 className="reveal-left">
                See exactly what you could save and what to do next.
              </h2>

              <p className="reveal-left">
                Your report turns your audit answers into clear savings
                priorities, practical actions and a simple plan you can follow.
              </p>

              <div className="reportPreviewBenefits reveal-left">
                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Estimated annual savings
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Your biggest money leaks ranked
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  Quick wins and estimated completion times
                </span>

                <span>
                  <CheckCircle2 size={19} fill="#059625" stroke="white" />
                  30-day action plan and checklist
                </span>
              </div>

              <Link href="/whats-included" className="reportPreviewLink reveal-left">
                Explore what’s included
                <MoveRight size={18} />
              </Link>
            </div>

            <div className="reportPreviewMockup reveal-up">
              <div className="previewTopBar">
                <div>
                  <span className="previewStatus">
                    <ShieldCheck size={16} />
                    Personalised Report
                  </span>
                  <p>Generated from your audit answers</p>
                </div>

                <Sparkles size={24} />
              </div>

              <div className="previewSavingsCard">
                <span>Estimated Annual Savings</span>
                <strong>A$4,850/year</strong>
                <p>
                  Based on Australian category averages and conservative
                  reduction targets.
                </p>
              </div>

              <div className="previewLeakCard">
                <div className="previewLeakHeader">
                  <span>01. Convenience Spending</span>
                  <span className="highImpactBadge">High impact</span>
                </div>

                <div className="previewEstimatedRow">
                  <CircleDollarSign size={21} />
                  <div>
                    <small>Estimated saving</small>
                    <strong>A$1,400/year</strong>
                  </div>
                </div>

                <div className="previewActionGrid">
                  <div>
                    <Lightbulb size={20} />
                    <span>
                      <small>Quick win</small>
                      Set a weekly convenience spending limit.
                    </span>
                  </div>

                  <div>
                    <Clock size={20} />
                    <span>
                      <small>Estimated time</small>
                      5 minutes
                    </span>
                  </div>

                  <div>
                    <ArrowRightCircle size={20} />
                    <span>
                      <small>Next step</small>
                      Move the weekly amount into savings.
                    </span>
                  </div>
                </div>
              </div>

              <div className="previewBottomGrid">
                <div className="previewMiniCard">
                  <ListChecks size={22} />
                  <div>
                    <strong>30-Day Plan</strong>
                    <span>4 clear weekly priorities</span>
                  </div>
                </div>

                <div className="previewMiniCard">
                  <CheckCircle2 size={22} />
                  <div>
                    <strong>Savings Checklist</strong>
                    <span>Track every completed action</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED - REDUCED */}
        <section className="includedSection" id="included">
          <div className="container">
            <div className="sectionIntro revealSection">
              <span className="sectionEyebrow reveal-up">What’s Included</span>

              <h2 className="sectionTitle reveal-up">
                Everything you need to
                <br />
                <span>turn insight into action.</span>
              </h2>

              <p className="reveal-up">
                Understand your savings potential, know what to fix first and
                follow a practical plan.
              </p>
            </div>

            <div className="includedGrid compactIncludedGrid">
              {includedCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="includedCard interactiveCard reveal-up"
                    key={item.title}
                  >
                    <div className="includedIcon animatedIcon">
                      <Icon size={30} strokeWidth={1.5} />
                    </div>

                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricingSection" id="pricing">
          <div className="container">
            <div className="sectionIntro revealSection">
              <span className="sectionEyebrow reveal-up">Simple Pricing</span>

              <h2 className="sectionTitle reveal-up">
                Start free.
                <br />
                <span className="reveal-up">Unlock your complete savings plan for A$39.</span>
              </h2>

              <p className="reveal-up">
                Understand where your money could be going and get a clear plan
                to keep more of it.
              </p>
            </div>

            <div className="pricingGrid">
              <article className="pricingCard interactiveCard reveal-left">
                <div className="pricingCardTop">
                  <span className="pricingLabel">Free Audit</span>

                  <div className="pricingAmount">
                    <strong>A$0</strong>
                  </div>

                  <h3>See your biggest opportunities before paying anything.</h3>

                  <p>
                    Get a fast overview of the spending areas that could be
                    costing you the most.
                  </p>
                </div>

                <div className="pricingList">
                  {[
                    "Discover your biggest money leaks",
                    "See your estimated savings range",
                    "Understand your top three opportunities",
                    "Decide whether the full report is right for you",
                  ].map((item) => (
                    <span key={item}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {item}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn pricingButton">
                  Start Free Audit
                  <MoveRight size={18} />
                </Link>

                <p className="pricingFinePrint">No credit card required.</p>
              </article>

              <article className="pricingCard featuredPricingCard interactiveCard reveal-right">
                <span className="popularBadge">Full Experience</span>

                <div className="pricingCardTop">
                  <span className="pricingLabel">
                    Full Personalised Savings Report
                  </span>

                  <div className="pricingAmount">
                    <strong>A$39</strong>
                    <small>one-time payment</small>
                  </div>

                  <h3>
                    Know what to fix first and how much you could save.
                  </h3>

                  <p>
                    Turn your personalised insights into practical actions that
                    could improve your finances throughout the year.
                  </p>
                </div>

                <div className="pricingList">
                  {paidOutcomes.map((item) => (
                    <span key={item}>
                      <CheckCircle2 size={19} fill="#059625" stroke="white" />
                      {item}
                    </span>
                  ))}
                </div>

                <Link href="/audit" className="btn pricingButton">
                  Start My Free Audit
                  <MoveRight size={18} />
                </Link>

                <div className="pricingTrust">
                  <span>One-time payment</span>
                  <span>No subscription</span>
                  <span>Instant access</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faqSection">
          <div className="container">
            <div className="sectionIntro revealSection">
              <span className="sectionEyebrow reveal-up">Questions</span>

              <h2 className="sectionTitle reveal-up">
                Frequently Asked
                <br />
                <span>Questions</span>
              </h2>
            </div>

            <div className="faqWrapper">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`faqItem ${
                    openFaq === index ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="faqQuestion"
                    onClick={() =>
                      setOpenFaq(openFaq === index ? -1 : index)
                    }
                  >
                    <span>{faq.question}</span>

                    <span className="faqIcon">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`faqAnswer ${
                      openFaq === index ? "show" : ""
                    }`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div className="reveal-left">
                <h2>Stop overpaying. Start saving.</h2>
                <p>Your free savings audit takes approximately two minutes.</p>
              </div>

              <div className="reveal-right">
                <Link className="btn white" href="/audit">
                  Start Your Free Audit
                  <MoveRight size={18} />
                </Link>

                <p className="noCard">No credit card required.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
