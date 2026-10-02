"use client";

import { useEffect } from "react";
import { trackEvent, withPageReference } from "@/lib/analytics";

// One delegated click listener for every conversion link on the site, so
// server components (footer, early CTA, service pages) need no client code —
// they only tag their links with `data-cta="<placement>"`.
//
//  - WhatsApp links (wa.me): the prefilled message gets the current page
//    title appended, then a `whatsapp_click` event is sent to GA4.
//  - Links to /<lang>/contacto: a `contact_click` event.
//
// Runs in the capture phase, before the browser follows the link, so the
// rewritten href is the one that opens. The original href is kept in
// `data-wa-base` so repeated clicks never stack references.

const CONTACT_PATH = /^\/(es|pt|en)\/contacto\/?$/;

export function CtaTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const cta = link.dataset.cta ?? "untagged";
      const locale = document.documentElement.lang || "es";
      const params = { cta, page_path: window.location.pathname, locale };

      if (link.href.includes("wa.me/")) {
        const base = link.dataset.waBase ?? link.href;
        link.dataset.waBase = base;
        link.href = withPageReference(base, document.title, locale);
        trackEvent("whatsapp_click", params);
        return;
      }

      const path = link.getAttribute("href") ?? "";
      if (CONTACT_PATH.test(path)) trackEvent("contact_click", params);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
