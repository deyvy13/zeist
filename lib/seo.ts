import type { Metadata } from "next";
import { absoluteUrl, site, siteUrl } from "@/lib/site";
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
// Pass `path` WITHOUT the locale prefix (e.g. "servicios/paginas-web").
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
};

function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/$/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
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

  const ogLocale = locale === "pt" ? "pt_BR" : "es_ES";

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
      type: "website",
      siteName: site.name,
      title,
      description,
      url: canonical,
      locale: ogLocale,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: site.twitter,
      images: ogImage ? [ogImage] : undefined,
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
    url: siteUrl,
    // The email is hidden from the site for now (site.showEmail), so it is not
    // published here either — WhatsApp is the declared contact channel.
    telephone: `+${site.whatsapp.number}`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${site.whatsapp.number}`,
        availableLanguage: ["es", "pt"],
        areaServed: ["PE", "LATAM"],
      },
    ],
    description: site.description[locale],
    sameAs: [] as string[],
    slogan: site.slogan[locale],
    // Local signal: the team is based in Trujillo (La Libertad, Peru) and works
    // remotely across LATAM. No postal address is declared because there is no
    // public office — `areaServed` is the honest way to signal geography.
    areaServed: [
      { "@type": "Country", name: "Perú" },
      { "@type": "AdministrativeArea", name: "La Libertad" },
      { "@type": "City", name: "Trujillo" },
      { "@type": "Place", name: "Latinoamérica" },
    ],
    knowsLanguage: ["es", "pt"],
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

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl(localePath(locale).slice(1)),
    inLanguage: hreflangByLocale[locale],
  };
}
