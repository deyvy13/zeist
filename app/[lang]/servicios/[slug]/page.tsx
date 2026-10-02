import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { absoluteUrl, localizedPath, site, siteUrl, whatsappUrl } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { getPost, type PostMeta } from "@/lib/blog";
import { SERVICE_SLUGS, getServicePage, isServiceSlug } from "@/lib/services";
import { serviceIcons, IconArrow, IconWhatsApp } from "@/components/icons";
import { ComparisonTable } from "@/components/visual/comparison-table";

// -----------------------------------------------------------------------------
// Service landing page — the page that has to rank for purchase-intent searches
// ("plugin para revit", "bim consulting services") and turn the visit into a
// WhatsApp conversation. Long content lives in lib/services-content/<locale>.ts;
// UI labels in the dictionaries (`serviceDetail`).
//
// The order follows the buyer's questions: what is it (the answer block, which
// search and AI assistants quote) → is it for me → what exactly → how and how
// long → what do I get, and why not the alternative → objections → act.
// -----------------------------------------------------------------------------

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => SERVICE_SLUGS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isServiceSlug(slug)) return {};
  const page = getServicePage(slug, lang);
  return buildMetadata({
    locale: lang,
    path: `servicios/${slug}`,
    title: page.seoTitle,
    description: page.metaDescription,
    keywords: page.keywords,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isServiceSlug(slug)) notFound();

  const dict = await getDictionary(lang);
  const labels = dict.serviceDetail;
  const page = getServicePage(slug, lang);
  const card = dict.services.items.find((s) => s.slug === slug);
  const name = card?.title ?? page.serviceType;
  const Icon = serviceIcons[slug];
  const pageUrl = absoluteUrl(`${lang}/servicios/${slug}`);
  const waHref = whatsappUrl(page.prefill);

  // Guide links resolve against the posts published in this locale (the Peru
  // cluster is Spanish-only) and carry the post's real title.
  const publishedPost = (postSlug: string): PostMeta | null => {
    const post = getPost(lang, postSlug);
    return post && !post.meta.draft ? post.meta : null;
  };
  const guides = page.guides
    .map(publishedPost)
    .filter((p): p is PostMeta => p !== null);
  const otherServices = dict.services.items.filter((s) => s.slug !== slug);

  const provider = {
    "@type": "Organization",
    name: site.name,
    url: `${siteUrl}/`,
    telephone: `+${site.whatsapp.number}`,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: page.answer,
    serviceType: page.serviceType,
    url: pageUrl,
    provider,
    areaServed: [
      { "@type": "Place", name: "Latinoamérica" },
      { "@type": "Place", name: "España" },
      { "@type": "Place", name: "Brasil" },
      { "@type": "Place", name: "Global" },
    ],
    availableLanguage: ["es", "pt", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: page.buildsTitle,
      itemListElement: page.builds.map((b) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: b.title, description: b.body },
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: absoluteUrl(lang) },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav.services,
        item: absoluteUrl(`${lang}/servicios`),
      },
      { "@type": "ListItem", position: 3, name, item: pageUrl },
    ],
  };

  // Training is also a Course — eligible for Google's course rich results.
  const courseJsonLd =
    slug === "cursos-mentorias-bim"
      ? {
          "@context": "https://schema.org",
          "@type": "Course",
          name: page.h1,
          description: page.answer,
          inLanguage: lang,
          url: pageUrl,
          provider: { "@type": "Organization", name: site.name, url: `${siteUrl}/` },
          teaches: page.builds.map((b) => b.title),
          about: card?.tags ?? [],
          offers: { "@type": "Offer", category: "Paid" },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "PT8H",
          },
        }
      : null;

  const jsonLd = [serviceJsonLd, faqJsonLd, breadcrumbJsonLd, courseJsonLd].filter(
    Boolean,
  );

  return (
    <>
      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* ============================ HERO ============================ */}
      <section className="section w-full pt-10 md:pt-14">
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
                <Link
                  href={localizedPath(lang, "servicios")}
                  className="hover:text-[color:var(--color-mint-700)]"
                >
                  {dict.nav.services}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-[color:var(--color-foreground)]">
                {name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <span className="eyebrow">{page.eyebrow}</span>
              <h1 className="mt-6 text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-[color:var(--color-muted)]">
                {page.intro}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="service-hero"
                  className="btn-primary"
                >
                  <IconWhatsApp className="h-5 w-5" />
                  {labels.ctaWhatsapp}
                </a>
                <a href="#proceso" className="btn-ghost">
                  {labels.ctaProcess}
                </a>
              </div>
              <p className="mt-4 text-sm text-[color:var(--color-muted)]">
                {labels.freeDiagnosis}
              </p>
            </div>

            {/* The quotable definition — what search snippets and AI answers lift. */}
            <section aria-labelledby="en-pocas-palabras" className="clay p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-mint-600)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 id="en-pocas-palabras" className="text-lg">
                  {labels.inShort}
                </h2>
              </div>
              <p className="mt-5 leading-relaxed">{page.answer}</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--color-hairline)] pt-6">
                {page.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </section>

      {/* ======================= PAINS (tint band) ==================== */}
      <section className="band-tint section w-full">
        <div className="container-zeist grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{labels.forWho}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl">{page.painsTitle}</h2>
          </div>
          <div>
            {page.pains.map((pain, i) => (
              <div key={pain.title} className={i === 0 ? "pb-6" : "hairline py-6"}>
                <div className="flex gap-5">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[color:var(--color-mint-600)]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl">{pain.title}</h3>
                    <p className="mt-2 text-[color:var(--color-muted)]">{pain.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= WHAT WE BUILD ====================== */}
      <section className="section w-full">
        <div className="container-zeist">
          <div className="max-w-2xl">
            <span className="eyebrow">{labels.whatWeBuild}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">{page.buildsTitle}</h2>
            <p className="mt-4 text-[color:var(--color-muted)]">{page.buildsIntro}</p>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {page.builds.map((build) => {
              const guide = build.guide ? publishedPost(build.guide) : null;
              return (
                <div key={build.title} className="border-t border-[color:var(--color-hairline)] pt-6">
                  <h3 className="text-xl">{build.title}</h3>
                  <p className="mt-2 text-[color:var(--color-muted)]">{build.body}</p>
                  {guide && (
                    <Link
                      href={localizedPath(lang, `blog/${guide.slug}`)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)] transition-all hover:gap-3"
                    >
                      {labels.readGuide}
                      <span className="sr-only">: {guide.title}</span>
                      <IconArrow className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================= PROCESS (dark band) ================== */}
      <section id="proceso" className="band-ink section w-full scroll-mt-20">
        <div className="container-zeist">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow-plain text-[color:var(--color-mint-400)]">
              {labels.howWeWork}
            </span>
            <h2 className="mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
              {page.processTitle}
            </h2>
          </div>
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {page.process.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[color:var(--color-mint-500)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                </div>
                <p className="mt-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-[color:var(--color-mint-300)]">
                  <span className="sr-only">{labels.typicalTime}: </span>
                  {step.time}
                </p>
                <h3 className="mt-3 text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= DELIVERABLES + COMPARISON ================== */}
      <div className="section w-full">
        <div className="container-zeist grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <section>
            <span className="eyebrow">{labels.whatYouGet}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl">{page.deliverablesTitle}</h2>
            <ul className="mt-8 space-y-4">
              {page.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-mint-600)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="min-w-0">
            <span className="eyebrow">{labels.decision}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl">{page.comparison.title}</h2>
            <ComparisonTable
              criterionLabel={page.comparison.criterionLabel}
              leftLabel={page.comparison.leftLabel}
              rightLabel={page.comparison.rightLabel}
              rows={page.comparison.rows}
            />
          </section>
        </div>
      </div>

      {/* ======================= GUIDES (tint band) =================== */}
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
                    <p className="mt-1.5 max-w-3xl text-sm text-[color:var(--color-muted)]">
                      {guide.description}
                    </p>
                  </div>
                  <IconArrow className="hidden h-5 w-5 text-[color:var(--color-muted)] transition-all group-hover:translate-x-1 group-hover:text-[color:var(--color-mint-600)] sm:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ FAQ ============================= */}
      {/* Native <details>: every answer ships in the HTML, readable without JS. */}
      <section className="section w-full">
        <div className="container-zeist grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{name}</span>
            <h2 className="mt-5 text-3xl sm:text-4xl">{labels.faq}</h2>
          </div>
          <div className="border-t border-[color:var(--color-hairline)]">
            {page.faqs.map((faq, i) => (
              <details
                key={faq.q}
                open={i === 0}
                className="group border-b border-[color:var(--color-hairline)] py-5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg">{faq.q}</h3>
                  <span
                    aria-hidden
                    className="mt-0.5 text-xl leading-none text-[color:var(--color-mint-700)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[color:var(--color-muted)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA (mint band) ================== */}
      <section className="band-mint section w-full">
        <div className="container-zeist">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-[color:var(--color-ink-950)] sm:text-4xl lg:text-5xl">
              {page.ctaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[color:var(--color-ink-800)]">
              {page.ctaBody}
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="service-final"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink-950)] px-7 py-4 font-semibold text-[color:var(--color-mint-400)] transition-all hover:gap-3"
            >
              <IconWhatsApp className="h-5 w-5" />
              {labels.ctaWhatsapp}
            </a>
            <p className="mt-4 text-sm text-[color:var(--color-ink-800)]">
              {labels.freeDiagnosis}
            </p>
          </div>
        </div>
      </section>

      {/* ======================== OTHER SERVICES ====================== */}
      <section className="section w-full">
        <div className="container-zeist">
          <h2 className="text-2xl sm:text-3xl">{labels.otherServices}</h2>
          <div className="mt-8 border-t border-[color:var(--color-hairline)]">
            {otherServices.map((service) => {
              const OtherIcon = serviceIcons[service.slug as keyof typeof serviceIcons];
              return (
                <Link
                  key={service.slug}
                  href={localizedPath(lang, `servicios/${service.slug}`)}
                  className="group grid items-center gap-5 border-b border-[color:var(--color-hairline)] py-6 transition-colors hover:bg-[color:var(--color-mint-500)]/[0.04] sm:grid-cols-[auto_1fr_auto] sm:px-2"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--color-border)] text-[color:var(--color-mint-600)] transition-colors group-hover:border-[color:var(--color-mint-500)]">
                    {OtherIcon && <OtherIcon className="h-6 w-6" />}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl">{service.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-muted)]">
                      {service.body}
                    </p>
                  </div>
                  <IconArrow className="hidden h-5 w-5 text-[color:var(--color-muted)] transition-all group-hover:translate-x-1 group-hover:text-[color:var(--color-mint-600)] sm:block" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
