import { WHOP_OFFERS } from "./whop-offers";

export type CourseOffer = {
  provider: "whop";
  planId: string;
  productId: string;
  billing: "one_time";
  purpose: "free_placeholder" | "paid";
  amountMinor: number;
  currency: "USD" | "EUR";
  label: string;
  hostedUrl: string;
};

// Keep the course identity independent of the Whop product/plan mapping.
// Future paid offers must be enabled together with server-verified course access.
const offers: Record<string, CourseOffer> = {
  "tus-primeros-pasos": {
    provider: "whop",
    planId: WHOP_OFFERS.freeCommunity.planId,
    productId: "prod_fGgcg5TK7jvos",
    billing: "one_time",
    purpose: "free_placeholder",
    amountMinor: 0,
    currency: "USD",
    label: "Free Comm",
    hostedUrl: "https://whop.com/rokitg/free-comm/",
  },
};

export function getCourseOffer(courseSlug: string): CourseOffer | undefined {
  return Object.hasOwn(offers, courseSlug) ? offers[courseSlug] : undefined;
}
