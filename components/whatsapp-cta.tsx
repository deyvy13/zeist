"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { IconWhatsApp } from "@/components/icons";

// -----------------------------------------------------------------------------
// Persistent WhatsApp entry point, present on every page.
//
//  - Desktop (md+): circular floating button, bottom-right. Sonar rings + the
//    site's signature rotating conic ring (--turbo-angle, shared with
//    .turbo-border in globals.css) so it reads as Zeist and not as a plugin.
//    An attention bubble opens once per session with a concrete question.
//  - Mobile (<md): full-width bar pinned to the bottom. Thumb-reachable, with
//    the CTA copy carrying the persuasion (specific promise + risk reversal),
//    which a bare icon cannot do.
//
// Continuous motion is CSS, not JS: the global prefers-reduced-motion rule in
// globals.css neutralizes it for free, and it never competes with scrolling.
// -----------------------------------------------------------------------------

export type WhatsAppStrings = {
  aria: string;
  hoverLabel: string;
  bubbleTitle: string;
  bubbleBody: string;
  mobileCta: string;
  mobileSub: string;
  prefill: string;
  dismiss: string;
  contactLead: string;
  contactCta: string;
  footerLabel: string;
};

const BUBBLE_KEY = "zeist-wa-bubble";
const BUBBLE_DELAY_MS = 7000;
const BUBBLE_LIFETIME_MS = 12000;

export function WhatsAppCta({
  href,
  strings,
}: {
  href: string;
  strings: WhatsAppStrings;
}) {
  const reduce = useReducedMotion();
  const [bubble, setBubble] = useState(false);

  // The bubble is an interruption, so it earns at most one appearance per
  // session. sessionStorage throws in some privacy modes — never let that
  // take the button down with it.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(BUBBLE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const open = setTimeout(() => {
      setBubble(true);
      try {
        sessionStorage.setItem(BUBBLE_KEY, "1");
      } catch {
        /* private mode: the bubble simply shows again next load */
      }
    }, BUBBLE_DELAY_MS);

    return () => clearTimeout(open);
  }, []);

  useEffect(() => {
    if (!bubble) return;
    const close = setTimeout(() => setBubble(false), BUBBLE_LIFETIME_MS);
    return () => clearTimeout(close);
  }, [bubble]);

  const linkProps = {
    href,
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Desktop: circular floating button                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block">
        <AnimatePresence>
          {bubble && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="pointer-events-auto absolute bottom-[5.25rem] right-0 w-72 origin-bottom-right"
            >
              <div className="surface relative rounded-2xl rounded-br-md p-4 shadow-[var(--elev-2)]">
                <button
                  type="button"
                  onClick={() => setBubble(false)}
                  aria-label={strings.dismiss}
                  className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full text-[color:var(--color-muted)] transition hover:bg-[color:var(--color-hairline)] hover:text-[color:var(--color-foreground)]"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <a {...linkProps} data-cta="floating-bubble" className="block pr-6">
                  <p className="text-sm font-semibold leading-snug">
                    {strings.bubbleTitle}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-muted)]">
                    {strings.bubbleBody}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-mint-700)]">
                    {strings.contactCta}
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.9 }}
          className="pointer-events-auto group relative"
        >
          {/* Label slides out on hover — no layout shift, the circle stays put. */}
          <span className="pointer-events-none absolute right-[4.5rem] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[color:var(--color-ink-950)] px-3.5 py-2 text-xs font-semibold text-white opacity-0 shadow-[var(--elev-2)] transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
            {strings.hoverLabel}
          </span>

          {/* Sonar rings: pure decoration, kept behind the button. */}
          <span aria-hidden="true" className="wa-sonar" />
          <span aria-hidden="true" className="wa-sonar wa-sonar-delay" />

          <a
            {...linkProps}
            aria-label={strings.aria}
            data-cta="floating-button"
            className="wa-ring relative grid h-16 w-16 place-items-center rounded-full"
          >
            <span className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(140deg,#2ee06a,#12a150)] text-white shadow-[0_10px_30px_-8px_rgba(18,161,80,0.75)] transition-transform duration-300 group-hover:scale-[1.06] group-active:scale-95">
              <IconWhatsApp className="h-8 w-8" />
            </span>
          </a>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile: full-width bottom bar                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="border-t border-[color:var(--color-hairline)] bg-[color:var(--color-background)]/85 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl">
          <a
            {...linkProps}
            aria-label={strings.aria}
            data-cta="mobile-bar"
            className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#2ee06a,#12a150)] px-4 py-3 text-white shadow-[0_8px_24px_-10px_rgba(18,161,80,0.9)] active:scale-[0.985] transition-transform"
          >
            <span aria-hidden="true" className="wa-shimmer" />
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20">
              <IconWhatsApp className="h-6 w-6" />
            </span>
            <span className="relative min-w-0 flex-1 text-left">
              <span className="block truncate text-[0.95rem] font-semibold leading-tight">
                {strings.mobileCta}
              </span>
              <span className="mt-0.5 block truncate text-[0.7rem] font-medium leading-tight text-white/80">
                {strings.mobileSub}
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="relative h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
