"use client";

import nextDynamic from "next/dynamic";

// Skips SSR: the terminal's live-tail state seeds itself from Date.now() at
// mount, which would otherwise mismatch between the server-rendered pass and
// client hydration (a real timestamp differs by however long the request
// took) and trip a hydration error. No SEO reason to server-render an
// auth-gated internal tool anyway. `ssr: false` requires this Client
// Component boundary — next/dynamic refuses it directly inside a Server Component.
export const EventsTerminalClient = nextDynamic(
  () => import("./EventsTerminal").then((mod) => mod.EventsTerminal),
  { ssr: false },
);
