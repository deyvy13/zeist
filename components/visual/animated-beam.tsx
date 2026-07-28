"use client";

import { motion } from "motion/react";

// Simplified AnimatedBeam: a horizontal (or diagonal) connecting line with a
// bright mint "pulse" traveling along it. Used to connect roadmap steps or to
// draw the eye through a section. Purely decorative; aria-hidden.

export function AnimatedBeam({
  className = "",
  height = 3,
  duration = 2.4,
}: {
  className?: string;
  height?: number;
  duration?: number;
}) {
  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden rounded-full ${className}`}
      style={{ height }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-mint-500) 50%, transparent 100%)",
          opacity: 0.25,
        }}
      />
      <motion.div
        className="absolute top-0 h-full w-1/3 rounded-full"
        initial={{ x: "-100%" }}
        animate={{ x: "300%" }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-mint-400), transparent)",
          filter: "drop-shadow(0 0 6px var(--color-mint-500))",
        }}
      />
    </div>
  );
}
