"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "spendshift_cookie_consent";

type ConsentChoice = "granted" | "denied";

function updateGoogleConsent(choice: ConsentChoice) {
if (typeof window === "undefined" || !window.gtag) return;

const granted = choice === "granted" ? "granted" : "denied";

window.gtag("consent", "update", {
analytics_storage: granted,
ad_storage: granted,
ad_user_data: granted,
ad_personalization: granted,
});
}

export default function ConsentBanner() {
const [visible, setVisible] = useState(false);

useEffect(() => {
const saved = localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;

if (saved === "granted" || saved === "denied") {
updateGoogleConsent(saved);
return;
}

setVisible(true);
}, []);
  useEffect(() => {
const openCookieSettings = () => {
setVisible(true);
};

window.addEventListener("open-cookie-settings", openCookieSettings);

return () => {
window.removeEventListener("open-cookie-settings", openCookieSettings);
};
}, []);

function saveConsent(choice: ConsentChoice) {
const previousChoice = localStorage.getItem(
CONSENT_KEY
) as ConsentChoice | null;

localStorage.setItem(CONSENT_KEY, choice);
updateGoogleConsent(choice);

const consentChanged =
previousChoice !== null && previousChoice !== choice;

if (choice === "granted" || consentChanged) {
window.location.reload();
return;
}

setVisible(false);
}

if (!visible) {
  return null;
}

return (
<div
role="dialog"
aria-label="Cookie preferences"
style={{
position: "fixed",
left: "20px",
right: "20px",
bottom: "20px",
zIndex: 99999,
maxWidth: "720px",
margin: "0 auto",
padding: "20px",
background: "#ffffff",
color: "#1f2937",
border: "1px solid #e5e7eb",
borderRadius: "16px",
boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
}}
>
<div
style={{
fontSize: "18px",
fontWeight: 700,
marginBottom: "8px",
}}
>
Your privacy choices
</div>

<p
style={{
margin: "0 0 16px",
lineHeight: 1.5,
fontSize: "14px",
}}
>
We use optional analytics and advertising technologies to understand
how SpendShift is used, improve the experience and measure our
marketing. You can accept or reject optional cookies.{" "}
<Link
href="/cookies"
style={{
textDecoration: "underline",
color: "inherit",
}}
>
Cookie Policy
</Link>
</p>

<div
style={{
display: "flex",
gap: "10px",
flexWrap: "wrap",
}}
>
<button
type="button"
onClick={() => saveConsent("granted")}
style={{
border: 0,
borderRadius: "10px",
padding: "11px 18px",
fontWeight: 700,
cursor: "pointer",
background: "#059625",
color: "#ffffff",
}}
>
Accept optional cookies
</button>

<button
type="button"
onClick={() => saveConsent("denied")}
style={{
border: "1px solid #d1d5db",
borderRadius: "10px",
padding: "11px 18px",
fontWeight: 700,
cursor: "pointer",
background: "#ffffff",
color: "#1f2937",
}}
>
Reject optional cookies
</button>
</div>
</div>
);
}
