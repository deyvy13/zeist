import { getPostData } from "@/lib/blog-data";
import type { Locale } from "@/lib/i18n";
import { LearningPath } from "./learning-path";
import { Faqs } from "./faq";

// Slug-driven wrappers around the generic visual components. MDX files pass
// only `slug` (and locale is injected by the blog page via MDX scope), so the
// data itself lives in lib/blog-data.ts as regular TS — avoiding
// next-mdx-remote/rsc's limitations with complex JSX prop expressions.

export function PostRoadmap({ slug, locale }: { slug: string; locale: Locale }) {
  const d = getPostData(slug, locale)?.roadmap;
  if (!d) return null;
  return <LearningPath steps={d.steps} title={d.title} intro={d.intro} />;
}

export function PostFaqs({ slug, locale }: { slug: string; locale: Locale }) {
  const d = getPostData(slug, locale)?.faqs;
  if (!d) return null;
  return <Faqs items={d.items} title={d.title} />;
}
