import { Meta } from "@once-ui-system/core";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { baseURL } from "@/resources";

/** Page metadata with a canonical for the current language and hreflang links to every language version. */
export async function localizedMeta(input: { title: string; description: string; path: string; image?: string }) {
  const locale = await getLocale();
  const urlFor = (target: string) =>
    `${baseURL}${target === routing.defaultLocale ? "" : `/${target}`}${input.path === "/" ? "" : input.path}`;

  return Meta.generate({
    ...input,
    baseURL,
    canonical: urlFor(locale),
    alternates: [
      ...routing.locales.map((target) => ({ hrefLang: target, href: urlFor(target) })),
      { hrefLang: "x-default", href: urlFor(routing.defaultLocale) },
    ],
  });
}
