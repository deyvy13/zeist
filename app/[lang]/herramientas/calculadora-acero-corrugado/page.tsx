import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { toolAvailable, toolLocales } from "@/lib/tools";
import { aceroContent, aceroLabels } from "@/lib/tools-content/acero";
import { ToolLayout } from "@/components/tools/tool-layout";
import { SteelCalculator } from "@/components/tools/steel-calculator";

// Spanish only (Peruvian bar table) — see toolLocales in lib/tools.ts.
const SLUG = "calculadora-acero-corrugado";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return toolLocales[SLUG].map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) return {};
  return buildMetadata({
    locale: lang,
    path: `herramientas/${SLUG}`,
    title: aceroContent.seoTitle,
    description: aceroContent.metaDescription,
    keywords: aceroContent.keywords,
    availableLocales: toolLocales[SLUG],
  });
}

export default async function SteelCalculatorPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <ToolLayout lang={lang} dict={dict} slug={SLUG} content={aceroContent} ctaTag="tool-steel-final">
      <SteelCalculator labels={aceroLabels} />
    </ToolLayout>
  );
}
