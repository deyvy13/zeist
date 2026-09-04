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
  // Contact. The email is intentionally NOT rendered anywhere right now —
  // WhatsApp is the single published channel. The address stays here so
  // restoring it later is one flag flip, not an archaeology exercise.
  email: "hola@zeist.dev",
  showEmail: false,
  whatsapp: {
    /** Digits only, country code first. This is the format wa.me requires. */
    number: "51994764550",
    display: "+51 994 764 550",
  },
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

/**
 * WhatsApp deep link. `message` is prefilled in the chat box — always pass one:
 * a conversation that starts with context converts far better than an empty
 * "Hola". wa.me works on both mobile app and WhatsApp Web.
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
