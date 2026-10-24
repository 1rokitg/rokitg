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

export { normalizeIp };
