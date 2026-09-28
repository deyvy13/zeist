import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath, whatsappUrl } from "@/lib/site";

// -----------------------------------------------------------------------------
// Early service CTA, rendered by the post template right under the article
// header — so every post pitches the service before the reader scrolls, not
// only in the closing CTABlock that most readers never reach.
//
// Copy lives in dictionaries (`blog.earlyCta`). A post can sharpen the headline
// to its own pain via the optional `ctaTitle` frontmatter field.
// -----------------------------------------------------------------------------

export function PostEarlyCta({
  lang,
  dict,
  title,
}: {
  lang: Locale;
  dict: Dictionary;
  title?: string;
}) {
  const c = dict.blog.earlyCta;

  return (
    <aside
      aria-label={c.eyebrow}
      className="turbo-border-soft my-10 rounded-3xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink-950)] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,255,206,0.45), transparent 70%)" }}
        />

        <p className="relative text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mint-400)]">
          {c.eyebrow}
        </p>
        <p className="relative mt-3 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-snug sm:text-2xl">
          {title ?? c.title}
        </p>
        <p className="relative mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
          {c.body}
        </p>

        <ul className="relative mt-5 grid gap-2 text-sm text-white/85 sm:grid-cols-3">
          {c.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-mint-400)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12l5 5 9-11" />
              </svg>
              {point}
            </li>
          ))}
        </ul>

        <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappUrl(dict.whatsapp.prefill)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary justify-center"
          >
            {c.primary}
          </a>
          <Link
            href={localizedPath(lang, "servicios/add-ins-revit-civil-3d")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[color:var(--color-mint-400)] hover:text-[color:var(--color-mint-300)]"
          >
            {c.secondary}
          </Link>
        </div>
        <p className="relative mt-4 text-xs text-white/55">{c.note}</p>
      </div>
    </aside>
  );
}
