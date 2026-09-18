import "server-only";
import { cookies } from "next/headers";

export const INTERNAL_AUTH_COOKIE = "rokitg_internal_auth";

// Deliberately a separate cookie/password from PAGE_ACCESS_PASSWORD (the
// marketing preview gate) — this one protects real business data.
export async function isInternalAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(INTERNAL_AUTH_COOKIE)?.value === "authenticated";
}
