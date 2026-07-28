import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { localizedPath, absoluteUrl, site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { serviceIcons, IconArrow } from "@/components/icons";

export function generateStaticParams() {
  // Slugs are shared across locales; params combine lang x slug.
  const slugs = [
    "desarrollo-de-software",
    "automatizacion-ingenieria",
    "diseno-ux-ui",
    "arquitectura-de-software",
    "arquitectura-de-datos",
    "cursos-y-mentorias",
  ];
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

async function resolve(lang: string, slug: string) {
  const locale: Locale = isLocale(lang) ? lang : "es";
  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.slug === slug);
  return { locale, dict, service };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const { locale, service } = await resolve(lang, slug);
  if (!service) return {};
  return buildMetadata({
    locale,
    path: `servicios/${slug}`,
    title: service.title,
    description: service.body,
    keywords: service.tags,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const { locale, dict, service } = await resolve(lang, slug);
  if (!service) notFound();

  const Icon = serviceIcons[slug as keyof typeof serviceIcons];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.body,
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Global",
    url: absoluteUrl(`${locale}/servicios/${slug}`),
  };

  return (
    <article className="container-zeist py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={localizedPath(lang, "servicios")}
        className="text-sm font-medium text-[color:var(--color-mint-700)] hover:underline"
      >
        ← {dict.nav.services}
      </Link>

      <header className="mt-8 border-b border-[color:var(--color-hairline)] pb-12">
        <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 text-[color:var(--color-mint-600)]">
          {Icon && <Icon className="h-8 w-8" />}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl md:text-5xl lg:text-6xl">
          {service.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
          {service.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <Link href={localizedPath(lang, "contacto")} className="btn-primary mt-9">
          {dict.hero.ctaPrimary}
          <IconArrow className="h-4 w-4" />
        </Link>
      </header>

      {/* Process reused as a value section (keeps the page substantial for SEO). */}
      <section className="mt-14">
        <h2 className="text-2xl md:text-3xl">{dict.process.title}</h2>
        <ol className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {dict.process.steps.map((step, i) => (
            <li key={step.title}>
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[color:var(--color-mint-500)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[color:var(--color-hairline)]" />
              </div>
              <h3 className="mt-3 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
