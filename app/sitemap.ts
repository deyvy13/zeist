import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { locales, hreflangByLocale, type Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";

const SERVICE_SLUGS = [
  "add-ins-revit-civil-3d",
  "automatizacion-dynamo",
  "auditoria-procesos-bim",
  "cursos-mentorias-bim",
];

const STATIC_PATHS = [
  "",
  "servicios",
  "blog",
  "herramientas",
  "contacto",
  ...SERVICE_SLUGS.map((s) => `servicios/${s}`),
];

// Pillar posts anchor each SEO topic cluster — they get a higher priority than
// their satellites so crawlers treat them as the canonical entry to the topic.
const PILLAR_SLUGS = new Set([
  "automatizar-civil-3d-guia-completa",              // C2 · Civil 3D
  "desarrollo-add-ins-revit-civil-3d-guia-completa", // C1 · Add-ins C#
  "dynamo-csharp-con-ia-claude",                     // C3 · IA + BIM
  "programacion-para-ingenieros-civiles",            // C4 · Carrera
  "plan-bim-peru-obligatorio-guia-empresas",         // C5 · Perú / corporativo
]);

function priorityFor(path: string): number {
  if (path === "") return 1;
  if (path.startsWith("blog/")) {
    return PILLAR_SLUGS.has(path.slice("blog/".length)) ? 0.9 : 0.7;
  }
  if (path.startsWith("servicios/")) return 0.8;
  return 0.8;
}

function localePath(locale: Locale, path: string) {
  return absoluteUrl(path ? `${locale}/${path}` : locale);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // path -> locales where that path actually exists.
  // Static routes are always translated; blog posts are not (locale-specific
  // content such as Peru regulation ships only in `es`), so listing a /pt/ URL
  // for them would publish a 404 and a broken hreflang pair.
  const pathLocales = new Map<string, Locale[]>();

  for (const path of STATIC_PATHS) pathLocales.set(path, [...locales]);

  for (const l of locales) {
    // getAllPosts filters out drafts — archived posts must not reach the sitemap.
    for (const post of getAllPosts(l)) {
      const path = `blog/${post.slug}`;
      pathLocales.set(path, [...(pathLocales.get(path) ?? []), l]);
    }
  }

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const [path, available] of pathLocales) {
    const languages: Record<string, string> = {};
    for (const l of available) languages[hreflangByLocale[l]] = localePath(l, path);

    for (const locale of available) {
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: path.startsWith("blog") ? "weekly" : "monthly",
        priority: priorityFor(path),
        alternates: { languages },
      });
    }
  }
  return entries;
}
