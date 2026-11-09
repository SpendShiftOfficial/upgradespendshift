import type { Metadata } from "next";
import HomePageClient from "./homePageClient";

export const metadata: Metadata = {
alternates: {
canonical: "https://www.spendshift.com.au/",
},
};

const structuredData = {
"@context": "https://schema.org",
"@graph": [
{
"@type": "Organization",
"@id": "https://www.spendshift.com.au/#organization",
name: "SpendShift",
legalName: "SpendShift Enterprises Pty Ltd",
email: "info@spendshift.com.au",
sameAs: [
"https://facebook.com/spendshiftofficial",
"https://instagram.com/spendshiftofficial",
"https://www.tiktok.com/@spendshiftofficial",
],
url: "https://www.spendshift.com.au/",
logo: "https://www.spendshift.com.au/logo.png",
description:
"SpendShift helps Australians uncover hidden money leaks with a fast, AI-powered savings audit and personalised financial report.",
areaServed: {
"@type": "Country",
name: "Australia",
},
},
{
"@type": "WebSite",
"@id": "https://www.spendshift.com.au/#website",
url: "https://www.spendshift.com.au/",
name: "SpendShift",
publisher: {
"@id": "https://www.spendshift.com.au/#organization",
},
inLanguage: "en-AU",
},
],
};

export default function Page() {
return (
<>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
}}
/>
<HomePageClient />
</>
);
}
