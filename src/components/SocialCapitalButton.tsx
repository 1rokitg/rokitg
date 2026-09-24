"use client";

import { useState } from "react";
import { trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import { WHOP_OFFERS } from "@/lib/whop-offers";
import { EmbeddedCheckout } from "@/components/checkout";
import styles from "./SocialCapitalButton.module.scss";

export function SocialCapitalButton({ source = "links_page" }: { source?: string }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    trackWhopEvent(WHOP_EVENTS.paidCheckoutClicked, {
      source,
      offer: WHOP_OFFERS.paidProgram.name,
      plan_id: WHOP_OFFERS.paidProgram.planId,
      payment_type: WHOP_OFFERS.paidProgram.paymentType,
      amount: WHOP_OFFERS.paidProgram.amount,
    });
    setOpen(true);
  };

  return (
    <>
      <button type="button" className={styles.auraButton} onClick={handleClick}>
        <span className={styles.shine} aria-hidden="true" />
        <span className={styles.label}>Join Social Capital</span>
      </button>
      <EmbeddedCheckout
        open={open}
        plan={WHOP_OFFERS.paidProgram.planId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
