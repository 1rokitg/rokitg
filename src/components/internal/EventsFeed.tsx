"use client";

import { loadWhop } from "@whop/elements";
import { WhopElements, Tracking, EventsElement } from "@whop/elements-react";
import styles from "./EventsFeed.module.scss";

const WHOP_ACCOUNT_ID = "biz_ROKYKZdV9YGZP7";

export function EventsFeed({ accessToken }: { accessToken: string }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <span className={styles.badge}>Internal</span>
        <h1 className={styles.title}>Inbound events</h1>
        <p className={styles.subtitle}>
          Every event RokitG&apos;s Whop pixel measured — page views, leads, and purchases — as a raw, filterable
          stream.
        </p>
      </header>

      <WhopElements
        elements={loadWhop()}
        appearance={{
          theme: { appearance: "dark" },
        }}
      >
        <Tracking accountId={WHOP_ACCOUNT_ID} accessToken={accessToken} period="last_30_days">
          <EventsElement />
        </Tracking>
      </WhopElements>
    </div>
  );
}
