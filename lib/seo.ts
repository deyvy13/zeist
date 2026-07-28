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
}: BuildMetadataArgs): Metadata {
  const canonical = absoluteUrl(localePath(locale, path).slice(1));

  // Reciprocal hreflang map for all locales + x-default.
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangByLocale[l]] = absoluteUrl(localePath(l, path).slice(1));
  }
  languages["x-default"] = absoluteUrl(
    localePath(defaultLocale, path).slice(1),
  );

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
    email: site.email,
    description: site.description[locale],
    sameAs: [] as string[],
    slogan: site.slogan[locale],
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
