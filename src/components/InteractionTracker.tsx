"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { classifyOutbound, isKeyPage, returnVisit, utcDay } from "@/lib/analytics/events";
export function InteractionTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  // Tracks the last pathname we already fired (or intentionally skipped) for, so any
  // re-invocation of this effect for the same transition — e.g. React's dev-mode
  // double-invoke — never produces a second event for one real navigation.
  const lastTrackedPath = useRef<string | null>(null);
  useEffect(() => {
    captureAttribution();
  }, [pathname]);
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip the initial load — Whop's own pixel already counts that page view.
      // Only a client-side route change (no full reload) needs an explicit view_content here.
      isFirstRender.current = false;
      lastTrackedPath.current = pathname;
      return;
    }
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    if (!isKeyPage(pathname)) return;
    trackWhopEvent(WHOP_EVENTS.pageViewed, {
      source: "spa_navigation",
      path: pathname,
    });
  }, [pathname]);
  useEffect(() => {
    try {
      const key = "rokitg:last-visit:v1";
      const now = new Date();
      const previous = localStorage.getItem(key);
      localStorage.setItem(key, utcDay(now));
      const visit = returnVisit(previous, now);
      if (visit)
        trackWhopEvent(WHOP_EVENTS.returnVisit, {
          source: "session",
          ...visit,
          event_id: `return:${visit.visit_day}`,
        });
    } catch {
      /* Storage can be unavailable. */
    }
  }, []);
  useEffect(() => {
    const played = new WeakSet<HTMLMediaElement>();
    function click(event: MouseEvent) {
      if (event.type === "auxclick" ? event.button !== 1 : event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.closest('[data-analytics="off"]') || link.dataset.analyticsManual) return;
      const destination = new URL(link.href, window.location.href);
      const name = classifyOutbound(destination);
      if (!name) return;
      trackWhopEvent(name, {
        source:
          link.closest<HTMLElement>("[data-analytics-source]")?.dataset.analyticsSource ??
          (link.closest("footer") ? "footer" : link.closest("header") ? "header" : "page_content"),
        destination: destination.origin + destination.pathname,
        link_label: (
          link.getAttribute("aria-label") ||
          link.textContent?.trim() ||
          link.querySelector("img")?.alt ||
          destination.hostname
        ).slice(0, 100),
        interaction:
          destination.searchParams.get("sub_confirmation") === "1" ? "subscribe" : "open",
      });
    }
    function play(event: Event) {
      const media = event.target;
      if (!(media instanceof HTMLMediaElement) || !media.dataset.contentId || played.has(media))
        return;
      if (media.autoplay || media.closest('[data-analytics="off"]')) return;
      played.add(media);
      trackWhopEvent(WHOP_EVENTS.videoPlayed, {
        source: "media_player",
        content_id: media.dataset.contentId,
        content_type: "video",
        interaction: "play",
      });
    }
    document.addEventListener("click", click, true);
    document.addEventListener("auxclick", click, true);
    document.addEventListener("playing", play, true);
    return () => {
      document.removeEventListener("click", click, true);
      document.removeEventListener("auxclick", click, true);
      document.removeEventListener("playing", play, true);
    };
  }, []);
  return null;
}
