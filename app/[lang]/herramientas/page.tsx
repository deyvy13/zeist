import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { localizedPath } from "@/lib/site";
import { getRubros, toolsHubCopy } from "@/lib/tools-catalog";
import { toolsFor } from "@/lib/tools";
import { rubroIcons, IconArrow, IconRoute } from "@/components/icons";

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
    title: copy.title,
    description: copy.subtitle,
  });
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  await getDictionary(lang); // validate locale

  const copy = toolsHubCopy[lang];
  const rubros = getRubros(lang);
  const available = toolsFor(lang);

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="section container-zeist pb-0">
        <div className="max-w-3xl">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">{copy.title}</h1>
          <p className="mt-5 text-lg text-[color:var(--color-muted)]">
            {copy.subtitle}
          </p>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]/80">
            {copy.note}
          </p>
        </div>

        {/* Category jump nav */}
        <nav
          aria-label={copy.eyebrow}
          className="mt-10 flex flex-wrap gap-2 border-y border-[color:var(--color-hairline)] py-4"
        >
          {rubros.map((r) => (
            <a
              key={r.slug}
              href={`#${r.slug}`}
              className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/50 px-3.5 py-1.5 text-sm font-medium text-[color:var(--color-muted)] transition hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]"
            >
              {r.category}
            </a>
          ))}
        </nav>
      </section>

      {/* ======================= AVAILABLE TOOLS ===================== */}
      {available.length > 0 && (
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
                  {copy.open}
                  <IconArrow className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================== RUBROS =========================== */}
      <section className="container-zeist pb-8">
        {rubros.map((rubro, idx) => {
          const Icon = rubroIcons[rubro.icon];
          return (
            <div
              key={rubro.slug}
              id={rubro.slug}
              className={`scroll-mt-24 grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr] ${
                idx === 0 ? "" : "border-t border-[color:var(--color-hairline)]"
              }`}
            >
              {/* Rubro header */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 text-[color:var(--color-mint-600)]">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="eyebrow eyebrow-plain mt-5">
                  {rubro.category}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl">{rubro.title}</h2>
                <p className="mt-3 max-w-md text-[color:var(--color-muted)]">
                  {rubro.description}
                </p>
              </div>

              {/* Proposals */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                  {copy.toolsLabel}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {rubro.slug === "calculadoras-ingenieria" &&
                    available.map(({ slug, card }) => (
                      <Link
                        key={slug}
                        href={localizedPath(lang, `herramientas/${slug}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)]/10 py-2 pl-4 pr-2.5 text-sm font-semibold transition hover:bg-[color:var(--color-mint-500)]/20"
                      >
                        {card.title}
                        <span className="rounded-full bg-[color:var(--color-mint-500)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-ink-950)]">
                          {copy.free}
                        </span>
                      </Link>
                    ))}
                  {rubro.tools.map((tool) => (
                    <span
                      key={tool}
                      className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/50 py-2 pl-4 pr-2.5 text-sm font-medium transition hover:border-[color:var(--color-mint-500)]"
                    >
                      {tool}
                      <span className="rounded-full bg-[color:var(--color-mint-500)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-mint-700)]">
                        {copy.soon}
                      </span>
                    </span>
                  ))}
                </div>

                <h3 className="mt-8 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                  {copy.routesLabel}
                </h3>
                <div className="mt-4 flex flex-col gap-2.5">
                  {rubro.routes.map((route) => (
                    <span
                      key={route}
                      className="group inline-flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-mint-500)]/[0.06] px-4 py-3 text-sm font-medium transition hover:border-[color:var(--color-mint-500)]"
                    >
                      <IconRoute className="h-5 w-5 shrink-0 text-[color:var(--color-mint-600)]" />
                      <span className="flex-1">{route}</span>
                      <span className="rounded-full bg-[color:var(--color-mint-500)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-mint-700)]">
                        {copy.soon}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
