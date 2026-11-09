"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
ArrowRight,
CalendarCheck2,
Car,
CheckCircle2,
CreditCard,
PiggyBank,
Receipt,
Repeat2,
Search,
ShieldCheck,
ShoppingCart,
Smartphone,
Utensils,
Wallet,
Zap,
} from "lucide-react";

const tips = [
{
id: "review-bills",
number: "01",
icon: Receipt,
title: "Review your recurring household bills",
text:
"Start with expenses that leave your account every month without much thought. Electricity, internet, phone plans, insurance and memberships can quietly become more expensive over time.",
action:
"Open your latest statements and list every recurring bill. Mark anything you have not reviewed or compared in the past 12 months.",
},
{
id: "energy",
number: "02",
icon: Zap,
title: "Check whether you are overpaying for energy",
text:
"Energy costs can vary significantly between plans, providers and locations. Staying on the same plan for years can mean missing newer offers or discounts.",
action:
"Check your current electricity rate, supply charge and discounts, then compare them with other plans available in your area.",
},
{
id: "phone-internet",
number: "03",
icon: Smartphone,
title: "Renegotiate your phone and internet",
text:
"Many Australians stay on the same phone or internet plan long after their needs change. You may be paying for data, speed or extras you rarely use.",
action:
"Check your actual usage first. Then ask your provider whether there is a cheaper plan that still covers what you genuinely need.",
},
{
id: "subscriptions",
number: "04",
icon: Repeat2,
title: "Audit every subscription and membership",
text:
"Streaming services, software, apps, gyms and other memberships are easy to accumulate because each individual payment can look small.",
action:
"Review the last three months of transactions and cancel anything you no longer use enough to justify keeping.",
},
{
id: "groceries",
number: "05",
icon: ShoppingCart,
title: "Make grocery shopping more intentional",
text:
"Saving on groceries does not require buying the cheapest version of everything. The biggest gains often come from reducing waste, planning meals and avoiding unnecessary top-up shops.",
action:
"Plan several meals before shopping, check what you already have and use a list. Compare unit prices where it helps.",
},
{
id: "takeaway",
number: "06",
icon: Utensils,
title: "Reduce convenience spending without banning it",
text:
"Takeaway, delivery, coffees and convenience purchases can become expensive when they happen automatically. Completely cutting them out is often unrealistic.",
action:
"Choose a weekly amount you are comfortable spending on convenience purchases and keep the rest available for higher priorities.",
},
{
id: "insurance",
number: "07",
icon: ShieldCheck,
title: "Review insurance before automatically renewing",
text:
"Insurance needs and prices can change over time. Automatically renewing without checking the policy can mean paying for cover that no longer fits your situation.",
action:
"Before renewal, review your level of cover, excess, optional extras and competing quotes. Compare like-for-like protection rather than price alone.",
},
{
id: "transport",
number: "08",
icon: Car,
title: "Look at the true cost of transport",
text:
"Fuel is only one part of transport spending. Parking, tolls, registration, servicing, public transport and convenience trips can also add up.",
action:
"Look at your total transport spending for one month and identify which trips or costs are easiest to reduce without disrupting your routine.",
},
{
id: "fees",
number: "09",
icon: CreditCard,
title: "Remove avoidable fees and charges",
text:
"Late fees, account fees, interest charges and other avoidable costs can drain money without improving your quality of life.",
action:
"Scan your recent statements for fees and interest. Where practical, automate due dates, change products or contact the provider about alternatives.",
},
{
id: "automate",
number: "10",
icon: PiggyBank,
title: "Automate part of your savings",
text:
"Saving becomes easier when it happens before the money is absorbed by everyday spending. The amount does not need to be large to build consistency.",
action:
"Set an automatic transfer shortly after payday into a separate savings account. Start with an amount you can maintain.",
},
{
id: "pause-spending",
number: "11",
icon: CalendarCheck2,
title: "Add a pause before non-essential purchases",
text:
"Impulse purchases often feel necessary in the moment and less important a day later. Creating a small delay can reduce spending without requiring a strict budget.",
action:
"For non-essential purchases above an amount you choose, wait at least 24 hours before buying and decide again with fresh eyes.",
},
{
id: "money-leaks",
number: "12",
icon: Search,
title: "Find the leaks that matter most to your household",
text:
"Not every saving strategy is equally valuable for every person. Your strongest opportunity might be energy, insurance, groceries, subscriptions or something completely different.",
action:
"Start with the categories where you spend the most or have reviewed the least. Fix the biggest opportunities before worrying about tiny expenses.",
},
];

