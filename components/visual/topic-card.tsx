"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";
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
  const id = `${step}-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const ctx = useStepsSafe();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ctx?.register({ id, label: title, step: String(step) });
  }, [ctx, id, title, step]);

  // Track viewport visibility so the TOC can highlight the active card.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !ctx) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) ctx.setActive(id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ctx, id]);

  // If no provider (e.g. rendered outside a blog post), fall back to open.
  const open = ctx ? ctx.isOpen(id) || (defaultOpen && !ctx.openedCount) : true;
  const contentId = `topic-${id}-content`;

  return (
    <motion.div
      id={id}
      ref={rootRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`scroll-mt-24 mt-6 rounded-3xl ${open ? "turbo-border" : ""}`}
    >
      <div
        className={`surface relative overflow-hidden rounded-3xl transition-colors ${
          open
            ? "border-transparent"
            : "hover:border-[color:var(--color-mint-500)]/40"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full transition-opacity"
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
          className="relative flex w-full items-start gap-3.5 p-5 text-left sm:gap-5 sm:p-6 md:p-8"
        >
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-[family-name:var(--font-space-grotesk)] text-base font-bold transition-colors sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg ${
              open
                ? "bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                : "bg-[color:var(--color-mint-500)]/12 text-[color:var(--color-mint-700)]"
            }`}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12l5 5 9-11" />
              </svg>
            ) : (
              typeof step === "number" ? String(step).padStart(2, "0") : step
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <h3 className="!mt-0 text-lg leading-snug sm:text-xl md:text-2xl">{title}</h3>
              {time && <span className="tag">{time}</span>}
            </div>
          </div>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="ml-1 mt-1 shrink-0 text-[color:var(--color-mint-700)] sm:ml-3"
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
              <div className="relative px-5 pb-5 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
                <div className="border-t border-[color:var(--color-hairline)] pt-4 text-[color:var(--color-foreground)]/90">
                  {children}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
