"use client";

import { useMemo, useRef, useState } from "react";
import {
  BARS,
  DEFAULT_STOCK_M,
  MAX_PLAN_PIECES,
  findBar,
  summarize,
  type DiameterSummary,
  type SteelSummary,
} from "@/lib/tools/steel";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";
import { buildXlsx, type Cell, type Sheet } from "@/lib/tools/xlsx";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { IconWhatsApp } from "@/components/icons";

// -----------------------------------------------------------------------------
// Rebar takeoff calculator (Peru: NTP 341.031 bar table, 9 m stock bars).
// Copy comes from lib/tools-content/acero.ts. Templates use {placeholders}
// because server → client props must be plain data, not functions.
// -----------------------------------------------------------------------------

export type SteelLabels = {
  element: string;
  elementPlaceholder: string;
  diameter: string;
  pieces: string;
  lengthPerPiece: string;
  weight: string;
  remove: string;
  addRow: string;
  loadExample: string;
  clear: string;
  stockLength: string;
  waste: string;
  resultsTitle: string;
  totalWeight: string;
  /** {pct} */
  withWaste: string;
  barsPlan: string;
  /** {pct} */
  barsLength: string;
  colDiameter: string;
  colPieces: string;
  colLength: string;
  colWeight: string;
  colBarsLength: string;
  colBarsPlan: string;
  colOffcut: string;
  total: string;
  byWeight: string;
  planTitle: string;
  /** {bars} {usage} */
  planHeader: string;
  /** {count} {cuts} {offcut} */
  planLine: string;
  planNote: string;
  /** {n} {label} {stock} */
  warnLong: string;
  /** {max} */
  warnSkipped: string;
  warnInvalid: string;
  empty: string;
  exportExcel: string;
  xlsx: {
    fileName: string;
    summarySheet: string;
    piecesSheet: string;
    planSheet: string;
    generatedBy: string;
    cuts: string;
    offcutPerBar: string;
    bars: string;
  };
  cta: {
    title: string;
    body: string;
    button: string;
    /** {kg} {n} */
    prefill: string;
  };
  example: { element: string; barId: string; count: string; length: string }[];
};

type Row = { id: number; element: string; barId: string; count: string; length: string };
type ParsedRow = { row: Row; count: number; lengthM: number; valid: boolean; blank: boolean };

const style = NUMBER_STYLES.es;
const fmt = (value: number, digits: number) => formatNumber(value, digits, style);
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

function compute(rows: Row[], stock: string, waste: string) {
  const parsed: ParsedRow[] = rows.map((row) => {
    const count = parseDecimal(row.count);
    const lengthM = parseDecimal(row.length);
    const blank = !row.count.trim() && !row.length.trim();
    const valid =
      Number.isInteger(count) && count > 0 && count <= 100000 && lengthM > 0 && lengthM <= 100 && Boolean(findBar(row.barId));
    return { row, count, lengthM, valid, blank };
  });
  const stockM = parseDecimal(stock);
  const stockOk = stockM >= 1 && stockM <= 30;
  const wastePct = parseDecimal(waste);
  const wasteOk = wastePct >= 0 && wastePct <= 50;
  const summary = summarize(
    parsed.filter((p) => p.valid).map((p) => ({ barId: p.row.barId, count: p.count, lengthM: p.lengthM })),
    stockOk ? stockM : DEFAULT_STOCK_M,
    wasteOk ? wastePct : 0,
  );
  return {
    parsed,
    summary,
    stockM: stockOk ? stockM : DEFAULT_STOCK_M,
    stockOk,
    wastePct: wasteOk ? wastePct : 0,
    wasteOk,
    invalidRows: parsed.filter((p) => !p.valid && !p.blank).length,
  };
}

