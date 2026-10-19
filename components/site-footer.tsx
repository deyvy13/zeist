import Image from "next/image";
import Link from "next/link";
import { localeNames, locales, type Dictionary, type Locale } from "@/lib/i18n";
import { localizedPath, mailtoUrl, site, whatsappUrl } from "@/lib/site";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: dict.footer.columns.services,
      links: dict.services.items.map((s) => ({
        label: s.title,
        href: localizedPath(lang, `servicios/${s.slug}`),
      })),
    },
    {
      title: dict.footer.columns.resources,
      links: [
        { label: dict.footer.links.blog, href: localizedPath(lang, "blog") },
        {
          label: dict.footer.links.tools,
          href: localizedPath(lang, "herramientas"),
        },
      ],
    },
    {
      title: dict.footer.columns.company,
      links: [
        {
          label: dict.footer.links.about,
          href: localizedPath(lang, "nosotros"),
        },
        {
          label: dict.footer.links.contact,
          href: localizedPath(lang, "contacto"),
        },
        {
          label: dict.footer.links.privacy,
          href: localizedPath(lang, "privacidad"),
        },
      ],
    },
  ];

  return (
    <footer className="band-ink relative mt-24 w-full overflow-hidden">
      {/* subtle mint glow bleeding from the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-60"
        style={{
          background:
            "radial-gradient(50rem 20rem at 50% 0%, rgba(0,255,206,0.18), transparent 70%)",
        }}
      />
      <div className="container-zeist relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <Link href={localizedPath(lang)} aria-label="Zeist" className="block">
              <Image
                src="/logo-horizontal.png"
                alt="Zeist"
                width={1532}
                height={313}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              {dict.footer.tagline}
            </p>
            <a
              href={whatsappUrl(dict.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.whatsapp.aria}
              data-cta="footer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-mint-400)] transition hover:text-[color:var(--color-mint-300)]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.24 8.24 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z" />
              </svg>
              {site.whatsapp.display}
            </a>
            {site.showEmail && (
              <a
                href={mailtoUrl()}
                data-cta="footer-email"
                className="mt-3 flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {site.email}
              </a>
            )}
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener"
              className="mt-3 flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              {dict.footer.links.linkedin}
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-white/50">
              © {year} {site.name}. {dict.footer.rights}
            </p>
            {/* Plain crawlable links to every locale home, on every page: the
                /en and /pt roots otherwise only get links from the switcher. */}
            <nav aria-label={dict.footer.languages} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
              <span>{dict.footer.languages}:</span>
              {locales.map((l) => (
                <Link key={l} href={localizedPath(l)} hrefLang={l} className="transition hover:text-white">
                  {localeNames[l]}
                </Link>
              ))}
            </nav>
          </div>
          <LocaleSwitcher current={lang} />
        </div>
      </div>
    </footer>
  );
}
