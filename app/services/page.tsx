import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  ListChecks,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Free Savings Audit",
    text: "A short assessment that identifies your biggest opportunities to save money.",
    features: [
      "Eight simple questions",
      "Approximately two minutes",
      "No signup required",
      "No bank connection",
      "Immediate free results",
    ],
    cta: "Start Free Audit",
    href: "/audit",
  },
  {
    icon: Sparkles,
    title: "Personalised Savings Report",
    text: "A detailed AI-generated report tailored to your answers and spending habits.",
    features: [
      "Estimated annual savings",
      "Priority money leaks",
      "Hidden savings opportunities",
      "Negotiation and cancellation scripts",
      "Saved report access",
    ],
    cta: "Create My Report",
    href: "/audit",
  },
  {
    icon: CalendarDays,
    title: "30-Day Savings Action Plan",
    text: "A practical step-by-step roadmap designed to help you implement your recommendations without feeling overwhelmed.",
    features: [
      "Four-week roadmap",
      "Clear weekly priorities",
      "Estimated completion times",
      "Interactive action checklist",
      "Simple progress tracking",
    ],
    cta: "See How It Works",
    href: "/how-it-works",
  },
];

const process = [
  {
    number: "01",
    title: "Complete the audit",
    text: "Answer eight simple questions about your everyday spending habits.",
  },
  {
    number: "02",
    title: "Review your free results",
    text: "See your biggest money leaks and estimated savings opportunities.",
  },
  {
    number: "03",
    title: "Unlock your report",
    text: "Receive your detailed personalised report and action plan.",
  },
];

export default function ServicesPage() {
  return (
    <div className="innerPage">
      <Header />

      <main>
        {/* HERO */}
        <section className="servicesPageHero">
          <div className="container servicesPageHeroContent">
            <span className="innerEyebrow">
              <Sparkles size={17} />
              SpendShift Services
            </span>

            <h1>
              Practical savings support from <span>insight to action.</span>
            </h1>

            <p>
              SpendShift helps you identify potential money leaks, understand
              which areas matter most and take clear steps to reduce everyday
              expenses.
            </p>

            <div className="servicesHeroChecks">
              <span>
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                Built for Australians
              </span>

              <span>
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                No bank connection required
              </span>

              <span>
                <CheckCircle2 size={19} fill="#059625" stroke="white" />
                Clear practical actions
              </span>
            </div>

            <Link href="/audit" className="btn">
              Start Your Free Audit
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* SERVICES */}
        <section className="servicesPageSection">
          <div className="container">
            <div className="sectionIntro">
              <span className="sectionEyebrow">What We Offer</span>

              <h2 className="sectionTitle">
                Three simple ways to
                <br />
                <span>move from insight to savings.</span>
              </h2>

              <p>
                Each service is designed to keep the experience simple,
                practical and easy to follow.
              </p>
            </div>

            <div className="servicesPageGrid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article className="servicesPageCard" key={service.title}>
                    <div className="servicesPageIcon">
                      <Icon size={34} strokeWidth={1.5} />
                    </div>

                    <h3>{service.title}</h3>
                    <p>{service.text}</p>

                    <div className="servicesPageList">
                      {service.features.map((feature) => (
                        <span key={feature}>
                          <CheckCircle2
                            size={18}
                            fill="#059625"
                            stroke="white"
                          />
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Link href={service.href}>
                      {service.cta}
                      <ArrowRight size={17} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHAT USERS RECEIVE */}
        <section className="servicesOutcomeSection">
          <div className="container servicesOutcomeGrid">
            <div className="servicesOutcomeContent">
              <span className="sectionEyebrow">What You Receive</span>

              <h2>A clearer picture of where your money could be going.</h2>

              <p>
                SpendShift does not create a traditional budget. It focuses on
likely savings opportunities and practical actions based on the
answers you submit. For practical ideas, explore our{" "}
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

              <div className="servicesOutcomePoints">
                <span>
                  <CircleDollarSign size={20} />
                  Estimated annual savings
                </span>

                <span>
                  <Target size={20} />
                  Ranked money leaks
                </span>

                <span>
                  <FileText size={20} />
                  Ready-to-use scripts
                </span>

                <span>
                  <ListChecks size={20} />
                  Interactive savings checklist
                </span>
              </div>
            </div>

            <div className="servicesOutcomePanel">
              <span className="servicesOutcomeLabel">
                Full personalised report
              </span>

              <strong>A$39</strong>

              <p>One-time payment with no subscription or recurring fees.</p>

              <div className="servicesOutcomeMiniList">
                <span>
                  <ClipboardCheck size={19} />
                  Personalised recommendations
                </span>

                <span>
                  <CalendarDays size={19} />
                  30-day action plan
                </span>

                <span>
                  <ListChecks size={19} />
                  Completion checklist
                </span>
              </div>

              <Link href="/audit" className="btn white">
                Start Free Audit First
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="servicesProcessSection">
          <div className="container">
            <div className="sectionIntro">
              <span className="sectionEyebrow">Simple Process</span>

              <h2 className="sectionTitle">
                Start free.
                <br />
                <span>Upgrade only when you are ready.</span>
              </h2>
            </div>

            <div className="servicesProcessGrid">
              {process.map((item) => (
                <article className="servicesProcessCard" key={item.number}>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="finalCtaSection">
          <div className="container">
            <div className="cta">
              <div>
                <h2>Find your biggest savings opportunities today.</h2>
                <p>Complete the free audit in approximately two minutes.</p>
              </div>

              <div>
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
      </main>
    </div>
  );
}
