import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/site";
import { buildMetadata, websiteJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { serviceIcons, IconArrow } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    keywords: [
      "soluciones tecnológicas",
      "desarrollo de software",
      "automatización ingeniería",
      "diseño UX UI",
      "arquitectura de datos",
      "desarrollo con IA",
      "Zeist",
    ],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const posts = getAllPosts(lang).slice(0, 3);
  const [featured, ...rest] = posts;
  const jsonLd = websiteJsonLd(lang);

  const heroMetrics =
    lang === "pt"
      ? [
          { k: "−40%", v: "custo médio" },
          { k: "3×", v: "mais rápido" },
          { k: "6", v: "áreas de atuação" },
        ]
      : [
          { k: "−40%", v: "costo promedio" },
          { k: "3×", v: "más rápido" },
          { k: "6", v: "áreas de solución" },
        ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================ HERO ============================ */}
      <section className="section w-full pt-14 md:pt-20">
        <div className="container-zeist">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div>
              <span className="eyebrow">{dict.hero.eyebrow}</span>
              <h1 className="mt-6 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.1rem]">
                {dict.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[color:var(--color-muted)] sm:text-xl">
                <span className="font-semibold text-[color:var(--color-mint-700)]">
                  {dict.hero.highlight}
                </span>{" "}
                {dict.hero.subtitle}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={localizedPath(lang, "contacto")} className="btn-primary">
                  {dict.hero.ctaPrimary}
                  <IconArrow className="h-4 w-4" />
                </Link>
                <Link href={localizedPath(lang, "servicios")} className="btn-ghost">
                  {dict.hero.ctaSecondary}
                </Link>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium text-[color:var(--color-muted)]">
                {dict.hero.trust.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-mint-500)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual — the single claymorphism accent of the page */}
            <div className="relative hidden lg:block">
              <div
                aria-hidden
                className="absolute -right-10 -top-16 h-72 w-72 rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,255,206,0.5), transparent 70%)",
                }}
              />
              <div className="clay relative p-7">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[color:var(--color-mint-500)]" />
                  <span className="h-3 w-3 rounded-full bg-[color:var(--color-ink-200)]" />
                  <span className="h-3 w-3 rounded-full bg-[color:var(--color-ink-200)]" />
                  <span className="ml-auto font-[family-name:var(--font-space-grotesk)] text-sm font-bold">
                    Zeist<span className="text-[color:var(--color-mint-500)]">.</span>
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {heroMetrics.map((m) => (
                    <div
                      key={m.v}
                      className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4"
                    >
                      <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[color:var(--color-mint-600)]">
                        {m.k}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--color-muted)]">
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="h-2.5 w-3/4 rounded-full bg-[color:var(--color-mint-500)]/25" />
                  <div className="h-2.5 w-full rounded-full bg-[color:var(--color-ink-100)]" />
                  <div className="h-2.5 w-5/6 rounded-full bg-[color:var(--color-ink-100)]" />
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-[color:var(--color-mint-500)] px-4 py-3">
                  <span className="text-sm font-semibold text-[color:var(--color-ink-950)]">
                    {lang === "pt" ? "Entregue" : "Entregado"}
                  </span>
                  <IconArrow className="h-4 w-4 text-[color:var(--color-ink-950)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== DIFFERENTIATORS (tint band) ============ */}
      <section className="band-tint section w-full">
        <div className="container-zeist">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">{dict.differentiators.eyebrow}</span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
                {dict.differentiators.title}
              </h2>
              <p className="mt-5 max-w-md text-[color:var(--color-muted)]">
                {dict.differentiators.subtitle}
              </p>
            </div>
            <div>
              {dict.differentiators.items.map((item, i) => (
                <div
                  key={item.title}
                  className={i === 0 ? "py-6" : "hairline py-6"}
                >
                  <div className="flex gap-5">
                    <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[color:var(--color-mint-600)]">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-xl">{item.title}</h3>
                      <p className="mt-2 text-[color:var(--color-muted)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= SERVICES (editorial rows) ========== */}
      <section className="section w-full">
        <div className="container-zeist">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">{dict.services.eyebrow}</span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
                {dict.services.title}
              </h2>
              <p className="mt-4 text-[color:var(--color-muted)]">
                {dict.services.subtitle}
              </p>
            </div>
            <Link
              href={localizedPath(lang, "servicios")}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)] hover:gap-3 transition-all"
            >
              {dict.services.viewAll}
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 border-t border-[color:var(--color-hairline)]">
            {dict.services.items.map((service) => {
              const Icon =
                serviceIcons[service.slug as keyof typeof serviceIcons];
              return (
                <Link
                  key={service.slug}
                  href={localizedPath(lang, `servicios/${service.slug}`)}
                  className="group grid items-center gap-5 border-b border-[color:var(--color-hairline)] py-8 transition-colors hover:bg-[color:var(--color-mint-500)]/[0.04] sm:grid-cols-[auto_1fr_auto] sm:px-2"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--color-border)] text-[color:var(--color-mint-600)] transition-colors group-hover:border-[color:var(--color-mint-500)]">
                    {Icon && <Icon className="h-6 w-6" />}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl">{service.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-[color:var(--color-muted)]">
                      {service.body}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <IconArrow className="hidden h-5 w-5 text-[color:var(--color-muted)] transition-all group-hover:translate-x-1 group-hover:text-[color:var(--color-mint-600)] sm:block" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= PROCESS (dark band) ================ */}
      <section className="band-ink section w-full">
        <div className="container-zeist">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow-plain text-[color:var(--color-mint-400)]">
              {dict.process.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
              {dict.process.title}
            </h2>
            <p className="mt-4 text-white/60">{dict.process.subtitle}</p>
          </div>
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {dict.process.steps.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[color:var(--color-mint-500)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                </div>
                <h3 className="mt-4 text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ========================== BLOG ============================== */}
      <section className="section w-full">
        <div className="container-zeist">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">{dict.blog.eyebrow}</span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
                {dict.blog.title}
              </h2>
              <p className="mt-4 text-[color:var(--color-muted)]">
                {dict.blog.subtitle}
              </p>
            </div>
            <Link
              href={localizedPath(lang, "blog")}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)] transition-all hover:gap-3"
            >
              {dict.blog.viewAll}
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>

          {featured ? (
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              {/* Featured post */}
              <Link
                href={localizedPath(lang, `blog/${featured.slug}`)}
                className="surface surface-hover flex flex-col justify-between rounded-3xl p-8"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    {featured.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-5 text-2xl sm:text-3xl">{featured.title}</h3>
                  <p className="mt-3 text-[color:var(--color-muted)]">
                    {featured.description}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)]">
                  {dict.blog.readMore}
                  <IconArrow className="h-4 w-4" />
                </span>
              </Link>

              {/* Rest as an editorial list */}
              <div className="flex flex-col">
                {rest.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={localizedPath(lang, `blog/${post.slug}`)}
                    className={`group flex flex-col gap-2 py-6 ${
                      i === 0 ? "" : "hairline"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg transition-colors group-hover:text-[color:var(--color-mint-700)]">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[color:var(--color-muted)]">
                      {post.description}
                    </p>
                    <span className="text-xs text-[color:var(--color-muted)]">
                      {post.readingMinutes} {dict.blog.minRead}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="surface mt-12 rounded-3xl p-12 text-center text-[color:var(--color-muted)]">
              {dict.blog.empty}
            </div>
          )}
        </div>
      </section>

      {/* ===================== TOOLS (full mint band) ================= */}
      <section className="band-mint section w-full">
        <div className="container-zeist">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-ink-800)]">
                {dict.tools.eyebrow} · {dict.tools.badge}
              </span>
              <h2 className="mt-4 text-3xl text-[color:var(--color-ink-950)] sm:text-4xl lg:text-5xl">
                {dict.tools.title}
              </h2>
              <p className="mt-4 max-w-xl text-[color:var(--color-ink-800)]">
                {dict.tools.subtitle}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                href={localizedPath(lang, "herramientas")}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink-950)] px-6 py-3.5 font-semibold text-[color:var(--color-mint-400)] transition hover:gap-3"
              >
                {dict.tools.cta}
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FINAL CTA =========================== */}
      <section className="section w-full">
        <div className="container-zeist">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl">
              {dict.finalCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[color:var(--color-muted)]">
              {dict.finalCta.subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={localizedPath(lang, "contacto")} className="btn-primary">
                {dict.finalCta.ctaPrimary}
                <IconArrow className="h-4 w-4" />
              </Link>
              <a href="mailto:hola@zeist.dev" className="btn-ghost">
                {dict.finalCta.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
