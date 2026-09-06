// -----------------------------------------------------------------------------
// Internationalization (i18n) — native Next.js App Router approach.
// All three locales are first-class for SEO: /es/, /pt/ and /en/ with
// reciprocal hreflang. No default-locale without prefix (equal indexing weight).
// -----------------------------------------------------------------------------

export const locales = ["es", "pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

// hreflang codes emitted in <link rel="alternate">. Kept generic ("es", "pt",
// "en") to cover all of LATAM + Iberia and the global English-speaking market.
// "x-default" points to the default locale.
export const hreflangByLocale: Record<Locale, string> = {
  es: "es",
  pt: "pt",
  en: "en",
};

// Human labels for the language switcher.
export const localeNames: Record<Locale, string> = {
  es: "Español",
  pt: "Português",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// -----------------------------------------------------------------------------
// Dictionary loader. Server-only JSON dictionaries keep translation payloads off
// the client bundle (they run only on the server in RSC).
// -----------------------------------------------------------------------------

import esDict from "@/dictionaries/es.json";

// The ES dictionary is the canonical shape; PT mirrors it structurally.
export type Dictionary = typeof esDict;

const dictionaries = {
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
  pt: () => import("@/dictionaries/pt.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
