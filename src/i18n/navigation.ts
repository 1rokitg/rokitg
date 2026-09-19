import { createNavigation } from "next-intl/navigation";
import { routing, type AppLocale } from "./routing";

// Locale-aware wrappers: Link automatically prefixes hrefs with /es when
// needed, redirect/usePathname/useRouter stay in sync with the current locale.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

/**
 * For components that take a plain href string (e.g. once-ui's ToggleButton)
 * instead of accepting a custom Link component — prefixes `path` for every
 * locale except the default, matching the "as-needed" routing config.
 */
export function localeHref(locale: AppLocale, path: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
