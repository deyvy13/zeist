"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import type { RoadmapStep } from "@/lib/blog-data";

// Custom SVG flow diagram — the "turbo flow" aesthetic (animated gradient
// borders, mint beams tracing edges) without the ReactFlow runtime, which
// wasn't rendering edges in this stack. Purely SVG + CSS.

const NODE_W = 190;
const NODE_H = 120;
const COL_GAP = 60;
const ROW_GAP = 70;
const COLS = 3;
const PAD = 24;

export function TurboFlow({ steps }: { steps: RoadmapStep[] }) {
  const { nodes, edges, viewW, viewH } = useMemo(() => {
    const rows = Math.ceil(steps.length / COLS);
    const nodes = steps.map((s, i) => {
      const row = Math.floor(i / COLS);
      const colIdx = i % COLS;
      // Zig-zag: even rows left→right, odd rows right→left.
      const effectiveCol = row % 2 === 0 ? colIdx : COLS - 1 - colIdx;
      const x = PAD + effectiveCol * (NODE_W + COL_GAP);
      const y = PAD + row * (NODE_H + ROW_GAP);
      return { ...s, x, y, row };
    });

    // Build edges connecting consecutive nodes.
    const edges = nodes.slice(1).map((n, i) => {
      const prev = nodes[i];
      // Same row: connect right→left or left→right depending on row direction.
      // Row change: connect bottom→top.
      const rowChange = n.row !== prev.row;
      const prevReversed = prev.row % 2 === 1;
      const cx = NODE_W / 2;
      const cy = NODE_H / 2;

      let x1: number, y1: number, x2: number, y2: number;
      let path: string;

      if (rowChange) {
        // Bottom of prev → top of current (vertical drop).
        x1 = prev.x + cx;
        y1 = prev.y + NODE_H;
        x2 = n.x + cx;
        y2 = n.y;
        const midY = (y1 + y2) / 2;
        path = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
      } else if (prevReversed) {
        // Right-to-left row: prev on right, current on left.
        x1 = prev.x;
        y1 = prev.y + cy;
        x2 = n.x + NODE_W;
        y2 = n.y + cy;
        const midX = (x1 + x2) / 2;
        path = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
      } else {
        // Left-to-right row.
        x1 = prev.x + NODE_W;
        y1 = prev.y + cy;
        x2 = n.x;
        y2 = n.y + cy;
        const midX = (x1 + x2) / 2;
        path = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
      }
      return { id: `${prev.n}-${n.n}`, path, delay: i * 0.15 };
    });

    const viewW = PAD * 2 + COLS * NODE_W + (COLS - 1) * COL_GAP;
    const viewH = PAD * 2 + rows * NODE_H + (rows - 1) * ROW_GAP;

    return { nodes, edges, viewW, viewH };
  }, [steps]);

  return (
    <>
      <style>{`
        @property --turbo-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes turbo-spin {
          to { --turbo-angle: 360deg; }
        }
        @keyframes turbo-beam {
          0%   { stroke-dashoffset: 220; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { stroke-dashoffset: -220; opacity: 0; }
        }
        .turbo-node-border {
          background: conic-gradient(from var(--turbo-angle, 0deg),
            rgba(0,255,206,0.9) 0deg,
            rgba(0,255,206,0.05) 90deg,
            rgba(0,255,206,0.05) 270deg,
            rgba(0,255,206,0.9) 360deg);
          animation: turbo-spin 5s linear infinite;
        }
        .turbo-beam {
          stroke-dasharray: 40 200;
          animation: turbo-beam 2.4s linear infinite;
        }
      `}</style>

      <div
        className="relative mt-8 overflow-hidden rounded-3xl border border-[color:var(--color-mint-500)]/30 bg-[color:var(--color-ink-950)]"
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 50%, rgba(0,255,206,0.10), transparent 70%)",
          }}
        />
        {/* Dot texture */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        >
          <defs>
            <pattern id="tf-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="rgba(0,255,206,0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tf-dots)" />
        </svg>

        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            width={viewW}
            height={viewH}
            style={{ display: "block", maxWidth: "100%", height: "auto", minWidth: 720 }}
            aria-label="Diagrama de la ruta de aprendizaje"
          >
            <defs>
              <linearGradient id="tf-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00FFCE" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#00FFCE" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00FFCE" stopOpacity="0.25" />
              </linearGradient>
              <filter id="tf-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges — base stroke + animated beam on top */}
            {edges.map((e) => (
              <g key={e.id}>
                <path
                  d={e.path}
                  fill="none"
                  stroke="url(#tf-edge)"
                  strokeWidth={1.5}
                  opacity={0.55}
                />
                <path
                  d={e.path}
                  fill="none"
                  stroke="#00FFCE"
                  strokeWidth={2}
                  filter="url(#tf-glow)"
                  className="turbo-beam"
                  style={{ animationDelay: `${e.delay}s` }}
                />
              </g>
            ))}

            {/* Nodes rendered as foreignObject so we can use HTML/CSS for the
                animated conic-gradient border. */}
            {nodes.map((n, i) => (
              <foreignObject
                key={n.n}
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="turbo-node-border h-full w-full rounded-2xl p-[1.5px]"
                >
                  <div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[color:var(--color-ink-950)] p-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-[color:var(--color-mint-500)]/20 font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold text-[color:var(--color-mint-400)]">
                        {String(n.n).padStart(2, "0")}
                      </span>
                      {n.tag && (
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-white/50">
                          {n.tag}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">
                        {n.title}
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-white/60">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </foreignObject>
            ))}
          </svg>
        </div>

        <p className="relative border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/50">
          Desliza horizontalmente si el diagrama no cabe · zig-zag de arriba
          abajo para seguir el orden.
        </p>
      </div>
    </>
  );
}
