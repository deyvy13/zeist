import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { absoluteUrl, localizedPath, site, siteUrl, whatsappUrl } from "@/lib/site";
import { getPost, type PostMeta } from "@/lib/blog";
import type { ToolSlug } from "@/lib/tools";
import type { ToolBlock, ToolContent } from "@/lib/tools-content/types";
import { IconArrow, IconWhatsApp } from "@/components/icons";

// -----------------------------------------------------------------------------
// Shared template for tool pages (/herramientas/<slug>). The calculator comes
// first — that is what the visitor searched for — then the quotable answer,
// the long-form content that ranks (tables, formulas, worked examples), the
// service pitch, FAQs and related guides.
// -----------------------------------------------------------------------------

const LINK_CLASS =
  "font-medium text-[color:var(--color-mint-700)] underline decoration-[color:var(--color-mint-500)]/40 underline-offset-4 transition hover:decoration-[color:var(--color-mint-500)]";

/** Renders [label](href) links and **bold** marks inside content strings. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href, bold] = match;
    if (label && href) {
      parts.push(
        href.startsWith("/") ? (
          <Link key={match.index} href={href} className={LINK_CLASS}>
            {label}
          </Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {label}
          </a>
        ),
      );
    } else {
      parts.push(
        <strong key={match.index} className="font-semibold text-[color:var(--color-foreground)]">
          {bold}
        </strong>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** "R^(2/3)" → R<sup>2/3</sup>. */
