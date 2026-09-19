import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

// Spanish-speaking markets (Spain + Latin America) — a first-time visitor
// from one of these gets the Spanish site by default instead of English.
const SPANISH_SPEAKING_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO",
  "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // First-time visitor, no saved language preference yet: guess from
  // Vercel's edge geolocation before next-intl falls back to Accept-Language.
  if (!request.cookies.get("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country");
    if (country) {
      const guessed = SPANISH_SPEAKING_COUNTRIES.has(country) ? "es" : "en";
      request.cookies.set("NEXT_LOCALE", guessed);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Skips the academy (/app — not localized yet), internal dashboard, API
  // routes, Next internals, and static files/assets.
  matcher: [
    "/((?!api|app|internal|_next|images|trademarks|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
