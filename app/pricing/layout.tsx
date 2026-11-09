import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing - Free Audit & A$39 Savings Report",
  description:
    "Start with SpendShift's free 2-minute savings audit,then unlock your full personalised savings report for A$39 - one-time payment, no subscription.",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
