"use client";

import { useState } from "react";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import type { CourseOffer } from "@/lib/course-offers";
import styles from "@/app/app/courses/courses.module.scss";

function formatOfferPrice(offer: CourseOffer) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 2,
  }).format(offer.amountMinor / 100);
}

export function PaidCourseCheckout({
  courseSlug,
  offer,
}: {
  courseSlug: string;
  offer: CourseOffer;
}) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => startCheckout(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/courses/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error ?? "checkout_failed");
      window.location.assign(body.url);
    } catch {
      setError("No pudimos abrir el pago. Inténtalo de nuevo en unos segundos.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className={styles.button}
        disabled={!ready || loading}
        onClick={() => (authenticated ? startCheckout() : login())}
      >
        {loading ? "Abriendo pago…" : `Comprar por ${formatOfferPrice(offer)}`}
      </button>
      {error && <p className={styles.muted}>{error}</p>}
    </div>
  );
}
