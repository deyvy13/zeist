"use client";

import { AnimatePresence, motion } from "motion/react";
import { useStepsSafe } from "./steps-provider";

// Floating "X / N" progress pill. Renders only when there are registered
// steps in the current article. Shows a mini ring and pops on increment.

export function StepsProgress({ locale = "es" }: { locale?: "es" | "pt" }) {
  const ctx = useStepsSafe();
  if (!ctx || ctx.total === 0) return null;

  const { openedCount, total } = ctx;
  const pct = total === 0 ? 0 : Math.round((openedCount / total) * 100);
  const complete = openedCount === total;

  const labels = {
    es: {
      progress: "Progreso",
      complete: "¡Completado!",
      of: "de",
    },
    pt: {
      progress: "Progresso",
      complete: "Completo!",
      of: "de",
    },
  }[locale];

  return (
    <motion.aside
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-5 right-5 z-40 select-none md:bottom-8 md:right-8"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-full border border-[color:var(--color-mint-500)]/40 bg-[color:var(--color-ink-950)]/85 py-2 pl-2 pr-4 text-white shadow-2xl backdrop-blur-md">
        {/* Mini progress ring */}
        <div className="relative grid h-10 w-10 place-items-center">
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="3"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="var(--color-mint-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 16}
              initial={false}
              animate={{
                strokeDashoffset: 2 * Math.PI * 16 * (1 - pct / 100),
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                filter: "drop-shadow(0 0 4px var(--color-mint-500))",
              }}
            />
          </svg>
          <AnimatePresence mode="wait">
            <motion.span
              key={openedCount}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-[family-name:var(--font-space-grotesk)] text-[11px] font-bold text-[color:var(--color-mint-400)]"
            >
              {openedCount}/{total}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            {complete ? labels.complete : labels.progress}
          </p>
          <p className="text-sm font-semibold leading-tight text-white">
            {openedCount} {labels.of} {total}
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
