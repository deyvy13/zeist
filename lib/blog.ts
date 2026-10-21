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
  /** File name: the post's URL slug in its own language. */
  slug: string;
  /**
   * Translation key, the same in every language: the Spanish slug. It ties the
   * three versions together (hreflang, language switcher, lib/blog-data.ts,
   * lib/clusters.ts). Set with `translationKey` in the frontmatter; defaults to
   * the slug.
   */
  key: string;
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
  /**
   * Last substantial revision (ISO). Feeds BlogPosting.dateModified, the
   * visible "updated" line and the sitemap's lastModified. Set it only when the
   * content really changed: Google learns to ignore dates that always move.
   */
  updated?: string;
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

// gray-matter turns unquoted YAML dates into Date objects; keep ISO strings.
function toIso(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

export function getPost(locale: Locale, slug: string): Post | null {
  const file = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const meta: PostMeta = {
    slug,
    key: data.translationKey ? String(data.translationKey) : slug,
    locale,
    title: String(data.title ?? slug),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    ctaTitle: data.ctaTitle ? String(data.ctaTitle) : undefined,
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString()),
    updated: data.updated ? toIso(data.updated) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author ?? "Zeist"),
    cover: data.cover ? String(data.cover) : undefined,
    draft: Boolean(data.draft ?? false),
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };

  return { meta, content };
}

/** The post with this translation key in a locale (its slug may differ). */
export function getPostByKey(locale: Locale, key: string): Post | null {
  const meta = getAllPosts(locale).find((p) => p.key === key);
  return meta ? getPost(locale, meta.slug) : null;
}

// The build reads the post list many times (lookups by translation key on
// every page); in production the files don't change, so it is read once.
const postsCache = new Map<Locale, PostMeta[]>();

export function getAllPosts(locale: Locale): PostMeta[] {
  const cached = process.env.NODE_ENV === "production" ? postsCache.get(locale) : undefined;
  if (cached) return [...cached];
  const posts = getPostSlugs(locale)
    .map((slug) => getPost(locale, slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m) && !m!.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (process.env.NODE_ENV === "production") postsCache.set(locale, posts);
  return [...posts];
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
export function getRelatedPosts(locale: Locale, key: string, limit = 4): PostMeta[] {
  const all = getAllPosts(locale);
  // Clusters list translation keys, so posts are matched by key.
  const byKey = new Map(all.map((p) => [p.key, p]));
  const self = byKey.get(key);
  const picked: string[] = [];
  const add = (s: string) => {
    if (s !== key && byKey.has(s) && !picked.includes(s)) picked.push(s);
  };

  const mine = clustersOf(key);
  mine.forEach((c) => add(c.pillar));
  mine.forEach((c) => c.satellites.forEach(add));

  if (self) {
    const tags = new Set(self.tags.map((t) => t.toLowerCase()));
    all
      .map((p) => ({ p, score: p.tags.filter((t) => tags.has(t.toLowerCase())).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach((x) => add(x.p.key));
  }

  pillarSlugs.forEach(add);
  all.forEach((p) => add(p.key));

  return picked.slice(0, limit).map((s) => byKey.get(s)!);
}
