"use client";

import { useSyncExternalStore } from "react";
import { ANALYTICS_OPTOUT_KEY, gaMeasurementId } from "@/lib/analytics";

// Opt-out switch for the privacy page. The choice lives in localStorage and is
// read by the GA4 loader (components/analytics.tsx) on every page load.
// useSyncExternalStore keeps SSR and the first client render identical (the
// server snapshot is `null` = unknown) and reacts to changes in other tabs.

export type AnalyticsOptOutLabels = {
  active: string;
  inactive: string;
  disable: string;
  enable: string;
  enabledNote: string;
  unavailable: string;
};

type Gtag = (...args: unknown[]) => void;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readOptOut(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS_OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Removes Google Analytics cookies (_ga, _ga_<id>) for this host. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name || !name.startsWith("_ga")) continue;
    for (const domain of ["", host, `.${host}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

function setOptOut(optOut: boolean) {
  try {
    if (optOut) window.localStorage.setItem(ANALYTICS_OPTOUT_KEY, "1");
    else window.localStorage.removeItem(ANALYTICS_OPTOUT_KEY);
  } catch {
    // Storage blocked: the switch below still applies to this page view.
  }
  if (gaMeasurementId) {
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaMeasurementId}`] = optOut;
  }
  if (optOut) {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
  }
  listeners.forEach((notify) => notify());
}

export function AnalyticsOptOut({ labels }: { labels: AnalyticsOptOutLabels }) {
  const optedOut = useSyncExternalStore(subscribe, readOptOut, () => null);

  if (!gaMeasurementId) {
    return <p className="text-sm text-[color:var(--color-muted)]">{labels.unavailable}</p>;
  }

  return (
    <div className="surface flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm" aria-live="polite">
        <span
          aria-hidden
          className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${optedOut ? "bg-[color:var(--color-muted)]" : "bg-[color:var(--color-mint-500)]"}`}
        />
        {optedOut === null ? "…" : optedOut ? labels.inactive : labels.active}
        {optedOut === false ? null : optedOut ? (
          <span className="mt-1 block text-xs text-[color:var(--color-muted)]">{labels.enabledNote}</span>
        ) : null}
      </p>
      <button
        type="button"
        disabled={optedOut === null}
        onClick={() => setOptOut(!optedOut)}
        className="btn-ghost shrink-0 text-sm"
      >
        {optedOut ? labels.enable : labels.disable}
      </button>
    </div>
  );
}