/** [1.7, 1.7, 1.7] → "3 × 1.70"; mixed lengths are joined with "+". */
function describeCuts(pieces: number[]): string {
  const groups: { length: number; n: number }[] = [];
  for (const p of pieces) {
    const last = groups[groups.length - 1];
    if (last && Math.abs(last.length - p) < 1e-9) last.n++;
    else groups.push({ length: p, n: 1 });
  }
  return groups.map((g) => (g.n > 1 ? `${g.n} × ${fmt(g.length, 2)}` : fmt(g.length, 2))).join(" + ");
}

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]/70 aria-[invalid=true]:border-red-400";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)] md:sr-only";

export function SteelCalculator({ labels }: { labels: SteelLabels }) {
  const nextId = useRef(labels.example.length + 1);
  const [rows, setRows] = useState<Row[]>(() => labels.example.map((r, i) => ({ ...r, id: i + 1 })));
  const [stock, setStock] = useState(String(DEFAULT_STOCK_M));
  const [waste, setWaste] = useState("5");

  const result = useMemo(() => compute(rows, stock, waste), [rows, stock, waste]);
  const { summary, parsed, wastePct } = result;
  const pct = fmt(wastePct, wastePct % 1 === 0 ? 0 : 1);

  const update = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const add = () => {
    const id = nextId.current++;
    setRows((rs) => [...rs, { id, element: "", barId: rs[rs.length - 1]?.barId ?? "3/8", count: "", length: "" }]);
  };
  const clear = () => {
    const id = nextId.current++;
    setRows([{ id, element: "", barId: "3/8", count: "", length: "" }]);
  };
  const loadExample = () => {
    const first = nextId.current;
    nextId.current += labels.example.length;
    setRows(labels.example.map((r, i) => ({ ...r, id: first + i })));
  };

  const hasResults = summary.diameters.length > 0;
  const prefill = fill(labels.cta.prefill, {
    kg: fmt(summary.totalKg, 1),
    n: summary.diameters.length,
  });

  function exportExcel() {
    const sheets = buildSheets(labels, result.summary, parsed, result.stockM, wastePct);
    const bytes = buildXlsx(sheets);
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = labels.xlsx.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    trackEvent("tool_export", { tool: "calculadora-acero-corrugado", format: "xlsx" });
  }

  return (
    <div className="space-y-6">
      {/* ============================ INPUTS ========================== */}
      <div className="surface rounded-3xl p-4 sm:p-6">
        <div
          aria-hidden
          className="hidden gap-3 px-1 pb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-muted)] md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.9fr)_2.5rem]"
        >
          <span>{labels.element}</span>
          <span>{labels.diameter}</span>
          <span>{labels.pieces}</span>
          <span>{labels.lengthPerPiece}</span>
          <span className="text-right">{labels.weight}</span>
          <span />
        </div>

        <ul className="space-y-3">
          {parsed.map(({ row, count, lengthM, valid, blank }) => {
            const bar = findBar(row.barId);
            const rowWeight = valid && bar ? count * lengthM * bar.kgPerM : NaN;
            const countBad = !blank && !(Number.isInteger(count) && count > 0);
            const lengthBad = !blank && !(lengthM > 0 && lengthM <= 100);
            return (
              <li
                key={row.id}
                className="relative grid grid-cols-2 gap-3 rounded-2xl border border-[color:var(--color-hairline)] p-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.9fr)_2.5rem] md:items-center md:rounded-none md:border-0 md:p-1"
              >
                <label className="col-span-2 pr-10 md:col-span-1 md:pr-0">
                  <span className={LABEL}>{labels.element}</span>
                  <input
                    value={row.element}
                    onChange={(e) => update(row.id, { element: e.target.value })}
                    placeholder={labels.elementPlaceholder}
                    className={FIELD}
                  />
                </label>
                <label>
                  <span className={LABEL}>{labels.diameter}</span>
                  <select
                    value={row.barId}
                    onChange={(e) => update(row.id, { barId: e.target.value })}
                    className={FIELD}
                  >
                    {BARS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className={LABEL}>{labels.pieces}</span>
                  <input
                    value={row.count}
                    onChange={(e) => update(row.id, { count: e.target.value })}
                    inputMode="numeric"
                    aria-invalid={countBad}
                    placeholder="0"
                    className={FIELD}
                  />
                </label>
                <label>
                  <span className={LABEL}>{labels.lengthPerPiece}</span>
                  <input
                    value={row.length}
                    onChange={(e) => update(row.id, { length: e.target.value })}
                    inputMode="decimal"
                    aria-invalid={lengthBad}
                    placeholder="0.00"
                    className={FIELD}
                  />
                </label>
                <div className="flex flex-col justify-end md:block md:text-right">
                  <span className={LABEL}>{labels.weight}</span>
                  <span className="py-2.5 text-sm font-semibold tabular-nums">
                    {Number.isFinite(rowWeight) ? fmt(rowWeight, 2) : "—"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  disabled={rows.length === 1}
                  aria-label={labels.remove}
                  title={labels.remove}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-[color:var(--color-muted)] transition hover:bg-[color:var(--color-hairline)] hover:text-[color:var(--color-foreground)] disabled:opacity-30 md:static"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={add} className="btn-primary px-4 py-2 text-sm">
            + {labels.addRow}
          </button>
          <button type="button" onClick={loadExample} className="btn-ghost px-4 py-2 text-sm">
            {labels.loadExample}
          </button>
          <button type="button" onClick={clear} className="btn-ghost px-4 py-2 text-sm">
            {labels.clear}
          </button>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-2 lg:max-w-xl">
          <label>
            <span className="mb-1 block text-xs font-medium text-[color:var(--color-muted)]">{labels.stockLength}</span>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              inputMode="decimal"
              aria-invalid={!result.stockOk}
              className={FIELD}
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-[color:var(--color-muted)]">{labels.waste}</span>
            <input
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              inputMode="decimal"
              aria-invalid={!result.wasteOk}
              className={FIELD}
            />
          </label>
        </div>
      </div>

      {/* ============================ RESULTS ========================= */}
      <div aria-live="polite" className="surface rounded-3xl p-4 sm:p-6">
        <h3 className="text-xl">{labels.resultsTitle}</h3>

        {!hasResults ? (
          <p className="mt-4 text-[color:var(--color-muted)]">{labels.empty}</p>
        ) : (
          <>
            <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label={labels.totalWeight} value={`${fmt(summary.totalKg, 2)} kg`} strong />
              <Stat label={fill(labels.withWaste, { pct })} value={`${fmt(summary.totalKgWithWaste, 2)} kg`} />
              <Stat label={labels.barsPlan} value={fmt(summary.totalBarsPlan, 0)} strong />
              <Stat label={fill(labels.barsLength, { pct })} value={fmt(summary.totalBarsByLength, 0)} />
            </dl>

            <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead className="border-b border-[color:var(--color-border)]">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                    <th scope="col" className="py-3 pr-3">{labels.colDiameter}</th>
                    <th scope="col" className="px-3 py-3 text-right">{labels.colPieces}</th>
                    <th scope="col" className="px-3 py-3 text-right">{labels.colLength}</th>
                    <th scope="col" className="px-3 py-3 text-right">{labels.colWeight}</th>
                    <th scope="col" className="px-3 py-3 text-right">{fill(labels.colBarsLength, { pct })}</th>
                    <th scope="col" className="px-3 py-3 text-right">{labels.colBarsPlan}</th>
                    <th scope="col" className="py-3 pl-3 text-right">{labels.colOffcut}</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {summary.diameters.map((d) => (
                    <DiameterRow key={d.bar.id} d={d} byWeight={labels.byWeight} />
                  ))}
                </tbody>
                <tfoot className="tabular-nums">
                  <tr className="font-semibold">
                    <th scope="row" className="py-3 pr-3 text-left">{labels.total}</th>
                    <td className="px-3 py-3 text-right">{fmt(summary.diameters.reduce((s, d) => s + d.pieces, 0), 0)}</td>
                    <td className="px-3 py-3 text-right">{fmt(summary.totalLengthM, 2)}</td>
                    <td className="px-3 py-3 text-right">{fmt(summary.totalKg, 2)}</td>
                    <td className="px-3 py-3 text-right">{fmt(summary.totalBarsByLength, 0)}</td>
                    <td className="px-3 py-3 text-right">{fmt(summary.totalBarsPlan, 0)}</td>
                    <td className="py-3 pl-3 text-right">
                      {fmt(summary.diameters.reduce((s, d) => s + (d.plan?.offcutM ?? 0), 0), 2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <Warnings result={result} labels={labels} />

            <details className="group mt-6 rounded-2xl border border-[color:var(--color-hairline)] p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {labels.planTitle}
                <span aria-hidden className="text-xl leading-none text-[color:var(--color-mint-700)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-[color:var(--color-muted)]">{labels.planNote}</p>
              <div className="mt-4 space-y-5">
                {summary.diameters
                  .filter((d) => d.plan)
                  .map((d) => (
                    <div key={d.bar.id}>
                      <p className="text-sm font-semibold">
                        {d.bar.label} ·{" "}
                        {fill(labels.planHeader, { bars: d.plan!.bars, usage: fmt(d.plan!.usage * 100, 0) })}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm tabular-nums text-[color:var(--color-foreground)]/90">
                        {d.plan!.patterns.map((p) => (
                          <li key={`${p.count}-${p.pieces.join("+")}`}>
                            {fill(labels.planLine, {
                              count: p.count,
                              cuts: describeCuts(p.pieces),
                              offcut: fmt(p.offcutM, 2),
                            })}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </details>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={exportExcel} className="btn-ghost text-sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                </svg>
                {labels.exportExcel}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ======================== SERVICE BRIDGE ====================== */}
      <aside className="turbo-border-soft rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink-950)] px-6 py-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-snug">{labels.cta.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{labels.cta.body}</p>
          </div>
          <a
            href={whatsappUrl(prefill)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="tool-steel"
            className="btn-primary mt-5 shrink-0 sm:mt-0"
          >
            <IconWhatsApp className="h-5 w-5" />
            {labels.cta.button}
          </a>
        </div>
      </aside>
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

function DiameterRow({ d, byWeight }: { d: DiameterSummary; byWeight: string }) {
  return (
    <tr className="border-b border-[color:var(--color-hairline)]">
      <th scope="row" className="py-3 pr-3 text-left font-semibold">{d.bar.label}</th>
      <td className="px-3 py-3 text-right">{fmt(d.pieces, 0)}</td>
      <td className="px-3 py-3 text-right">{fmt(d.lengthM, 2)}</td>
      <td className="px-3 py-3 text-right">{fmt(d.weightKg, 2)}</td>
      <td className="px-3 py-3 text-right">{d.barsByLength === null ? byWeight : fmt(d.barsByLength, 0)}</td>
      <td className="px-3 py-3 text-right font-semibold">
        {d.bar.soldByWeight ? byWeight : d.plan ? fmt(d.plan.bars, 0) : "—"}
      </td>
      <td className="py-3 pl-3 text-right">{d.plan ? fmt(d.plan.offcutM, 2) : "—"}</td>
    </tr>
  );
}

function Warnings({ result, labels }: { result: ReturnType<typeof compute>; labels: SteelLabels }) {
  const notes: string[] = [];
  for (const d of result.summary.diameters) {
    if (d.plan && d.plan.longPieces > 0) {
      notes.push(fill(labels.warnLong, { n: d.plan.longPieces, label: d.bar.label, stock: fmt(result.stockM, 2) }));
    }
    if (d.planSkipped) notes.push(fill(labels.warnSkipped, { max: fmt(MAX_PLAN_PIECES, 0) }));
  }
  if (result.invalidRows > 0) notes.push(labels.warnInvalid);
  if (notes.length === 0) return null;
  return (
    <ul className="mt-5 space-y-2 text-sm">
      {[...new Set(notes)].map((note) => (
        <li key={note} className="flex gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-[color:var(--color-foreground)]/90">
          <span aria-hidden>⚠</span>
          {note}
        </li>
      ))}
    </ul>
  );
}

function buildSheets(
  labels: SteelLabels,
  summary: SteelSummary,
  parsed: ParsedRow[],
  stockM: number,
  wastePct: number,
): Sheet[] {
  const h = (value: string): Cell => ({ value, style: "header" });
  const pct = String(wastePct);
  const summaryRows: Cell[][] = [
    [h(labels.colDiameter), h(labels.colPieces), h(labels.colLength), h(labels.colWeight), h(fill(labels.colBarsLength, { pct })), h(labels.colBarsPlan), h(labels.colOffcut)],
    ...summary.diameters.map((d): Cell[] => [
      d.bar.label,
      { value: d.pieces, style: "int" },
      { value: d.lengthM, style: "dec2" },
      { value: d.weightKg, style: "dec2" },
      d.barsByLength === null ? labels.byWeight : { value: d.barsByLength, style: "int" },
      d.bar.soldByWeight ? labels.byWeight : d.plan ? { value: d.plan.bars, style: "int" } : "",
      d.plan ? { value: d.plan.offcutM, style: "dec2" } : "",
    ]),
    [
      h(labels.total),
      { value: summary.diameters.reduce((s, d) => s + d.pieces, 0), style: "int" },
      { value: summary.totalLengthM, style: "dec2" },
      { value: summary.totalKg, style: "dec2" },
      { value: summary.totalBarsByLength, style: "int" },
      { value: summary.totalBarsPlan, style: "int" },
      { value: summary.diameters.reduce((s, d) => s + (d.plan?.offcutM ?? 0), 0), style: "dec2" },
    ],
    [],
    [fill(labels.withWaste, { pct }), { value: summary.totalKgWithWaste, style: "dec2" }],
    [labels.stockLength, { value: stockM, style: "dec2" }],
    [labels.xlsx.generatedBy],
  ];

  const pieceRows: Cell[][] = [
    [h(labels.element), h(labels.diameter), h(labels.pieces), h(labels.lengthPerPiece), h(labels.colLength), h(labels.colWeight)],
    ...parsed
      .filter((p) => p.valid)
      .map((p): Cell[] => {
        const bar = findBar(p.row.barId)!;
        return [
          p.row.element,
          bar.label,
          { value: p.count, style: "int" },
          { value: p.lengthM, style: "dec2" },
          { value: p.count * p.lengthM, style: "dec2" },
          { value: p.count * p.lengthM * bar.kgPerM, style: "dec2" },
        ];
      }),
  ];

  const planRows: Cell[][] = [
    [h(labels.colDiameter), h(labels.xlsx.bars), h(labels.xlsx.cuts), h(labels.xlsx.offcutPerBar)],
    ...summary.diameters.flatMap((d) =>
      (d.plan?.patterns ?? []).map((p): Cell[] => [
        d.bar.label,
        { value: p.count, style: "int" },
        describeCuts(p.pieces),
        { value: p.offcutM, style: "dec2" },
      ]),
    ),
  ];

  return [
    { name: labels.xlsx.summarySheet, rows: summaryRows, widths: [24, 10, 16, 14, 24, 22, 14] },
    { name: labels.xlsx.piecesSheet, rows: pieceRows, widths: [34, 12, 10, 18, 16, 14] },
    { name: labels.xlsx.planSheet, rows: planRows, widths: [14, 12, 48, 22] },
  ];
}
