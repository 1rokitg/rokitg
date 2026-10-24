"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@once-ui-system/core";
import { captureAttribution, trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { WHOP_OFFERS, whopPageUrl } from "@/lib/whop-offers";

type Status = "idle" | "pending" | "done" | "error";

// The Whop pixel keeps the visitor id in a first-party cookie; sending it lets Whop tie the lead to the ad click.
function whopVisitorId(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)_wuid=([^;]*)/);
  if (match) return match[1];
  try {
    return localStorage.getItem("_wuid") || undefined;
  } catch {
    return undefined;
  }
}

// The address bar can lose campaign tags after landing, so rebuild the URL from the attribution saved on arrival.
function attributedPageUrl(): string {
  const url = new URL(window.location.origin + window.location.pathname);
  for (const [key, value] of Object.entries(captureAttribution()?.parameters ?? {})) url.searchParams.set(key, value);
  return url.toString();
}

const fieldStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.05)",
  color: "inherit",
  fontSize: 15,
} as const;

export function EmailCapture({ source }: { source: string }) {
  const t = useTranslations("EmailCapture");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "pending") return;
    if (!consent) {
      setError(t("errorConsent"));
      return;
    }

    setStatus("pending");
    setError(null);
    const submissionId = crypto.randomUUID();

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          submissionId,
          pageUrl: attributedPageUrl(),
          visitorId: whopVisitorId(),
          website: honeypot,
        }),
      });

      if (response.ok) {
        trackWhopEvent(WHOP_EVENTS.emailSubscribed, {
          source,
          submission_id: submissionId,
          interaction: "submit",
          event_id: `signup:${submissionId}`,
        });
        setStatus("done");
        return;
      }

      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error === "invalid" ? t("errorEmail") : body?.error === "consent" ? t("errorConsent") : t("errorGeneric"));
    } catch {
      setError(t("errorGeneric"));
    }
    setStatus("error");
  }

  function joinCommunity() {
    window.open(whopPageUrl(WHOP_OFFERS.freeCommunity.productUrl, captureAttribution()?.parameters), "_blank", "noopener");
  }

  if (status === "done") {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          margin: "0 auto",
          padding: 20,
          borderRadius: 16,
          border: "1px solid rgba(34,201,138,0.4)",
          background: "rgba(34,201,138,0.08)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 17 }}>{t("successTitle")}</p>
        <p style={{ margin: "0 0 14px", fontSize: 14, opacity: 0.8 }}>{t("successBody")}</p>
        <Button type="button" variant="secondary" size="m" onClick={joinCommunity}>
          {t("joinCta")} →
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      data-analytics="off"
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
        padding: 20,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        textAlign: "left",
      }}
    >
      <div>
        <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 17 }}>{t("title")}</p>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>{t("subtitle")}</p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          style={{ ...fieldStyle, flex: "1 1 220px", width: "auto" }}
        />
        <Button type="submit" variant="primary" size="l" disabled={status === "pending"}>
          {status === "pending" ? t("sending") : t("button")}
        </Button>
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, lineHeight: 1.5, opacity: 0.8 }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <span>{t("consent")}</span>
      </label>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
      />

      {error ? (
        <p role="alert" style={{ margin: 0, fontSize: 13, color: "#f87171" }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
