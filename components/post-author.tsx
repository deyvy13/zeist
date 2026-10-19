import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedPath, site } from "@/lib/site";

// Byline box at the end of every guide: who writes it, with a link to the about
// page and to the LinkedIn profile, the same ones the BlogPosting JSON-LD cites.
export function PostAuthor({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <aside aria-label={dict.blog.authorTitle} className="mt-16 border-t border-[color:var(--color-hairline)] pt-8">
      <p className="eyebrow eyebrow-plain">{dict.blog.authorTitle}</p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <Image src="/icon-512.png" alt="" width={512} height={512} className="h-10 w-10" />
        </span>
        <div>
          <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold">{site.name}</p>
          <p className="mt-2 text-[color:var(--color-muted)]">{dict.blog.authorBio}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link href={localizedPath(lang, "nosotros")} rel="author" className="text-[color:var(--color-mint-700)] hover:underline">
              {dict.blog.authorMore}
            </Link>
            <a href={site.linkedin} target="_blank" rel="noopener" className="text-[color:var(--color-mint-700)] hover:underline">
              {dict.blog.authorLinkedin} ↗
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
