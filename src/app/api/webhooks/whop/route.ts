import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { grantCourseAccess } from "@/lib/entitlements";

// Whop signs webhooks the "Standard Webhooks" way: HMAC-SHA256 over
// `{webhook-id}.{webhook-timestamp}.{raw body}`, base64-encoded as `v1,<sig>`,
// using the `ws_...` secret from the webhook's settings. See docs.whop.com/webhooks.
function isValidSignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) return false;

  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  return signatureHeader.split(" ").some((candidate) => {
    const [, sig] = candidate.split(",");
    if (!sig) return false;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isValidSignature(rawBody, request.headers)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    type?: string;
    data?: { metadata?: Record<string, string> | null; status?: string };
  };

  if (event.type === "payment.succeeded") {
    const metadata = event.data?.metadata;
    const privyUserId = metadata?.privy_user_id;
    const courseSlug = metadata?.course_slug;
    if (privyUserId && courseSlug) {
      await grantCourseAccess(privyUserId, courseSlug);
    }
  }

  return NextResponse.json({ received: true });
}
