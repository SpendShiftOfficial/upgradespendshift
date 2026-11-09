export const GA_MEASUREMENT_ID = "G-MEHDG2Y7T2";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, any>[];
    clarity?: (command: string, ...args: any[]) => void;
  }
}
const CLARITY_FUNNEL_EVENTS = new Set([
"audit_start",
"audit_complete",
"free_results_view",
"upgrade_click",
"begin_checkout",
"purchase",
"paid_report_ready",
]);
function sendClarityEvent(eventName: string, retries = 20) {
if (typeof window === "undefined") return;

if (typeof window.clarity === "function") {
window.clarity("event", eventName);
console.log("✅ CLARITY EVENT SENT:", eventName);
return;
}

if (retries > 0) {
window.setTimeout(
() => sendClarityEvent(eventName, retries - 1),
250
);
}
}
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {}
) {
  console.log("🔥 EVENT:", eventName, params);

  if (typeof window === "undefined") return;

  // Send event to Google Tag Manager
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  console.log("✅ GTM EVENT SENT:", eventName);

  // Existing direct GA4 tracking
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);

    console.log("✅ GA4 EVENT SENT:", eventName);
  } else {
    console.log("❌ gtag unavailable");
  }
  if (CLARITY_FUNNEL_EVENTS.has(eventName)) {
sendClarityEvent(eventName);
}
}
