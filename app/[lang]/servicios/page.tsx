import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { serviceIcons, IconArrow } from "@/components/icons";
import { MagneticCard } from "@/components/visual/magnetic-card";

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
    path: "servicios",
    title: `${dict.services.title} | ${dict.nav.services}`,
    description: dict.services.subtitle + " " + dict.hero.subtitle,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <section className="section container-zeist">
      <div className="max-w-2xl">
        <span className="eyebrow">{dict.services.eyebrow}</span>
        <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">{dict.services.title}</h1>
        <p className="mt-4 text-lg text-[color:var(--color-muted)]">
          {dict.services.subtitle}
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dict.services.items.map((service) => {
          const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
          return (
            <MagneticCard
              key={service.slug}
              className="surface surface-hover rounded-3xl"
              intensity="subtle"
            >
              <Link
                href={localizedPath(lang, `servicios/${service.slug}`)}
                className="block h-full rounded-3xl p-8"
                style={{ transform: "translateZ(0)" }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--color-border)] text-[color:var(--color-mint-600)]">
                  {Icon && <Icon className="h-7 w-7" />}
                </span>
                <h2 className="mt-5 text-2xl">{service.title}</h2>
                <p className="mt-3 text-[color:var(--color-muted)]">
                  {service.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)]">
                  {dict.services.viewDetail}
                  <IconArrow className="h-4 w-4" />
                </span>
              </Link>
            </MagneticCard>
          );
        })}
      </div>
    </section>
  );
}
