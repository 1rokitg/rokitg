import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // "as-needed": the default locale (en) is unprefixed (rokitg.com/about),
  // every other locale gets a prefix (rokitg.com/es/about). Keeps every
  // existing English URL — ad destinations, bookmarks, search results —
  // working exactly as before.
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
