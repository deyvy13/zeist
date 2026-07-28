"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n";
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

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Idioma">
      {locales.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            href={swapLocale(pathname, l)}
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
