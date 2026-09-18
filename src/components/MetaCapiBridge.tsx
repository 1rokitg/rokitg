"use client";

import { useEffect } from "react";
import { metaEventFor, type EventName } from "@/lib/analytics/events";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type AnalyticsDetail = {
  name: EventName;
  payload: Record<string, unknown> & { event_id: string; landing_url?: string };
  delivery: "whop" | "ga4" | "preview";
};

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Subscribes to the same `rokitg:analytics` bus every tracked action already
 * dispatches (see trackWhopEvent in src/lib/whop.ts) and mirrors it to the
 * user's own Meta Pixel + Conversions API — entirely independent of Whop's ad
 * stack, using the same event_id on both sides so Meta deduplicates them.
 */
export function MetaCapiBridge() {
  useEffect(() => {
    function onAnalytics(event: Event) {
      const detail = (event as CustomEvent<AnalyticsDetail>).detail;
      if (!detail || detail.delivery === "preview") return;

      const eventId = String(detail.payload.event_id ?? "");
      const url = String(detail.payload.landing_url ?? window.location.href);
      if (!eventId) return;

      const standardName = metaEventFor(detail.name);
      const fbEventName = standardName ?? detail.name.replace(/[^a-zA-Z0-9]+/g, "");

      window.fbq?.(standardName ? "track" : "trackCustom", fbEventName, {}, { eventID: eventId });

      fetch("/api/meta/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fbEventName,
          eventId,
          url,
          fbp: readCookie("_fbp"),
          fbc: readCookie("_fbc"),
        }),
        keepalive: true,
      }).catch(() => {
        /* Measurement must never block a visitor's action. */
      });
    }

    window.addEventListener("rokitg:analytics", onAnalytics);
    return () => window.removeEventListener("rokitg:analytics", onAnalytics);
  }, []);

  return null;
}
