import type { Locale } from "./i18n";
import type { ToolSlug } from "./tools";
import type { ServiceSlug } from "./services";
import { postRoutes } from "./post-locales.generated";

// -----------------------------------------------------------------------------
// Public URLs per language (oct-2026). Every page has its URL in its own
// language: /en/tools/utm-converter, /pt/ferramentas/conversor-de-coordenadas,
// /es/herramientas/conversor-de-coordenadas. The app folders keep the Spanish
// names (the "internal path"); proxy.ts rewrites each public URL to its folder
// and redirects (308) every old URL to the new one.
//
// The internal path is what code passes around: "herramientas/<tool>",
// "servicios/<service>", "blog/<translationKey>". publicPath() turns it into the
// URL of a locale, and internalPath() turns any URL (old or new, internal or
// public) back into it. Both give the same answer whichever form comes in, so
// a client component that reads the pathname renders the same links on the
// server (which sees the internal path after a rewrite) and in the browser.
//
// Client-safe: no filesystem, only data. Posts come from the generated map.
// -----------------------------------------------------------------------------

const LOCALES = ["es", "pt", "en"] as const satisfies readonly Locale[];

export type Section = "servicios" | "blog" | "herramientas" | "contacto" | "nosotros" | "privacidad";

/** Public name of each section per locale. */
export const SECTION_PATHS: Record<Locale, Record<Section, string>> = {
  es: { servicios: "servicios", blog: "blog", herramientas: "herramientas", contacto: "contacto", nosotros: "nosotros", privacidad: "privacidad" },
  pt: { servicios: "servicos", blog: "blog", herramientas: "ferramentas", contacto: "contato", nosotros: "sobre", privacidad: "privacidade" },
  en: { servicios: "services", blog: "blog", herramientas: "tools", contacto: "contact", nosotros: "about", privacidad: "privacy" },
};

/**
 * Public slug of each tool in every locale that publishes it. The locales
 * listed here are the tool's locales: lib/tools.ts reads them from this map.
 */
export const TOOL_PATHS: Record<ToolSlug, Partial<Record<Locale, string>>> = {
  "coordenadas-utm-en-google-maps": { es: "coordenadas-utm-en-google-maps", pt: "coordenadas-utm-no-google-maps", en: "utm-coordinates-google-maps" },
  "conversor-de-coordenadas": { es: "conversor-de-coordenadas", pt: "conversor-de-coordenadas", en: "utm-converter" },
  "calculadora-area-terreno": { es: "calculadora-area-terreno", pt: "calculadora-de-area-de-terreno", en: "area-from-coordinates-calculator" },
  "generador-curvas-de-nivel": { es: "generador-curvas-de-nivel", pt: "gerador-curvas-de-nivel", en: "contour-map-generator" },
  "calculadora-acero-corrugado": { es: "calculadora-acero-corrugado" },
  "calculadora-manning": { es: "calculadora-manning", pt: "calculadora-manning", en: "manning-calculator" },
};

/** Public slug of each service per locale. */
export const SERVICE_PATHS: Record<ServiceSlug, Record<Locale, string>> = {
  "add-ins-revit-civil-3d": { es: "add-ins-revit-civil-3d", pt: "plugins-revit-civil-3d", en: "revit-civil-3d-plugin-development" },
  "automatizacion-dynamo": { es: "automatizacion-dynamo", pt: "scripts-dynamo", en: "dynamo-scripts" },
  "auditoria-procesos-bim": { es: "auditoria-procesos-bim", pt: "auditoria-bim", en: "bim-audit" },
  "cursos-mentorias-bim": { es: "cursos-mentorias-bim", pt: "cursos-revit-api-dynamo", en: "revit-api-dynamo-training" },
};

const SECTIONS = Object.keys(SECTION_PATHS.es) as Section[];

// Any form of a section name (internal or any locale's) -> section.
const sectionByName = new Map<string, Section>();
for (const s of SECTIONS) {
  sectionByName.set(s, s);
  for (const l of LOCALES) sectionByName.set(SECTION_PATHS[l][s], s);
}

// Any form of a slug -> its internal id, per section.
function slugIndex(map: Record<string, Partial<Record<Locale, string>>>): Map<string, string> {
  const index = new Map<string, string>();
  for (const [id, byLocale] of Object.entries(map)) {
    index.set(id, id);
    for (const slug of Object.values(byLocale)) if (slug && !index.has(slug)) index.set(slug, id);
  }
  return index;
}
const toolIndex = slugIndex(TOOL_PATHS);
const serviceIndex = slugIndex(SERVICE_PATHS);
const postIndex = slugIndex(postRoutes);

