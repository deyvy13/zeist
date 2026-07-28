"use client";

import { motion } from "motion/react";

// Reusable animated flow diagram (magicui animated-beam style). 2-6 nodes,
// horizontal on desktop, vertical on mobile. Between adjacent nodes a mint
// beam pulses to draw the eye through the sequence.
//
// MDX-friendly: pipe-separated strings for nodes and subs. `warnCount` tints
// the first N nodes amber (useful for "problem → solution" narratives).

export function AnimatedFlow({
  nodes,
  subs,
  warnCount = 0,
  title,
}: {
  nodes: string;
  subs?: string;
  warnCount?: number;
  title?: string;
}) {
  const items = nodes.split("|").map((s) => s.trim()).filter(Boolean);
  const subItems = subs ? subs.split("|").map((s) => s.trim()) : [];

  return (
    <div className="my-8">
      {title && (
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
          {title}
        </p>
      )}
      <div className="flex flex-col items-stretch gap-0 md:flex-row md:items-stretch">
        {items.map((label, i) => {
          const isWarn = i < warnCount;
          return (
            <div
              key={i}
              className="flex flex-col items-stretch md:flex-1 md:flex-row md:items-stretch"
            >
              <FlowNode label={label} sub={subItems[i]} warn={isWarn} index={i} />
              {i < items.length - 1 && (
                <FlowBeam warn={isWarn && i + 1 < warnCount} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlowNode({
  label,
  sub,
  warn,
  index,
}: {
  label: string;
  sub?: string;
  warn: boolean;
  index: number;
}) {
  const border = warn
    ? "border-amber-500/60 bg-amber-500/[0.06]"
    : "border-[color:var(--color-mint-500)]/60 bg-[color:var(--color-mint-500)]/[0.06]";
  const dotColor = warn ? "#f59e0b" : "var(--color-mint-500)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative flex flex-1 flex-col justify-center rounded-2xl border ${border} p-4 text-center backdrop-blur-sm`}
    >
      <div
        className="mx-auto mb-2 h-1.5 w-1.5 rounded-full"
        style={{ background: dotColor }}
      />
      <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold">
        {label}
      </p>
      {sub && <p className="mt-1 text-xs text-[color:var(--color-muted)]">{sub}</p>}
    </motion.div>
  );
}

function FlowBeam({ warn }: { warn: boolean }) {
  const color = warn ? "#f59e0b" : "var(--color-mint-500)";
  return (
    <>
      {/* Mobile: vertical beam between stacked nodes */}
      <div
        aria-hidden
        className="relative flex h-8 w-full items-center justify-center md:hidden"
      >
        <div
          className="h-full w-[2px] rounded-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
            opacity: 0.4,
          }}
        />
        <motion.div
          className="absolute h-3 w-[3px] rounded-full"
          style={{ background: color, filter: `drop-shadow(0 0 6px ${color})` }}
          initial={{ y: -14 }}
          animate={{ y: 14 }}
          transition={{
            duration: 1.4,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      </div>

      {/* Desktop: horizontal beam between nodes in a row */}
      <div
        aria-hidden
        className="relative hidden h-full items-center md:flex md:w-10 lg:w-14"
      >
        <div
          className="h-[2px] w-full rounded-full"
          style={{
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            opacity: 0.4,
          }}
        />
        <motion.div
          className="absolute h-[3px] w-3 rounded-full"
          style={{ background: color, filter: `drop-shadow(0 0 6px ${color})` }}
          initial={{ x: -12 }}
          animate={{ x: 40 }}
          transition={{
            duration: 1.4,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      </div>
    </>
  );
}
