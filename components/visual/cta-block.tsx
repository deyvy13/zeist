"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DotPattern } from "./dot-pattern";

// Inline CTA block for MDX posts. Follows sales best-practices:
// - Eyebrow: relevance hook ("¿Prefieres acompañamiento?" — for the doubtful reader)
// - Title: outcome-focused promise
// - Body: what we offer + reduce friction
// - Primary action (mint pill) + optional secondary (ghost)
// Rendered dark with dot pattern so it visually breaks from the article flow.

export function CTABlock({
  eyebrow,
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="relative mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-mint-500)]/40 bg-[color:var(--color-ink-950)] p-8 text-white md:p-10"
    >
      <DotPattern size={22} radius={1} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.45), transparent 70%)",
        }}
      />
      <div className="relative">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mint-400)]">
            {eyebrow}
          </p>
        )}
        <h3 className="!mt-3 font-[family-name:var(--font-space-grotesk)] text-2xl leading-tight text-white md:text-3xl">
          {title}
        </h3>
        {body && (
          <p className="mt-3 max-w-2xl text-white/70">
            {body}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-mint-500)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-ink-950)] transition hover:gap-3"
          >
            {primaryLabel}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white/60 hover:text-white"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
