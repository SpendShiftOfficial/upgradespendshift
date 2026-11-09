import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how SpendShift uses cookies and similar technologies for website operation, analytics, payments and security.",
};

export default function CookiePolicy() {
  return (
    <div>
      <Header />

      <div className="privacy-policy-content">
        <div className="container">
          <h1>Cookie Policy</h1>

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
                This Cookie Policy adopts the defined terms in the Privacy
                Policy.
              </p>

              <h3>1. About this Policy</h3>

              <p>
                This Cookie Policy explains how SpendShift Enterprises Pty Ltd
                uses cookies and similar technologies on
                www.spendshift.com.au and through related third-party services.
              </p>

              <p>
                It should be read with our Privacy Policy. The website and
                service providers may change, therefore the specific cookies
                and lifespans may also change.
              </p>

              <h3>2. What cookies and similar technologies are</h3>

              <p>
                <strong>Cookies and Similar Technologies</strong> means cookies
                and other technologies that store, access, collect or otherwise
                process information on or from a user's browser, device or
                application. These technologies include, without limitation,
                cookies, local storage, software development kits, pixels, tags,
                device identifiers, server logs and other similar technologies.
              </p>

              <p>
                Cookies and Similar Technologies may collect information
                relating to your use of the Service, your device, browser and
                interactions with the Service.
              </p>

              <h3>3. Technologies currently used</h3>

              <p>
                Based on the current implementation, SpendShift and its
                providers may use the following categories:
              </p>

              <div className="cookie-table-wrap">
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Purpose</th>
                      <th>Examples / third party provider</th>
                      <th>Ability to be disabled</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Strictly necessary</td>
                      <td>
                        Operate the website, route traffic, protect security,
                        process checkout and prevent fraud.
                      </td>
                      <td>
                        Vercel infrastructure; Stripe Checkout; security and
                        session technologies.
                      </td>
                      <td>
                        Some may be necessary for the website or payment flow to
                        function.
                      </td>
                    </tr>

                    <tr>
                      <td>Analytics</td>
                      <td>
                        Measure visits, pages viewed, device information,
                        referral sources and website performance.
                      </td>
                      <td>
                        Google Analytics first-party analytics cookies and
                        related identifiers.
                      </td>
                      <td>
                        Yes, through browser settings, Google opt-out tools or
                        consent controls where provided.
                      </td>
                    </tr>

                    <tr>
                      <td>Payment and fraud prevention</td>
                      <td>
                        Enable Stripe Checkout, card or Apple Pay processing,
                        authentication, risk analysis and fraud prevention.
                      </td>
                      <td>Stripe and associated payment providers.</td>
                      <td>Disabling may prevent checkout from working.</td>
                    </tr>

                    <tr>
                      <td>Email delivery and infrastructure logs</td>
                      <td>
                        Deliver report emails, maintain service reliability and
                        diagnose abuse or errors.
                      </td>
                      <td>Resend, Supabase and hosting/server logs.</td>
                      <td>
                        These are generally server-side and not controlled
                        through browser cookie settings.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>4. Google Analytics</h3>

              <p>
                We use Google Analytics to understand how people use the
                website. Google Analytics may collect information such as IP
                address, device and browser details, approximate location, pages
                viewed, events, referral source and timestamps.
              </p>

              <p>
                Google may process this information in accordance with its own
                terms and privacy documentation. We use analytics to improve the
                website, measure conversion performance and diagnose usability
                issues.
              </p>

              <h3>5. Stripe Checkout</h3>

              <p>
                Payment checkout is hosted by Stripe. When you enter Stripe
                Checkout, Stripe may set cookies or use similar technologies for
                payment functionality, authentication, security, fraud
                prevention and regulatory compliance.
              </p>

              <p>
                Stripe’s cookies and data handling are governed by Stripe’s own
                policies. SpendShift does not control cookies used on
                Stripe-hosted pages.
              </p>

              <h3>6. Your choices</h3>

              <p>You can manage cookies by:</p>

              <ul>
                <li>
                  using any cookie or consent controls displayed on the website;
                </li>

                <li>
                  changing browser settings to block, restrict or delete
                  cookies;
                </li>

                <li>using browser privacy or tracking-protection features;</li>

                <li>using available Google Analytics opt-out tools; or</li>

                <li>
                  avoiding Stripe Checkout if you do not wish to accept
                  technologies required for payment, noting that this will
                  prevent purchase.
                </li>
              </ul>

              <p>
                Blocking cookies may affect website functionality, analytics
                accuracy, fraud prevention and checkout.
              </p>

              <h3>7. Do Not Track and similar signals</h3>

              <p>
                Some browsers send “Do Not Track” or similar signals. There is
                no universally accepted technical standard for responding to all
                such signals. We may not respond to every signal, but you may
                use the controls described above.
              </p>

              <h3>8. Updates</h3>

              <p>
                We may update this Cookie Policy when technologies, providers or
                legal requirements change. The updated version will be
                published on the website.
              </p>

              <h3>9. Contact</h3>

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
