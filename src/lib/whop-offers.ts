export const WHOP_OFFERS = {
  freeCommunity: {
    name: "free_community",
    planId: "plan_6hY35QLQssD74",
    productUrl: "https://whop.com/rokitg/free-comm/",
    paymentType: "free",
    amount: 0,
  },
  paidProgram: {
    name: "paid_program",
    planId: "plan_iKZZy75Zb7JlR",
    productUrl: "https://whop.com/rokitg/join-the-circle/",
    /** Where the funnel's paid button sends people: the storefront, not the single product page. */
    ctaUrl: "https://whop.com/rokitg",
    paymentType: "paid",
    amount: 97,
  },
} as const;

const WHOP_AFFILIATE_CODE = "rokitg";

/** whop.com page link; forwards the visitor's ad attribution (utm_*, ad ids) so it survives the redirect. */
export function whopPageUrl(
  pageUrl: string,
  attribution: Record<string, string> = {},
  options: { affiliate?: boolean } = {},
): string {
  const url = new URL(pageUrl);
  if (options.affiliate !== false) url.searchParams.set("a", WHOP_AFFILIATE_CODE);
  for (const [key, value] of Object.entries(attribution)) url.searchParams.set(key, value);
  return url.toString();
}
