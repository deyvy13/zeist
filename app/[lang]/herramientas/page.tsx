import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { breadcrumbJsonLd, buildMetadata, collectionJsonLd } from "@/lib/seo";
import { localizedPath } from "@/lib/site";
import { toolsHubCopy } from "@/lib/tools-catalog";
import { toolsFor } from "@/lib/tools";
import { IconArrow } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const copy = toolsHubCopy[locale];
  return buildMetadata({
    locale,
    path: "herramientas",
    title: copy.seoTitle,
    description: copy.metaDescription,
  });
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const copy = toolsHubCopy[lang];
  const available = toolsFor(lang);

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd(
            lang,
            "herramientas",
            copy.seoTitle,
            copy.metaDescription,
            available.map(({ slug, card }) => ({ name: card.title, path: `herramientas/${slug}`, type: "WebApplication", description: card.body })),
          ),
          breadcrumbJsonLd(lang, [[dict.nav.tools, "herramientas"]]),
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="section container-zeist pb-0">
        <div className="max-w-3xl">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">{copy.title}</h1>
          <p className="mt-5 text-lg text-[color:var(--color-muted)]">{copy.subtitle}</p>
        </div>
      </section>

      {/* ======================= AVAILABLE TOOLS ===================== */}
      <section aria-labelledby="disponibles" className="container-zeist pt-12">
        <span className="eyebrow">{copy.availableEyebrow}</span>
        <h2 id="disponibles" className="mt-4 text-3xl sm:text-4xl">
          {copy.availableTitle}
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {available.map(({ slug, card }) => (
            <Link
              key={slug}
              href={localizedPath(lang, `herramientas/${slug}`)}
              className="surface surface-hover group flex flex-col rounded-3xl p-7"
            >
              <span className="self-start rounded-full bg-[color:var(--color-mint-500)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-ink-950)]">
                {copy.free}
              </span>
              <h3 className="mt-4 text-2xl">{card.title}</h3>
              <p className="mt-2 text-[color:var(--color-muted)]">{card.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)] transition-all group-hover:gap-3">
                {card.cta}
                <IconArrow className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================= SERVICE BRIDGE ===================== */}
      <section className="section container-zeist">
        <div className="grid gap-6 border-t border-[color:var(--color-hairline)] pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl">{copy.bridgeTitle}</h2>
            <p className="mt-3 text-[color:var(--color-muted)]">{copy.bridgeBody}</p>
          </div>
          <Link href={localizedPath(lang, "servicios/add-ins-revit-civil-3d")} className="btn-ghost">
            {copy.bridgeCta}
            <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
