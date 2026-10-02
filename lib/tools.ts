import type { Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// Released tools in /herramientas. Single source for the hub, the sitemap, the
// language switcher and /llms.txt. (Proposals still marked "Pronto" live in
// lib/tools-catalog.ts.) Client-safe: plain data, no fs.
// -----------------------------------------------------------------------------

export const TOOL_SLUGS = ["conversor-de-coordenadas", "calculadora-acero-corrugado", "calculadora-manning"] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

/**
 * Locales where each tool is published. The steel calculator uses Peruvian bar
 * sizes and 9 m stock bars, so it ships in `es` only — pt/en would need their
 * own tables (Brazil: CA-50 in mm, 12 m bars; US: bar sizes #3-#11).
 */
export const toolLocales: Record<ToolSlug, readonly Locale[]> = {
  "conversor-de-coordenadas": ["es", "pt", "en"],
  "calculadora-acero-corrugado": ["es"],
  "calculadora-manning": ["es", "pt", "en"],
};

export type ToolCard = { title: string; body: string; tags: string[] };

export const toolCards: Record<ToolSlug, Partial<Record<Locale, ToolCard>>> = {
  "conversor-de-coordenadas": {
    es: {
      title: "Conversor de coordenadas",
      body: "UTM ⇄ geográficas y PSAD56 → WGS84, de un punto o cientos pegados desde Excel. Mapa de verificación y descarga para Civil 3D, Excel y Google Earth.",
      tags: ["Topografía", "PSAD56 → WGS84", "Civil 3D"],
    },
    pt: {
      title: "Conversor de coordenadas",
      body: "UTM ⇄ geográficas e SAD69 → SIRGAS 2000, de um ponto ou centenas coladas do Excel. Mapa de verificação e exportação para Civil 3D, Excel e Google Earth.",
      tags: ["Topografia", "SAD69 → SIRGAS", "Civil 3D"],
    },
    en: {
      title: "UTM to lat long converter",
      body: "Convert one point or hundreds pasted from Excel, check them on a map and export to Civil 3D, Excel or Google Earth, with the scale factor per point.",
      tags: ["Surveying", "Batch", "Civil 3D"],
    },
  },
  "calculadora-acero-corrugado": {
    es: {
      title: "Calculadora de acero corrugado",
      body: "Peso por diámetro, kilos totales y cuántas varillas de 9 m comprar, con plan de cortes. Exporta el metrado a Excel.",
      tags: ["Metrado de acero", "Plan de cortes", "Excel"],
    },
  },
  "calculadora-manning": {
    es: {
      title: "Calculadora de Manning",
      body: "Caudal, velocidad y tirante normal en tuberías parcialmente llenas y canales abiertos, con número de Froude y tensión tractiva.",
      tags: ["Alcantarillado", "Drenaje", "Canales"],
    },
    pt: {
      title: "Calculadora de Manning",
      body: "Vazão, velocidade e lâmina normal em tubulações parcialmente cheias e canais abertos, com número de Froude e tensão trativa.",
      tags: ["Esgoto", "Drenagem", "Canais"],
    },
    en: {
      title: "Manning's equation calculator",
      body: "Flow, velocity and normal depth in partially full pipes and open channels, with Froude number and boundary shear.",
      tags: ["Sewers", "Storm drainage", "Open channels"],
    },
  },
};

export function isToolSlug(value: string): value is ToolSlug {
  return (TOOL_SLUGS as readonly string[]).includes(value);
}

export function toolAvailable(slug: ToolSlug, locale: Locale): boolean {
  return toolLocales[slug].includes(locale);
}

export function toolsFor(locale: Locale): { slug: ToolSlug; card: ToolCard }[] {
  return TOOL_SLUGS.flatMap((slug) => {
    const card = toolCards[slug][locale];
    return card && toolAvailable(slug, locale) ? [{ slug, card }] : [];
  });
}
