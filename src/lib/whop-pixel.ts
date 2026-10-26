import "server-only";
import { headers } from "next/headers";
import { getConsentState } from "@/lib/consent-server";

function getRequestIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip");
  return ip?.replace(/^::ffff:/, "");
}

function shouldLoadWhop(requestHeaders: Headers) {
  const excludedIps = (process.env.WHOP_EXCLUDED_IPS ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  return !excludedIps.includes(getRequestIp(requestHeaders) ?? "");
}

/** Shared between the marketing and academy root layouts so both get real, deduped Whop pixel tracking. */
export async function getWhopPixelContext() {
  const requestHeaders = await headers();
  const consent = await getConsentState();
  // Without consent (where it's required) nothing loads and nothing is tracked, same as an excluded IP.
  const analyticsEnabled = shouldLoadWhop(requestHeaders) && consent.allowed;
  const analyticsLive = process.env.VERCEL_ENV === "production";
  return {
    consent,
    loadWhop: analyticsEnabled && analyticsLive,
    shouldTrack: analyticsEnabled || !analyticsLive,
    whopContext: {
      country: requestHeaders.get("x-vercel-ip-country") ?? undefined,
      enabled: analyticsEnabled,
      live: analyticsLive,
    },
  };
}
