import { locales, type Locale } from "@/lib/i18n";
import { TOOL_PATHS } from "@/lib/routes";

// -----------------------------------------------------------------------------
// Released tools in /herramientas. Single source for the hub, the sitemap, the
// language switcher and /llms.txt. The hub's own copy lives in
// lib/tools-catalog.ts. Client-safe: plain data, no fs.
// -----------------------------------------------------------------------------

export const TOOL_SLUGS = [
  "coordenadas-utm-en-google-maps",
  "conversor-de-coordenadas",
  "calculadora-area-terreno",
  "generador-curvas-de-nivel",
  "calculadora-acero-corrugado",
  "calculadora-manning",
  "excel-a-puntos-civil-3d",
  "diagnostico-modelo-revit",
  "calculadora-costo-reprocesos",
] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

/**
 * Locales where each tool is published: the locales that have a URL for it in
 * TOOL_PATHS (lib/routes.ts). The steel calculator uses Peruvian bar sizes and
 * 9 m stock bars, so it ships in `es` only — pt/en would need their own tables
 * (Brazil: CA-50 in mm, 12 m bars; US: bar sizes #3-#11).
 */
export const toolLocales = {} as Record<ToolSlug, readonly Locale[]>;
for (const slug of TOOL_SLUGS) toolLocales[slug] = locales.filter((l) => TOOL_PATHS[slug][l]);

/**
 * Last real change of each tool page (calculator or its copy), ISO date. The
 * sitemap's lastmod: bump it when the tool or its text changes, never on a
 * plain redeploy (Google stops trusting a lastmod that always moves).
 */
export const toolUpdated: Record<ToolSlug, string> = {
  "coordenadas-utm-en-google-maps": "2026-10-16",
  "conversor-de-coordenadas": "2026-10-23",
  "calculadora-area-terreno": "2026-10-16",
  "generador-curvas-de-nivel": "2026-10-19",
  "calculadora-acero-corrugado": "2026-10-01",
  "calculadora-manning": "2026-10-23",
  "excel-a-puntos-civil-3d": "2026-10-31",
  "diagnostico-modelo-revit": "2026-10-31",
  "calculadora-costo-reprocesos": "2026-10-31",
};

/** `cta` is the link text on cards: what the tool does, in the words people search for. */
export type ToolCard = { title: string; body: string; tags: string[]; cta: string };

