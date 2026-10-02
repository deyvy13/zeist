// Content model for tool pages (/herramientas/<slug>). Text fields accept two
// inline marks: [label](/path) links and **bold** — enough for internal
// linking without pulling MDX into a calculator page.

export type ToolBlock =
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  /** Plain-text formula; "x^(2/3)" renders as a superscript. */
  | { type: "formula"; text: string; note?: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][]; numeric?: boolean[] }
  | { type: "callout"; title: string; text: string };

export type ToolSection = { id: string; title: string; blocks: ToolBlock[] };

export type ToolContent = {
  /** <title> without the " — Zeist" suffix; keep ≤ 52 characters. */
  seoTitle: string;
  /** Keep ≤ 160 characters. */
  metaDescription: string;
  keywords: string[];
  /** Short name: breadcrumb, schema and cards. */
  name: string;
  eyebrow: string;
  h1: string;
  intro: string;
  badges: string[];
  calculatorTitle: string;
  /** Self-contained answer (60-100 words) — what search and AI answers quote. */
  answer: string;
  sections: ToolSection[];
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    prefill: string;
    secondaryLabel: string;
    /** Path without the locale prefix, e.g. "servicios/add-ins-revit-civil-3d". */
    secondaryPath: string;
  };
  faqs: { q: string; a: string }[];
  /** Blog slugs; missing ones in the locale are skipped. */
  guides: string[];
};
