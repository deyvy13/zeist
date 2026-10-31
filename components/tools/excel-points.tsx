"use client";

import { useId, useMemo, useState } from "react";
import { buildPointFile, parsePointTable, type PointColumn, type PointFormat } from "@/lib/tools/points";
import { downloadFile } from "@/components/tools/download";
import { trackEvent } from "@/lib/analytics";

// -----------------------------------------------------------------------------
// Excel → Civil 3D points: paste a table in any column order and download a
// PNEZD/PENZD file that Civil 3D imports at the first try. Everything runs in
// the browser. Parsing in lib/tools/points.ts; copy in
// lib/tools-content/excel-puntos.ts. Templates use {placeholders}.
// -----------------------------------------------------------------------------

export type ExcelPointsLabels = {
  input: string;
  inputHint: string;
  example: string;
  loadExample: string;
  clear: string;
  columnsTitle: string;
  /** {n} */
  column: string;
  columnNames: Record<PointColumn, string>;
  format: string;
  start: string;
  results: string;
  points: string;
  skipped: string;
  missingZ: string;
  preview: string;
  /** {n} */
  more: string;
  download: string;
  downloadTxt: string;
  empty: string;
  noCoords: string;
  ambiguous: string;
  /** {start} */
  renumbered: string;
  /** {list} */
  duplicates: string;
  /** {n} */
  zeroZ: string;
  /** {lines} */
  skippedLines: string;
  privacy: string;
};

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] aria-[invalid=true]:border-red-400";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";
const SMALL_BTN =
  "rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-sm font-medium text-[color:var(--color-muted)] transition hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]";
const COLUMNS: PointColumn[] = ["P", "N", "E", "Z", "D", "skip"];

