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
    es: "Tecnología e ingeniería con IA",
    pt: "Tecnologia e engenharia com IA",
  },
  description: {
    es: "Soluciones tecnológicas para cada industria: software, automatización, diseño e ingeniería. IA y metodología ágil para resultados más rápidos y accesibles.",
    pt: "Soluções tecnológicas para cada indústria: software, automação, design e engenharia. IA e metodologia ágil para resultados mais rápidos e acessíveis.",
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
