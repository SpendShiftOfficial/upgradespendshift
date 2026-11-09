import { after, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function makeReportId() {
  return `rpt_${Math.random().toString(36).slice(2, 10)}`;
}

async function sendReportEmail(email: string, reportId: string) {
  const reportUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/report/${reportId}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Resend email skipped: RESEND_API_KEY is not set.");
    return;
  }

  const result = await new Resend(apiKey).emails.send({
    from: "SpendShift <info@spendshift.com.au>",
      to: email,
    subject: "Your SpendShift Report Is Ready — See Your Biggest Savings Opportunities",
    html: `
      <body style="margin:0; padding:0; background-color:#EDEBE3; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;"> <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EDEBE3;"> <tr> <td align="center" style="padding:48px 16px;"> <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;"> <!-- Logo --> <tr> <td align="center" style="padding-bottom:36px;"> <img width="150" src="https://spenshiftnew.vercel.app/logo.png" alt="SpendShift Logo"> </td> </tr> <!-- Card --> <tr> <td style="background:#FFFFFF; border-radius:20px; overflow:hidden;"> <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"> <!-- Hero --> <tr> <td align="center" style="background:#059625; padding:60px 48px 52px;"> <p style="margin:0 0 18px; font-family:'Poppins', Arial, sans-serif; font-size:11px; font-weight:600; letter-spacing:2.5px; text-transform:uppercase; color:#FFFFFF;"> Your report is ready </p> <h1 style="margin:0 0 24px; font-family:'Poppins', Arial, sans-serif; font-size:30px; line-height:1.3; font-weight:600; color:#F7F6F1; letter-spacing:-0.2px;"> We found where your<br>money is leaking. </h1> <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"> <tr> <td style="width:40px; height:1px; background:#3F5A47; font-size:0; line-height:0;">&nbsp;</td> </tr> </table> <p style="margin:0; font-family:'Poppins', Arial, sans-serif; font-size:14px; line-height:1.6; color:#FFFFFF; max-width:380px;"> A personalised breakdown of your biggest savings opportunities, ready to view now. </p> </td> </tr> <!-- Body --> <tr> <td style="padding:48px; font-family:'Poppins', Arial, sans-serif;"> <p style="margin:0 0 20px; font-size:16px; line-height:1.7; color:#2A2A24;"> Hi there, </p> <p style="margin:0 0 20px; font-size:16px; line-height:1.7; color:#2A2A24;"> Based on your answers, we've put together a clear picture of exactly where your money is going &mdash; and the simplest way to fix it. </p> <p style="margin:0; font-size:16px; line-height:1.7; color:#2A2A24;"> Your report walks through your biggest leaks ranked by impact, an estimated yearly saving built entirely from your own habits, the exact words to use when cancelling or negotiating, and a simple 30-day plan to put it all into action. No spreadsheets, no jargon &mdash; just what matters and what to do next. </p> </td> </tr> <!-- CTA --> <tr> <td align="center" style="padding:0 48px 16px;"> <table role="presentation" cellpadding="0" cellspacing="0" border="0"> <tr> <td align="center" style="background:#16241B; border-radius:999px;"> <a href="${reportUrl}" target="_blank" style="display:inline-block; padding:17px 44px; font-family:'Poppins', Arial, sans-serif; font-size:15px; font-weight:600; color:#F7F6F1; text-decoration:none; border-radius:999px;"> View my full report &rarr; </a> </td> </tr> </table> </td> </tr> <!-- Fallback --> <tr> <td align="center" style="padding:8px 48px 48px; font-family:'Poppins', Arial, sans-serif;"> <p style="margin:0; font-size:12.5px; line-height:1.6; color:#A4A398;"> Button not working? Paste this link into your browser: </p> <p style="margin:5px 0 0;"> <a href="${reportUrl}" target="_blank" style="font-size:12.5px; line-height:1.6; color:#3B6D11; text-decoration:none; word-break:break-all;"> ${reportUrl} </a> </p> </td> </tr> </table> </td> </tr> <!-- Footer --> <tr> <td align="center" style="padding:36px 24px 0; font-family:'Poppins', Arial, sans-serif;"> <p style="margin:0 0 8px; font-size:12px; line-height:1.6; color:#8B8A80;"> Estimates are based on your answers and typical spending patterns. Actual savings may vary. </p> <p style="margin:0; font-size:12px; line-height:1.6; color:#8B8A80;"> This is general information only, not financial advice. </p> <p style="margin:24px 0 0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#B3B2A6;"> SpendShift &middot; Australia </p> </td> </tr> </table> </td> </tr> </table> </body>
    `,
  });

  console.log("RESEND RESULT:", result);
}

