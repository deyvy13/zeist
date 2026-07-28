"use client";

import { motion, useScroll } from "motion/react";

// Thin mint progress bar fixed at the top that fills as the user scrolls the
// article. Small dopamine hook: readers see how much is left, keeps them going.

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--color-mint-400), var(--color-mint-600))",
        boxShadow: "0 0 8px var(--color-mint-500)",
      }}
    />
  );
}
