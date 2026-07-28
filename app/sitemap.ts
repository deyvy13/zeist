import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { locales, hreflangByLocale, type Locale } from "@/lib/i18n";
import { getPostSlugs } from "@/lib/blog";

const SERVICE_SLUGS = [
  "desarrollo-de-software",
  "automatizacion-ingenieria",
  "diseno-ux-ui",
  "arquitectura-de-software",
  "arquitectura-de-datos",
  "cursos-y-mentorias",
];

const STATIC_PATHS = [
  "",
  "servicios",
  "blog",
  "herramientas",
  "contacto",
  ...SERVICE_SLUGS.map((s) => `servicios/${s}`),
];

function localePath(locale: Locale, path: string) {
  return absoluteUrl(path ? `${locale}/${path}` : locale);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Union of blog slugs across locales (posts may not exist in every language).
  const blogPaths = new Set<string>();
  for (const l of locales) {
    for (const slug of getPostSlugs(l)) blogPaths.add(`blog/${slug}`);
  }

  const allPaths = [...STATIC_PATHS, ...blogPaths];
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];
  for (const path of allPaths) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      for (const l of locales) languages[hreflangByLocale[l]] = localePath(l, path);

      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: path.startsWith("blog") ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.includes("/") ? 0.6 : 0.8,
        alternates: { languages },
      });
    }
  }
  return entries;
}
