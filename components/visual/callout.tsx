"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type CalloutType = "tip" | "info" | "warn" | "success";

const styles: Record<CalloutType, { border: string; bg: string; ico: string; label: Record<"es" | "pt", string> }> = {
  tip: {
    border: "border-l-[color:var(--color-mint-500)]",
    bg: "bg-[color:var(--color-mint-500)]/[0.08]",
    ico: "💡",
    label: { es: "Tip", pt: "Dica" },
  },
  info: {
    border: "border-l-blue-400",
    bg: "bg-blue-500/[0.06]",
    ico: "ℹ️",
    label: { es: "Nota", pt: "Nota" },
  },
  warn: {
    border: "border-l-amber-400",
    bg: "bg-amber-500/[0.08]",
    ico: "⚠️",
    label: { es: "Cuidado", pt: "Atenção" },
  },
  success: {
    border: "border-l-[color:var(--color-mint-500)]",
    bg: "bg-[color:var(--color-mint-500)]/[0.1]",
    ico: "✅",
    label: { es: "Bien", pt: "Ótimo" },
  },
};

export function Callout({
  type = "tip",
  title,
  children,
  locale = "es",
}: {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
  locale?: "es" | "pt";
}) {
  const s = styles[type];
  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={`mt-6 rounded-2xl border border-[color:var(--color-border)] border-l-4 ${s.border} ${s.bg} p-5`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none" aria-hidden>
          {s.ico}
        </span>
        <div className="min-w-0">
          <p className="!mt-0 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
            {title ?? s.label[locale]}
          </p>
          <div className="mt-1 text-[color:var(--color-foreground)]/90">
            {children}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
