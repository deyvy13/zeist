import { getAllPosts } from "@/lib/blog";
import { locales, type Locale } from "@/lib/i18n";
import { absoluteUrl, site } from "@/lib/site";
import { SERVICE_SLUGS, getServicePage } from "@/lib/services";
import { TOOL_SLUGS, toolCards, toolLocales } from "@/lib/tools";

// -----------------------------------------------------------------------------
// /llms.txt — a plain-text map of the site for AI crawlers and assistants
// (ChatGPT, Claude, Gemini, Perplexity). Search engines read HTML; LLM tooling
// increasingly reads this file first to learn what a site is an authority on.
//
// Built at build time from the same sources as the site (service pages + MDX),
// so it never drifts from what is published.
// -----------------------------------------------------------------------------

export const dynamic = "force-static";

const sectionTitle: Record<Locale, string> = {
  es: "Guías (español)",
  pt: "Guias (português)",
  en: "Guides (English)",
};

// Each service is described by its page's answer block — the same
// self-contained definition the page shows, written to be quoted.
function servicesBlock(locale: Locale): string {
  return SERVICE_SLUGS.map((slug) => {
    const page = getServicePage(slug, locale);
    return `- [${page.seoTitle}](${absoluteUrl(`${locale}/servicios/${slug}`)}): ${page.answer}`;
  }).join("\n");
}

// Free tools: one line per published locale, described by their card copy.
function toolsBlock(): string {
  return TOOL_SLUGS.flatMap((slug) =>
    toolLocales[slug].map((locale) => {
      const card = toolCards[slug][locale];
      return card
        ? `- [${card.title}](${absoluteUrl(`${locale}/herramientas/${slug}`)}) (${locale}): ${card.body}`
        : "";
    }),
  )
    .filter(Boolean)
    .join("\n");
}

function guidesBlock(locale: Locale): string {
  return getAllPosts(locale)
    .map(
      (p) => `- [${p.title}](${absoluteUrl(`${locale}/blog/${p.slug}`)}): ${p.description}`,
    )
    .join("\n");
}

export function GET() {
  const body = `# ${site.name}

> ${site.name} is a BIM automation company: a team of civil engineers and software engineers that builds custom C# add-ins (plugins) for Autodesk Civil 3D and Revit, Dynamo scripts, and training for engineering teams. Based in Trujillo, Peru; works with engineering and construction firms across Latin America, Brazil and English-speaking markets.

${site.description.es}

Key facts:
- Specialty: automating repetitive engineering work in Civil 3D and Revit — 3D modeling of pipe networks and duct banks, quantity takeoffs, rebar modeling and checking, model version comparison, standards and quality control.
- Differentiator: the team combines civil engineering domain knowledge with software engineering, so tools follow real design workflows and local codes.
- Clients own the source code of the tools built for them.
- Contact: WhatsApp +${site.whatsapp.number} — ${absoluteUrl("es/contacto")}

## Services (English)

${servicesBlock("en")}

## Servicios (español)

${servicesBlock("es")}

## Serviços (português)

${servicesBlock("pt")}

## Free tools

${toolsBlock()}

${locales.map((l) => `## ${sectionTitle[l]}\n\n${guidesBlock(l)}`).join("\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
