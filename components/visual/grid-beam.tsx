"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { GridPattern } from "./grid-pattern";

// Inspired by cult-ui grid-beam: a grid background with animated "light beams"
// that sweep diagonally. Pure SVG + CSS-driven, respects prefers-reduced-motion.

export function GridBeam({
  children,
  className = "",
  intensity = "mid",
}: {
  children?: ReactNode;
  className?: string;
  intensity?: "low" | "mid" | "high";
}) {
  const beamOpacity = intensity === "low" ? 0.35 : intensity === "high" ? 0.8 : 0.55;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <GridPattern size={44} />

      {/* Animated mint beam sweeping across */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 left-0 h-[150%] w-64 -rotate-12"
        initial={{ x: "-20%" }}
        animate={{ x: "120%" }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 3,
        }}
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(0,255,206,${beamOpacity * 0.4}) 40%, rgba(0,255,206,${beamOpacity}) 50%, rgba(0,255,206,${beamOpacity * 0.4}) 60%, transparent 100%)`,
          filter: "blur(24px)",
        }}
      />

      {/* Soft mint glow center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 50%, rgba(0,255,206,0.12), transparent 70%)",
        }}
      />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
