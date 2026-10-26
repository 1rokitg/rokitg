"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

/** Footer link that reopens the consent choice, so it can be changed or withdrawn at any time. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}
    >
      {label}
    </button>
  );
}
