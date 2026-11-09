import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Why SpendShift - Find Hidden Money Leaks",
  description:
    "Learn how SpendShift helps Australians identify potential money leaks and find practical ways to save without bank connections or complicated budgeting.",
};

export default function WhySpendShiftLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
