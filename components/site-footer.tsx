import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath, site } from "@/lib/site";
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
              href={`mailto:${site.email}`}
              className="mt-5 inline-block text-sm font-medium text-[color:var(--color-mint-400)] hover:text-[color:var(--color-mint-300)]"
            >
              {site.email}
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
