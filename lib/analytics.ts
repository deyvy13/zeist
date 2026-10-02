// -----------------------------------------------------------------------------
// Analytics — Google Analytics 4 + lead attribution.
//
// Two complementary measurements:
//  1. GA4 (optional, env-gated): page views and conversion events such as
//     `whatsapp_click` and `contact_click`. Loads only when NEXT_PUBLIC_GA_ID
//     is set at build time, so local builds and previews stay clean.
//  2. Page reference in the WhatsApp message (always on, no cookies): when a
//     visitor taps a WhatsApp button, the prefilled text gets the title of the
//     page they were reading. Leads arrive self-attributed in the chat itself,
//     even if GA4 is never configured.
//
// Pure module: safe to import from server and client components.
// -----------------------------------------------------------------------------

const rawId = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** GA4 measurement ID, only if it has the expected shape (guards the inline script). */
export const gaMeasurementId = /^G-[A-Z0-9]{4,20}$/.test(rawId) ? rawId : "";

type Gtag = (...args: unknown[]) => void;
type EventParams = Record<string, string | number>;

/** Sends a GA4 event. No-op when GA4 isn't loaded (no ID, blocked, or SSR). */
export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}

const pageLabel: Record<string, string> = { es: "Página", pt: "Página", en: "Page" };

/** Current page title without the " — Zeist" template suffix. */
export function cleanPageTitle(title: string): string {
  return title.replace(/\s+[—-]\s+Zeist\s*$/u, "").trim();
}

/**
 * Appends "(Página: <title>)" to a wa.me prefilled message. Visible to the
 * visitor, who can edit it before sending — it reads as context, not tracking.
 * Returns the href untouched if it isn't a parseable wa.me link.
 */
export function withPageReference(href: string, title: string, locale: string): string {
  try {
    const url = new URL(href);
    if (!url.hostname.endsWith("wa.me")) return href;
    const label = pageLabel[locale] ?? pageLabel.es;
    const base = url.searchParams.get("text") ?? "";
    const ref = `(${label}: ${cleanPageTitle(title)})`;
    url.searchParams.set("text", base ? `${base}\n\n${ref}` : ref);
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Regions where analytics cookies stay off by default (GDPR/UK GDPR/Swiss law).
 * There is no consent banner, so visitors there are never cookied; GA4 sends
 * only cookieless pings. Everywhere else, analytics storage is granted.
 * Advertising storage is denied everywhere — the site runs no ads.
 */
export const consentDeniedRegions = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];
