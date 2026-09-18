import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";

export async function POST(request: NextRequest) {
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
