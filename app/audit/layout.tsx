import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free Savings Audit - Find Your Money Leaks",
  description:
    "Take SpendShift’s free 2-minute savings audit to identify potential money leaks and see where you could save across everyday expenses in Australia.",
};

export default function AuditLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