const slugMaps: Partial<Record<Section, { index: Map<string, string>; paths: Record<string, Partial<Record<Locale, string>>> }>> = {
  herramientas: { index: toolIndex, paths: TOOL_PATHS },
  servicios: { index: serviceIndex, paths: SERVICE_PATHS },
  blog: { index: postIndex, paths: postRoutes },
};

function split(path: string): { segments: string[]; suffix: string } {
  const m = /^([^?#]*)(.*)$/.exec(path.replace(/^\/+/, ""))!;
  return { segments: m[1].split("/").filter(Boolean), suffix: m[2] };
}

/**
 * Internal path of any path without its locale: "tools/utm-converter" and
 * "herramientas/conversor-de-coordenadas" both give
 * "herramientas/conversor-de-coordenadas"; a post gives "blog/<translationKey>".
 */
function toInternal(segments: string[]): string {
  if (segments.length === 0) return "";
  const section = sectionByName.get(segments[0]);
  if (!section) return segments.join("/");
  const rest = segments.slice(1);
  if (rest.length === 0) return section;
  const id = slugMaps[section]?.index.get(rest[0]) ?? rest[0];
  return [section, id, ...rest.slice(1)].join("/");
}

/**
 * URL path of a page in a locale ("/en/tools/utm-converter"). Takes the
 * internal path ("herramientas/conversor-de-coordenadas", "blog/<key>") or any
 * public form, keeps "#hash" and "?query".
 */
export function publicPath(locale: Locale, path = ""): string {
  const { segments, suffix } = split(path);
  const internal = toInternal(segments);
  if (!internal) return `/${locale}${suffix}`;
  const [section, id, ...rest] = internal.split("/");
  const known = sectionByName.get(section) === section ? (section as Section) : null;
  if (!known) return `/${locale}/${internal}${suffix}`;
  const out = [SECTION_PATHS[locale][known]];
  if (id) out.push(slugMaps[known]?.paths[id]?.[locale] ?? id, ...rest);
  return `/${locale}/${out.join("/")}${suffix}`;
}

/** Locale and internal path of any URL path, old or new ("/en/tools/x" or "/en/herramientas/y"). */
export function internalPath(pathname: string): { locale: Locale | null; path: string } {
  const { segments } = split(pathname);
  const first = segments[0] as Locale | undefined;
  const locale = first && (LOCALES as readonly string[]).includes(first) ? first : null;
  return { locale, path: toInternal(locale ? segments.slice(1) : segments) };
}

/** Locales that publish an internal path (posts and tools are not in every locale). */
export function localesOf(path: string): readonly Locale[] {
  const [section, id] = path.split("/");
  if (!id) return LOCALES;
  const map = slugMaps[section as Section];
  if (!map) return LOCALES;
  const byLocale = map.paths[id];
  return byLocale ? LOCALES.filter((l) => byLocale[l]) : [];
}

/**
 * A site link in its public form: "/en/herramientas/conversor-de-coordenadas#x"
 * becomes "/en/tools/utm-converter#x". Anything else (external, mailto, a path
 * without locale) is returned as it is. Links in content should already be
 * public; this keeps an old-style link from costing the reader a redirect.
 */
export function normalizeHref(href: string): string {
  if (!href.startsWith("/")) return href;
  const m = /^([^?#]*)(.*)$/.exec(href)!;
  const { locale, path } = internalPath(m[1]);
  return locale ? publicPath(locale, `${path}${m[2]}`) : href;
}

/** Every locale's public URL path of an internal path, for hreflang and the sitemap. */
export function alternatePaths(path: string): Partial<Record<Locale, string>> {
  return Object.fromEntries(localesOf(path).map((l) => [l, publicPath(l, path)]));
}

/**
 * App route of a page, what proxy.ts rewrites the public URL to: the Spanish
 * folder and id ("/en/herramientas/conversor-de-coordenadas"), except posts,
 * whose MDX file is named after their own slug ("/en/blog/slow-revit-model").
 */
export function appPath(locale: Locale, path: string): string {
  if (path.split("/")[0] === "blog") return publicPath(locale, path);
  return `/${locale}${path ? `/${path}` : ""}`;
}

/**
 * What proxy.ts does with a locale-prefixed URL: send an old or misspelled URL
 * to the page's public URL (308), serve a public URL from its app route
 * (rewrite), or leave it alone (a page whose URL is its folder, or a 404).
 */
export function resolveRoute(pathname: string): { redirect: string } | { rewrite: string } | null {
  const { locale, path } = internalPath(pathname);
  if (!locale || !localesOf(path).includes(locale)) return null;
  const target = publicPath(locale, path);
  if (pathname !== target) return { redirect: target };
  const app = appPath(locale, path);
  return app !== target ? { rewrite: app } : null;
}
