import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath, site, whatsappUrl } from "@/lib/site";
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
          label: dict.footer.links.contact,
          href: localizedPath(lang, "contacto"),
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
            <Link
              href={localizedPath(lang)}
              className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight text-white"
            >
              Zeist<span className="text-[color:var(--color-mint-500)]">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              {dict.footer.tagline}
            </p>
            <a
              href={whatsappUrl(dict.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.whatsapp.aria}
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
          <p className="text-xs text-white/50">
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <LocaleSwitcher current={lang} />
        </div>
      </div>
    </footer>
  );
}
