import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Styled element map — full control over prose without a typography plugin.
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 scroll-mt-24 text-2xl md:text-3xl" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 scroll-mt-24 text-xl md:text-2xl" {...props} />
  ),
  p: (props) => (
    <p className="mt-5 leading-relaxed text-[color:var(--color-foreground)]/90" {...props} />
  ),
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[color:var(--color-mint-700)] underline underline-offset-2"
        {...props}
      />
    ) : (
      <Link
        href={href}
        className="font-medium text-[color:var(--color-mint-700)] underline underline-offset-2"
        {...props}
      />
    );
  },
  ul: (props) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-[color:var(--color-foreground)]/90" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-[color:var(--color-foreground)]/90" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-6 rounded-2xl border border-l-4 border-[color:var(--color-border)] border-l-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)]/[0.05] p-5 italic text-[color:var(--color-muted)]"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-[color:var(--color-mint-500)]/12 px-1.5 py-0.5 font-mono text-[0.9em] text-[color:var(--color-mint-800)]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-ink-950)]/[0.03] p-5 text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-[color:var(--color-border)]" />,
  img: ({ alt = "", ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="mt-6 rounded-2xl" {...props} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </div>
  );
}
