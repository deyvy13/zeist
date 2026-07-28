import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  lang,
  className,
}: {
  lang: Locale;
  className?: string;
}) {
  return (
    <Link
      href={localizedPath(lang)}
      aria-label="Zeist — inicio"
      className={cn(
        "font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight",
        className,
      )}
    >
      <span className="text-[color:var(--color-foreground)]">Zeist</span>
      <span className="text-[color:var(--color-mint-500)]">.</span>
    </Link>
  );
}
