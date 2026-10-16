import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { toolAvailable, toolLocales } from "@/lib/tools";
import { getPlanLocatorContent, getPlanLocatorLabels } from "@/lib/tools-content/coordenadas-google-maps";
import { ToolLayout } from "@/components/tools/tool-layout";
import { PlanLocator } from "@/components/tools/plan-locator";

const SLUG = "coordenadas-utm-en-google-maps";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return toolLocales[SLUG].map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) return {};
  const content = getPlanLocatorContent(lang);
  return buildMetadata({
    locale: lang,
    path: `herramientas/${SLUG}`,
    title: content.seoTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    availableLocales: toolLocales[SLUG],
  });
}

export default async function PlanLocatorPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || !toolAvailable(SLUG, lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <ToolLayout lang={lang} dict={dict} slug={SLUG} content={getPlanLocatorContent(lang)} ctaTag="tool-plan-final">
      <PlanLocator labels={getPlanLocatorLabels(lang)} locale={lang} />
    </ToolLayout>
  );
}
