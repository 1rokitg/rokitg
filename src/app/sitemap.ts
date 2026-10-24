import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { routing } from "@/i18n/routing";

const lastModified = () => new Date().toISOString().split("T")[0];

// getPosts() throws a 404 when its folder is missing, which would take the whole sitemap down.
const postsIn = (segments: string[]) => {
  try {
    return getPosts(segments);
  } catch {
    return [];
  }
};

// The academy (/app) isn't localized, so it gets one URL; everything else exists in every language.
const isLocalized = (route: string) => !route.startsWith("/app");

export default async function sitemap() {
  const blogs = postsIn(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const works = postsIn(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => route !== "/welcome" && routesConfig[route as keyof typeof routesConfig],
  );

  const urlFor = (route: string, locale: string) =>
    `${baseURL}${locale === routing.defaultLocale ? "" : `/${locale}`}${route === "/" ? "" : route}`;

  const routes = activeRoutes.flatMap((route) => {
    if (!isLocalized(route)) return [{ url: `${baseURL}${route}`, lastModified: lastModified() }];

    const languages = {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(route, locale)])),
      "x-default": urlFor(route, routing.defaultLocale),
    };
    return routing.locales.map((locale) => ({
      url: urlFor(route, locale),
      lastModified: lastModified(),
      alternates: { languages },
    }));
  });

  return [...routes, ...blogs, ...works];
}
