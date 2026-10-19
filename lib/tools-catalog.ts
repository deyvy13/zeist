import type { Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// Copy of the tools hub (/herramientas). The hub lists only tools that exist:
// the old "Pronto" proposals were removed in oct-2026 (names without a page or
// content are thin content and link nowhere). The tools themselves come from
// lib/tools.ts. The H1 carries the search term, not a brand line.
// -----------------------------------------------------------------------------

export type ToolsHubCopy = {
  /** <title> (≤52 chars, keyword first) and meta description (≤155). */
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  availableEyebrow: string;
  availableTitle: string;
  free: string;
  bridgeTitle: string;
  bridgeBody: string;
  bridgeCta: string;
};

export const toolsHubCopy: Record<Locale, ToolsHubCopy> = {
  es: {
    seoTitle: "Herramientas gratis para ingeniería civil y BIM",
    metaDescription: "Herramientas gratis para ingenieros: coordenadas UTM en Google Maps, conversor de coordenadas, área de terreno, curvas de nivel, acero corrugado y Manning.",
    eyebrow: "Herramientas gratuitas",
    title: "Herramientas gratis para ingeniería civil y BIM",
    subtitle:
      "Curvas de nivel en DXF, coordenadas UTM en Google Maps, conversión de coordenadas, área de terreno con memoria descriptiva, peso del acero corrugado y Manning. En línea, sin registro y con exportación a Civil 3D, AutoCAD, Excel y Google Earth.",
    availableEyebrow: "Disponibles ahora",
    availableTitle: "Calculadoras gratuitas, listas para usar",
    free: "Gratis",
    bridgeTitle: "De la herramienta al plugin",
    bridgeBody:
      "Estas herramientas resuelven un caso puntual. Si tu equipo repite la tarea en cada proyecto, la automatizamos dentro de Civil 3D o Revit con un plugin a medida.",
    bridgeCta: "Ver plugins a medida",
  },
  pt: {
    seoTitle: "Ferramentas grátis para engenharia civil e BIM",
    metaDescription: "Ferramentas grátis para engenheiros: coordenadas UTM no Google Maps, conversor UTM, área de terreno com memorial descritivo, curvas de nível e Manning.",
    eyebrow: "Ferramentas gratuitas",
    title: "Ferramentas grátis para engenharia civil e BIM",
    subtitle:
      "Curvas de nível em DXF, coordenadas UTM no Google Maps, conversão de coordenadas, área de terreno com memorial descritivo e Manning. Online, sem cadastro e com exportação para Civil 3D, AutoCAD, Excel e Google Earth.",
    availableEyebrow: "Disponíveis agora",
    availableTitle: "Calculadoras gratuitas, prontas para usar",
    free: "Grátis",
    bridgeTitle: "Da ferramenta ao plugin",
    bridgeBody:
      "Estas ferramentas resolvem um caso pontual. Se a sua equipe repete a tarefa em todo projeto, nós a automatizamos dentro do Civil 3D ou do Revit com um plugin sob medida.",
    bridgeCta: "Ver plugins sob medida",
  },
  en: {
    seoTitle: "Free Civil Engineering and BIM Tools (Online)",
    metaDescription: "Free tools for engineers: UTM coordinates on Google Maps, UTM converter, land area with legal description, contour map generator and Manning calculator.",
    eyebrow: "Free tools",
    title: "Free civil engineering and BIM tools, online",
    subtitle:
      "Contour maps as DXF, UTM coordinates on Google Maps, UTM to lat long conversion, lot area with a metes and bounds description, and Manning's equation. Online, no sign-up, with exports to Civil 3D, AutoCAD, Excel and Google Earth.",
    availableEyebrow: "Available now",
    availableTitle: "Free calculators, ready to use",
    free: "Free",
    bridgeTitle: "From tool to plugin",
    bridgeBody:
      "These tools solve a one-off case. If your team repeats the task on every project, we automate it inside Civil 3D or Revit with a custom plugin.",
    bridgeCta: "See custom plugins",
  },
};