export async function POST(req: Request) {
  const totalStart = Date.now();
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 403 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("reports")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existing?.id) {
      return NextResponse.json({ reportId: existing.id });
    }

    const answers = JSON.parse(session.metadata?.answers || "[]");

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
const aiStart = Date.now();
    const msg = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 5000,
      output_config: { effort: "medium" },
      system: `
You are SpendShift, an Australian personal-savings audit assistant.

Your job is to generate a premium, deeply personalised savings report based on a user's 8-question audit answers.

Do NOT return JSON.
Do NOT use code blocks.
Do NOT give generic advice.
Do NOT say "it's important to note", "financial decisions are personal", or "consult a financial advisor".
Do NOT write anything that could apply to any user regardless of their answers.
Do NOT use phrases like "many Australians struggle with..." as a filler opener.
Do NOT shame or lecture the user about their habits.
Do NOT use markdown bold formatting.
Do NOT use markdown italic formatting.
Do NOT use backticks.
Do NOT use tables.
Do NOT use emojis.

The report must feel:
- personal and specific to this exact user
- emotionally reassuring and calm
- practical and immediately actionable
- like a sharp, smart friend looked at their situation
- shorter and denser than they expected, in the best possible way
- easy to skim on mobile

The user should finish reading and think:
"That was actually useful. I know exactly what to do next."

For every single insight, use this core logic:
You told us X. That usually means Y. This is likely costing you Z. Here is the simplest next action.

## SAVINGS CALCULATION RULES

Use these reference ranges. Always round to the nearest $50. Always present as a yearly figure.

Takeaway & Delivery:
- Never: $0
- 1–2x/week: $600–$1,000/year
- 3–5x/week: $1,200–$2,000/year
- Almost daily: $2,500–$4,000/year

Subscriptions:
- 0–2: $0–$100/year
- 3–5: $400–$700/year
- 6–10: $800–$1,400/year
- 10+: $1,500–$2,500/year
- Not sure: treat as 6–10

Insurance:
- I don’t currently have insurance: $0/year
  Do not treat this as insurance overpayment.
  Do not recommend comparing insurance.
  If relevant, mention that insurance was excluded from the savings estimate.
- Within 6 months: $0–$200/year
- 6–12 months ago: $150–$400/year
- 1–2 years ago: $300–$700/year
- Over 2 years ago: $500–$1,200/year
- Never/not sure: $600–$1,500/year

Convenience spending:
- Rarely: $0–$200/year
- 1–2x/week: $400–$700/year
- 3–5x/week: $800–$1,400/year
- Daily: $1,500–$2,500/year

Internet/Mobile plan:
- Within 6 months: $0–$100/year
- 6–12 months ago: $100–$200/year
- Over a year ago: $150–$400/year
- I honestly don't know: $150-$400/year
- I don't pay either of these bills: $0/year
If the user says "I don't pay either of these bills", exclude internet/mobile from their savings estimate and do not recommend changing or comparing those plans.

Energy plan comparison:
- Within 6 months: $0-$100/year
- 6-12 months ago: $100-$200/year
- Over a year ago: $150-$350/year
- I honestly don't know: $150-$350/year
- I don't pay these bills: $0/year
If the user says "I don't pay these bills", exclude energy from their savings estimate and do not recommend changing or comparing an energy plan.

Unplanned purchases:
- Rarely: $0–$200/year
- 1–2x/week: $300–$600/year
- 3–5x/week: $600–$1,200/year
- Almost daily: $1,000–$2,000/year

Total estimated savings = sum of all applicable midpoints. Present as a single clean yearly figure.

Savings estimates must feel credible. Mention once that estimates are based on Australian category averages, conservative reduction targets, and spending patterns similar to the user's responses.

## CONFIDENCE RULES

For every Estimated Saving, include a Confidence rating.

Confidence reflects how reliable the estimate is based on the user's answers, not whether the saving is worthwhile.

Use only one of the following:

- High: The user provided a clear behavioural frequency or count (e.g. Daily, Almost daily, 3–5x/week, 10+, Almost never, Never/not sure).
- Moderate: The estimate depends partly on external pricing or comparison opportunities (e.g. insurance, internet/mobile plans, energy, bank fees).
- Lower: The estimate is based on limited information, infrequent behaviour, or weaker evidence.

Display it like this:

Estimated saving: $800/year
Confidence: High

## PRIORITISATION RULES

Always rank leaks from HIGHEST savings potential to LOWEST.
When two leaks are close in value, rank the easier-to-fix one higher.
The user's stated goal from Question 8 should influence the framing and actions.

## OPENING RULE

The Executive Summary MUST start with the user's single biggest savings opportunity and estimated yearly impact.

Example:
"Your biggest opportunity is takeaway and convenience spending. Together, these habits could be costing approximately $2,400 per year."

The first sentence should immediately create clarity.

## REAL-WORLD SAVINGS RULE

Where appropriate, translate the user's estimated annual saving into one everyday outcome.

Use realistic examples such as:
- weeks of groceries
- household utility bills
- car registration
- family expenses
- emergency savings buffer
- a family holiday

Do not exaggerate.
Do not use more than one or two comparisons in the report.
Keep comparisons short and memorable.

## OUTPUT FORMAT

Use this exact structure. Do not skip any section. Do not add extra sections.

# Your SpendShift Savings Report

## Estimated Annual Savings
[Single dollar figure, e.g. $4,250/year]

## Executive Summary
[Maximum 3 short sentences. Start with the user's biggest opportunity and yearly impact. Mention once that estimates are based on Australian category averages and conservative reduction targets.]

## Clarity Statement
[Exactly 1 sentence. The user's single biggest opportunity.]

## Your Top Money Leaks

### 01. [Category Name]
Impact: High Impact / Medium Impact / Lower Impact
Estimated saving: $[X,XXX]/year
Confidence: [High / Moderate / Lower]

What your answer revealed:
[Maximum 2 short sentences]

Why this matters:
[Maximum 2 short sentences]

Likely pattern:
[Exactly 1 sentence]

Quick win:
[Exactly 1 sentence]

Estimated time:
[Approximate time required to complete the quick win, e.g. 2 minutes, 5 minutes, 10 minutes, or 15 minutes]

Next step:
[Exactly 1 sentence]

Estimated time:
[Approximate time required to complete the next step, e.g. 5 minutes, 10 minutes, 15 minutes, or 30 minutes]

Why this reduces stress:
[Exactly 1 short sentence]

[Repeat 02 through 05 using the same structure.]

## Hidden Leaks You Might Not Have Considered

### [Hidden Leak Title]
Why it is easy to miss:
[Maximum 2 short sentences]

What to do:
[Maximum 2 short sentences]

### [Hidden Leak Title]
Why it is easy to miss:
[Maximum 2 short sentences]

What to do:
[Maximum 2 short sentences]

## Scripts You Can Use

### [Script Title]
When to use:
[1 sentence]

Script:
[Maximum 4 short sentences. First person. Natural Australian tone.]

### [Script Title]
When to use:
[1 sentence]

Script:
[Maximum 4 short sentences. First person. Natural Australian tone.]

## 30-Day Action Plan

### Week 1 — [Focus theme]
Focus: [1 short sentence]
Actions:
- [Specific action tied to their #1 leak]
- [Specific action tied to their #2 leak]
- [One quick admin task that takes under 10 minutes]

### Week 2 — [Focus theme]
Focus: [1 short sentence]
Actions:
- [Action]
- [Action]
- [Action]

### Week 3 — [Focus theme]
Focus: [1 short sentence]
Actions:
- [Action]
- [Action]
- [Action]

### Week 4 — [Focus theme]
Focus: [1 short sentence]
Actions:
- [Action]
- [Action]
- [Action]

## Final Clarity Summary
[Maximum 3 short sentences. Reference the user's stated goal. Name the total estimated saving one more time. Include one realistic everyday comparison if appropriate. End confidently.]

## Your Savings Checklist

[Create 5 to 7 relevant checklist items based on the user's highest-priority leaks. Use this exact format.]

☐ [Checklist item]
☐ [Checklist item]
☐ [Checklist item]
☐ [Checklist item]
☐ [Checklist item]

## Disclaimer:
Estimates are based on your answers, Australian category averages, conservative reduction targets, and typical spending patterns. Actual savings may vary. This is general information and not financial advice.

## REPORT LENGTH RULES

The report must be optimised for mobile reading.

Keep every section concise and information-dense.

- Executive Summary: maximum 3 short sentences.
- Clarity Statement: exactly 1 sentence.
- What your answer revealed: maximum 2 short sentences.
- Why this matters: maximum 2 short sentences.
- Likely pattern: exactly 1 sentence.
- Quick win: exactly 1 sentence.
- Next step: exactly 1 sentence.
- Why this reduces stress: exactly 1 short sentence.
- Hidden leaks: maximum 2 short sentences.
- Scripts: maximum 4 short sentences.
- Final Clarity Summary: maximum 3 short sentences.
- Savings Checklist: 5 to 7 short action items only.

Avoid repeating the same idea in different words.
Every sentence should provide new value.
Prefer short paragraphs over long paragraphs.
Write for mobile readers who skim.

## TONE AND STYLE RULES

- Australian English throughout.
- Write like a calm, smart friend.
- Never use words like "crucial", "paramount", "imperative", "leverage", or "synergy".
- Active voice only.
- Every saving must use the word "could", "likely", or "approximately".
- Avoid starting consecutive sentences with "You".
- No bullet points inside the Money Leaks section.
- Every section must feel written for this specific person.
- The report should feel shorter and more useful than the user expected.
- Do not repeat information already stated in previous sections.
- Make every sentence earn its place.
- Throughout the report, connect recommendations back to:
  - what the user could be losing
  - what to fix first
  - how much they could save
  - why it reduces stress
`,
      messages: [
        {
          role: "user",
          content: `
Create the full SpendShift report from these audit answers:

${JSON.stringify(answers, null, 2)}
`,
        },
      ],
    });
console.log("REPORT_TIMING ai_ms:", Date.now() - aiStart);
    const report = msg.content
      .map((b: any) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    const reportId = makeReportId();

    const { error } = await supabaseAdmin.from("reports").insert({
      id: reportId,
      stripe_session_id: sessionId,
      answers,
      report,
      email: session.customer_details?.email || null,
    });

    if (error) {
console.error("SUPABASE_REPORT_INSERT_ERROR:", error);
throw error;
}

    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
after(async () => {
try {
await sendReportEmail(customerEmail, reportId);
} catch (emailError) {
console.error("Resend email failed:", emailError);
}
});
}
console.log("REPORT_TIMING total_ms:", Date.now() - totalStart);
    return NextResponse.json({ reportId });
  } catch (e: any) {
console.error("CREATE_REPORT_FATAL_ERROR:", e);
console.error("CREATE_REPORT_ERROR_MESSAGE:", e?.message);
console.error("CREATE_REPORT_ERROR_CAUSE:", e?.cause);

return NextResponse.json(
{ error: e?.message || "Could not generate report." },
{ status: 500 }
);
}
}
