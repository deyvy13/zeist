import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// File-based blog. Posts live in content/blog/<locale>/<slug>.mdx with
// frontmatter. Zero CMS, versioned in git, fully server-rendered.
// -----------------------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
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
