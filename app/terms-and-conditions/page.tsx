import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions governing use of SpendShift, including payments, reports, refunds and AI-generated content.",
};

export default function TermsAndConditions() {
  return (
    <div>
      <Header />
      <div className="privacy-policy-content">
        <div className="container">
          <h1>Terms and Conditions</h1>

          <div className="row">
            <div className="policy-content">

              <div className="policy-meta">
                <p>
                  <strong>Legal entity:</strong> SpendShift Enterprises Pty Ltd
                </p>
                <p>
                  <strong>ACN:</strong> 689 089 610
                </p>
                <p>
                  <strong>Website:</strong> www.spendshift.com.au
                </p>
                <p>
                  <strong>Contact:</strong> info@spendshift.com.au
                </p>
              </div>

              <p>
                These Terms and Conditions adopt the defined terms in the
                Privacy Policy.
              </p>

              <h3>1. Acceptance of these Terms</h3>

              <p>
                These Website Terms and Conditions (“Terms”) govern access to
                and use of www.spendshift.com.au, the free audit, free results,
                paid personalised reports, saved report URLs and related
                services (“Service”).
              </p>

              <p>
                The Service is operated by SpendShift Enterprises Pty Ltd ACN
                689 089 610 (“SpendShift”, “we”, “us” or “our”). By accessing
                or using the Service, you agree to these Terms and our Privacy
                Policy, Cookie Policy, Refund Policy and Financial Information
                and AI Disclaimer.
              </p>

              <p>
                If you do not agree, do not use the Service. If you purchase the
                Service on behalf of another person or organisation, you confirm
                that you are authorised to bind them to these Terms.
              </p>

              <h3>2. Eligibility</h3>

              <p>
                You must be at least 18 years old and legally capable of
                entering a binding contract to use or purchase the Service.
              </p>

              <p>
                The Service is designed primarily for Australian consumers. If
                you access it from outside Australia, you are responsible for
                complying with local law.
              </p>

              <h3>3. What SpendShift provides</h3>

              <p>
                SpendShift provides a questionnaire-based spending audit and,
                where purchased, an AI-assisted personalised report containing
                estimated savings opportunities, explanations, quick wins,
                suggested next steps, scripts, a 30-day action plan and related
                general information.
              </p>

              <p>
                The paid report is a digital service delivered electronically
                and may be made available immediately after payment through a
                saved report URL and by email.
              </p>

              <h3>4. Important limitations</h3>

              <p>
                SpendShift does not access bank account(s) and does not
                independently verify audit answers, actual transactions, income,
                expenses, debts, contracts, insurance policies,
                telecommunications plan, subscriptions or personal
                circumstances.
              </p>

              <p>
                The quality and relevance of the output depends on the
                completeness and accuracy of the information provided. Savings
                figures are estimates based on reported habits, assumptions,
                typical spending patterns, category averages and conservative
                reduction targets. They are not guaranteed.
              </p>

              <p>
                The Service provides general educational information and
                practical prompts. It is not personal financial product advice,
                legal advice, tax advice, accounting advice, credit assistance,
                insurance advice or a substitute for professional advice.
              </p>

              <h3>5. Your responsibilities</h3>

              <p>You agree that you will:</p>

              <ul>
                <li>
                  provide information that is accurate, current and not
                  misleading;
                </li>

                <li>use the Service only for lawful personal purposes;</li>

                <li>
                  review the report critically and verify any price, provider,
                  plan, contract term, cancellation consequence, fee, saving or
                  recommendation before acting;
                </li>

                <li>
                  obtain professional advice where your circumstances require it;
                </li>

                <li>
                  not provide information about another person unless you are
                  authorised to do so;
                </li>

                <li>
                  protect your email account and saved report URL from
                  unauthorised access;
                </li>

                <li>
                  not copy, scrape, reverse engineer, interfere with, overload,
                  probe, test or attempt to bypass the security of the Service;
                </li>

                <li>
                  not use bots, automated tools or bulk requests without our
                  written permission;
                </li>

                <li>
                  not upload or transmit malware, unlawful material or content
                  that infringes another person’s rights; and
                </li>

                <li>
                  not use SpendShift outputs to mislead, defraud, harass or
                  cause harm.
                </li>
              </ul>

              <h3>6. AI-generated and automated content</h3>

              <p>
                The Service uses Anthropic’s Claude Application Programming
                Interface (“API”) and automated logic. AI-generated content may
                be incomplete, inaccurate, outdated, repetitive, inconsistent
                or unsuitable for your circumstances.
              </p>

              <p>
                You remain responsible for decisions made using the report. You
                should not act solely on an AI-generated statement where the
                decision could materially affect your finances, legal rights,
                insurance, credit, tax position, health or safety.
              </p>

              <p>
                We may modify prompts, models, calculation logic, assumptions,
                report structure and providers at any time to improve or
                maintain the Service.
              </p>

              <h3>7. Price, GST and payment</h3>

              <p>
                The current price for a paid personalised report is AUD $39.
                Prices for SpendShift Services may be subject to change at the
                discretion of SpendShift. Prices are inclusive of GST where GST
                is legally applicable, unless clearly stated otherwise.
              </p>

              <p>
                Payment is processed by Stripe through a hosted checkout.
                Available payment methods may include bank cards and Apple Pay.
                You authorise Stripe and the relevant payment provider to charge
                the amount shown at checkout (inclusive of GST).
              </p>

              <p>
                SpendShift does not receive or store full card details. Stripe
                may perform verification, fraud screening or other checks. A
                purchase is not complete until payment is confirmed.
              </p>

              <p>
                You are responsible for any bank, card issuer, foreign-exchange,
                internet or device fees and charges imposed by external third
                parties.
              </p>

              <h3>8. Digital delivery and report access</h3>

              <p>
                After successful payment, we will generate or unlock the report
                and email a link to the email address associated with the
                transaction. Delivery times may vary due to payment
                verification, AI processing, internet connectivity,
                maintenance or third-party outages.
              </p>

              <p>
                Each report may be stored and accessed using a unique saved
                report URL. No login is required. Anyone with the URL may be
                able to view the report. SpendShift is not responsible for any
                external or third-party access of the report once the unique
                URL has been provided to you.
              </p>

              <p>
                We may suspend or disable report access where reasonably
                necessary for security, suspected fraud, unlawful use, system
                maintenance, legal compliance or protection of our rights.
              </p>

              <h3>9. Refunds and consumer guarantees</h3>

              <p>
                Our voluntary 30-day money-back guarantee and refund process are
                described in the Refund Policy, which forms part of these
                Terms.
              </p>

              <p>
                Nothing in these Terms excludes, restricts or modifies any
                consumer guarantee, right or remedy that cannot lawfully be
                excluded under the Australian Consumer Law or another
                applicable law.
              </p>

              <h3>10. Intellectual property</h3>

              <p>
                The website, software, branding, questionnaires, report
                structure, calculations, prompts, text, graphics, icons,
                layouts, databases and other materials supplied by SpendShift
                are owned by or licensed to us and are protected by
                intellectual-property laws.
              </p>

              <p>
                Subject to payment and compliance with these Terms, we grant you
                a limited, personal, non-exclusive, non-transferable and
                revocable licence to access and use your report for your own
                private, non-commercial purposes.
              </p>

              <p>You must not, without our prior written permission:</p>

              <ul>
                <li>
                  reproduce, republish, sell, sublicense, distribute or
                  commercially exploit the Service or a report;
                </li>

                <li>
                  create a competing product or service using our content,
                  structure, prompts, calculations or outputs;
                </li>

                <li>
                  remove copyright, trademark or proprietary notices;
                </li>

                <li>
                  frame, mirror or embed substantial parts of the Service on
                  another website; or
                </li>

                <li>
                  use SpendShift branding in a way that suggests sponsorship,
                  endorsement or affiliation.
                </li>
              </ul>

              <p>
                You retain ownership of information you submit. You grant us a
                non-exclusive licence to use, process, store and disclose that
                information as reasonably necessary to provide, secure, improve
                and administer the Service in accordance with our Privacy
                Policy.
              </p>

              <h3>11. Third-party services and links</h3>

              <p>
                The Service relies on third parties, including Anthropic,
                Stripe, Apple Pay, Supabase, Resend, Vercel and Google
                Analytics. It may also link to comparison sites, providers,
                banks, telecommunications companies, insurers or other third
                parties.
              </p>

              <p>
                We do not control and are not responsible for third-party
                availability, security, terms, prices, eligibility rules,
                products, advice, representations or conduct. A reference or
                link does not mean we endorse or guarantee the third party.
              </p>

              <h3>12. Availability, changes and discontinuation</h3>

              <p>
                We aim to provide a reliable Service but do not guarantee that
                it will always be available, uninterrupted, secure or
                error-free.
              </p>

              <p>
                We may update, suspend, withdraw, replace or discontinue any
                part of the Service, including features, pricing, providers,
                report format and storage arrangements. Where practical, changes
                that materially affect existing paid access will be
                communicated or managed reasonably.
              </p>

              <h3>13. Disclaimers</h3>

              <p>
                To the maximum extent permitted by law, the Service is provided
                on an “as available” basis. We do not warrant that every report
                will identify all possible savings, that an identified saving
                is achievable, or that a provider will offer, honour or
                maintain any price or discount.
              </p>

              <p>
                We do not warrant that the Service is suitable for any
                particular purpose unless you have expressly disclosed that
                purpose to us and we have accepted it in writing.
              </p>

              <h3>14. Limitation of liability</h3>

              <p>
                Nothing in this clause limits liability that cannot lawfully be
                limited, including liability under the Australian Consumer Law.
              </p>

              <p>
                To the maximum extent permitted by law, SpendShift is not liable
                for indirect, incidental, special or consequential loss, loss of
                profit, loss of opportunity, loss of data, reputational loss,
                or loss arising from a decision made in reliance on an
                estimate, AI-generated statement or third-party service.
              </p>

              <p>
                To the maximum extent permitted by law, our aggregate liability
                arising from a particular paid report will not exceed the
                amount you paid for that report. This cap does not apply where
                it would be unlawful or where loss results from fraud, wilful
                misconduct or another liability that cannot be excluded.
              </p>

              <h3>15. Indemnity</h3>

              <p>
                To the extent permitted by law, you indemnify us against loss,
                damage, liability and reasonable costs arising from your
                unlawful use of the Service, breach of these Terms,
                infringement of another person’s rights, or unauthorised
                disclosure of a report URL, except to the extent caused by our
                negligence, breach of law or misconduct.
              </p>

              <h3>16. Privacy and data</h3>

              <p>
                Our collection, use, storage and disclosure of personal
                information are described in the Privacy Policy. By using the
                Service, you acknowledge that audit answers may be sent to an
                overseas AI provider and that reports and associated information
                may be stored using third-party infrastructure.
              </p>

              <h3>17. Suspension and termination</h3>

              <p>
                We may suspend or terminate your access to the Service if we
                reasonably believe you have breached these Terms, engaged in
                fraud or misuse, created a security risk, infringed rights, or
                used the Service unlawfully.
              </p>

              <p>
                Termination does not affect accrued rights, payment obligations,
                intellectual-property rights, disclaimers, liability provisions
                or any clause intended to survive termination.
              </p>

              <h3>18. Electronic communications</h3>

              <p>
                You consent to receiving transactional communications
                electronically, including purchase confirmations, report links,
                service notices and responses to support or legal requests. You
                are responsible for providing a valid email address and checking
                spam or junk folders.
              </p>

              <h3>19. Changes to these Terms</h3>

              <p>
                We may update these Terms by publishing the revised version on
                the website. Changes apply from the stated date of
                commencement. Your continued use of the Service after that date
                constitutes acceptance of the revised Terms, except where
                further consent is required by law.
              </p>

              <h3>20. General</h3>

              <p>
                If part of these Terms is invalid or unenforceable, it will be
                read down to the minimum extent necessary or severed, and the
                remainder will continue.
              </p>

              <p>
                A failure or delay in enforcing a right is not a waiver. You may
                not assign your rights under these Terms without our consent. We
                may assign or transfer our rights and obligations as part of a
                business sale, restructure or service transfer.
              </p>

              <p>
                These Terms, together with the incorporated policies, form the
                entire agreement concerning the Service, except for rights that
                cannot be excluded by law.
              </p>

              <h3>21. Governing law and jurisdiction</h3>

              <p>
                These Terms shall be governed by, and construed in accordance
                with, the laws of New South Wales. Each party irrevocably agrees
                that the courts of New South Wales shall have exclusive
                jurisdiction to settle any dispute or claim (including
                non-contractual disputes or claims) arising out of or in
                connection with these Terms.
              </p>

              <h3>22. Contact</h3>

              <p>
                SpendShift Enterprises Pty Ltd
                <br />
                ACN 689 089 610
                <br />
                Address: 2 Blackwoods Road, Nobbys Creek NSW, Australia
                <br />
                Email:{" "}
                <a href="mailto:info@spendshift.com.au">
                  info@spendshift.com.au
                </a>
                <br />
                Website: www.spendshift.com.au
              </p>

              <p>
                <strong>Last updated: 14 July 2026</strong>
              </p>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
