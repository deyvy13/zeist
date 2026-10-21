import type { Metadata } from "next";
import { absoluteUrl, site, siteUrl } from "@/lib/site";
import { publicPath } from "@/lib/routes";
import {
  defaultLocale,
  hreflangByLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

// -----------------------------------------------------------------------------
// buildMetadata: one place to produce SEO-correct <head> for every page.
//  - canonical points to the current locale URL
//  - alternates.languages emits reciprocal hreflang for every locale + x-default
//  - Open Graph + Twitter cards filled from the same inputs
// Pass the internal `path`, WITHOUT the locale prefix ("servicios/<id>",
// "blog/<translationKey>"): each locale gets its own public URL (lib/routes.ts).
// -----------------------------------------------------------------------------

type BuildMetadataArgs = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  /** Overrides the auto OG image (defaults to the dynamic /opengraph-image). */
  ogImage?: string;
  /** Set true on pages that should not be indexed (e.g. thank-you, drafts). */
  noindex?: boolean;
  keywords?: string[];
  /**
   * Locales where this exact page exists. Defaults to every locale (correct for
   * static routes, which are always translated). Blog posts pass the real list:
   * locale-specific content (e.g. Peru regulation) only exists in `es`, and
   * emitting an hreflang to a `pt` URL that 404s is an SEO error.
   */
  availableLocales?: readonly Locale[];
  /** Blog posts: emits og:type=article with its dates, author page and tags. */
  article?: { publishedTime: string; modifiedTime?: string; tags?: string[] };
};

function localePath(locale: Locale, path = ""): string {
  return publicPath(locale, path);
}

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage,
  noindex,
  keywords,
  availableLocales = locales,
  article,
}: BuildMetadataArgs): Metadata {
  const canonical = absoluteUrl(localePath(locale, path).slice(1));

  // Reciprocal hreflang map, restricted to locales where the page really
  // exists. A single-locale page gets no alternates at all — only x-default,
  // pointing at itself.
  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[hreflangByLocale[l]] = absoluteUrl(localePath(l, path).slice(1));
  }
  // x-default falls back to the default locale when translated, otherwise to
  // whichever locale actually has the page.
  const defaultFor = availableLocales.includes(defaultLocale)
    ? defaultLocale
    : (availableLocales[0] ?? locale);
  languages["x-default"] = absoluteUrl(localePath(defaultFor, path).slice(1));

  const ogLocaleByLocale: Record<Locale, string> = {
    es: "es_ES",
    pt: "pt_BR",
    en: "en_US",
  };
  const ogLocale = ogLocaleByLocale[locale];

  // Every page needs a preview image for WhatsApp/LinkedIn link cards.
  // app/opengraph-image.tsx sits above the [lang] root layout, so Next never
  // attaches it on its own — it has to be referenced explicitly.
  const image = ogImage ?? absoluteUrl("opengraph-image");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
    openGraph: {
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
            authors: [absoluteUrl(localePath(locale, "nosotros").slice(1))],
            tags: article.tags,
          }
        : { type: "website" as const }),
      siteName: site.name,
      title,
      description,
      url: canonical,
      locale: ogLocale,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: site.twitter,
      images: [{ url: image, alt: title }],
    },
  };
}

// -----------------------------------------------------------------------------
// JSON-LD structured data. Injected via <script type="application/ld+json">.
// -----------------------------------------------------------------------------

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icon-512.png`,
    // Same channels the site shows: WhatsApp always, the email while
    // site.showEmail is on.
    telephone: `+${site.whatsapp.number}`,
    ...(site.showEmail ? { email: site.email } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${site.whatsapp.number}`,
        ...(site.showEmail ? { email: site.email } : {}),
        availableLanguage: ["es", "pt", "en"],
        areaServed: areaServedJsonLd(locale).map((p) => p.name),
      },
    ],
    description: site.description[locale],
    sameAs: [site.linkedin],
    slogan: site.slogan[locale],
    // Zeist works remotely; there is no office, so no address is declared and
    // `areaServed` is the honest way to signal geography.
    areaServed: areaServedJsonLd(locale),
    knowsLanguage: ["es", "pt", "en"],
    knowsAbout: [
      "Automatización BIM",
      "Autodesk Civil 3D",
      "Autodesk Revit",
      "Dynamo",
      "Desarrollo de add-ins en C#",
      "Plan BIM Perú",
    ],
  };
}

/**
 * Where Zeist works, always remotely: all of Latin America plus English- and
 * Portuguese-speaking countries. Zeist is not based in Peru or in Trujillo
 * (user, 21-oct-2026): never declare a city, region or office here.
 */
export function areaServedJsonLd(locale: Locale) {
  const names: Record<Locale, string[]> = {
    es: ["Latinoamérica", "Países de habla inglesa", "Países de habla portuguesa"],
    pt: ["América Latina", "Países de língua inglesa", "Países de língua portuguesa"],
    en: ["Latin America", "English-speaking countries", "Portuguese-speaking countries"],
  };
  return names[locale].map((name) => ({ "@type": "Place", name }));
}

/**
 * Zeist as the author of the guides: an Organization tied to its about page and
 * its LinkedIn profile, so the byline points at something verifiable.
 */
export function authorJsonLd(locale: Locale) {
  return {
    "@type": "Organization",
    name: site.name,
    url: absoluteUrl(localePath(locale, "nosotros").slice(1)),
    sameAs: [site.linkedin],
    description: site.description[locale],
  };
}

/** BreadcrumbList from [name, path-without-locale] pairs; the home is added first. */
export function breadcrumbJsonLd(locale: Locale, items: [string, string][]) {
  const all: [string, string][] = [[site.name, ""], ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(localePath(locale, path).slice(1)),
    })),
  };
}

/** A listing page (blog, services, tools) with the items it links to. */
export function collectionJsonLd(
  locale: Locale,
  path: string,
  name: string,
  description: string,
  items: { name: string; path: string; type?: string; description?: string }[],
  pageType = "CollectionPage",
) {
  const url = absoluteUrl(localePath(locale, path).slice(1));
  return {
    "@context": "https://schema.org",
    "@type": pageType,
    name,
    description,
    url,
    inLanguage: hreflangByLocale[locale],
    isPartOf: { "@type": "WebSite", name: site.name, url: `${siteUrl}/` },
    publisher: { "@type": "Organization", name: site.name, url: `${siteUrl}/`, sameAs: [site.linkedin] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(localePath(locale, it.path).slice(1)),
        name: it.name,
        ...(it.type
          ? {
              item: {
                "@type": it.type,
                name: it.name,
                url: absoluteUrl(localePath(locale, it.path).slice(1)),
                ...(it.description ? { description: it.description } : {}),
              },
            }
          : {}),
      })),
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    // Google derives the "site name" shown above each result from WebSite
    // data tied to the ROOT url, not a locale home. Pointing this at /es left
    // the subdomain unnamed, so Google fell back to the parent domain
    // (vercel.app → "Vercel"). Keep `url` on the root, identical in every locale.
    name: site.name,
    alternateName: ["Zeist BIM", "Zeist — Automatización BIM"],
    url: `${siteUrl}/`,
    inLanguage: hreflangByLocale[locale],
    publisher: { "@type": "Organization", name: site.name, url: `${siteUrl}/` },
  };
}
