// -----------------------------------------------------------------------------
// SEO topic clusters — single source of truth.
//
// The blog is a pillar/satellite hierarchy. This map drives:
//  - "Related posts" at the end of every article (pillar first, then its
//    satellites), so authority flows to pillars instead of to whatever was
//    published last.
//  - Sitemap priority for pillars (app/sitemap.ts).
// A post may belong to more than one cluster. Keep in sync with CLAUDE.md §8.
// -----------------------------------------------------------------------------

export type Cluster = { id: string; pillar: string; satellites: string[] };

export const clusters: Cluster[] = [
  {
    id: "C1",
    pillar: "desarrollo-add-ins-revit-civil-3d-guia-completa",
    satellites: [
      "crear-plugin-civil-3d-con-claude-code-sin-programar",
      "dynamo-vs-csharp-civil3d-revit",
      "cuanto-cuesta-un-add-in-revit-civil-3d",
      "revit-api-espanol-primeros-pasos",
      "comparar-modelos-revit-civil-3d-detectar-cambios",
      "plugin-acero-revit-modelado-revision",
      "revit-lento-modelo-pesado-auditoria",
      "exportar-tablas-revit-excel-editar-parametros",
      "produccion-planos-automatica-civil-3d-revit",
      "automatizar-tareas-revit-dynamo-plugins",
      "auditoria-bim-checklist-empresa",
    ],
  },
  {
    id: "C2",
    pillar: "automatizar-civil-3d-guia-completa",
    satellites: [
      "deja-de-usar-excel-y-perder-horas",
      "automatizar-metrados-cubicaciones-civil-3d",
      "produccion-planos-automatica-civil-3d-revit",
      "dynamo-civil-3d-scripts",
      "curvas-de-nivel-civil-3d-google-earth",
    ],
  },
  {
    id: "C3",
    pillar: "dynamo-csharp-con-ia-claude",
    satellites: [
      "guia-vibe-coding-para-empezar",
      "crear-plugin-civil-3d-con-claude-code-sin-programar",
      "inteligencia-artificial-autocad-civil-3d",
    ],
  },
  {
    id: "C4",
    pillar: "programacion-para-ingenieros-civiles",
    satellites: ["aprende-a-programar-desde-cero", "ramas-ingenieria-sistemas-especializaciones"],
  },
  {
    id: "C5",
    pillar: "plan-bim-peru-obligatorio-guia-empresas",
    satellites: [
      "expediente-tecnico-observaciones-reducir",
      "automatizacion-bim-trujillo-la-libertad",
      "reprocesos-obra-costo-oculto",
      "estandarizar-procesos-bim-empresa",
      "auditoria-bim-checklist-empresa",
    ],
  },
  {
    id: "C6",
    pillar: "plugin-civil-3d-dibujo-3d-automatizado",
    satellites: ["redes-tuberias-civil-3d-accesorios", "banco-de-ductos-civil-3d"],
  },
];

export const pillarSlugs = new Set(clusters.map((c) => c.pillar));

/** Clusters a slug belongs to, as pillar or satellite. */
export function clustersOf(slug: string): Cluster[] {
  return clusters.filter((c) => c.pillar === slug || c.satellites.includes(slug));
}
