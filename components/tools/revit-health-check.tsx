"use client";

import { useId, useMemo, useState } from "react";
import {
  HEALTH_THRESHOLDS,
  assessHealth,
  parseWarningsReport,
  type HealthIndicator,
  type HealthLevel,
  type WarningReport,
} from "@/lib/tools/revit-health";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";
import { trackEvent } from "@/lib/analytics";

// -----------------------------------------------------------------------------
// Revit model health check: reads the warnings report Revit exports (in the
// browser, the file never leaves it) plus four numbers, and rates each one
// against Zeist's reference thresholds (lib/tools/revit-health.ts). Copy in
// lib/tools-content/revit-salud.ts. Templates use {placeholders}.
// -----------------------------------------------------------------------------

export type RevitHealthLabels = {
  reportTitle: string;
  reportHint: string;
  reportButton: string;
  /** {total} {types} {elements} */
  reportLoaded: string;
  reportEmpty: string;
  numbersTitle: string;
  fields: Record<HealthIndicator, { label: string; hint: string; unit?: string }>;
  results: string;
  score: string;
  bands: Record<HealthLevel, string>;
  levels: Record<HealthLevel, string>;
  /** {good} {fair} — the indicator's thresholds */
  thresholds: string;
  advice: Record<HealthIndicator, Record<HealthLevel, string>>;
  topWarnings: string;
  /** {n} */
  occurrences: string;
  empty: string;
  note: string;
};

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] aria-[invalid=true]:border-red-400";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";
const ORDER: HealthIndicator[] = ["warnings", "fileSize", "importedCad", "inPlace"];
// Tinted backgrounds with the theme foreground: readable in light and dark.
const BADGE: Record<HealthLevel, string> = {
  good: "bg-[color:var(--color-mint-500)]/25 text-[color:var(--color-foreground)]",
  fair: "bg-amber-500/25 text-[color:var(--color-foreground)]",
  poor: "bg-red-500/25 text-[color:var(--color-foreground)]",
};

/** Revit may write the report as UTF-16 (with a BOM) or as UTF-8. */
function decode(buffer: ArrayBuffer): string {
  const b = new Uint8Array(buffer);
  if (b[0] === 0xff && b[1] === 0xfe) return new TextDecoder("utf-16le").decode(b);
  if (b[0] === 0xfe && b[1] === 0xff) return new TextDecoder("utf-16be").decode(b);
  const utf8 = new TextDecoder("utf-8").decode(b);
  return utf8.includes("�") ? new TextDecoder("windows-1252").decode(b) : utf8;
}

export function RevitHealthCheck({ labels, locale }: { labels: RevitHealthLabels; locale: "es" | "pt" | "en" }) {
  const [report, setReport] = useState<WarningReport | null>(null);
  const [reportError, setReportError] = useState(false);
  const [values, setValues] = useState<Record<HealthIndicator, string>>({ warnings: "", fileSize: "", importedCad: "", inPlace: "" });
  const fileId = useId();
  const style = NUMBER_STYLES[locale];
  const t = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

  const result = useMemo(() => {
    const num = (v: string) => (v.trim() === "" ? null : parseDecimal(v));
    return assessHealth({
      warnings: num(values.warnings),
      fileSize: num(values.fileSize),
      importedCad: num(values.importedCad),
      inPlace: num(values.inPlace),
    });
  }, [values]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const parsed = parseWarningsReport(decode(await file.arrayBuffer()));
    if (!parsed.total) {
      setReport(null);
      setReportError(true);
      return;
    }
    setReport(parsed);
    setReportError(false);
    setValues((v) => ({ ...v, warnings: String(parsed.total) }));
    trackEvent("tool_import", { tool: "diagnostico-modelo-revit", format: "html", warnings: parsed.total });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ============================ INPUTS ========================== */}
      <div className="surface space-y-5 rounded-3xl p-5 sm:p-6">
        <div>
          <h3 className="text-base font-semibold">{labels.reportTitle}</h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">{labels.reportHint}</p>
          <label
            htmlFor={fileId}
            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium transition hover:border-[color:var(--color-mint-500)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--color-mint-500)]"
          >
            {labels.reportButton}
            <input id={fileId} type="file" accept=".html,.htm,text/html" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          {report && (
            <p className="mt-3 text-sm">
              {t(labels.reportLoaded, { total: report.total, types: report.groups.length, elements: report.elements })}
            </p>
          )}
          {reportError && <p className="mt-3 rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm">{labels.reportEmpty}</p>}
        </div>

        <div className="border-t border-[color:var(--color-hairline)] pt-5">
          <h3 className="text-base font-semibold">{labels.numbersTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {ORDER.map((id) => {
              const f = labels.fields[id];
              const v = values[id];
              return (
                <label key={id} className="block">
                  <span className={LABEL}>{f.label}</span>
                  <span className="relative block">
                    <input
                      value={v}
                      onChange={(e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))}
                      inputMode="decimal"
                      aria-invalid={v.trim() !== "" && !(parseDecimal(v) >= 0)}
                      className={`${FIELD} ${f.unit ? "pr-12" : ""}`}
                    />
                    {f.unit && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-muted)]">
                        {f.unit}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-xs text-[color:var(--color-muted)]">{f.hint}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================ RESULTS ========================= */}
      <div aria-live="polite" className="surface rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        {result.score === null || !result.band ? (
          <p className="mt-4 text-sm text-[color:var(--color-muted)]">{labels.empty}</p>
        ) : (
          <>
            <div className="mt-4 flex items-end gap-4">
              <span className="font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tabular-nums text-[color:var(--color-mint-700)]">
                {result.score}
              </span>
              <span className="pb-1.5 text-sm text-[color:var(--color-muted)]">/ 100 · {labels.score}</span>
              <span className={`mb-1.5 ml-auto rounded-full px-3 py-1 text-xs font-semibold ${BADGE[result.band]}`}>{labels.bands[result.band]}</span>
            </div>
            <ul className="mt-5 space-y-3">
              {result.items.map((item) => {
                const [good, fair] = HEALTH_THRESHOLDS[item.id];
                return (
                  <li key={item.id} className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{labels.fields[item.id].label}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[item.level]}`}>
                        {formatNumber(item.value, Number.isInteger(item.value) ? 0 : 1, style)} · {labels.levels[item.level]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[color:var(--color-muted)]">{labels.advice[item.id][item.level]}</p>
                    <p className="mt-1 text-xs text-[color:var(--color-muted)]">{t(labels.thresholds, { good, fair })}</p>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {report && report.groups.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-semibold">{labels.topWarnings}</h4>
            <ol className="mt-2 space-y-2 text-sm">
              {report.groups.slice(0, 8).map((g) => (
                <li key={g.message} className="flex gap-3 border-t border-[color:var(--color-hairline)] pt-2">
                  <span className="shrink-0 font-semibold tabular-nums text-[color:var(--color-mint-700)]">
                    {t(labels.occurrences, { n: g.count })}
                  </span>
                  <span className="text-[color:var(--color-muted)]">{g.message}</span>
                </li>
              ))}
            </ol>
          </>
        )}
        <p className="mt-5 text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.note}</p>
      </div>
    </div>
  );
}
