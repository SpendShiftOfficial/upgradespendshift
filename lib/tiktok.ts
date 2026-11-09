declare global {
  interface Window {
    ttq?: {
      track?: (event: string, params?: Record<string, any>) => void;
      page?: () => void;
    };
  }
}

export function trackTikTok(
  eventName: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  if (!window.ttq?.track) return;

  window.ttq.track(eventName, params);
}