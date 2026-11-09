import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Read SpendShift's refund policy, including our 30-day money-back guarantee and Australian Consumer Law rights.",
};

export default function RefundPolicy() {
  return (
    <div>
      <Header />

      <div className="privacy-policy-content">
        <div className="container">
          <h1>Refund Policy</h1>

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
                This Refund Policy adopts the defined terms in the Privacy
                Policy.
              </p>

              <h3>1. Overview</h3>

              <p>
                This Refund Policy applies to paid SpendShift personalised
                reports purchased through www.spendshift.com.au.
              </p>

              <p>
                It includes a voluntary 30-day money-back guarantee. This
                guarantee is additional to, and does not limit, any rights or
                remedies available under the Australian Consumer Law.
              </p>

              <h3>2. 30-day money-back guarantee</h3>

              <p>
                You may request a refund within 30 calendar days after the
                purchase date if you are not satisfied with the paid report or
                you reasonably believe it did not identify a useful potential
                saving or practical action for you.
              </p>

              <p>
                To request a refund, email{" "}
                <a href="mailto:info@spendshift.com.au">
                  info@spendshift.com.au
                </a>{" "}
                and include:
              </p>

              <ul>
                <li>the email address used at checkout;</li>
                <li>the purchase date or Stripe receipt details;</li>
                <li>the saved report URL, if available; and</li>
                <li>
                  a brief explanation of why you are requesting the refund, so
                  we can verify and improve the Service.
                </li>
              </ul>

              <p>
                You do not need to provide bank statements or sensitive
                financial documents to use the voluntary guarantee.
              </p>

              <h3>3. Refund assessment</h3>

              <p>
                We will assess requests reasonably and in good faith. We may ask
                for information needed to locate the transaction, confirm
                identity, prevent fraud or understand the issue.
              </p>

              <p>
                The voluntary guarantee is generally limited to one refund per
                person, payment method or substantially identical audit within a
                reasonable period, unless consumer law requires otherwise.
              </p>

              <p>
                A request made more than 30 calendar days after purchase is not
                covered by the voluntary guarantee, but we will still consider
                any rights you may have under the Australian Consumer Law.
              </p>

              <h3>4. Australian Consumer Law</h3>

              <p>
                Our services come with consumer guarantees that cannot be
                excluded under the Australian Consumer Law. If the Service has a
                major failure, you may be entitled to cancel and obtain a
                refund. For a minor failure, we may be entitled to remedy the
                problem within a reasonable time.
              </p>

              <p>
                Nothing in this Policy excludes, restricts or modifies a right,
                guarantee or remedy that cannot lawfully be excluded.
              </p>

              <h3>5. Processing approved refunds</h3>

              <p>
                Approved refunds will generally be returned to the original
                payment method through Stripe. Processing times depend on
                Stripe, your bank, card issuer and payment method.
              </p>

              <p>
                We refund the amount paid to SpendShift. We are not responsible
                for separate bank, card, currency-conversion, internet or other
                third-party charges unless required by law.
              </p>

              <p>
                After a refund, we may disable the saved report URL and delete
                or restrict access to the report, subject to legal and
                record-keeping requirements.
              </p>

              <h3>6. Chargebacks</h3>

              <p>
                Please contact us before initiating a payment dispute so we have
                a reasonable opportunity to resolve the issue. This does not
                prevent you from exercising lawful rights through your bank,
                card issuer or payment provider.
              </p>

              <h3>7. Contact</h3>

              <p>
                Email:{" "}
                <a href="mailto:info@spendshift.com.au">
                  info@spendshift.com.au
                </a>
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
