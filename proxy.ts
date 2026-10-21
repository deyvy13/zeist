import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { resolveRoute } from "@/lib/routes";

// -----------------------------------------------------------------------------
// Locale routing (Next.js 16 "proxy", formerly "middleware").
//  - A path without a locale is redirected to a locale-prefixed URL, picking
//    the best locale from the Accept-Language header.
//  - Each page has its URL in its own language (lib/routes.ts): the public URL
//    is rewritten to its app folder (/en/tools/utm-converter is served by
//    app/[lang]/herramientas/conversor-de-coordenadas), and every old URL gets a
//    permanent redirect to the new one (/en/herramientas/… → /en/tools/…).
// The old-domain redirects (zeist.vercel.app → zeist.dev) live in Vercel.
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
  if (hasLocale) {
    const route = resolveRoute(pathname);
    if (!route) return;
    const url = request.nextUrl.clone();
    if ("redirect" in route) {
      url.pathname = route.redirect;
      return NextResponse.redirect(url, 308);
    }
    url.pathname = route.rewrite;
    return NextResponse.rewrite(url);
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, the OG image (no extension, so it needs
  // its own exclusion — otherwise it redirects to /es/opengraph-image, a 404)
  // and any file with an extension (sitemap.xml, robots.txt, favicon.ico…).
  matcher: ["/((?!_next|api|opengraph-image|.*\\..*).*)"],
};
