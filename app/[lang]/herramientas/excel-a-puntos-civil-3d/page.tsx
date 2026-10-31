import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { toolAvailable, toolLocales } from "@/lib/tools";
import { getExcelPointsContent, getExcelPointsLabels } from "@/lib/tools-content/excel-puntos";
import { ExcelPoints } from "@/components/tools/excel-points";
import { ToolLayout } from "@/components/tools/tool-layout";

const SLUG = "excel-a-puntos-civil-3d";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return toolLocales[SLUG].map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) return {};
  const content = getExcelPointsContent(lang);
  return buildMetadata({
    locale: lang,
    path: `herramientas/${SLUG}`,
    title: content.seoTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    availableLocales: toolLocales[SLUG],
  });
}

export default async function ExcelPointsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <ToolLayout lang={lang} dict={dict} slug={SLUG} content={getExcelPointsContent(lang)} ctaTag="tool-excel-points-final">
      <ExcelPoints labels={getExcelPointsLabels(lang)} />
    </ToolLayout>
  );
}