function Formula({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\^\(([^)]+)\)|\^([A-Za-z0-9.]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<sup key={match.index}>{match[1] ?? match[2]}</sup>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ block }: { block: ToolBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="mt-5 leading-relaxed text-[color:var(--color-foreground)]/90">
          <RichText text={block.text} />
        </p>
      );
    case "list": {
      const items = block.items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ));
      const cls = "mt-5 space-y-2 pl-6 leading-relaxed text-[color:var(--color-foreground)]/90";
      return block.ordered ? (
        <ol className={`${cls} list-decimal`}>{items}</ol>
      ) : (
        <ul className={`${cls} list-disc`}>{items}</ul>
      );
    }
    case "formula":
      return (
        <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-5 py-4">
          <p className="font-mono text-base text-[color:var(--color-foreground)] sm:text-lg">
            <Formula text={block.text} />
          </p>
          {block.note && (
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
              <RichText text={block.note} />
            </p>
          )}
        </div>
      );
    case "table":
      return (
        <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
            {block.caption && (
              <caption className="mb-3 text-left text-sm text-[color:var(--color-muted)]">
                {block.caption}
              </caption>
            )}
            <thead className="border-b border-[color:var(--color-border)]">
              <tr>
                {block.head.map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`px-3 py-3 align-bottom text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)] first:pl-0 last:pr-0 ${
                      block.numeric?.[i] ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th
                        key={i}
                        scope="row"
                        className="border-b border-[color:var(--color-hairline)] px-3 py-3 text-left font-semibold first:pl-0"
                      >
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={i}
                        className={`border-b border-[color:var(--color-hairline)] px-3 py-3 text-[color:var(--color-foreground)]/90 last:pr-0 ${
                          block.numeric?.[i] ? "text-right tabular-nums" : ""
                        }`}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className="mt-6 rounded-2xl border border-l-4 border-[color:var(--color-border)] border-l-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)]/[0.05] p-5">
          <p className="font-semibold">{block.title}</p>
          <p className="mt-1.5 leading-relaxed text-[color:var(--color-foreground)]/90">
            <RichText text={block.text} />
          </p>
        </aside>
      );
  }
}

export function ToolLayout({
  lang,
  dict,
  slug,
  content,
  ctaTag,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  slug: ToolSlug;
  content: ToolContent;
  /** data-cta value of the closing WhatsApp button, e.g. "tool-steel-final". */
  ctaTag: string;
  /** The calculator. */
  children: ReactNode;
}) {
  const labels = dict.serviceDetail;
  const pageUrl = absoluteUrl(`${lang}/herramientas/${slug}`);
  const guides = content.guides
    .map((s) => getPost(lang, s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && !p!.meta.draft)
    .map((p): PostMeta => p.meta);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.name,
    description: content.answer,
    url: pageUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: lang,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: site.name, url: `${siteUrl}/` },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: absoluteUrl(lang) },
      { "@type": "ListItem", position: 2, name: dict.nav.tools, item: absoluteUrl(`${lang}/herramientas`) },
      { "@type": "ListItem", position: 3, name: content.name, item: pageUrl },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "") },
    })),
  };

  return (
    <>
      {[appJsonLd, breadcrumbJsonLd, faqJsonLd].map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      {/* ============================ HEADER ========================== */}
      <section className="w-full pb-10 pt-10 md:pt-14">
        <div className="container-zeist">
          <nav aria-label="Breadcrumb" className="text-sm text-[color:var(--color-muted)]">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href={localizedPath(lang)} className="hover:text-[color:var(--color-mint-700)]">
                  {site.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={localizedPath(lang, "herramientas")} className="hover:text-[color:var(--color-mint-700)]">
                  {dict.nav.tools}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-[color:var(--color-foreground)]">
                {content.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="eyebrow">{content.eyebrow}</span>
            <h1 className="mt-5 text-[2rem] leading-[1.08] sm:text-5xl">{content.h1}</h1>
            <p className="mt-5 text-lg text-[color:var(--color-muted)]">{content.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {content.badges.map((badge) => (
                <li key={badge} className="tag gap-1.5">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========================== CALCULATOR ======================== */}
      <section aria-labelledby="calculadora" className="w-full pb-16">
        <div className="container-zeist">
          <h2 id="calculadora" className="sr-only">
            {content.calculatorTitle}
          </h2>
          {children}
        </div>
      </section>

      {/* ======================= ANSWER (tint band) =================== */}
      <section aria-labelledby="en-pocas-palabras" className="band-tint section w-full">
        <div className="container-zeist grid gap-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <div>
            <span className="eyebrow">{content.name}</span>
            <h2 id="en-pocas-palabras" className="mt-4 text-3xl sm:text-4xl">
              {labels.inShort}
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-[color:var(--color-foreground)]/90 sm:text-xl">
            <Formula text={content.answer} />
          </p>
        </div>
      </section>

      {/* ======================== LONG-FORM CONTENT =================== */}
      <div className="section w-full">
        <div className="container-zeist grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={dict.toolPage.onThisPage} className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                {dict.toolPage.onThisPage}
              </p>
              <ol className="mt-4 space-y-2.5 border-l border-[color:var(--color-hairline)] pl-4 text-sm">
                {content.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-[color:var(--color-muted)] transition hover:text-[color:var(--color-mint-700)]"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="min-w-0 max-w-3xl">
            {content.sections.map((section, i) => (
              <section key={section.id} id={section.id} className={`scroll-mt-24 ${i === 0 ? "" : "mt-16"}`}>
                <h2 className="text-2xl md:text-3xl">{section.title}</h2>
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* ======================== CTA (dark band) ===================== */}
      <section className="band-ink section w-full">
        <div className="container-zeist max-w-4xl">
          <span className="eyebrow eyebrow-plain text-[color:var(--color-mint-400)]">{content.cta.eyebrow}</span>
          <h2 className="mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">{content.cta.title}</h2>
          <p className="mt-5 max-w-2xl text-lg text-white/70">{content.cta.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(content.cta.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta={ctaTag}
              className="btn-primary"
            >
              <IconWhatsApp className="h-5 w-5" />
              {labels.ctaWhatsapp}
            </a>
            <Link
              href={localizedPath(lang, content.cta.secondaryPath)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[color:var(--color-mint-400)] hover:text-[color:var(--color-mint-300)]"
            >
              {content.cta.secondaryLabel}
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/55">{labels.freeDiagnosis}</p>
        </div>
      </section>

      {/* ============================= FAQ ============================ */}
      {/* Native <details>: every answer ships in the HTML, readable without JS. */}
      <section className="section w-full">
        <div className="container-zeist grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{content.name}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl">{labels.faq}</h2>
          </div>
          <div className="border-t border-[color:var(--color-hairline)]">
            {content.faqs.map((faq, i) => (
              <details key={faq.q} open={i === 0} className="group border-b border-[color:var(--color-hairline)] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg">{faq.q}</h3>
                  <span
                    aria-hidden
                    className="mt-0.5 text-xl leading-none text-[color:var(--color-mint-700)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-[color:var(--color-muted)]">
                  <RichText text={faq.a} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== GUIDES =========================== */}
      {guides.length > 0 && (
        <section className="band-tint section w-full">
          <div className="container-zeist">
            <div className="max-w-2xl">
              <span className="eyebrow">{labels.guides}</span>
              <h2 className="mt-5 text-3xl sm:text-4xl">{labels.guidesTitle}</h2>
            </div>
            <div className="mt-10 border-t border-[color:var(--color-hairline)]">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={localizedPath(lang, `blog/${guide.slug}`)}
                  className="group grid gap-2 border-b border-[color:var(--color-hairline)] py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
                >
                  <div>
                    <h3 className="text-lg transition-colors group-hover:text-[color:var(--color-mint-700)] sm:text-xl">
                      {guide.title}
                    </h3>
                    <p className="mt-1.5 max-w-3xl text-sm text-[color:var(--color-muted)]">{guide.description}</p>
                  </div>
                  <IconArrow className="hidden h-5 w-5 text-[color:var(--color-muted)] transition-all group-hover:translate-x-1 group-hover:text-[color:var(--color-mint-600)] sm:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
