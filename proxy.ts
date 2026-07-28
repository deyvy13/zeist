import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

// -----------------------------------------------------------------------------
// Locale routing (Next.js 16 "proxy", formerly "middleware").
// Redirects non-prefixed paths to a locale-prefixed URL, picking the best
// locale from the Accept-Language header. Both locales are always prefixed.
// -----------------------------------------------------------------------------

function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  // Parse "es-PE,es;q=0.9,pt-BR;q=0.8" -> ordered base languages.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base as Locale;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension
  // (sitemap.xml, robots.txt, favicon.ico, images, opengraph-image, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
