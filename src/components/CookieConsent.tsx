"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  OPEN_CONSENT_EVENT,
  clearTrackerCookies,
  storeChoice,
  trackingAllowed,
  type ConsentChoice,
  type ConsentMode,
} from "@/lib/consent";
import styles from "./CookieConsent.module.scss";

type Props = { mode: ConsentMode; choice?: ConsentChoice; gpc: boolean };

/**
 * Asks for consent where it's required (opt-in regions, until a choice exists) and can be reopened from the footer
 * anywhere. Tracking scripts are decided on the server from the saved choice, so a change that turns them on or off reloads the page.
 */
export function CookieConsent({ mode, choice, gpc }: Props) {
  const t = useTranslations("CookieConsent");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // The browser's own Global Privacy Control signal can be on even when the server didn't see it (e.g. a cached page).
    const browserGpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    if (mode === "optin" && !choice && !gpc && !browserGpc) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, [mode, choice, gpc]);

  if (!open) return null;

  const decide = (next: ConsentChoice) => {
    storeChoice(next);
    const changed = trackingAllowed(mode, choice, gpc) !== trackingAllowed(mode, next, gpc);
    if (next === "denied") clearTrackerCookies();
    if (changed) window.location.reload();
    else setOpen(false);
  };

  return (
    <section className={styles.banner} role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title">
      <h2 id="cookie-consent-title" className={styles.title}>
        {t("title")}
      </h2>
      <p className={styles.text}>{gpc ? t("gpc") : t("body")}</p>
      <p className={styles.text}>
        <Link className={styles.link} href="/privacy">
          {t("policy")}
        </Link>
      </p>
      <div className={styles.actions}>
        {gpc ? (
          <button type="button" className={styles.button} onClick={() => setOpen(false)}>
            {t("close")}
          </button>
        ) : (
          <>
            <button type="button" className={styles.button} onClick={() => decide("denied")}>
              {t("reject")}
            </button>
            <button type="button" className={styles.button} onClick={() => decide("granted")}>
              {t("accept")}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
