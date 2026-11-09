import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "What’s Included - Free Audit & Savings Report",
  description:
    "See what's included in SpendShift's free savings audit and A$39 personalised report, including savings insights, action steps and a 30-day plan.",
};

export default function WhatsIncludedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
