"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n";
import { postLocales } from "@/lib/post-locales.generated";
import { cn } from "@/lib/utils";

// Swaps the leading locale segment of the current path, preserving the rest.
function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  // parts[0] is "" (leading slash); parts[1] is the current locale.
  if (parts.length > 1) parts[1] = next;
  const joined = parts.join("/");
  return joined || `/${next}`;
}

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  // On a blog post, only offer locales that actually publish it. Not every
  // post is translated (the Peru cluster is `es`-only), and blindly swapping
  // the locale prefix would drop the reader on a 404. The lookup table is
  // built at module load, so this stays a pure client-side check.
  const slug = pathname.match(/^\/[^/]+\/blog\/([^/]+)\/?$/)?.[1];
  const available = slug ? postLocales[slug] : undefined;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Idioma">
      {locales.map((l) => {
        const active = l === current;
        // Missing translation: send them to that locale's blog index, which is
        // a real page in their language, instead of a dead URL.
        const missing = available ? !available.includes(l) : false;
        const href = missing ? `/${l}/blog` : swapLocale(pathname, l);
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