export function ExcelPoints({ labels }: { labels: ExcelPointsLabels }) {
  const [text, setText] = useState(labels.example);
  const [override, setOverride] = useState<PointColumn[] | null>(null);
  const [format, setFormat] = useState<PointFormat>("PNEZD");
  const [start, setStart] = useState("1");
  const textId = useId();

  const table = useMemo(() => parsePointTable(text), [text]);
  // A new paste with another shape starts again from the automatic guess.
  const columns = override && override.length === table.columns.length ? override : table.columns;
  const built = useMemo(
    () => buildPointFile(table, columns, { format, start: Number(start) || 1 }),
    [table, columns, format, start],
  );
  const hasCoords = columns.includes("N") && columns.includes("E");
  // The preview shows the numbers exactly as they go into the file.
  const fmt = (x: number) => x.toFixed(3);
  const t = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

  const download = (ext: "csv" | "txt") => {
    downloadFile(`puntos-${format.toLowerCase()}.${ext}`, ext === "csv" ? "text/csv" : "text/plain", built.text);
    trackEvent("tool_export", { tool: "excel-a-puntos-civil-3d", format: `${format}-${ext}`, points: built.points.length });
  };

  const notes: string[] = [];
  if (table.ambiguousEN && !override) notes.push(labels.ambiguous);
  if (built.renumbered) notes.push(t(labels.renumbered, { start: Number(start) || 1 }));
  if (built.duplicates.length) notes.push(t(labels.duplicates, { list: built.duplicates.slice(0, 6).join(", ") }));
  if (built.missingZ) notes.push(t(labels.zeroZ, { n: built.missingZ }));
  if (built.skipped.length) notes.push(t(labels.skippedLines, { lines: built.skipped.slice(0, 8).map((s) => s.line).join(", ") }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ============================ INPUT =========================== */}
      <div className="surface space-y-5 rounded-3xl p-5 sm:p-6">
        <div>
          <label htmlFor={textId} className={LABEL}>
            {labels.input}
          </label>
          <textarea
            id={textId}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setOverride(null);
            }}
            spellCheck={false}
            rows={9}
            className={`${FIELD} font-mono text-xs leading-relaxed`}
          />
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">{labels.inputHint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => { setText(labels.example); setOverride(null); }} className={SMALL_BTN}>
              {labels.loadExample}
            </button>
            <button type="button" onClick={() => { setText(""); setOverride(null); }} className={SMALL_BTN}>
              {labels.clear}
            </button>
          </div>
        </div>

        {table.columns.length > 0 && (
          <fieldset className="border-t border-[color:var(--color-hairline)] pt-5">
            <legend className="text-sm font-semibold">{labels.columnsTitle}</legend>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {columns.map((c, i) => (
                <label key={i} className="block">
                  <span className={LABEL}>{table.header?.[i] || t(labels.column, { n: i + 1 })}</span>
                  <select
                    value={c}
                    onChange={(e) => {
                      const next = [...columns];
                      const value = e.target.value as PointColumn;
                      // A role lives in one column: the old one is freed.
                      if (value !== "skip") next.forEach((x, j) => x === value && j !== i && (next[j] = "skip"));
                      next[i] = value;
                      setOverride(next);
                    }}
                    className={FIELD}
                  >
                    {COLUMNS.map((k) => (
                      <option key={k} value={k}>
                        {labels.columnNames[k]}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="grid gap-4 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-2">
          <fieldset>
            <legend className={LABEL}>{labels.format}</legend>
            <div className="flex flex-wrap gap-1.5">
              {(["PNEZD", "PENZD"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    format === f
                      ? "border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                      : "border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-mint-500)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className={LABEL}>{labels.start}</span>
            <input value={start} onChange={(e) => setStart(e.target.value.replace(/\D/g, ""))} inputMode="numeric" className={FIELD} />
          </label>
        </div>
      </div>

      {/* ============================ RESULTS ========================= */}
      <div aria-live="polite" className="surface rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        {!text.trim() ? (
          <p className="mt-4 text-sm text-[color:var(--color-muted)]">{labels.empty}</p>
        ) : !hasCoords ? (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{labels.noCoords}</p>
        ) : (
          <>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <Stat label={labels.points} value={String(built.points.length)} strong />
              <Stat label={labels.skipped} value={String(built.skipped.length)} />
              <Stat label={labels.missingZ} value={String(built.missingZ)} />
            </dl>

            {notes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {notes.map((n) => (
                  <li key={n} className="rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm">
                    {n}
                  </li>
                ))}
              </ul>
            )}

            {built.points.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold">{labels.preview}</h4>
                <div className="mt-2 overflow-x-auto rounded-xl border border-[color:var(--color-hairline)]">
                  <table className="w-full text-left text-xs tabular-nums">
                    <thead className="bg-[color:var(--color-surface)]">
                      <tr>
                        {(format === "PNEZD" ? ["P", "N", "E", "Z", "D"] : ["P", "E", "N", "Z", "D"]).map((h) => (
                          <th key={h} className="px-3 py-2 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {built.points.slice(0, 8).map((p) => (
                        <tr key={p.p} className="border-t border-[color:var(--color-hairline)]">
                          <td className="px-3 py-1.5">{p.p}</td>
                          <td className="px-3 py-1.5">{fmt(format === "PNEZD" ? p.n : p.e)}</td>
                          <td className="px-3 py-1.5">{fmt(format === "PNEZD" ? p.e : p.n)}</td>
                          <td className="px-3 py-1.5">{fmt(p.z)}</td>
                          <td className="px-3 py-1.5">{p.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {built.points.length > 8 && (
                  <p className="mt-2 text-xs text-[color:var(--color-muted)]">{t(labels.more, { n: built.points.length - 8 })}</p>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => download("csv")} className="btn-primary">
                    {labels.download}
                  </button>
                  <button type="button" onClick={() => download("txt")} className="btn-ghost">
                    {labels.downloadTxt}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <p className="mt-5 text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.privacy}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
      <dt className="text-xs font-medium text-[color:var(--color-muted)]">{label}</dt>
      <dd
        className={`mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tabular-nums ${
          strong ? "text-[color:var(--color-mint-700)]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
