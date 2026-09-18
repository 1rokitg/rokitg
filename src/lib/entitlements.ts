import "server-only";
import { head, put } from "@vercel/blob";

function entitlementPath(privyUserId: string) {
  return `entitlements/${encodeURIComponent(privyUserId)}.json`;
}

async function readEntitlements(privyUserId: string): Promise<string[]> {
  try {
    const blob = await head(entitlementPath(privyUserId), {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as { courseSlugs?: string[] };
    return Array.isArray(data.courseSlugs) ? data.courseSlugs : [];
  } catch {
    return [];
  }
}

export async function hasCourseAccess(privyUserId: string, courseSlug: string): Promise<boolean> {
  if (!privyUserId) return false;
  const owned = await readEntitlements(privyUserId);
  return owned.includes(courseSlug);
}

/** Called from the Whop webhook once a course payment succeeds — additive, never removes access. */
export async function grantCourseAccess(privyUserId: string, courseSlug: string): Promise<void> {
  const owned = await readEntitlements(privyUserId);
  if (owned.includes(courseSlug)) return;
  await put(entitlementPath(privyUserId), JSON.stringify({ courseSlugs: [...owned, courseSlug] }), {
    access: "public",
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
