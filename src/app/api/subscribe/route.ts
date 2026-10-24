import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { sendWhopLead } from "@/lib/whop-events";

const ALLOWED_HOSTS = /(^|\.)rokitg\.com$|^localhost$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email: string;
  consent: true;
  submissionId: string;
  pageUrl: string;
  visitorId?: string;
  website?: string;
};

function parseBody(raw: unknown): { ok: true; body: Body } | { ok: false; reason: "consent" | "invalid" } {
  if (typeof raw !== "object" || raw === null) return { ok: false, reason: "invalid" };
  const input = raw as Record<string, unknown>;

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email.length === 0 || email.length > 254 || !EMAIL_PATTERN.test(email)) return { ok: false, reason: "invalid" };
  if (input.consent !== true) return { ok: false, reason: "consent" };

  const submissionId = typeof input.submissionId === "string" ? input.submissionId : "";
  if (!/^[\w-]{8,64}$/.test(submissionId)) return { ok: false, reason: "invalid" };

  const pageUrl = typeof input.pageUrl === "string" ? input.pageUrl : "";
  try {
    if (pageUrl.length > 2048 || !ALLOWED_HOSTS.test(new URL(pageUrl).hostname)) return { ok: false, reason: "invalid" };
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const visitorId = typeof input.visitorId === "string" && /^wuid_\w{1,59}$/.test(input.visitorId) ? input.visitorId : undefined;
  const website = typeof input.website === "string" ? input.website.slice(0, 200) : undefined;

  return { ok: true, body: { email, consent: true, submissionId, pageUrl, visitorId, website } };
}

// Best-effort per-instance limit; the honeypot and Whop's own dedupe do the heavy lifting.
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request: Request) {
  const parsed = parseBody(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.reason }, { status: 400 });
  const { email, submissionId, pageUrl, visitorId, website } = parsed.body;

  if (website) return NextResponse.json({ ok: true });

  const ip = getClientIp(request.headers);
  if (ip && rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const lead = {
    email,
    eventId: `lead:${submissionId}`,
    pageUrl,
    visitorId,
    ip,
    userAgent: request.headers.get("user-agent"),
  };

  try {
    await sendWhopLead(lead);
    return NextResponse.json({ ok: true });
  } catch (whopError) {
    console.error("Whop lead failed, saving to blob fallback:", whopError instanceof Error ? whopError.message : whopError);
    try {
      await put(`leads/pending/${submissionId}.json`, JSON.stringify({ ...lead, savedAt: new Date().toISOString() }), {
        access: "private",
        contentType: "application/json",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      });
      return NextResponse.json({ ok: true, queued: true });
    } catch (blobError) {
      console.error("Blob fallback failed:", blobError instanceof Error ? blobError.message : blobError);
      return NextResponse.json({ error: "unavailable" }, { status: 502 });
    }
  }
}
