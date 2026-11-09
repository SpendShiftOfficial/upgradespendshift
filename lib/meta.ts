declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackMeta(
  eventName: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("trackCustom", eventName, params);
}

export function trackMetaStandard(
  eventName: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", eventName, params);
}