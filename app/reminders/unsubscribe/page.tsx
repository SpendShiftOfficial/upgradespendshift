"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BellOff, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";

function UnsubscribeContent() {
  const token = useSearchParams().get("token") || "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reportId, setReportId] = useState("");

  async function stop() {
    setState("busy");
    try {
      const res = await fetch("/api/reminders/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setReportId(data.reportId || "");
      setState("done");
    } catch {
      setMessage("You seem to be offline. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="analysisCard sspUnsub">
      {state === "done" ? (
        <>
          <CheckCircle2 size={48} color="#059625" />
          <h1>Reminders turned off</h1>
          <p>You won&rsquo;t receive any more SpendShift savings reminders. Your plan and progress are still saved.</p>
          {reportId && (
            <Link className="sspBtn" href={`/report/${reportId}`}>
              Open my savings plan
            </Link>
          )}
        </>
      ) : (
        <>
          <BellOff size={48} color="#059625" />
          <h1>Stop savings reminders?</h1>
          <p>We&rsquo;ll stop sending reminder emails about your SpendShift plan. You can turn them back on inside your report any time.</p>
          <button type="button" className="sspBtn" disabled={!token || state === "busy"} onClick={stop}>
            {state === "busy" ? "Saving..." : "Stop My Reminders"}
          </button>
          {!token && <p className="sspError">This link is missing its code. Please use the link from your email.</p>}
          {state === "error" && <p className="sspError">{message}</p>}
          <p className="mini">
            Need help? Email <a href="mailto:info@spendshift.com.au">info@spendshift.com.au</a>.
          </p>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="auditPage">
      <Header simple />
      <main className="container">
        <Suspense fallback={<p>Loading...</p>}>
          <UnsubscribeContent />
        </Suspense>
      </main>
    </div>
  );
}
