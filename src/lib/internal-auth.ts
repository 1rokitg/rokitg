import "server-only";
import { headers } from "next/headers";

function normalizeIp(raw: string | null | undefined): string | null {
  const ip = raw?.split(",")[0]?.trim().toLowerCase().replace(/^::ffff:/, "");
  return ip ? ip : null;
}

// On Vercel these headers carry the real client IP and are overwritten at the edge,
// so a visitor can't spoof them. Don't deploy this behind a proxy that forwards client-set headers.
export function getClientIp(requestHeaders: Headers): string | null {
  return (
    normalizeIp(requestHeaders.get("x-real-ip")) ??
    normalizeIp(requestHeaders.get("x-vercel-forwarded-for")) ??
    normalizeIp(requestHeaders.get("x-forwarded-for"))
  );
}

function allowedIps(): string[] {
  return (process.env.INTERNAL_ALLOWED_IPS ?? "")
    .split(",")
    .map((ip) => normalizeIp(ip))
    .filter((ip): ip is string => ip !== null);
}

/**
 * Only requests from an IP listed in INTERNAL_ALLOWED_IPS get in. Fails closed in
 * production when the list is empty; in local development an empty list allows everything.
 */
export async function isInternalAuthenticated(): Promise<boolean> {
  const allowed = allowedIps();
  if (allowed.length === 0) return process.env.NODE_ENV !== "production";

  const ip = getClientIp(await headers());
  return ip !== null && allowed.includes(ip);
}
