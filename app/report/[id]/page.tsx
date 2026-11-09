import type React from "react";
import Header from "@/components/Header";
import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  LockOpen,
  CircleDollarSign,
  Lightbulb,
  ArrowRightCircle,
  Clock3,
} from "lucide-react";

function cleanOldJson(report: string): string {
  try {
    const parsed = JSON.parse(report);

    if (typeof parsed === "string") return parsed;
    if (parsed?.summary) return parsed.summary;

    return report;
  } catch {
    return report;
  }
}

function getSavings(report: string): string {
  const match = report.match(/\$[\d,]+\/year/);
  return match ? match[0] : "$4,276/year";
}

function getSavingsNumber(savings: string): number {
  return Number(savings.replace("$", "").replace(",", "").replace("/year", ""));
}

function getSavingsEquivalent(amount: number) {
  const groceryWeeks = Math.max(1, Math.round(amount / 200));
  const utilityMonths = Math.max(1, Math.round(amount / 350));

  if (amount >= 6000) {
    return {
      label: "What this could mean",
      title: "That is real breathing room",
      items: [
        `Around ${groceryWeeks} weeks of groceries`,
        "A meaningful family holiday fund",
        `${utilityMonths} months of household bills`,
      ],
    };
  }

  if (amount >= 4000) {
    return {
      label: "What this could mean",
      title: "That is more than a small saving",
      items: [
        `Around ${groceryWeeks} weeks of groceries`,
        "A domestic holiday fund",
        `${utilityMonths} months of utility bills`,
      ],
    };
  }

  if (amount >= 2500) {
    return {
      label: "What this could mean",
      title: "That could ease everyday pressure",
      items: [
        `Around ${groceryWeeks} weeks of groceries`,
        `${utilityMonths} months of household bills`,
        "A stronger emergency buffer",
      ],
    };
  }

  return {
    label: "What this could mean",
    title: "Money staying with you",
    items: [
      `Around ${groceryWeeks} weeks of groceries`,
      "Less money quietly disappearing",
      "A stronger savings buffer",
    ],
  };
}

