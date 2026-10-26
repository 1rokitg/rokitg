"use client";

import type { ReactNode } from "react";
import { CallToAction } from "@/components/cta";

export function HomeCheckout({ hero }: { hero?: ReactNode }) {
  return <CallToAction trustBadges={false} hero={hero} />;
}
