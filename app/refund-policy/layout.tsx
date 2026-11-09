import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Read SpendShift's refund policy, including our 30-day money-back guarantee and Australian Consumer Law rights.",
};

export default function RefundPolicyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