function renderReport(report: string) {
  const text = cleanOldJson(report);

  const lines: string[] = text
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  const elements: React.ReactNode[] = [];

  for (let index = 0; index < lines.length; index++) {
    const trimmed = lines[index].trim();

    const nextLine = lines[index + 1]?.trim() || "";

    function takeNextContent() {
      if (
        nextLine &&
        !nextLine.startsWith("#") &&
        !nextLine.startsWith("☐") &&
        !nextLine.startsWith("- ") &&
        !nextLine.includes(":")
      ) {
        index++;
        return nextLine;
      }

      return "";
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 className="docTitle" key={index}>
          {trimmed.replace("# ", "")}
        </h1>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 className="docHeading" key={index}>
          {trimmed.replace("## ", "")}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 className="docSubheading" key={index}>
          {trimmed.replace("### ", "")}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("☐")) {
      elements.push(
        <label className="savingChecklistItem" key={index}>
          <input type="checkbox" />
          <span>{trimmed.replace("☐", "").trim()}</span>
        </label>,
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      elements.push(
        <div className="docBullet" key={index}>
          <CheckCircle2 size={18} fill="#059625" stroke="white" />
          <span>{trimmed.replace("- ", "")}</span>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Estimated saving:")) {
      const currentContent = trimmed.replace("Estimated saving:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout savingCallout" key={index}>
          <div className="calloutHeader">
            <CircleDollarSign size={22} color="#059625" />
            <b>Estimated saving</b>
          </div>
          <strong>{content}</strong>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Estimated time:")) {
      const currentContent = trimmed.replace("Estimated time:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout timeCallout" key={index}>
          <div className="calloutHeader">
            <Clock3 size={22} color="#7c3aed" />
            <b>Estimated time</b>
          </div>
          <p>{content}</p>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Confidence:")) {
      const currentContent = trimmed.replace("Confidence:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout confidenceCallout" key={index}>
          <div className="calloutHeader">
            <ShieldCheck size={22} color="#059625" />
            <b>Confidence</b>
          </div>
          <p>{content}</p>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Why this matters:")) {
      const currentContent = trimmed.replace("Why this matters:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout whyCallout" key={index}>
          <div className="calloutHeader">
            <Lightbulb size={22} color="#f59e0b" />
            <b>Why this matters</b>
          </div>
          <p>{content}</p>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Quick win:")) {
      const currentContent = trimmed.replace("Quick win:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout quickCallout" key={index}>
          <div className="calloutHeader">
            <Sparkles size={22} color="#059625" />
            <b>Quick win</b>
          </div>
          <p>{content}</p>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("Next step:")) {
      const currentContent = trimmed.replace("Next step:", "").trim();
      const content = currentContent || takeNextContent();

      elements.push(
        <div className="reportCallout nextCallout" key={index}>
          <div className="calloutHeader">
            <ArrowRightCircle size={22} color="#2563eb" />
            <b>Next step</b>
          </div>
          <p>{content}</p>
        </div>,
      );
      continue;
    }

    if (
      trimmed.startsWith("Impact:") ||
      trimmed.startsWith("What your answer revealed:") ||
      trimmed.startsWith("Likely pattern:") ||
      trimmed.startsWith("Why this reduces stress:") ||
      trimmed.startsWith("When to use:") ||
      trimmed.startsWith("Script:") ||
      trimmed.startsWith("Focus:") ||
      trimmed.startsWith("Actions:")
    ) {
      const [label, ...rest] = trimmed.split(":");

      elements.push(
        <div className="docInfoRow" key={index}>
          <b>{label}:</b>
          <span>{rest.join(":").trim()}</span>
        </div>,
      );
      continue;
    }

    elements.push(
      <p className="docParagraph" key={index}>
        {trimmed}
      </p>,
    );
  }

  return elements;
}
export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const reportText = cleanOldJson(data.report);
  const savings = getSavings(reportText);
  const savingsNumber = getSavingsNumber(savings);
  const equivalent = getSavingsEquivalent(savingsNumber);

  return (
    <div className="auditPage">
      <Header simple />

      <main className="container reportUnlockedPage">
        <div className="unlockreport-bg">
          <section className="resultsHero reportHero">
            <div>
              <span className="reportStatus">
                <ShieldCheck size={18} />
                Payment confirmed
              </span>

              <h1>
                Your full{" "}
                <span style={{ color: "#059625" }}>
                  savings report is unlocked
                </span>
              </h1>

              <p>
                Your biggest opportunities are highlighted below, with estimated
                yearly savings, quick wins, scripts, and a 30-day action plan to
                help you take action without feeling overwhelmed.
              </p>

              <div className="reportMeta">
                <span>
                  <CheckCircle2 size={18} fill="#059625" stroke="white" />
                  Full report unlocked
                </span>

                <span>
                  <Sparkles size={18} color="#059625" />
                  AI-generated insights
                </span>

                <span>
                  <CalendarDays size={18} color="#059625" />
                  Saved report URL
                </span>
              </div>
            </div>

            <div
              className="greenPanel"
              style={{
                backgroundImage: "url('/result/panelbg.png')",
              }}
            >
              <span className="badge">Total Recoverable Cash Found</span>
              <h2>{savings}</h2>
              <p>
                Your report includes priority leaks, action steps, scripts, and
                a 30-day savings plan.
              </p>

              <div className="savingsEquivalent">
                <span>{equivalent.label}</span>
                <h3>{equivalent.title}</h3>
                <div className="wowItems">
                  {equivalent.items.map((item) => (
                    <div className="wowItem" key={item}>
                      <CheckCircle2 size={16} fill="#fff" stroke="#059625" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="reportDocumentLayout">
            <aside className="reportSummaryCard">
              <span className="pill">Full Report</span>

              <h2>Your savings summary</h2>

              <div className="summaryBox">
                <FileText size={34} color="#059625" />
                <div>
                  <b>Potential annual savings</b>
                  <strong>{savings}</strong>
                </div>
              </div>

              <div className="summaryWowBox">
                <span>{equivalent.label}</span>
                <strong>{equivalent.title}</strong>
                <div className="wowItems summary">
                  {equivalent.items.map((item) => (
                    <div className="wowItem" key={item}>
                      <CheckCircle2 size={16} fill="#059625" stroke="white" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="potential-report">
                <p className="list-item">
                  <CheckCircle2 size={15} color="#059625" /> Personalised money
                  leaks
                </p>
                <p className="list-item">
                  <CheckCircle2 size={15} color="#059625" /> Hidden spending
                  patterns
                </p>
                <p className="list-item">
                  <CheckCircle2 size={15} color="#059625" /> Scripts included
                </p>
                <p className="list-item">
                  <CheckCircle2 size={15} color="#059625" /> 30-day action plan
                  included
                </p>
              </div>
            </aside>

            <hr />

            <article className="reportDocument">
              <div className="documentHeader">
                <span className="pill">
                  <LockOpen size={25} color="#059625" /> Unlocked Personalised
                  Report
                </span>
                <h2>Your SpendShift Savings Report</h2>
                <p>
                  This report is saved at <b>/report/{id}</b>. You can revisit
                  it anytime.
                </p>
              </div>

              <div className="documentBody">{renderReport(data.report)}</div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