const quickWins = [
"Cancel one subscription you no longer use",
"Check one major bill against current alternatives",
"Plan your next grocery shop before leaving home",
"Set one automatic savings transfer",
];

const faqs = [
{
question: "What is the best way to start saving money in Australia?",
answer:
"Start by reviewing your largest recurring expenses rather than trying to cut every small purchase. Household bills, insurance, groceries, subscriptions and convenience spending are useful places to begin because small improvements can repeat throughout the year.",
},
{
question: "Do I need a detailed budget to save money?",
answer:
"No. A detailed budget can be useful, but it is not the only way to save. You can begin by identifying recurring expenses, comparing major bills and changing a few spending habits that have the biggest effect.",
},
{
question: "How can I reduce monthly household expenses?",
answer:
"Review recurring bills, compare energy and telecommunications plans, check insurance before renewal, cancel unused subscriptions and reduce avoidable fees. Focus first on expenses that repeat every month.",
},
{
question: "How can I save money on groceries in Australia?",
answer:
"Meal planning, checking what you already have, using a shopping list, comparing unit prices and reducing food waste can all help. Avoiding frequent unplanned top-up shops can also make a meaningful difference.",
},
{
question: "How does SpendShift help me find savings?",
answer:
"SpendShift asks eight simple questions about your everyday spending habits and identifies likely money leaks and practical savings opportunities. The free audit takes approximately two minutes and does not require a bank connection.",
},
];

