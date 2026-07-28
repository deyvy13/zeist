"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { IconArrow } from "@/components/icons";

// Scroll-driven parallax variant of the landing hero visual (right-side clay
// card). The blurred mint blob drifts up while the clay card drifts down
// slightly and its inner rows fade — a subtle depth cue as the reader scrolls.
// Respects prefers-reduced-motion.

export function HeroParallax({
  metrics,
  deliveredLabel,
}: {
  metrics: { k: string; v: string }[];
  deliveredLabel: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // No motion values when the user prefers reduced motion.
  const blobY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 60]);
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -60]);
  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [0.98, 1, 0.98],
  );
  const rowsOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    reduce ? [1, 1, 1] : [1, 1, 0.4],
  );

  return (
    <div ref={ref} className="relative hidden lg:block">
      <motion.div
        aria-hidden
        className="absolute -right-10 -top-16 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.5), transparent 70%)",
          y: blobY,
        }}
      />
      <motion.div
        className="clay relative p-7"
        style={{ y: cardY, scale: cardScale }}
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[color:var(--color-mint-500)]" />
          <span className="h-3 w-3 rounded-full bg-[color:var(--color-ink-200)]" />
          <span className="h-3 w-3 rounded-full bg-[color:var(--color-ink-200)]" />
          <span className="ml-auto font-[family-name:var(--font-space-grotesk)] text-sm font-bold">
            Zeist<span className="text-[color:var(--color-mint-500)]">.</span>
          </span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div
              key={m.v}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4"
            >
              <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[color:var(--color-mint-600)]">
                {m.k}
              </div>
              <div className="mt-1 text-xs text-[color:var(--color-muted)]">
                {m.v}
              </div>
            </div>
          ))}
        </div>
        <motion.div className="mt-4 space-y-2.5" style={{ opacity: rowsOpacity }}>
          <div className="h-2.5 w-3/4 rounded-full bg-[color:var(--color-mint-500)]/25" />
          <div className="h-2.5 w-full rounded-full bg-[color:var(--color-ink-100)]" />
          <div className="h-2.5 w-5/6 rounded-full bg-[color:var(--color-ink-100)]" />
        </motion.div>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-[color:var(--color-mint-500)] px-4 py-3">
          <span className="text-sm font-semibold text-[color:var(--color-ink-950)]">
            {deliveredLabel}
          </span>
          <IconArrow className="h-4 w-4 text-[color:var(--color-ink-950)]" />
        </div>
      </motion.div>
    </div>
  );
}
