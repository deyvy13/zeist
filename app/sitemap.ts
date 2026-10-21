import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { locales, hreflangByLocale, type Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";
import { pillarSlugs } from "@/lib/clusters";
import { SERVICE_SLUGS, SERVICE_UPDATED } from "@/lib/services";
import { TOOL_SLUGS, toolLocales, toolUpdated } from "@/lib/tools";

const PAGES = ["", "servicios", "blog", "herramientas", "contacto", "privacidad", "nosotros"] as const;

/**
 * Last real change of each fixed page, ISO date: the sitemap's lastmod. Bump it
 * when the page's content changes, never on a plain redeploy — a lastmod that
 * moves on every build teaches Google to ignore it. The home and the blog index
 * also move with the newest post, since they list it.
 */
const PAGE_UPDATED: Record<(typeof PAGES)[number], string> = {
  "": "2026-10-19",
  servicios: "2026-10-19",
  blog: "2026-10-19",
  herramientas: "2026-10-19",
  contacto: "2026-10-19",
  privacidad: "2026-10-16",
  nosotros: "2026-10-19",
};

const STATIC_PATHS = [...PAGES, ...SERVICE_SLUGS.map((s) => `servicios/${s}`)];

// Pillars come from lib/clusters.ts (single source shared with related posts).
const PILLAR_SLUGS = pillarSlugs;

function priorityFor(path: string): number {
  if (path === "") return 1;
  if (path.startsWith("blog/")) {
    return PILLAR_SLUGS.has(path.slice("blog/".length)) ? 0.9 : 0.7;
  }
  if (path.startsWith("servicios/")) return 0.8;
  if (path === "privacidad") return 0.3;
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
  // "<locale>:<path>" -> real last-modified date. Posts carry their own
  // (`updated` or `date`); pages, services and tools take it from their maps.
  const lastMod = new Map<string, Date>();
  const fixed = new Map<string, string>([
    ...PAGES.map((p) => [p, PAGE_UPDATED[p]] as [string, string]),
    ...SERVICE_SLUGS.map((s) => [`servicios/${s}`, SERVICE_UPDATED[s]] as [string, string]),
    ...TOOL_SLUGS.map((s) => [`herramientas/${s}`, toolUpdated[s]] as [string, string]),
  ]);

  for (const path of STATIC_PATHS) pathLocales.set(path, [...locales]);
  // Tools ship per locale too (the steel calculator is es-only).
  for (const slug of TOOL_SLUGS) pathLocales.set(`herramientas/${slug}`, [...toolLocales[slug]]);

  for (const l of locales) {
    let newest = 0;
    // getAllPosts filters out drafts — archived posts must not reach the sitemap.
    for (const post of getAllPosts(l)) {
      const path = `blog/${post.slug}`;
      const date = new Date(post.updated ?? post.date);
      pathLocales.set(path, [...(pathLocales.get(path) ?? []), l]);
      lastMod.set(`${l}:${path}`, date);
      newest = Math.max(newest, date.getTime());
    }
    for (const [path, iso] of fixed) {
      const own = new Date(`${iso}T12:00:00.000Z`).getTime();
      // The home and the blog index list the newest posts.
      const listsPosts = path === "" || path === "blog";
      lastMod.set(`${l}:${path}`, new Date(listsPosts ? Math.max(own, newest) : own));
    }
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const [path, available] of pathLocales) {
    const languages: Record<string, string> = {};
    for (const l of available) languages[hreflangByLocale[l]] = localePath(l, path);

    for (const locale of available) {
      entries.push({
        url: localePath(locale, path),
        lastModified: lastMod.get(`${locale}:${path}`),
        changeFrequency: path.startsWith("blog") ? "weekly" : "monthly",
        priority: priorityFor(path),
        alternates: { languages },
      });
    }
  }
  return entries;
}
