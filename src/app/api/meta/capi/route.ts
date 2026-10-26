import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { getConsentState } from "@/lib/consent-server";

export async function POST(request: NextRequest) {
  // Conversion events are only forwarded to Meta when the visitor's consent allows tracking.
  if (!(await getConsentState()).allowed) {
    return NextResponse.json({ ok: false, skipped: "no-consent" }, { status: 202 });
  }

  const { name, eventId, url, fbp, fbc } = (await request.json()) as {
    name?: string;
    eventId?: string;
    url?: string;
    fbp?: string;
    fbc?: string;
  };

  if (!name || !eventId || !url) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;

  await sendMetaEvent({
    eventName: name,
    eventId,
    eventTime: Math.floor(Date.now() / 1000),
    eventSourceUrl: url,
    clientIp,
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    fbp,
    fbc,
  });

  return NextResponse.json({ ok: true });
}
