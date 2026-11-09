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
"paid_offer_view",
"paid_plan_view",
"action_task_open",
]);

/*
 * Internal / test traffic.
 * Visit any page once with ?ss_internal=1 to tag this browser as internal
 * (?ss_internal=0 removes it). Every event from that browser then carries
 * traffic_type: "internal", which GA4 can filter out (Admin → Data filters →
 * Internal traffic). Clarity sessions are tagged the same way.
 */
const INTERNAL_KEY = "spendshift_internal_traffic";

function isInternalTraffic(): boolean {
try {
const flag = new URLSearchParams(window.location.search).get("ss_internal");
if (flag === "1") localStorage.setItem(INTERNAL_KEY, "1");
if (flag === "0") localStorage.removeItem(INTERNAL_KEY);
return localStorage.getItem(INTERNAL_KEY) === "1";
} catch {
return false;
}
}

/** Fires an event only once per browser session (stops double-counting). */
export function trackEventOnce(
  eventName: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  const key = `${eventName}_tracked`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage blocked: still send once for this page */
  }
  trackEvent(eventName, params);
}
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

  if (isInternalTraffic()) {
    params = { ...params, traffic_type: "internal" };
    if (typeof window.clarity === "function") {
      window.clarity("set", "traffic_type", "internal");
    }
  }

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
