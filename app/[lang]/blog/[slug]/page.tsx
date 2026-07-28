import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { localizedPath, absoluteUrl, site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/blog";
import { MdxContent } from "@/components/mdx-content";
import { ReadingProgress } from "@/components/visual/reading-progress";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getPostSlugs(lang).map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "es";
  const post = getPost(locale, slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `blog/${slug}`,
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.tags,
    ogImage: post.meta.cover,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const post = getPost(lang, slug);
  if (!post || post.meta.draft) notFound();

  const { meta } = post;
  const dateFmt = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const related = getAllPosts(lang)
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const wordCount = post.content.trim().split(/\s+/).length;
  const canonical = absoluteUrl(`${lang}/blog/${slug}`);
  const ogImage = meta.cover ?? absoluteUrl(`${lang}/blog/${slug}/opengraph-image`);

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: {
      "@type": "Organization",
      name: meta.author,
      url: absoluteUrl(lang),
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: absoluteUrl(lang),
    },
    image: ogImage,
    inLanguage: lang,
    mainEntityOfPage: canonical,
    url: canonical,
    keywords: meta.tags.join(", "),
    articleSection: meta.tags[0] ?? "Blog",
    wordCount,
    timeRequired: `PT${meta.readingMinutes}M`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Zeist",
        item: absoluteUrl(lang),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav.blog,
        item: absoluteUrl(`${lang}/blog`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: canonical,
      },
    ],
  };

  return (
    <article className="container-zeist py-16">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          href={localizedPath(lang, "blog")}
          className="text-sm font-medium text-[color:var(--color-mint-700)] hover:underline"
        >
          ← {dict.blog.backToBlog}
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="tag"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl">{meta.title}</h1>
          <p className="mt-4 text-lg text-[color:var(--color-muted)]">
            {meta.description}
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
            <span>{meta.author}</span>
            <span>·</span>
            <time dateTime={meta.date}>
              {dateFmt.format(new Date(meta.date))}
            </time>
            <span>·</span>
            <span>
              {meta.readingMinutes} {dict.blog.minRead}
            </span>
          </div>
        </header>

        <hr className="my-10 border-[color:var(--color-border)]" />

        <MdxContent source={post.content} slug={slug} locale={lang} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl">{dict.blog.viewAll}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={localizedPath(lang, `blog/${p.slug}`)}
                  className="surface surface-hover rounded-3xl p-6"
                >
                  <h3 className="text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
