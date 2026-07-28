"use client";

import { motion } from "motion/react";

// Reusable comparison table with a permanently animated grid-beam background
// (cult-ui style). Two columns of values plus a "criterion" label. Winner per
// row can be marked with a "*" prefix in the value.
//
// MDX-friendly: rows are a single string with rows separated by "||" and
// columns by "|" — order: "criterion | left | right".
// Example:
//   rows="Curva de aprendizaje | Días | 2-3 meses || Rendimiento | Medio | Alto"
//
// Prefix any cell value with "*" to highlight it as the winner for that row.

export function ComparisonTable({
  leftLabel,
  rightLabel,
  rows,
  criterionLabel,
}: {
  leftLabel: string;
  rightLabel: string;
  rows: string;
  criterionLabel?: string;
}) {
  const parsed = rows
    .split("||")
    .map((r) => r.split("|").map((c) => c.trim()))
    .filter((cols) => cols.length >= 3);

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-[color:var(--color-mint-500)]/30 bg-[color:var(--color-ink-950)]">
      {/* Animated grid-beam background */}
      <GridBeamBg />

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm text-white">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-white/50 md:px-6">
                {criterionLabel ?? "Criterio"}
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mint-400)] md:px-6">
                {leftLabel}
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mint-400)] md:px-6">
                {rightLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {parsed.map(([criterion, left, right], i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-b border-white/5 last:border-none"
              >
                <td className="px-4 py-3.5 font-medium text-white/85 md:px-6">
                  {criterion}
                </td>
                <Cell value={left} />
                <Cell value={right} />
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ value }: { value: string }) {
  const winner = value.startsWith("*");
  const text = winner ? value.slice(1).trim() : value;
  return (
    <td className="px-4 py-3.5 text-white/75 md:px-6">
      {winner ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-mint-500)]/15 px-2.5 py-1 font-semibold text-[color:var(--color-mint-300)]">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12l5 5 9-11" />
          </svg>
          {text}
        </span>
      ) : (
        text
      )}
    </td>
  );
}

// Permanent grid + diagonal beam sweep, inspired by cult-ui grid-beam.
function GridBeamBg() {
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      >
        <defs>
          <pattern id="ct-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path
              d="M 42 0 L 0 0 0 42"
              fill="none"
              stroke="rgba(0,255,206,0.25)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="ct-fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="ct-mask">
            <rect width="100%" height="100%" fill="url(#ct-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#ct-grid)" mask="url(#ct-mask)" />
      </svg>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 h-[150%] w-56 -rotate-12"
        initial={{ x: "-30%" }}
        animate={{ x: "120%" }}
        transition={{
          duration: 5.5,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 1.5,
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,255,206,0.2) 40%, rgba(0,255,206,0.55) 50%, rgba(0,255,206,0.2) 60%, transparent 100%)",
          filter: "blur(24px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 50%, rgba(0,255,206,0.12), transparent 70%)",
        }}
      />
    </>
  );
}
