import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";

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
    path: "blog",
    title: dict.blog.title,
    description: dict.blog.subtitle,
  });
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const posts = getAllPosts(lang);

  const dateFmt = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <section className="section container-zeist">
      <div className="max-w-2xl">
        <span className="eyebrow">{dict.blog.eyebrow}</span>
        <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">{dict.blog.title}</h1>
        <p className="mt-4 text-lg text-[color:var(--color-muted)]">
          {dict.blog.subtitle}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={localizedPath(lang, `blog/${post.slug}`)}
              className="surface surface-hover flex flex-col rounded-3xl p-6"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 text-xl">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-[color:var(--color-muted)]">
                {post.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
                <time dateTime={post.date}>
                  {dateFmt.format(new Date(post.date))}
                </time>
                <span>·</span>
                <span>
                  {post.readingMinutes} {dict.blog.minRead}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="surface mt-14 rounded-3xl p-12 text-center text-[color:var(--color-muted)]">
          {dict.blog.empty}
        </div>
      )}
    </section>
  );
}
