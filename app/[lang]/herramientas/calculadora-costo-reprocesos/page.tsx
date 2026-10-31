import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { toolAvailable, toolLocales } from "@/lib/tools";
import { getReworkContent, getReworkDefaults, getReworkLabels } from "@/lib/tools-content/reprocesos";
import { ReworkCalculator } from "@/components/tools/rework-calculator";
import { ToolLayout } from "@/components/tools/tool-layout";

const SLUG = "calculadora-costo-reprocesos";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return toolLocales[SLUG].map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) return {};
  const content = getReworkContent(lang);
  return buildMetadata({
    locale: lang,
    path: `herramientas/${SLUG}`,
    title: content.seoTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    availableLocales: toolLocales[SLUG],
  });
}

export default async function ReworkCalculatorPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <ToolLayout lang={lang} dict={dict} slug={SLUG} content={getReworkContent(lang)} ctaTag="tool-rework-final">
      <ReworkCalculator labels={getReworkLabels(lang)} locale={lang} defaults={getReworkDefaults(lang)} />
    </ToolLayout>
  );
}
