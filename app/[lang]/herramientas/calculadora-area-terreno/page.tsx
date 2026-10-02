import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { toolAvailable, toolLocales } from "@/lib/tools";
import { getParcelContent, getParcelLabels } from "@/lib/tools-content/terreno";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ParcelCalculator } from "@/components/tools/parcel-calculator";

const SLUG = "calculadora-area-terreno";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return toolLocales[SLUG].map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) return {};
  const content = getParcelContent(lang);
  return buildMetadata({
    locale: lang,
    path: `herramientas/${SLUG}`,
    title: content.seoTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    availableLocales: toolLocales[SLUG],
  });
}

export default async function ParcelCalculatorPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <ToolLayout lang={lang} dict={dict} slug={SLUG} content={getParcelContent(lang)} ctaTag="tool-parcel-final">
      <ParcelCalculator labels={getParcelLabels(lang)} locale={lang} />
    </ToolLayout>
  );
}
