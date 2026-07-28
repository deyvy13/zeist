"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

// Interactive FAQ list. Emits FAQPage JSON-LD on the server via a separate
// helper (in mdx-content) so the schema stays SEO-friendly even without JS.

export type FaqItem = { q: string; a: string };

export function Faq({ items = [], title }: { items?: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mt-12">
      {title && (
        <h2 className="!mt-0 text-2xl md:text-3xl">{title}</h2>
      )}
      <div className="mt-6 divide-y divide-[color:var(--color-hairline)] rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="px-6 py-4">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl leading-none text-[color:var(--color-mint-700)]"
                  aria-hidden
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-[color:var(--color-muted)]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Server helper: emits <script type="application/ld+json"> with FAQPage schema
// so Google can render the FAQ rich result even before hydration.
export function FaqJsonLd({ items = [] }: { items?: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function Faqs({ items, title }: { items?: FaqItem[]; title?: string }) {
  return (
    <>
      <FaqJsonLd items={items} />
      <Faq items={items} title={title} />
    </>
  );
}
