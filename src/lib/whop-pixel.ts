import "server-only";
import { headers } from "next/headers";

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
  const analyticsEnabled = shouldLoadWhop(requestHeaders);
  const analyticsLive = process.env.VERCEL_ENV === "production";
  return {
    loadWhop: analyticsEnabled && analyticsLive,
    shouldTrack: analyticsEnabled || !analyticsLive,
    whopContext: {
      country: requestHeaders.get("x-vercel-ip-country") ?? undefined,
      enabled: analyticsEnabled,
      live: analyticsLive,
    },
  };
}
