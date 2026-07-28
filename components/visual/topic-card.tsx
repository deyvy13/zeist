"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, type ReactNode } from "react";
import { useStepsSafe } from "./steps-provider";

// TopicCard is the collapsible unit inside a learning-path style article.
// - Auto-registers with the surrounding <StepsProvider> so a floating progress
//   pill can show "X/N" without the article author counting manually.
// - Header (number + title + time + chevron) is always visible.
// - Body collapses/expands with a soft height animation.
// - "Open" state is persisted per post-slug in the provider's localStorage.

export function TopicCard({
  step,
  title,
  time,
  children,
  defaultOpen = false,
}: {
  step: number | string;
  title: string;
  time?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const reactId = useId();
  const id = `${step}-${reactId}`;
  const ctx = useStepsSafe();

  useEffect(() => {
    ctx?.register(id);
  }, [ctx, id]);

  // If no provider (e.g. rendered outside a blog post), fall back to open.
  const open = ctx ? ctx.isOpen(id) || (defaultOpen && !ctx.openedCount) : true;
  const contentId = `topic-${id}-content`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`surface relative mt-6 overflow-hidden rounded-3xl transition-colors ${
        open
          ? "border-[color:var(--color-mint-500)]/60"
          : "hover:border-[color:var(--color-mint-500)]/40"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 transition-opacity"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,206,0.4), transparent 70%)",
          opacity: open ? 0.55 : 0.25,
        }}
      />

      <button
        type="button"
        onClick={() => ctx?.toggle(id)}
        aria-expanded={open}
        aria-controls={contentId}
        className="relative flex w-full items-start gap-5 p-6 text-left md:p-8"
      >
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-[family-name:var(--font-space-grotesk)] text-lg font-bold transition-colors ${
            open
              ? "bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
              : "bg-[color:var(--color-mint-500)]/12 text-[color:var(--color-mint-700)]"
          }`}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12l5 5 9-11" />
            </svg>
          ) : (
            typeof step === "number" ? String(step).padStart(2, "0") : step
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="!mt-0 text-xl md:text-2xl">{title}</h3>
            {time && <span className="tag">{time}</span>}
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-3 mt-1 text-[color:var(--color-mint-700)]"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="relative px-6 pb-6 md:px-8 md:pb-8">
              <div className="pl-[68px] text-[color:var(--color-foreground)]/90 md:pl-[68px]">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
