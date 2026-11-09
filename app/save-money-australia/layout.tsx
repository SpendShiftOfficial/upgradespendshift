import type { Metadata } from "next";
import type { ReactNode } from "react";

const articleImage =
"https://www.spendshift.com.au/save-money-australia.png";

export const metadata: Metadata = {
title: "How to Save Money in Australia: 12 Practical Ways",
description:
"Discover practical ways to save money in Australia across bills, groceries, subscriptions and everyday expenses, plus a free 2-minute savings audit.",
alternates: {
canonical: "https://www.spendshift.com.au/save-money-australia",
},
openGraph: {
title: "How to Save Money in Australia: 12 Practical Ways",
description:
"Discover practical ways to save money in Australia across bills, groceries, subscriptions and everyday expenses.",
url: "https://www.spendshift.com.au/save-money-australia",
siteName: "SpendShift",
locale: "en_AU",
type: "article",
images: [
{
url: articleImage,
alt: "How to Save Money in Australia: 12 Practical Ways",
},
],
},
twitter: {
card: "summary_large_image",
title: "How to Save Money in Australia: 12 Practical Ways",
description:
"Discover practical ways to save money in Australia across bills, groceries, subscriptions and everyday expenses.",
images: [articleImage],
},
};

const articleStructuredData = {
"@context": "https://schema.org",
"@type": "Article",
"@id": "https://www.spendshift.com.au/save-money-australia#article",
headline: "How to Save Money in Australia: 12 Practical Ways",
dateModified: "2026-10-12T22:13:00+11:00",
description:
"Discover practical ways to save money in Australia across bills, groceries, subscriptions and everyday expenses, plus a free 2-minute savings audit.",
url: "https://www.spendshift.com.au/save-money-australia",
image: articleImage,
mainEntityOfPage: {
"@type": "WebPage",
"@id": "https://www.spendshift.com.au/save-money-australia",
},
author: {
"@type": "Organization",
"@id": "https://www.spendshift.com.au/#organization",
name: "SpendShift",
url: "https://www.spendshift.com.au/",
},
publisher: {
"@type": "Organization",
"@id": "https://www.spendshift.com.au/#organization",
name: "SpendShift",
url: "https://www.spendshift.com.au/",
},
inLanguage: "en-AU",
about: {
"@type": "Thing",
name: "Saving money in Australia",
},
};

export default function SaveMoneyAustraliaLayout({
children,
}: {
children: ReactNode;
}) {
return (
<>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify(articleStructuredData).replace(
/</g,
"\\u003c"
),
}}
/>
{children}
</>
);
}
