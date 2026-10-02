import type { Locale } from "@/lib/i18n";
import { servicesEs } from "@/lib/services-content/es";
import { servicesPt } from "@/lib/services-content/pt";
import { servicesEn } from "@/lib/services-content/en";

// -----------------------------------------------------------------------------
// Service landing pages — the "money pages".
//
// Blog posts attract readers; these pages are what ranks for purchase-intent
// searches ("plugin para revit", "revit plugin development company",
// "consultoría BIM", "curso revit api"). Each one carries a citable definition
// for AI answers, the buyer's pains, what we build, process with timelines,
// deliverables, a comparison, related guides and FAQs (FAQPage schema).
//
// Card copy for listings (title/body/tags) stays in the dictionaries; the long
// page content lives in lib/services-content/<locale>.ts.
// -----------------------------------------------------------------------------

export const SERVICE_SLUGS = [
  "add-ins-revit-civil-3d",
  "automatizacion-dynamo",
  "auditoria-procesos-bim",
  "cursos-mentorias-bim",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServicePage = {
  /** <title> without the " — Zeist" suffix; keep ≤ 52 characters. */
  seoTitle: string;
  /** Meta description; keep ≤ 160 characters. */
  metaDescription: string;
  keywords: string[];
  /** schema.org Service.serviceType */
  serviceType: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** Self-contained definition (60-100 words) — what search and AI answers quote. */
  answer: string;
  facts: { label: string; value: string }[];
  /** WhatsApp prefilled message for this service. */
  prefill: string;
  painsTitle: string;
  pains: { title: string; body: string }[];
  buildsTitle: string;
  buildsIntro: string;
  /** `guide` is a blog slug; the link renders only if the post exists in the locale. */
  builds: { title: string; body: string; guide?: string }[];
  processTitle: string;
  process: { title: string; body: string; time: string }[];
  deliverablesTitle: string;
  deliverables: string[];
  comparison: {
    title: string;
    criterionLabel: string;
    leftLabel: string;
    rightLabel: string;
    /** ComparisonTable format: "Label | *win | value || Label | value | *win" */
    rows: string;
  };
  /** Blog slugs, rendered with their real titles; missing ones are skipped. */
  guides: string[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
};

const content: Record<Locale, Record<ServiceSlug, ServicePage>> = {
  es: servicesEs,
  pt: servicesPt,
  en: servicesEn,
};

export function isServiceSlug(value: string): value is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(value);
}

export function getServicePage(slug: ServiceSlug, locale: Locale): ServicePage {
  return content[locale][slug];
}
