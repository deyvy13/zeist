import type { Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// Single source of truth for brand + SEO defaults.
// Change the production URL via NEXT_PUBLIC_SITE_URL (no trailing slash).
// -----------------------------------------------------------------------------

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeist.vercel.app"
).replace(/\/$/, "");

export const site = {
  name: "Zeist",
  // Brand-first name (like Nike/Adidas). The niche lives in the slogan, not the name.
  legalName: "Zeist",
  email: "hola@zeist.dev",
  twitter: "@zeist", // update when the handle exists
  themeColor: "#00FFCE",
  // Localized one-liners used for <title> templates and OG defaults.
  // Keyword-led: "add-in" + "Civil 3D" + "Revit" are the target search terms.
  slogan: {
    es: "Add-ins y automatización BIM para Civil 3D y Revit",
    pt: "Add-ins e automação BIM para Civil 3D e Revit",
  },
  description: {
    es: "Desarrollamos add-ins en C# para Civil 3D y Revit, y scripts Dynamo que eliminan las tareas repetitivas de tu equipo BIM. Equipo de ingenieros civiles e ingenieros de sistemas.",
    pt: "Desenvolvemos add-ins em C# para Civil 3D e Revit, e scripts Dynamo que eliminam as tarefas repetitivas da sua equipe BIM. Equipe de engenheiros civis e engenheiros de sistemas.",
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
