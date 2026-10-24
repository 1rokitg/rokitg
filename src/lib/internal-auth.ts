import "server-only";
import { headers } from "next/headers";
import { getClientIp, normalizeIp } from "@/lib/client-ip";

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