export default function SaveMoneyAustraliaPage() {
return (
<div className="savePage">
<Header />

<main>
<section className="saveMoneyHero">
<div className="saveMoneyHeroGrid">
<div className="heroCopy saveMoneyHeroCopy">
<div className="eyebrow">
<PiggyBank size={16} />
Australian money-saving guide
</div>

 <p
style={{
margin: "10px 0 0",
fontSize: "14px",
color: "#667085",
fontWeight: 500,
}}
>
Last reviewed: 12 October 2026
</p>

<h1>
How to save money in Australia:
<span> 12 practical ways to cut everyday costs.</span>
</h1>

<p className="heroText">
Saving more does not have to mean tracking every dollar or
giving up everything you enjoy. Start by finding the expenses
that are quietly costing you more than they should.
</p>

<div className="heroActions">
<Link href="/audit" className="primaryButton">
Start your free audit
<ArrowRight size={18} />
</Link>

<Link href="/how-it-works" className="secondaryLink">
See how SpendShift works
</Link>
</div>

<div className="trustRow">
<span>
<CheckCircle2 size={16} />
Approximately 2 minutes
</span>
<span>
<CheckCircle2 size={16} />
No bank connection
</span>
<span>
<CheckCircle2 size={16} />
No signup required
</span>
</div>
</div>

<div className="heroPanel saveMoneyHeroPanel">
<span className="panelLabel">WHERE TO START</span>
<h2>Fix the biggest leaks first.</h2>
<p>
You do not need to optimise every expense at once. Start with
the areas that are large, recurring or have not been reviewed
for a long time.
</p>

<div className="panelSteps">
<div>
<span>01</span>
<p>Review recurring bills</p>
</div>
<div>
<span>02</span>
<p>Find unnecessary spending</p>
</div>
<div>
<span>03</span>
<p>Take one practical action</p>
</div>
<div>
<span>04</span>
<p>Redirect the saving</p>
</div>
</div>
</div>
</div>
</section>

<section className="introSection">
<div className="articleContainer">
<div className="sectionEyebrow">A simpler approach</div>

<h2>
Saving more usually starts with fixing the leaks, not tracking
every cent.
</h2>

<p>
When living costs rise, it is easy to focus on tiny purchases
because they are visible. But the more useful question is often:
<strong> where is money leaving repeatedly without giving you enough value?</strong>
</p>

<p>
A phone plan that no longer suits you, an insurance policy you
automatically renew, unused subscriptions or frequent convenience
purchases can all quietly increase your monthly expenses. The goal
is not to make life miserable. It is to make sure your money is
going toward things you actually value.
</p>

<div className="quickWinBox">
<div className="quickWinHeader">
<Wallet size={23} />
<div>
<span>START TODAY</span>
<h3>Four quick wins you can do first</h3>
</div>
</div>

<div className="quickWinGrid">
{quickWins.map((win) => (
<div key={win} className="quickWin">
<CheckCircle2 size={18} />
<span>{win}</span>
</div>
))}
</div>
</div>
</div>
</section>

<section className="tipsSection">
<div className="pageContainer">
<div className="sectionHeading">
<div className="sectionEyebrow">12 practical ways to save</div>
<h2>Work through the expenses that can make the biggest difference.</h2>
<p>
You do not need to complete all 12. Pick the areas most relevant
to your household and start there.
</p>
</div>

<nav className="jumpNav" aria-label="Money-saving topics">
{tips.map((tip) => (
<a href={`#${tip.id}`} key={tip.id}>
{tip.number}
</a>
))}
</nav>

<div className="tipsGrid">
{tips.map((tip) => {
const Icon = tip.icon;

return (
<article className="tipCard" id={tip.id} key={tip.id}>
<div className="tipTop">
<div className="tipIcon">
<Icon size={22} />
</div>
<span className="tipNumber">{tip.number}</span>
</div>

<h3>{tip.title}</h3>
<p>{tip.text}</p>

<div className="actionBox">
<strong>Try this:</strong>
<span>{tip.action}</span>
</div>
</article>
);
})}
</div>
</div>
</section>

<section className="midCta">
<div className="pageContainer">
<div className="midCtaCard">
<div>
<span className="ctaEyebrow">PERSONALISED TO YOU</span>
<h2>Not sure which expense to tackle first?</h2>
<p>
SpendShift&apos;s free audit analyses your answers to identify
likely money leaks and show you where practical savings
opportunities may exist.
</p>
</div>

<Link href="/audit" className="lightButton">
Find my money leaks
<ArrowRight size={18} />
</Link>
</div>
</div>
</section>

<section className="planSection">
<div className="articleContainer">
<div className="sectionEyebrow">Turn savings into a system</div>
<h2>A simple three-step plan for keeping more of your money.</h2>

<div className="planGrid">
<div className="planCard">
<span>01</span>
<h3>Find</h3>
<p>
Identify the expenses that are costing you the most or giving
you the least value.
</p>
</div>

<div className="planCard">
<span>02</span>
<h3>Fix</h3>
<p>
Cancel, compare, negotiate or change one expense at a time
instead of trying to overhaul everything.
</p>
</div>

<div className="planCard">
<span>03</span>
<h3>Keep</h3>
<p>
Redirect part of the money you free up toward savings,
upcoming expenses or another financial priority.
</p>
</div>
</div>

<div className="noteBox">
<strong>Remember:</strong>
<p>
The best money-saving strategy is one you can maintain. Saving
A$20 consistently can be more useful than setting an unrealistic
target and abandoning it after a week.
</p>
</div>
</div>
</section>

<section className="faqSection">
<div className="articleContainer">
<div className="sectionEyebrow">Frequently asked questions</div>
<h2>Saving money in Australia</h2>

<div className="faqList">
{faqs.map((faq) => (
<article className="faqItem" key={faq.question}>
<h3>{faq.question}</h3>
<p>{faq.answer}</p>
</article>
))}
</div>
</div>
</section>
<section className="resourcesSection">
<div className="articleContainer">
<div className="sectionEyebrow">Useful Australian resources</div>

<h2>Official resources to help you save and compare costs.</h2>

<p className="resourcesIntro">
For more information, tools and consumer guidance, these Australian
government resources can help you compare expenses and make informed
decisions.
</p>

<div className="resourcesGrid">
<a
href="https://moneysmart.gov.au/saving/simple-ways-to-save-money"
target="_blank"
rel="noopener noreferrer"
className="resourceCard"
>
<span className="resourceSource">MONEYSMART</span>
<h3>Simple ways to save money</h3>
<p>
Practical guidance on saving, household bills, energy, insurance,
phone plans and building sustainable saving habits.
</p>
<span className="resourceLink">Visit Moneysmart ↗</span>
</a>

<a
href="https://moneysmart.gov.au/budgeting/cost-of-living-help"
target="_blank"
rel="noopener noreferrer"
className="resourceCard"
>
<span className="resourceSource">MONEYSMART</span>
<h3>Cost of living help</h3>
<p>
Australian tools, calculators and guidance for managing bills,
household expenses and rising living costs.
</p>
<span className="resourceLink">View cost-of-living help ↗</span>
</a>

<a
href="https://www.accc.gov.au/business/pricing/unit-pricing"
target="_blank"
rel="noopener noreferrer"
className="resourceCard"
>
<span className="resourceSource">ACCC</span>
<h3>Grocery unit pricing</h3>
<p>
Learn how unit prices can help you compare similar grocery products
and assess value for money.
</p>
<span className="resourceLink">Read the ACCC guide ↗</span>
</a>
</div>
</div>
</section>
<section className="finalSection">
<div className="pageContainer">
<div className="finalCard">
<div className="finalIcon">
<Search size={28} />
</div>

<span className="ctaEyebrow">FREE SPENDSHIFT AUDIT</span>

<h2>Find where your money could be quietly disappearing.</h2>

<p>
Answer eight simple questions about your everyday spending
habits. SpendShift will identify likely money leaks and show
you your strongest savings opportunities.
</p>

<Link href="/audit" className="primaryButton finalButton">
Start your free audit
<ArrowRight size={18} />
</Link>

<div className="finalTrust">
Approximately 2 minutes · No signup required · No bank connection
</div>
</div>

<p className="disclaimer">
SpendShift provides general information and estimated savings
opportunities only. Results vary by household, provider, location
and spending behaviour and should not be treated as financial
advice.{" "}
<Link
href="/financial-information-ai-disclaimer"
style={{
color: "inherit",
fontWeight: 700,
textDecoration: "underline",
textUnderlineOffset: "3px",
}}
>
Read our Financial Information &amp; AI Disclaimer
</Link>.
</p>
</div>
</section>
</main>

<Footer />

<style jsx>{`
.savePage {
background: #ffffff;
color: #1f2937;
}

.pageContainer {
width: min(1120px, calc(100% - 40px));
margin: 0 auto;
}

.articleContainer {
width: min(820px, calc(100% - 40px));
margin: 0 auto;
}

.hero {
background:
radial-gradient(
circle at 85% 20%,
rgba(88, 190, 74, 0.14),
transparent 36%
),
linear-gradient(180deg, #ffffff 0%, #f6faf4 100%);
padding: 96px 0 88px;
border-bottom: 1px solid #e8eee6;
}

.heroGrid {
display: grid;
grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
gap: 72px;
align-items: center;
}

.eyebrow,
.sectionEyebrow {
display: inline-flex;
align-items: center;
gap: 8px;
color: #419b38;
font-size: 13px;
line-height: 1;
font-weight: 800;
letter-spacing: 0.08em;
text-transform: uppercase;
}

.hero h1 {
margin: 20px 0 24px;
max-width: 760px;
font-size: clamp(44px, 5.5vw, 74px);
line-height: 1.02;
letter-spacing: -0.045em;
color: #293548;
}

.hero h1 span {
color: #49a83e;
}

.heroText {
margin: 0;
max-width: 650px;
font-size: 19px;
line-height: 1.7;
color: #657083;
}

.heroActions {
margin-top: 34px;
display: flex;
align-items: center;
flex-wrap: wrap;
gap: 22px;
}

.primaryButton,
.lightButton {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 10px;
border-radius: 999px;
padding: 15px 24px;
text-decoration: none;
font-weight: 800;
transition:
transform 0.2s ease,
opacity 0.2s ease;
}

.primaryButton {
background: #4caf3f;
color: #ffffff;
box-shadow: 0 12px 30px rgba(76, 175, 63, 0.2);
}

.primaryButton:hover,
.lightButton:hover {
transform: translateY(-2px);
}

.secondaryLink {
color: #334155;
font-weight: 750;
text-decoration: none;
}

.secondaryLink:hover {
color: #419b38;
}

.trustRow {
display: flex;
flex-wrap: wrap;
gap: 18px;
margin-top: 30px;
color: #667085;
font-size: 13px;
font-weight: 650;
}

.trustRow span {
display: inline-flex;
align-items: center;
gap: 6px;
}

.trustRow svg {
color: #4caf3f;
}

.heroPanel {
background: #12392f;
color: #ffffff;
border-radius: 28px;
padding: 38px;
box-shadow: 0 24px 60px rgba(18, 57, 47, 0.17);
}

.panelLabel,
.ctaEyebrow {
color: #9adb91;
font-size: 12px;
font-weight: 850;
letter-spacing: 0.09em;
}

.heroPanel h2 {
margin: 12px 0 14px;
color: #ffffff;
font-size: 34px;
line-height: 1.1;
letter-spacing: -0.035em;
}

.heroPanel > p {
margin: 0;
color: #c8d8d1;
font-size: 15px;
line-height: 1.65;
}

.panelSteps {
display: grid;
gap: 10px;
margin-top: 28px;
}

.panelSteps div {
display: flex;
align-items: center;
gap: 14px;
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 14px;
padding: 14px 15px;
}

.panelSteps span {
color: #8dd780;
font-size: 12px;
font-weight: 850;
}

.panelSteps p {
margin: 0;
font-size: 14px;
font-weight: 720;
}

.introSection,
.planSection,
.faqSection {
padding: 90px 0;
}

.articleContainer > h2,
.sectionHeading h2,
.midCtaCard h2,
.finalCard h2 {
letter-spacing: -0.035em;
color: #293548;
}

.articleContainer > h2 {
margin: 16px 0 24px;
font-size: clamp(32px, 4vw, 46px);
line-height: 1.12;
}

.articleContainer > p {
color: #5f6c7b;
font-size: 17px;
line-height: 1.8;
margin: 0 0 18px;
}

.articleContainer > p strong {
color: #293548;
}

.quickWinBox {
margin-top: 44px;
border-radius: 24px;
padding: 28px;
background: #f5faf3;
border: 1px solid #dfeedd;
}

.quickWinHeader {
display: flex;
align-items: center;
gap: 14px;
}

.quickWinHeader > svg {
color: #49a83e;
}

.quickWinHeader span {
display: block;
color: #49a83e;
font-size: 11px;
font-weight: 850;
letter-spacing: 0.09em;
}

.quickWinHeader h3 {
margin: 4px 0 0;
font-size: 21px;
color: #293548;
}

.quickWinGrid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 12px;
margin-top: 22px;
}

.quickWin {
display: flex;
gap: 10px;
align-items: flex-start;
padding: 14px;
border-radius: 14px;
background: #ffffff;
color: #475569;
font-size: 14px;
line-height: 1.5;
}

.quickWin svg {
flex: 0 0 auto;
margin-top: 1px;
color: #49a83e;
}

.tipsSection {
padding: 96px 0;
background: #f7f9f6;
border-top: 1px solid #ebefea;
border-bottom: 1px solid #ebefea;
}

.sectionHeading {
max-width: 760px;
margin: 0 auto;
text-align: center;
}

.sectionHeading h2 {
margin: 16px 0 16px;
font-size: clamp(34px, 4vw, 50px);
line-height: 1.1;
}

.sectionHeading p {
color: #687386;
font-size: 17px;
line-height: 1.7;
}

.jumpNav {
display: flex;
justify-content: center;
flex-wrap: wrap;
gap: 8px;
margin: 32px auto 42px;
}

.jumpNav a {
width: 38px;
height: 38px;
display: inline-flex;
align-items: center;
justify-content: center;
border: 1px solid #d9e4d7;
border-radius: 50%;
background: #ffffff;
color: #486052;
font-size: 12px;
font-weight: 800;
text-decoration: none;
}

.jumpNav a:hover {
background: #4caf3f;
color: #ffffff;
border-color: #4caf3f;
}

.tipsGrid {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 18px;
}

.tipCard {
scroll-margin-top: 110px;
background: #ffffff;
border: 1px solid #e3e9e1;
border-radius: 22px;
padding: 26px;
}

.tipTop {
display: flex;
align-items: center;
justify-content: space-between;
}

.tipIcon {
width: 46px;
height: 46px;
border-radius: 13px;
display: flex;
align-items: center;
justify-content: center;
color: #3f9e38;
background: #eef8ec;
}

.tipNumber {
color: #91a09a;
font-size: 13px;
font-weight: 850;
letter-spacing: 0.08em;
}

.tipCard h3 {
margin: 20px 0 11px;
color: #293548;
font-size: 22px;
line-height: 1.25;
letter-spacing: -0.02em;
}

.tipCard > p {
margin: 0;
color: #687386;
font-size: 15px;
line-height: 1.7;
}

.actionBox {
margin-top: 20px;
padding: 15px;
border-radius: 14px;
background: #f7f9f6;
font-size: 14px;
line-height: 1.6;
}

.actionBox strong {
display: block;
color: #3f9e38;
margin-bottom: 3px;
}

.actionBox span {
color: #52606f;
}

.midCta {
padding: 72px 0;
}

.midCtaCard {
display: grid;
grid-template-columns: 1fr auto;
gap: 40px;
align-items: center;
background: #12392f;
border-radius: 28px;
padding: 42px 46px;
color: #ffffff;
}

.midCtaCard h2 {
color: #ffffff;
font-size: 34px;
margin: 9px 0 12px;
}

.midCtaCard p {
color: #c9d9d2;
margin: 0;
max-width: 720px;
line-height: 1.65;
}

.lightButton {
background: #ffffff;
color: #173d32;
white-space: nowrap;
}

.planSection {
background: #ffffff;
}

.planGrid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;
margin-top: 36px;
}

.planCard {
padding: 26px;
border-radius: 20px;
background: #f6faf4;
border: 1px solid #e1ede0;
}

.planCard > span {
color: #4caf3f;
font-size: 12px;
font-weight: 850;
}

.planCard h3 {
color: #293548;
font-size: 24px;
margin: 10px 0 10px;
}

.planCard p {
color: #687386;
line-height: 1.65;
margin: 0;
font-size: 14px;
}

.noteBox {
display: flex;
align-items: flex-start;
gap: 13px;
margin-top: 28px;
padding: 19px 21px;
border-left: 4px solid #4caf3f;
background: #fbfcfb;
}

.noteBox strong {
color: #293548;
white-space: nowrap;
}

.noteBox p {
margin: 0;
color: #657083;
line-height: 1.6;
font-size: 14px;
}

.faqSection {
background: #f7f9f6;
border-top: 1px solid #ebefea;
}

.faqSection h2 {
margin: 15px 0 30px;
font-size: clamp(32px, 4vw, 46px);
}

.faqList {
display: grid;
gap: 12px;
}

.faqItem {
background: #ffffff;
border: 1px solid #e2e9e0;
border-radius: 18px;
padding: 24px;
}

.faqItem h3 {
margin: 0 0 9px;
color: #293548;
font-size: 18px;
line-height: 1.35;
}

.faqItem p {
margin: 0;
color: #687386;
line-height: 1.7;
font-size: 15px;
}
.resourcesSection {
padding: 90px 0;
background: #f7f9f6;
border-top: 1px solid #ebefea;
}

.resourcesSection h2 {
margin: 15px 0 14px;
color: #293548;
font-size: clamp(32px, 4vw, 46px);
line-height: 1.12;
letter-spacing: -0.035em;
}

.resourcesIntro {
margin: 0;
max-width: 720px;
color: #687386;
font-size: 16px;
line-height: 1.7;
}

.resourcesGrid {
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 14px;
margin-top: 30px;
}

.resourceCard {
display: block;
padding: 24px;
background: #ffffff;
border: 1px solid #e2e9e0;
border-radius: 18px;
text-decoration: none;
transition:
transform 0.2s ease,
border-color 0.2s ease;
}

.resourceCard:hover {
transform: translateY(-2px);
border-color: #b9d8b5;
}

.resourceSource {
display: block;
margin-bottom: 10px;
color: #4caf3f;
font-size: 11px;
font-weight: 850;
letter-spacing: 0.09em;
}

.resourceCard h3 {
margin: 0 0 10px;
color: #293548;
font-size: 20px;
line-height: 1.3;
}

.resourceCard p {
margin: 0;
color: #687386;
font-size: 14px;
line-height: 1.65;
}

.resourceLink {
display: block;
margin-top: 18px;
color: #3f9e38;
font-size: 13px;
font-weight: 800;
}
.finalSection {
padding: 90px 0 70px;
}

.finalCard {
text-align: center;
max-width: 850px;
margin: 0 auto;
border-radius: 30px;
padding: 54px 48px;
background:
radial-gradient(
circle at 50% 0%,
rgba(115, 207, 99, 0.16),
transparent 50%
),
#12392f;
color: #ffffff;
}

.finalIcon {
width: 56px;
height: 56px;
margin: 0 auto 18px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 16px;
color: #a2e397;
background: rgba(255, 255, 255, 0.08);
}

.finalCard h2 {
max-width: 650px;
margin: 12px auto 16px;
color: #ffffff;
font-size: clamp(34px, 4vw, 48px);
line-height: 1.1;
}

.finalCard > p {
max-width: 650px;
margin: 0 auto;
color: #cbdad4;
font-size: 16px;
line-height: 1.7;
}

.finalButton {
margin-top: 28px;
}

.finalTrust {
margin-top: 18px;
color: #aebfb8;
font-size: 12px;
}

.disclaimer {
max-width: 760px;
margin: 24px auto 0;
text-align: center;
color: #87918e;
font-size: 12px;
line-height: 1.6;
}

@media (max-width: 900px) {
.hero {
padding: 72px 0 64px;
}

.heroGrid {
grid-template-columns: 1fr;
gap: 42px;
}
.resourcesGrid {
grid-template-columns: 1fr;
}
.heroPanel {
max-width: 650px;
}

.tipsGrid {
grid-template-columns: 1fr;
}

.midCtaCard {
grid-template-columns: 1fr;
}

.lightButton {
justify-self: start;
}

.planGrid {
grid-template-columns: 1fr;
}
}

@media (max-width: 640px) {
.pageContainer,
.articleContainer {
width: min(100% - 28px, 1120px);
}

.hero {
padding: 54px 0 50px;
}

.hero h1 {
font-size: 43px;
}

.heroText {
font-size: 17px;
}

.heroActions {
align-items: stretch;
flex-direction: column;
}

.primaryButton {
width: 100%;
}

.secondaryLink {
text-align: center;
}

.trustRow {
flex-direction: column;
gap: 10px;
}

.heroPanel {
padding: 28px 22px;
}

.heroPanel h2 {
font-size: 30px;
}

.introSection,
.tipsSection,
.planSection,
.faqSection,
.finalSection {
padding: 64px 0;
}

.quickWinGrid {
grid-template-columns: 1fr;
}

.quickWinBox {
padding: 22px 18px;
}

.tipCard {
padding: 22px 19px;
}

.midCta {
padding: 54px 0;
}

.midCtaCard {
padding: 30px 22px;
}

.midCtaCard h2 {
font-size: 30px;
}

.lightButton {
width: 100%;
}

.noteBox {
flex-direction: column;
}

.finalCard {
padding: 40px 21px;
}

.finalCard h2 {
font-size: 36px;
}
}
`}</style>
 
</div>
);
}
