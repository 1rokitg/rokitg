import "server-only";
import { cookies, headers } from "next/headers";
import { CONSENT_COOKIE, consentModeFor, parseChoice, trackingAllowed } from "@/lib/consent";

/** The visitor's consent state for this request: which rule applies where they are, what they chose, and whether tracking may run. */
export async function getConsentState() {
  const [requestHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const mode = consentModeFor(requestHeaders.get("x-vercel-ip-country"));
  const choice = parseChoice(cookieStore.get(CONSENT_COOKIE)?.value);
  const gpc = requestHeaders.get("sec-gpc") === "1";
  return { mode, choice, gpc, allowed: trackingAllowed(mode, choice, gpc) };
}
