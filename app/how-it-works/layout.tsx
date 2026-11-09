import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How It Works - Free Savings Audit",
  description:
    "See how SpendShift's free 2-minute savings audit helps Australians identify potential money leaks and get practical, personalised ways to save.",
};

export default function HowItWorksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
