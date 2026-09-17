import {
  attributionFromUrl,
  eventCategory,
  standardEventFor,
  EVENTS,
  type EventName,
  type EventPayloads,
} from "./analytics/events";
export { EVENTS as WHOP_EVENTS };
export type WhopEvent = EventName;
export type WhopEventProperties<E extends EventName> = EventPayloads[E];
declare global {
  interface Window {
    whop?: { track?: (event: string, data: Record<string, unknown>) => void };
    __whopContext?: { country?: string; enabled?: boolean; live?: boolean };
  }
}
const ATTRIBUTION_KEY = "rokitg:attribution:v1";
let attribution: ReturnType<typeof attributionFromUrl> | undefined;
const sent = new Set<string>();
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const current = attributionFromUrl(new URL(window.location.href));
  try {
    const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "null");
    if (Object.keys(current.parameters).length || !stored) {
      attribution = current;
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
    } else if (stored.landing_url && stored.parameters) {
      attribution = attributionFromUrl(new URL(stored.landing_url));
    }
  } catch {
    attribution ??= current;
  }
  return attribution ?? current;
}
/** Preview builds emit local diagnostics only. A stable ID deduplicates one action. */
export function trackWhopEvent<E extends EventName>(name: E, properties: EventPayloads[E]) {
  if (typeof window === "undefined") return;
  if (window.__whopContext?.live === true && window.__whopContext?.enabled === false) return;
  try {
    const eventId =
      properties.event_id ??
      (name === EVENTS.newsletterSubmitted
        ? `newsletter:${(properties as EventPayloads["Newsletter Submitted"]).submission_id}`
        : undefined) ??
      (name === EVENTS.calendarBooked
        ? `booking:${(properties as EventPayloads["Calendar Booking"]).booking_id}`
        : undefined) ??
      crypto.randomUUID();
    const key = `${name}:${eventId}`;
    if (sent.has(key)) return;
    const touch = captureAttribution();
    const category = eventCategory(name);
    const payload = {
      ...touch?.parameters,
      ...properties,
      schema_version: 1,
      event_id: eventId,
      occurred_at: new Date().toISOString(),
      event_category: category,
      page: window.location.pathname,
      landing_url: touch?.landing_url,
      country: window.__whopContext?.country,
      language: navigator.language,
      locale: document.documentElement.lang,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer ? new URL(document.referrer).hostname : "direct",
    };
    const live = window.__whopContext?.live === true;
    if (live && category !== "retention") {
      if (!window.whop?.track) return;
      window.whop.track(name, payload);
      const standardName = standardEventFor(name);
      if (standardName) {
        const amount = (properties as { amount?: number }).amount;
        window.whop.track(
          standardName,
          amount !== undefined ? { value: amount, currency: "USD" } : {},
        );
      }
    }
    if (live && category === "retention") {
      const analyticsWindow = window as Window & { dataLayer?: unknown[] };
      analyticsWindow.dataLayer ??= [];
      function emit(...args: unknown[]) {
        analyticsWindow.dataLayer!.push(arguments);
      }
      emit("event", "return_visit", {
        days_since_last_visit: (properties as EventPayloads["Return Visit"]).days_since_last_visit,
      });
    }
    sent.add(key);
    if (sent.size > 1000) sent.delete(sent.values().next().value!);
    window.dispatchEvent(
      new CustomEvent("rokitg:analytics", {
        detail: {
          name,
          payload,
          delivery: live ? (category === "retention" ? "ga4" : "whop") : "preview",
        },
      }),
    );
  } catch {
    /* Measurement must never block a visitor's action. */
  }
}
