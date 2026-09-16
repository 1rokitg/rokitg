"use client";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import type { CourseOffer } from "@/lib/course-offers";

export default function CourseCheckoutEmbed({ offer }: { offer: CourseOffer }) {
  return (
    <div style={{ marginTop: 24, minHeight: 400 }}>
      <WhopCheckoutEmbed
        planId={offer.planId}
        locale="es"
        theme="dark"
        themeOptions={{ accentColor: "lime", buttonText: "Unirme gratis" }}
        returnUrl={`${window.location.origin}/app/courses/checkout/complete`}
      />
    </div>
  );
}
