import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/lib/i18n";
import { clustersOf, pillarSlugs } from "@/lib/clusters";

// -----------------------------------------------------------------------------
// File-based blog. Posts live in content/blog/<locale>/<slug>.mdx with
// frontmatter. Zero CMS, versioned in git, fully server-rendered.
// -----------------------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  /**
   * Short title for the <title> tag and OG cards. Google truncates titles at
   * ~60 characters, and the layout appends " — Zeist", so keep this to ~52.
   * The full `title` remains the on-page <h1>. Falls back to `title`.
   */
  seoTitle?: string;
  /** Optional headline for the early service CTA, tailored to the post's pain. */
  ctaTitle?: string;
  description: string;
  date: string; // ISO
  tags: string[];
  author: string;
  cover?: string;
  draft?: boolean;
  readingMinutes: number;
};

export type Post = {
  meta: PostMeta;
  content: string; // raw MDX body
};

function localeDir(locale: Locale) {
  return path.join(BLOG_DIR, locale);
}

export function getPostSlugs(locale: Locale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(locale: Locale, slug: string): Post | null {
  const file = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const meta: PostMeta = {
    slug,
    locale,
    title: String(data.title ?? slug),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    ctaTitle: data.ctaTitle ? String(data.ctaTitle) : undefined,
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString()),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author ?? "Zeist"),
    cover: data.cover ? String(data.cover) : undefined,
    draft: Boolean(data.draft ?? false),
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };

  return { meta, content };
}

export function getAllPosts(locale: Locale): PostMeta[] {
  return getPostSlugs(locale)
    .map((slug) => getPost(locale, slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m) && !m!.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getAllTags(locale: Locale): string[] {
  const set = new Set<string>();
  for (const p of getAllPosts(locale)) p.tags.forEach((t) => set.add(t));
  return [...set].sort();
}

/**
 * Related posts for the end of an article, ordered to push authority toward
 * pillars: the post's cluster pillar(s) first, then cluster siblings, then
 * posts sharing tags, then other pillars. Previously this was "the 2 newest
 * posts", which linked every article to the same fresh posts and never to the
 * pillars we want to rank.
 */
export function getRelatedPosts(locale: Locale, slug: string, limit = 4): PostMeta[] {
  const all = getAllPosts(locale);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const self = bySlug.get(slug);
  const picked: string[] = [];
  const add = (s: string) => {
    if (s !== slug && bySlug.has(s) && !picked.includes(s)) picked.push(s);
  };

  const mine = clustersOf(slug);
  mine.forEach((c) => add(c.pillar));
  mine.forEach((c) => c.satellites.forEach(add));

  if (self) {
    const tags = new Set(self.tags.map((t) => t.toLowerCase()));
    all
      .map((p) => ({ p, score: p.tags.filter((t) => tags.has(t.toLowerCase())).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach((x) => add(x.p.slug));
  }

  pillarSlugs.forEach(add);
  all.forEach((p) => add(p.slug));

  return picked.slice(0, limit).map((s) => bySlug.get(s)!);
}
