"use client";

import { motion } from "motion/react";
import { useStepsSafe } from "./steps-provider";

// Sticky table-of-contents shown next to the article on desktop. Reads the
// registered TopicCards from the provider, highlights the one currently in
// view (via IntersectionObserver in TopicCard), and scrolls-to on click.
// Hidden on small screens where the floating pill already tells progress.

export function PostTOC({ locale = "es" }: { locale?: "es" | "pt" }) {
  const ctx = useStepsSafe();
  if (!ctx || ctx.steps.length === 0) return null;

  const label = locale === "pt" ? "Nesta guia" : "En esta guía";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // If closed, open first so the reader lands on visible content.
    if (!ctx.isOpen(id)) ctx.toggle(id);
    // Wait a tick so the expansion starts, then scroll.
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <aside
      className="hidden xl:block xl:sticky xl:top-24 xl:h-fit xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"
      aria-label={label}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
        {label}
      </p>
      <ol className="space-y-1 border-l border-[color:var(--color-hairline)] pl-4">
        {ctx.steps.map((s) => {
          const active = ctx.activeId === s.id;
          const done = ctx.isOpen(s.id);
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                className={`flex w-full items-start gap-2 py-1.5 text-left text-sm transition ${
                  active
                    ? "font-semibold text-[color:var(--color-mint-700)]"
                    : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
                }`}
              >
                <span className="mt-0.5 font-[family-name:var(--font-space-grotesk)] text-xs opacity-70">
                  {String(s.step).padStart(2, "0")}
                </span>
                <span className="flex-1 leading-snug">
                  {stripLeadingNumber(s.label)}
                </span>
                {done && !active && (
                  <span
                    aria-hidden
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-mint-500)]"
                  />
                )}
              </button>
              {active && (
                <motion.span
                  layoutId="toc-marker"
                  aria-hidden
                  className="absolute -left-[17px] top-2 h-4 w-[2px] rounded-full bg-[color:var(--color-mint-500)]"
                  style={{ filter: "drop-shadow(0 0 4px var(--color-mint-500))" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

// The TopicCard titles already prefix "1. " for readability; drop it in the TOC
// since the step chip already shows the number.
function stripLeadingNumber(label: string): string {
  return label.replace(/^\s*\d+\.\s*/, "");
}
