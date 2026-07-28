"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

// Magnetic card: on hover, a soft 3D tilt tracks the cursor. A radial
// "spotlight" also follows for a premium micro-interaction. Falls back to a
// static container when the user prefers reduced motion. Wrap any card
// content: services rows, blog cards, CTAs.

export function MagneticCard({
  children,
  className = "",
  intensity = "normal",
}: {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "normal" | "strong";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Spring-smoothed tilt so movement feels elastic, not jittery.
  const rx = useSpring(rawY, { stiffness: 220, damping: 22 });
  const ry = useSpring(rawX, { stiffness: 220, damping: 22 });

  // Spotlight position (0–100%).
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(220px circle at ${mx}% ${my}%, rgba(0,255,206,0.18), transparent 60%)`;

  const maxTilt = intensity === "subtle" ? 4 : intensity === "strong" ? 12 : 7;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // -1 to 1 range centered at cursor
    rawX.set((px - 0.5) * maxTilt * 2);
    rawY.set(-(py - 0.5) * maxTilt * 2);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Spotlight follows cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: bg }}
      />
      {children}
    </motion.div>
  );
}
