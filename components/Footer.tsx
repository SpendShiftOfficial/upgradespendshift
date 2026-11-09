"use client";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import {
Circle,
 Mail, Phone
} from "lucide-react";

import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

export default function Footer({ simple = false }: { simple?: boolean }) {
 const openCookieSettings = () => {
window.dispatchEvent(new Event("open-cookie-settings"));
};

  if (simple) {
    return (
      <footer className="footer">
        <div className="container footerBottom">
          <span className="footerCopyright">
            © SpendShift 2026. All rights reserved.
          </span>
          <div className="footerLegalLinks">
<Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
<span>|</span>
<Link href="/privacy-policy">Privacy Policy</Link>
<span>|</span>
<Link
href="/cookies"
onClick={(e) => {
e.preventDefault();
openCookieSettings();
}}
>
Cookie settings
</Link>
</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="container footerGrid">
        <div className="footerBrand reveal-up">
          <div className="footerLogo reveal-up">
            <Link href="/" className="logo">
              <Image
                src="/logo.png"
                alt="SpendShift"
                width={180}
                height={50}
              />
            </Link>
          </div>

          <p>
            SpendShift helps Australians uncover hidden money leaks, reduce
            unnecessary spending and take practical action with personalised
            AI-powered savings insights.
          </p>

          <div className="socials">
            <Link
              href="https://facebook.com/spendshiftofficial"
              target="_blank"
              aria-label="SpendShift on Facebook"
            >
              <FaFacebook size={20} />
            </Link>

            <Link
              href="https://instagram.com/spendshiftofficial"
              target="_blank"
              aria-label="SpendShift on Instagram"
            >
              <FaInstagram size={20} />
            </Link>

            <Link
              href="https://www.tiktok.com/@spendshiftofficial"
              target="_blank"
              aria-label="SpendShift on TikTok"
            >
              <FaTiktok size={20} />
            </Link>
          </div>
        </div>

        <div className="reveal-up">
          <h4>Learn</h4>
          <Link href="/how-it-works"><Circle size={10} color="#fff" /> How It Works</Link>
          <Link href="/whats-included"><Circle size={10} color="#fff" /> What’s Included</Link>
          <Link href="/why-spendshift"><Circle size={10} color="#fff" /> Why SpendShift</Link>
          <Link href="/pricing"><Circle size={10} color="#fff" /> Pricing</Link>
          <Link href="/#faq"><Circle size={10} color="#fff" /> Frequently Asked Questions</Link>
         <Link href="/save-money-australia"><Circle size={10} color="#fff" /> Save Money Australia</Link>
        </div>

        <div className="reveal-up">
          <h4>Services</h4>
          <Link href="/#services"><Circle size={10} color="#fff" /> Free Savings Audit</Link>
          <Link href="/#services"><Circle size={10} color="#fff" /> Personalised Savings Report</Link>
          <Link href="/#services"><Circle size={10} color="#fff" /> 30-Day Savings Action Plan</Link>
        </div>

        <div className="reveal-up">
          <h4>Legal</h4>
          <Link href="/privacy-policy"><Circle size={10} color="#fff" /> Privacy Policy</Link>
          <Link href="/terms-and-conditions"><Circle size={10} color="#fff" /> Terms &amp; Conditions</Link>
          <Link href="/cookies"><Circle size={10} color="#fff" /> Cookie Policy</Link>
          <Link href="/refund-policy"><Circle size={10} color="#fff" /> Refund Policy</Link>
          <Link href="/financial-information-ai-disclaimer"><Circle size={10} color="#fff" /> Financial Disclosure</Link>
        </div>

        <div className="reveal-up ">
          <h4>Contact</h4>
          <Link className="cntct" href="mailto:info@spendshift.com.au">
           <Mail size={20} color="#059625" /> info@spendshift.com.au
          </Link>
        </div>
      </div>

      <div className="container footerBottom reveal-up">
        <span className="footerCopyright">
          © SpendShift 2026. All rights reserved.
        </span>

        <div className="footerLegalLinks">
<Link href="/terms-and-conditions">
<Circle size={10} color="#fff" /> Terms &amp; Conditions
</Link>
<span>|</span>
<Link href="/privacy-policy">
<Circle size={10} color="#fff" /> Privacy Policy
</Link>
<span>|</span>
<Link
href="/cookies"
onClick={(e) => {
e.preventDefault();
openCookieSettings();
}}
>
<Circle size={10} color="#fff" /> Cookie settings
</Link>
</div>
      </div>
       <ScrollReveal />
    </footer>
   
  );
}
