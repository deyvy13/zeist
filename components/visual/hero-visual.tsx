"use client";

import { motion } from "motion/react";
import { DotPattern } from "./dot-pattern";

// Blog hero visual: a rich, animated banner-style block to open the post with
// a strong hook. Meant to sit between the header (title/meta) and the article
// body. Uses dot pattern + mint aurora + a floating "terminal" hint.

export function BlogHero({
  eyebrow,
  title,
  highlight,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
}) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-6 py-14 md:px-12 md:py-20">
      <DotPattern size={20} radius={1.2} />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.4), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.5), transparent 70%)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="eyebrow eyebrow-plain relative z-10 text-[color:var(--color-mint-700)]"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 !mt-4 max-w-3xl font-[family-name:var(--font-space-grotesk)] text-3xl leading-tight md:text-5xl"
      >
        {title}
      </motion.h2>
      {highlight && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative z-10 mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]"
        >
          {highlight}
        </motion.p>
      )}
    </div>
  );
}
