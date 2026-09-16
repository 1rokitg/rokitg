"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { CourseOffer } from "@/lib/course-offers";
import { trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import styles from "@/app/app/courses/courses.module.scss";

const Checkout = dynamic(() => import("./CourseCheckoutEmbed"), {
  ssr: false,
  loading: () => <p role="status">Cargando inscripción segura…</p>,
});

export function CourseCheckout({ courseSlug, offer }: { courseSlug: string; offer: CourseOffer }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {open ? (
        <>
          <button className={styles.button} onClick={() => setOpen(false)}>
            Cerrar inscripción
          </button>
          <Checkout offer={offer} />
          <p className={styles.muted}>
            Si no aparece el formulario, <a href={offer.hostedUrl}>abre {offer.label} en Whop ↗</a>
          </p>
        </>
      ) : (
        <button
          className={styles.button}
          onClick={() => {
            trackWhopEvent(WHOP_EVENTS.freeCheckout, {
              source: "course_placeholder",
              course_id: courseSlug,
              plan_id: offer.planId,
              product_id: offer.productId,
              payment_type: "free",
              amount: 0,
            });
            setOpen(true);
          }}
        >
          Unirme gratis a {offer.label} →
        </button>
      )}
    </div>
  );
}
