"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/site";
import { Logo } from "@/components/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: dict.nav.services, href: localizedPath(lang, "servicios") },
    { label: dict.nav.blog, href: localizedPath(lang, "blog") },
    {
      label: dict.nav.tools,
      href: localizedPath(lang, "herramientas"),
      badge: dict.nav.toolsSoon,
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-[color:var(--color-hairline)] bg-[color:var(--color-background)]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-zeist">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo lang={lang} />

          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Principal"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm font-medium text-[color:var(--color-muted)] transition hover:text-[color:var(--color-foreground)]"
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-mint-700)]">
                    · {item.badge}
                  </span>
                )}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[color:var(--color-mint-500)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LocaleSwitcher current={lang} />
            </div>
            <ThemeToggle />
            <Link
              href={localizedPath(lang, "contacto")}
              className="btn-primary hidden text-sm sm:inline-flex"
            >
              {dict.nav.cta}
            </Link>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-border)] md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — full-width dropdown */}
      {open && (
        <div className="border-t border-[color:var(--color-hairline)] bg-[color:var(--color-background)]/95 backdrop-blur-xl md:hidden">
          <div className="container-zeist flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-[color:var(--color-mint-500)]/10"
              >
                {item.label}
                {item.badge && (
                  <span className="ml-2 text-[10px] font-semibold uppercase text-[color:var(--color-mint-700)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href={localizedPath(lang, "contacto")}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 text-sm"
            >
              {dict.nav.cta}
            </Link>
            <div className="mt-3">
              <LocaleSwitcher current={lang} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
