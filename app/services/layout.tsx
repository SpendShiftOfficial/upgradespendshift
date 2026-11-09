import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SpendShift’s free savings audit, personalised report, and practical 30-day action plan for reducing everyday expenses.",
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