export const toolCards: Record<ToolSlug, Partial<Record<Locale, ToolCard>>> = {
  "coordenadas-utm-en-google-maps": {
    es: {
      title: "Coordenadas UTM en Google Maps",
      body: "Pega el cuadro de coordenadas de tu plano y mira dónde queda. Corrige PSAD56, revisa el cuadro y abre la ubicación en Google Maps para llegar.",
      tags: ["Google Maps", "PSAD56 → WGS84", "Planos"],
      cta: "Ubicar mi plano en Google Maps",
    },
    pt: {
      title: "Coordenadas UTM no Google Maps",
      body: "Cole o quadro de coordenadas da planta e veja onde fica o terreno. Corrige SAD69 e PSAD56, confere o quadro e abre no Google Maps.",
      tags: ["Google Maps", "SAD69 → SIRGAS", "Plantas"],
      cta: "Localizar minha planta no Google Maps",
    },
    en: {
      title: "UTM coordinates on Google Maps",
      body: "Paste a site plan coordinate table and see where it is. Fixes legacy datums, checks the table and opens the location in Google Maps.",
      tags: ["Google Maps", "Site plans", "Datum shift"],
      cta: "Find my site plan on Google Maps",
    },
  },
  "conversor-de-coordenadas": {
    es: {
      title: "Conversor de coordenadas",
      body: "UTM ⇄ geográficas y PSAD56 → WGS84, de un punto o cientos pegados desde Excel. Mapa de verificación y descarga para Civil 3D, Excel y Google Earth.",
      tags: ["Topografía", "PSAD56 → WGS84", "Civil 3D"],
      cta: "Convertir coordenadas UTM a geográficas",
    },
    pt: {
      title: "Conversor de coordenadas",
      body: "UTM ⇄ geográficas e SAD69 → SIRGAS 2000, de um ponto ou centenas coladas do Excel. Mapa de verificação e exportação para Civil 3D, Excel e Google Earth.",
      tags: ["Topografia", "SAD69 → SIRGAS", "Civil 3D"],
      cta: "Converter coordenadas UTM em geográficas",
    },
    en: {
      title: "UTM to lat long converter",
      body: "Convert one point or hundreds pasted from Excel, check them on a map and export to Civil 3D, Excel or Google Earth, with the scale factor per point.",
      tags: ["Surveying", "Batch", "Civil 3D"],
      cta: "Convert UTM to lat long",
    },
  },
  "calculadora-area-terreno": {
    es: {
      title: "Calculadora de área de terreno",
      body: "Área y perímetro por coordenadas o por medidas, cuadro de datos técnicos, memoria descriptiva en Word y plano perimétrico en DXF.",
      tags: ["Plano perimétrico", "Memoria descriptiva", "DXF"],
      cta: "Calcular el área de mi terreno",
    },
    pt: {
      title: "Calculadora de área de terreno",
      body: "Área e perímetro por coordenadas ou medidas, quadro de coordenadas com azimutes, memorial descritivo em Word e planta em DXF.",
      tags: ["Memorial descritivo", "Azimutes", "DXF"],
      cta: "Calcular a área do terreno",
    },
    en: {
      title: "Area from coordinates calculator",
      body: "Lot area and perimeter from coordinates or measured sides, bearings and distances, a metes and bounds description in Word and a DXF plat.",
      tags: ["Metes and bounds", "Lot area", "DXF"],
      cta: "Calculate lot area from coordinates",
    },
  },
  "generador-curvas-de-nivel": {
    es: {
      title: "Generador de curvas de nivel",
      body: "Elige un área en el mapa y descarga sus curvas de nivel en DXF para AutoCAD y Civil 3D, con puntos para crear la superficie. Para anteproyectos.",
      tags: ["Curvas de nivel", "Civil 3D", "DXF"],
      cta: "Generar curvas de nivel gratis",
    },
    pt: {
      title: "Gerador de curvas de nível",
      body: "Escolha uma área no mapa e baixe as curvas de nível em DXF para AutoCAD e Civil 3D, com pontos para criar a superfície. Para estudos preliminares.",
      tags: ["Curvas de nível", "Civil 3D", "DXF"],
      cta: "Gerar curvas de nível grátis",
    },
    en: {
      title: "Contour map generator",
      body: "Pick an area on the map and download its contour lines as DXF for AutoCAD and Civil 3D, plus points to build the surface. For preliminary studies.",
      tags: ["Contour lines", "Civil 3D", "DXF"],
      cta: "Generate a free contour map",
    },
  },
  "calculadora-acero-corrugado": {
    es: {
      title: "Calculadora de acero corrugado",
      body: "Peso por diámetro, kilos totales y cuántas varillas de 9 m comprar, con plan de cortes. Exporta el metrado a Excel.",
      tags: ["Metrado de acero", "Plan de cortes", "Excel"],
      cta: "Calcular el peso del acero corrugado",
    },
  },
  "calculadora-manning": {
    es: {
      title: "Calculadora de Manning",
      body: "Caudal, velocidad y tirante normal en tuberías parcialmente llenas y canales abiertos, con número de Froude y tensión tractiva.",
      tags: ["Alcantarillado", "Drenaje", "Canales"],
      cta: "Calcular caudal y tirante con Manning",
    },
    pt: {
      title: "Calculadora de Manning",
      body: "Vazão, velocidade e lâmina normal em tubulações parcialmente cheias e canais abertos, com número de Froude e tensão trativa.",
      tags: ["Esgoto", "Drenagem", "Canais"],
      cta: "Calcular vazão e lâmina com Manning",
    },
    en: {
      title: "Manning's equation calculator",
      body: "Flow, velocity and normal depth in partially full pipes and open channels, with Froude number and boundary shear.",
      tags: ["Sewers", "Storm drainage", "Open channels"],
      cta: "Calculate flow with Manning's equation",
    },
  },
  "excel-a-puntos-civil-3d": {
    es: {
      title: "Excel a puntos de Civil 3D",
      body: "Pega tu tabla de Excel en cualquier orden y descarga el archivo PNEZD que Civil 3D importa a la primera: sin encabezado, con números enteros y la coma decimal corregida.",
      tags: ["Civil 3D", "PNEZD", "Excel"],
      cta: "Importar puntos de Excel a Civil 3D",
    },
    pt: {
      title: "Excel para pontos do Civil 3D",
      body: "Cole sua tabela do Excel em qualquer ordem e baixe o arquivo PNEZD que o Civil 3D importa de primeira: sem cabeçalho, com números inteiros e a vírgula decimal corrigida.",
      tags: ["Civil 3D", "PNEZD", "Excel"],
      cta: "Importar pontos do Excel para o Civil 3D",
    },
    en: {
      title: "Excel to Civil 3D points",
      body: "Paste your Excel table in any column order and download the PNEZD file Civil 3D imports on the first try: no header row, whole point numbers, decimal commas fixed.",
      tags: ["Civil 3D", "PNEZD", "Excel"],
      cta: "Import points from Excel to Civil 3D",
    },
  },
  "diagnostico-modelo-revit": {
    es: {
      title: "Diagnóstico de modelo Revit",
      body: "Carga el reporte de advertencias de Revit y anota el peso, los CAD importados y las familias in situ: puntuación de 0 a 100 y qué corregir primero.",
      tags: ["Revit", "Advertencias", "Auditoría"],
      cta: "Diagnosticar mi modelo de Revit",
    },
    pt: {
      title: "Diagnóstico de modelo Revit",
      body: "Carregue o relatório de advertências do Revit e anote o peso, os CAD importados e as famílias no local: pontuação de 0 a 100 e o que corrigir primeiro.",
      tags: ["Revit", "Advertências", "Auditoria"],
      cta: "Diagnosticar meu modelo do Revit",
    },
    en: {
      title: "Revit model health check",
      body: "Load the Revit warnings report and enter file size, imported CAD and in-place families: a 0-100 score and what to fix first.",
      tags: ["Revit", "Warnings", "Audit"],
      cta: "Check my Revit model's health",
    },
  },
  "calculadora-costo-reprocesos": {
    es: {
      title: "Calculadora del costo de los reprocesos",
      body: "Las horas que tu equipo dedica a rehacer entregables, en dinero al año, y lo que los estudios publicados atribuyen al reproceso sobre el valor de una obra.",
      tags: ["Reprocesos", "Costos", "Gestión"],
      cta: "Calcular el costo de los reprocesos",
    },
    pt: {
      title: "Calculadora do custo do retrabalho",
      body: "As horas que a sua equipe gasta refazendo entregas, em dinheiro por ano, e o que os estudos publicados atribuem ao retrabalho sobre o valor de uma obra.",
      tags: ["Retrabalho", "Custos", "Gestão"],
      cta: "Calcular o custo do retrabalho",
    },
    en: {
      title: "Construction rework cost calculator",
      body: "The hours your team spends redoing deliverables, in money per year, and what published studies attribute to rework as a share of project value.",
      tags: ["Rework", "Costs", "Project management"],
      cta: "Calculate the cost of rework",
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
