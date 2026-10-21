// FAQ list for posts. Native <details>: every answer ships in the HTML, open or
// closed, so Google and AI crawlers (which don't run JS or click) read the same
// answers the FAQPage JSON-LD declares. The animated version mounted only the
// open answer, which left 7 of 8 answers out of the page.

export type FaqItem = { q: string; a: string };

export function Faq({ items = [], title }: { items?: FaqItem[]; title?: string }) {
  return (
    <section className="mt-12">
      {title && (
        <h2 className="!mt-0 text-2xl md:text-3xl">{title}</h2>
      )}
      <div className="mt-6 divide-y divide-[color:var(--color-hairline)] rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="!mt-0 text-base font-semibold leading-snug">{item.q}</h3>
              <span
                aria-hidden
                className="text-xl leading-none text-[color:var(--color-mint-700)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pt-3 text-[color:var(--color-muted)]">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Server helper: emits <script type="application/ld+json"> with FAQPage schema.
// The answers it declares are the same ones rendered above.
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
