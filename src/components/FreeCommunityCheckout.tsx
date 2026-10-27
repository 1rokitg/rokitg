"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@once-ui-system/core";
import { captureAttribution, trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { DISCORD_ACCESS_URL, WHOP_OFFERS, whopPageUrl } from "@/lib/whop-offers";

const SOURCE = "home_thumbnail";

function Loading() {
  const t = useTranslations("FreeCheckout");
  return (
    <p role="status" style={{ margin: 0, padding: "48px 0", textAlign: "center", opacity: 0.7 }}>
      {t("loading")}
    </p>
  );
}

// The checkout script is only fetched once someone asks to join, so it never weighs on the page load.
const Embed = dynamic(() => import("./FreeCommunityEmbed"), { ssr: false, loading: () => <Loading /> });

const offer = WHOP_OFFERS.freeCommunity;
const checkoutProperties = {
  source: SOURCE,
  offer: offer.name,
  plan_id: offer.planId,
  payment_type: offer.paymentType,
  amount: offer.amount,
};

export function FreeCommunityCheckout({ onClose }: { onClose: () => void }) {
  const t = useTranslations("FreeCheckout");
  const locale = useLocale() === "es" ? "es" : "en";
  const panel = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);
  // Read once on open; this component only mounts after a click, so the browser is always there.
  const [theme] = useState<"light" | "dark">(() =>
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
  );
  const [attribution] = useState(() => captureAttribution()?.parameters ?? {});
  const [whopUrl] = useState(() => whopPageUrl(offer.productUrl, attribution));

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
  }, []);

  const handleJoined = (sessionId: string) => {
    trackWhopEvent(WHOP_EVENTS.freeCommunityJoined, { ...checkoutProperties, event_id: `joined:${sessionId}` });
    setJoined(true);
  };

  return (
    <div
      ref={panel}
      role="region"
      aria-label={t("title")}
      style={{
        width: "100%",
        padding: "18px 18px 14px",
        border: "2px solid #ed1238",
        borderRadius: 16,
        background: "var(--page-background)",
        boxShadow: "0 15px 45px rgba(0,0,0,0.35)",
        textAlign: "left",
      }}
    >
      {joined ? (
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0 8px", textAlign: "center" }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#ed1238",
              color: "#fff",
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </span>
          <h3 style={{ margin: 0, fontSize: 24 }}>{t("doneTitle")}</h3>
          <p style={{ margin: 0, opacity: 0.8, maxWidth: 420 }}>{t("doneBody")}</p>
          <Button
            href={DISCORD_ACCESS_URL}
            size="l"
            variant="primary"
            style={{ width: "100%", minHeight: 60, borderRadius: 10, fontWeight: 800 }}
          >
            {t("doneCta")} →
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <strong style={{ fontSize: 18 }}>{t("title")}</strong>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid var(--neutral-alpha-medium)",
                background: "transparent",
                color: "inherit",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ minHeight: 320 }}>
            <Embed
              locale={locale}
              theme={theme}
              source={SOURCE}
              attribution={attribution}
              onJoined={handleJoined}
            />
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 13, textAlign: "center", opacity: 0.75 }}>
            {t("trouble")}{" "}
            <a
              href={whopUrl}
              target="_blank"
              rel="noopener"
              style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {t("openOnWhop")}
            </a>
          </p>
        </>
      )}
    </div>
  );
}
