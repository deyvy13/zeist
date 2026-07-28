"use client";

import { useState } from "react";
import { LearningPath } from "./learning-path";
import { TurboFlow } from "./turbo-flow";
import type { RoadmapStep } from "@/lib/blog-data";

// Wraps the roadmap in a small tab switcher: "Lista" (grid of cards) or
// "Diagrama" (ReactFlow turbo-flow). Both consume the same steps array.

export function RoadmapView({
  steps,
  title,
  intro,
  locale = "es",
}: {
  steps: RoadmapStep[];
  title?: string;
  intro?: string;
  locale?: "es" | "pt";
}) {
  const [view, setView] = useState<"list" | "flow">("list");
  const labels = {
    es: { list: "Lista", flow: "Diagrama" },
    pt: { list: "Lista", flow: "Diagrama" },
  }[locale];

  return (
    <div className="mt-10">
      <div className="flex items-center justify-end">
        <div
          role="tablist"
          aria-label="Vista del roadmap"
          className="inline-flex rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-1"
        >
          {(["list", "flow"] as const).map((k) => {
            const active = view === k;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => setView(k)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
                  active
                    ? "bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                    : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
                }`}
              >
                {labels[k]}
              </button>
            );
          })}
        </div>
      </div>

      {view === "list" ? (
        <LearningPath steps={steps} title={title} intro={intro} />
      ) : (
        <TurboFlow steps={steps} />
      )}
    </div>
  );
}
