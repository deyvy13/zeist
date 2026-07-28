"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { GridBeam } from "./grid-beam";
import { AnimatedBeam } from "./animated-beam";

// Visual roadmap of learning steps. Renders as a vertical timeline on mobile
// and a connected flow on desktop. Not ReactFlow yet — that comes in phase B.
// Each step is scroll-revealed with staggered delay.

type Step = {
  n: number;
  title: string;
  desc: string;
  tag?: string;
};

export function LearningPath({
  steps = [],
  title,
  intro,
}: {
  steps?: Step[];
  title?: string;
  intro?: ReactNode;
}) {
  return (
    <div className="mt-10">
      <GridBeam className="rounded-3xl border border-[color:var(--color-border)] p-6 md:p-10">
        {title && (
          <h3 className="!mt-0 font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl">
            {title}
          </h3>
        )}
        {intro && (
          <p className="mt-3 max-w-2xl text-[color:var(--color-muted)]">
            {intro}
          </p>
        )}

        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="turbo-border rounded-2xl"
            >
              <div className="group relative h-full rounded-2xl bg-[color:var(--color-surface)] p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--color-mint-500)]/15 font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[color:var(--color-mint-700)]">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  {s.tag && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                      {s.tag}
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-lg font-semibold">{s.title}</h4>
                <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
                  {s.desc}
                </p>
                <AnimatedBeam className="mt-4 opacity-60 transition-opacity group-hover:opacity-100" />
              </div>
            </motion.li>
          ))}
        </ol>
      </GridBeam>
    </div>
  );
}
