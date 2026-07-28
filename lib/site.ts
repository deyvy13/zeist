import type { Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// Single source of truth for brand + SEO defaults.
// Change the production URL via NEXT_PUBLIC_SITE_URL (no trailing slash).
// -----------------------------------------------------------------------------

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeist.dev"
).replace(/\/$/, "");

export const site = {
  name: "Zeist",
  // Brand tagline is intentionally product-agnostic (brand-first, like Nike/Adidas).
  legalName: "Zeist",
  email: "hola@zeist.dev",
  twitter: "@zeist", // update when the handle exists
  themeColor: "#00FFCE",
  // Localized one-liners used for <title> templates and OG defaults.
  slogan: {
    es: "Software e ingeniería de sistemas con IA",
    pt: "Software e engenharia de sistemas com IA",
  },
  description: {
    es: "Creamos páginas web, apps móviles y sistemas para empresas usando IA y metodología ágil. Más rápido, más accesible, sin rodeos.",
    pt: "Criamos sites, apps móveis e sistemas para empresas usando IA e metodologia ágil. Mais rápido, mais acessível, sem rodeios.",
  },
} as const;

export function localizedPath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export function absoluteUrl(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${siteUrl}/${clean}` : siteUrl;
}
