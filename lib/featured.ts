import type { Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";
import { toolsFor } from "@/lib/tools";

// -----------------------------------------------------------------------------
// The pages that ranked best in Search Console (oct-2026). The home page and the
// footer link them from every page, so the strongest URLs keep a steady stream
// of internal links. Internal paths; each locale shows only the ones it has
// (the Trujillo guide is es-only). Labels come from the content itself: the
// tool card's call to action and the post's short SEO title.
// -----------------------------------------------------------------------------

const FEATURED = [
  "herramientas/generador-curvas-de-nivel",
  "herramientas/coordenadas-utm-en-google-maps",
  "blog/inteligencia-artificial-autocad-civil-3d",
  "blog/membrete-planos-automatico-revit-autocad",
  "blog/coordenadas-utm-trujillo-la-libertad",
] as const;

export function featuredLinks(locale: Locale): { path: string; label: string }[] {
  const labels = new Map<string, string>([
    ...toolsFor(locale).map(({ slug, card }) => [`herramientas/${slug}`, card.cta] as [string, string]),
    ...getAllPosts(locale).map((p) => [`blog/${p.key}`, p.seoTitle ?? p.title] as [string, string]),
  ]);
  return FEATURED.flatMap((path) => {
    const label = labels.get(path);
    return label ? [{ path, label }] : [];
  });
}
