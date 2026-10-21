"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n";
import { internalPath, localesOf, publicPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  // Each language has its own URL for the same page (/en/tools/utm-converter,
  // /pt/ferramentas/conversor-de-coordenadas). internalPath() reads the page
  // from any form of the URL: after a rewrite the server sees the app folder
  // and the browser sees the public URL, and both give the same links, so the
  // hydrated HTML matches.
  const { path } = internalPath(pathname);
  // Not everything is translated (the Peru cluster and the steel calculator
  // are `es`-only): a missing translation sends the reader to that locale's
  // section index, a real page in their language, instead of a dead URL.
  const available = localesOf(path);
  const section = path.split("/")[0];

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Idioma">
      {locales.map((l) => {
        const active = l === current;
        const href = available.includes(l) ? publicPath(l, path) : publicPath(l, section);
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition",
              active
                ? "bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
            )}
            title={localeNames[l]}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
