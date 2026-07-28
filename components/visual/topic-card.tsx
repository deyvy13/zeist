"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Magnetic-feel topic card with subtle 3D tilt on hover. Used inside MDX to
// present each learning-path topic in a visually rich way without being loud.

export function TopicCard({
  step,
  title,
  time,
  children,
}: {
  step: number | string;
  title: string;
  time?: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="surface surface-hover relative mt-6 overflow-hidden rounded-3xl p-6 md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.4), transparent 70%)",
        }}
      />
      <div className="flex items-start gap-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--color-mint-500)]/12 font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[color:var(--color-mint-700)]">
          {typeof step === "number" ? String(step).padStart(2, "0") : step}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="!mt-0 text-xl md:text-2xl">{title}</h3>
            {time && (
              <span className="tag">{time}</span>
            )}
          </div>
          <div className="mt-2 text-[color:var(--color-foreground)]/85">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
