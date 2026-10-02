"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  DATUMS,
  GEO_ORDERS,
  UTM_ORDERS,
  convertRow,
  formatDms,
  hasPointNames,
  parseTable,
  shiftAccuracy,
  toGeoCsv,
  toKml,
  toPnezd,
  type Converted,
  type Crs,
  type DatumId,
  type Delimiter,
  type Hemispheres,
  type InputRow,
  type OrderId,
  type PointError,
} from "@/lib/tools/coordinates";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";
import { buildXlsx, type Cell } from "@/lib/tools/xlsx";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { IconWhatsApp } from "@/components/icons";

// Leaflet touches `window` on import: client only, loaded on first use.
const PointsMap = dynamic(() => import("@/components/tools/points-map").then((m) => m.PointsMap), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse rounded-2xl bg-[color:var(--color-hairline)]" />,
});

// -----------------------------------------------------------------------------
// Coordinate converter: one point or a pasted spreadsheet, UTM ⇄ geographic
// across datums, with a verification map, Civil 3D / Excel / KML exports and
// a local history. Math in lib/tools/coordinates.ts; copy in
// lib/tools-content/coordenadas.ts. Templates use {placeholders}.
// -----------------------------------------------------------------------------

export type CoordLabels = {
  modeSingle: string;
  modeBatch: string;
  from: string;
  to: string;
  swap: string;
  system: string;
  utm: string;
  geo: string;
  datum: string;
  datums: Record<DatumId, string>;
  datumOrder: DatumId[];
  zone: string;
  zoneAuto: string;
  hemisphere: string;
  north: string;
  south: string;
  easting: string;
  northing: string;
  elevation: string;
  latitude: string;
  longitude: string;
  angleHint: string;
  order: string;
  orders: Record<OrderId, string>;
  paste: string;
  pasteHint: string;
  loadExample: string;
  clear: string;
  /** {n} {sep} */
  detected: string;
  delimiters: Record<Delimiter, string>;
  results: string;
  empty: string;
  decimalDegrees: string;
  dms: string;
  scale: string;
  convergence: string;
  combined: string;
  combinedHint: string;
  /** {source} {m} */
  accuracy: string;
  copy: string;
  copied: string;
  openMaps: string;
  errors: Record<PointError, string>;
  /** {line} {error} */
  rowError: string;
  /** {ok} {bad} */
  summary: string;
  /** {shown} {total} */
  tableShowing: string;
  /** {zones} */
  multiZone: string;
  renumbered: string;
  exportCivil3d: string;
  exportCsv: string;
  exportExcel: string;
  exportKml: string;
  mapTitle: string;
  mapHint: string;
  recent: string;
  recentHint: string;
  restore: string;
  /** {n} */
  points: string;
  cols: { p: string; e: string; n: string; lat: string; lon: string; z: string; d: string; zone: string; k: string };
  xlsx: { fileName: string; sheet: string; generatedBy: string };
  kmlName: string;
  cta: { title: string; body: string; button: string; /** {n} */ prefill: string };
  hemi: Hemispheres;
  example: {
    single: { e: string; n: string; z: string; zone: number; south: boolean; datum: DatumId };
    batch: { text: string; order: OrderId; src: Side; dst: Side };
  };
};

/** zone: "" means automatic (target only). */
export type Side = { kind: "utm" | "geo"; datum: DatumId; zone: string; south: boolean };
type State = {
  mode: "single" | "batch";
  src: Side;
  dst: Side;
  e: string;
  n: string;
  lat: string;
  lon: string;
  z: string;
  order: OrderId;
  text: string;
};

const ZONES = Array.from({ length: 60 }, (_, i) => String(i + 1));
const UTM_TO_GEO_ORDER: Record<string, OrderId> = { PNEZD: "PLATLON", PENZD: "PLONLAT", NEZD: "LATLON", ENZD: "LONLAT" };
const GEO_TO_UTM_ORDER: Record<string, OrderId> = { PLATLON: "PNEZD", PLONLAT: "PENZD", LATLON: "NEZD", LONLAT: "ENZD" };
const TABLE_LIMIT = 200;
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

function initialState(labels: CoordLabels): State {
  const ex = labels.example.single;
  return {
    mode: "single",
    src: { kind: "utm", datum: ex.datum, zone: String(ex.zone), south: ex.south },
    dst: { kind: "geo", datum: ex.datum, zone: "", south: ex.south },
    e: ex.e,
    n: ex.n,
    lat: "",
    lon: "",
    z: ex.z,
    order: "PNEZD",
    text: "",
  };
}

const toCrs = (side: Side): Crs => ({
  kind: side.kind,
  datum: side.datum,
  zone: side.zone ? Number(side.zone) : null,
  south: side.south,
});

/** A first line with no digits in its coordinates is a header row: skip it. */
function dropHeader(rows: InputRow[]): InputRow[] {
  const first = rows[0];
  if (!first) return rows;
  const coords = [first.values.E, first.values.N, first.values.LAT, first.values.LON].filter(Boolean).join("");
  return coords && !/\d/.test(coords) ? rows.slice(1) : rows;
}

function compute(s: State): { points: Converted[]; delimiter: Delimiter | null } {
  const src = toCrs(s.src);
  const dst = toCrs(s.dst);
  if (s.mode === "single") {
    const values = s.src.kind === "utm" ? { E: s.e, N: s.n, Z: s.z } : { LAT: s.lat, LON: s.lon, Z: s.z };
    const blank = s.src.kind === "utm" ? !s.e.trim() && !s.n.trim() : !s.lat.trim() && !s.lon.trim();
    return { points: blank ? [] : [convertRow({ line: 1, values }, src, dst, parseDecimal)], delimiter: null };
  }
  const { rows, delimiter } = parseTable(s.text, s.order);
  return { points: dropHeader(rows).map((r) => convertRow(r, src, dst, parseDecimal)), delimiter };
}

// --- Local history (per browser) ------------------------------------------------

const HISTORY_KEY = "zeist-coords-history";
const HISTORY_MAX = 6;
const HISTORY_TEXT_MAX = 100_000;
type HistoryItem = { at: number; count: number; state: State };
const historyListeners = new Set<() => void>();

function readHistory(): string {
  try {
    return localStorage.getItem(HISTORY_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribeHistory(listener: () => void) {
  historyListeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === HISTORY_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    historyListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function parseHistory(raw: string): HistoryItem[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((h) => h && h.state && typeof h.at === "number") : [];
  } catch {
    return [];
  }
}

function pushHistory(count: number, state: State) {
  if (state.text.length > HISTORY_TEXT_MAX) return;
  const item: HistoryItem = { at: Date.now(), count, state };
  const fingerprint = JSON.stringify(item.state);
  const list = [item, ...parseHistory(readHistory()).filter((h) => JSON.stringify(h.state) !== fingerprint)];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {
    return; // private mode or full storage: history is a convenience
  }
  historyListeners.forEach((l) => l());
}

// --- Downloads ------------------------------------------------------------------

function download(name: string, type: string, data: string | Uint8Array) {
  const part: BlobPart = typeof data === "string" ? data : (data.buffer as ArrayBuffer);
  const url = URL.createObjectURL(new Blob([part], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------------------------------------------------------------------------------

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]/70";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";

export function CoordinateConverter({ labels, locale }: { labels: CoordLabels; locale: "es" | "pt" | "en" }) {
  const style = NUMBER_STYLES[locale];
  const [s, setS] = useState<State>(() => initialState(labels));
  const [copied, setCopied] = useState<string | null>(null);
  const result = useMemo(() => compute(s), [s]);
  const historyRaw = useSyncExternalStore(subscribeHistory, readHistory, () => "[]");
  const history = useMemo(() => parseHistory(historyRaw), [historyRaw]);

  const ok = result.points.filter((p) => !p.error);
  const bad = result.points.filter((p) => p.error);
  const fixed = (x: number, d: number) => x.toFixed(d).replace(".", style.decimal);
  const dms = (x: number, kind: "lat" | "lon") => formatDms(x, kind, labels.hemi, style.decimal, 3);
  const signedDms = (x: number) =>
    (x < 0 ? "−" : "+") + formatDms(Math.abs(x), "lat", { n: "", s: "", e: "", w: "" }, style.decimal, 1).trim();

  // Save to the local history once the input settles — only what the visitor
  // did, never the untouched example every page load starts with.
  const pristine = useMemo(() => JSON.stringify(initialState(labels)), [labels]);
  useEffect(() => {
    if (ok.length === 0 || JSON.stringify(s) === pristine) return;
    const timer = setTimeout(() => pushHistory(ok.length, s), 2500);
    return () => clearTimeout(timer);
  }, [s, ok.length, pristine]);

  const setSide = (which: "src" | "dst", patch: Partial<Side>) =>
    setS((prev) => {
      const side: Side = { ...prev[which], ...patch };
      const next: State = which === "src" ? { ...prev, src: side } : { ...prev, dst: side };
      if (which === "src" && patch.kind && patch.kind !== prev.src.kind) {
        next.order = (patch.kind === "geo" ? UTM_TO_GEO_ORDER : GEO_TO_UTM_ORDER)[prev.order] ?? next.order;
        if (patch.kind === "utm" && !side.zone) side.zone = prev.dst.zone || String(labels.example.single.zone);
      }
      return next;
    });

  // Swap direction; in single mode the result becomes the new input.
  const swap = () =>
    setS((prev) => {
      const next: State = { ...prev, src: { ...prev.dst }, dst: { ...prev.src } };
      if (next.src.kind === "utm" && !next.src.zone) next.src.zone = String(ok[0]?.utm?.zone ?? labels.example.single.zone);
      if (prev.mode === "single" && ok[0]) {
        const r = ok[0];
        if (next.src.kind === "utm" && r.utm) {
          next.e = fixed(r.utm.e, 3);
          next.n = fixed(r.utm.n, 3);
          next.src.south = r.utm.south;
        } else if (r.lat !== undefined && r.lon !== undefined) {
          next.lat = fixed(r.lat, 9);
          next.lon = fixed(r.lon, 9);
        }
      }
      next.order = (next.src.kind === "geo" ? UTM_TO_GEO_ORDER : GEO_TO_UTM_ORDER)[prev.order] ?? prev.order;
      return next;
    });

  const loadExample = () => {
    const ex = labels.example.batch;
    setS((prev) => ({ ...prev, mode: "batch", src: { ...ex.src }, dst: { ...ex.dst }, order: ex.order, text: ex.text }));
  };

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      setCopied(null);
    }
  }

  function exportAs(format: "civil3d" | "csv" | "xlsx" | "kml") {
    const base = labels.xlsx.fileName.replace(/\.xlsx$/, "");
    if (format === "civil3d") download(`${base}-civil3d-pnezd.csv`, "text/csv", toPnezd(ok).text);
    if (format === "csv") download(`${base}.csv`, "text/csv", toGeoCsv(ok));
    if (format === "kml") download(`${base}.kml`, "application/vnd.google-earth.kml+xml", toKml(ok, labels.kmlName));
    if (format === "xlsx") download(labels.xlsx.fileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buildXlsx([sheetFor(ok)]));
    trackEvent("tool_export", { tool: "conversor-de-coordenadas", format, points: ok.length });
    pushHistory(ok.length, s);
  }

  function sheetFor(points: Converted[]) {
    const h = (value: string): Cell => ({ value, style: "header" });
    const utmOut = s.dst.kind === "utm";
    const head = utmOut
      ? [h(labels.cols.p), h(labels.cols.e), h(labels.cols.n), h(labels.cols.zone), h(labels.cols.z), h(labels.cols.d), h(labels.scale), h(labels.convergence), h(labels.combined)]
      : [
          h(labels.cols.p),
          h(labels.cols.lat),
          h(labels.cols.lon),
          h(`${labels.cols.lat} (${labels.dms})`),
          h(`${labels.cols.lon} (${labels.dms})`),
          h(labels.cols.z),
          h(labels.cols.d),
          h(labels.scale),
          h(labels.convergence),
          h(labels.combined),
        ];
    const rows: Cell[][] = points.map((p) => {
      const common: Cell[] = [
        p.z === null ? "" : { value: p.z, style: "dec3" },
        p.d,
        p.scale === undefined ? "" : p.scale,
        p.convergence === undefined ? "" : p.convergence,
        p.combined === undefined ? "" : p.combined,
      ];
      return utmOut
        ? [p.p, { value: p.utm!.e, style: "dec3" }, { value: p.utm!.n, style: "dec3" }, `${p.utm!.zone}${p.utm!.south ? "S" : "N"}`, ...common]
        : [p.p, p.lat!, p.lon!, dms(p.lat!, "lat"), dms(p.lon!, "lon"), ...common];
    });
    const widths = utmOut ? [14, 16, 16, 8, 10, 28, 14, 14, 14] : [14, 16, 16, 18, 18, 10, 28, 14, 14, 14];
    return { name: labels.xlsx.sheet, rows: [head, ...rows, [], [labels.xlsx.generatedBy]], widths };
  }

  const zones = [...new Set(ok.map((p) => p.utm && `${p.utm.zone}${p.utm.south ? "S" : "N"}`).filter(Boolean))];
  const accuracyM = shiftAccuracy(s.src.datum, s.dst.datum);
  const datumNote =
    accuracyM > 0
      ? fill(labels.accuracy, {
          source: DATUMS[s.src.datum].accuracyM >= DATUMS[s.dst.datum].accuracyM ? DATUMS[s.src.datum].source : DATUMS[s.dst.datum].source,
          m: accuracyM,
        })
      : null;
  const needsRenumber = s.dst.kind === "utm" && hasPointNames(ok);
  const mapPoints = ok.map((p, i) => ({ lat: p.wgs!.lat, lon: p.wgs!.lon, label: p.p || String(i + 1) }));
  const single = s.mode === "single" ? result.points[0] : undefined;

  return (
    <div className="space-y-6">
      <div className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        {/* Mode */}
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={labels.modeSingle + " / " + labels.modeBatch}>
          {(["single", "batch"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={s.mode === m}
              onClick={() => setS((prev) => ({ ...prev, mode: m }))}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                s.mode === m
                  ? "border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              {m === "single" ? labels.modeSingle : labels.modeBatch}
            </button>
          ))}
        </div>

        {/* Source and target systems */}
        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <SideEditor title={labels.from} side={s.src} target={false} labels={labels} onChange={(p) => setSide("src", p)} />
          <button
            type="button"
            onClick={swap}
            aria-label={labels.swap}
            title={labels.swap}
            className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-mint-700)] transition hover:border-[color:var(--color-mint-500)] md:mt-10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 7h13l-4-4M17 17H4l4 4" />
            </svg>
          </button>
          <SideEditor title={labels.to} side={s.dst} target labels={labels} onChange={(p) => setSide("dst", p)} />
        </div>

        {/* Input */}
        {s.mode === "single" ? (
          <div className="grid gap-4 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-3">
            {s.src.kind === "utm" ? (
              <>
                <TextField label={labels.easting} value={s.e} onChange={(e) => setS((p) => ({ ...p, e }))} unit="m" />
                <TextField label={labels.northing} value={s.n} onChange={(n) => setS((p) => ({ ...p, n }))} unit="m" />
              </>
            ) : (
              <>
                <TextField label={labels.latitude} value={s.lat} onChange={(lat) => setS((p) => ({ ...p, lat }))} hint={labels.angleHint} />
                <TextField label={labels.longitude} value={s.lon} onChange={(lon) => setS((p) => ({ ...p, lon }))} hint={labels.angleHint} />
              </>
            )}
            <TextField label={labels.elevation} value={s.z} onChange={(z) => setS((p) => ({ ...p, z }))} unit="m" />
          </div>
        ) : (
          <div className="space-y-3 border-t border-[color:var(--color-hairline)] pt-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="block min-w-[14rem]">
                <span className={LABEL}>{labels.order}</span>
                <select
                  value={s.order}
                  onChange={(e) => setS((p) => ({ ...p, order: e.target.value as OrderId }))}
                  className={FIELD}
                >
                  {Object.keys(s.src.kind === "utm" ? UTM_ORDERS : GEO_ORDERS).map((id) => (
                    <option key={id} value={id}>
                      {labels.orders[id as OrderId]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={loadExample} className="btn-ghost px-4 py-2 text-sm">
                  {labels.loadExample}
                </button>
                <button type="button" onClick={() => setS((p) => ({ ...p, text: "" }))} className="btn-ghost px-4 py-2 text-sm">
                  {labels.clear}
                </button>
              </div>
            </div>
            <label className="block">
              <span className={LABEL}>{labels.paste}</span>
              <textarea
                value={s.text}
                onChange={(e) => setS((p) => ({ ...p, text: e.target.value }))}
                rows={8}
                spellCheck={false}
                placeholder={labels.pasteHint}
                className={`${FIELD} font-mono text-[13px] leading-relaxed`}
              />
            </label>
            {result.delimiter && result.points.length > 0 && (
              <p className="text-xs text-[color:var(--color-muted)]">
                {fill(labels.detected, { n: result.points.length, sep: labels.delimiters[result.delimiter] })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* =============================== RESULTS ============================ */}
      <div aria-live="polite" className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>

        {result.points.length === 0 && <p className="text-[color:var(--color-muted)]">{labels.empty}</p>}

        {single && single.error && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{labels.errors[single.error]}</p>}

        {single && !single.error && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              {s.dst.kind === "geo" ? (
                <>
                  <ResultLine
                    label={labels.latitude}
                    main={fixed(single.lat!, 8)}
                    sub={dms(single.lat!, "lat")}
                    copyLabel={copied === "lat" ? labels.copied : labels.copy}
                    onCopy={() => copy(fixed(single.lat!, 8), "lat")}
                  />
                  <ResultLine
                    label={labels.longitude}
                    main={fixed(single.lon!, 8)}
                    sub={dms(single.lon!, "lon")}
                    copyLabel={copied === "lon" ? labels.copied : labels.copy}
                    onCopy={() => copy(fixed(single.lon!, 8), "lon")}
                  />
                </>
              ) : (
                <>
                  <ResultLine
                    label={`${labels.easting} · ${labels.zone} ${single.utm!.zone}${single.utm!.south ? "S" : "N"}`}
                    main={fixed(single.utm!.e, 3)}
                    copyLabel={copied === "e" ? labels.copied : labels.copy}
                    onCopy={() => copy(fixed(single.utm!.e, 3), "e")}
                  />
                  <ResultLine
                    label={labels.northing}
                    main={fixed(single.utm!.n, 3)}
                    copyLabel={copied === "n" ? labels.copied : labels.copy}
                    onCopy={() => copy(fixed(single.utm!.n, 3), "n")}
                  />
                </>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${single.wgs!.lat.toFixed(8)},${single.wgs!.lon.toFixed(8)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-mint-700)] hover:underline"
              >
                {labels.openMaps} ↗
              </a>
            </div>
            <dl className="grid content-start gap-3 rounded-2xl border border-[color:var(--color-hairline)] p-4 text-sm">
              {single.scale !== undefined && <Pair label={labels.scale} value={single.scale.toFixed(8).replace(".", style.decimal)} />}
              {single.convergence !== undefined && <Pair label={labels.convergence} value={signedDms(single.convergence)} />}
              {single.combined !== undefined ? (
                <Pair label={labels.combined} value={single.combined.toFixed(8).replace(".", style.decimal)} />
              ) : (
                single.scale !== undefined && <p className="text-xs text-[color:var(--color-muted)]">{labels.combinedHint}</p>
              )}
            </dl>
          </div>
        )}

        {s.mode === "batch" && result.points.length > 0 && (
          <>
            <p className="text-sm font-semibold">{fill(labels.summary, { ok: ok.length, bad: bad.length })}</p>
            {bad.length > 0 && (
              <ul className="space-y-1 text-sm">
                {bad.slice(0, 5).map((p) => (
                  <li key={p.line} className="rounded-xl bg-amber-500/10 px-3 py-2">
                    {fill(labels.rowError, { line: p.line, error: labels.errors[p.error!] })}
                  </li>
                ))}
              </ul>
            )}
            {s.dst.kind === "utm" && !s.dst.zone && zones.length > 1 && (
              <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm">{fill(labels.multiZone, { zones: zones.join(", ") })}</p>
            )}
            {ok.length > 0 && (
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm tabular-nums">
                  <thead className="border-b border-[color:var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                    <tr>
                      <th className="py-2.5 pr-3">{labels.cols.p}</th>
                      {s.dst.kind === "utm" ? (
                        <>
                          <th className="px-3 py-2.5 text-right">{labels.cols.e}</th>
                          <th className="px-3 py-2.5 text-right">{labels.cols.n}</th>
                          <th className="px-3 py-2.5">{labels.cols.zone}</th>
                        </>
                      ) : (
                        <>
                          <th className="px-3 py-2.5 text-right">{labels.cols.lat}</th>
                          <th className="px-3 py-2.5 text-right">{labels.cols.lon}</th>
                        </>
                      )}
                      <th className="px-3 py-2.5 text-right">{labels.cols.z}</th>
                      <th className="px-3 py-2.5">{labels.cols.d}</th>
                      <th className="py-2.5 pl-3 text-right">{labels.cols.k}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ok.slice(0, TABLE_LIMIT).map((p, i) => (
                      <tr key={p.line} className="border-b border-[color:var(--color-hairline)]">
                        <td className="py-2 pr-3 font-semibold">{p.p || i + 1}</td>
                        {p.utm ? (
                          <>
                            <td className="px-3 py-2 text-right">{fixed(p.utm.e, 3)}</td>
                            <td className="px-3 py-2 text-right">{fixed(p.utm.n, 3)}</td>
                            <td className="px-3 py-2">{`${p.utm.zone}${p.utm.south ? "S" : "N"}`}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 text-right">{fixed(p.lat!, 8)}</td>
                            <td className="px-3 py-2 text-right">{fixed(p.lon!, 8)}</td>
                          </>
                        )}
                        <td className="px-3 py-2 text-right">{p.z === null ? "—" : fixed(p.z, 3)}</td>
                        <td className="max-w-[12rem] truncate px-3 py-2">{p.d}</td>
                        <td className="py-2 pl-3 text-right">{p.scale === undefined ? "—" : fixed(p.scale, 6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {ok.length > TABLE_LIMIT && (
              <p className="text-xs text-[color:var(--color-muted)]">{fill(labels.tableShowing, { shown: TABLE_LIMIT, total: ok.length })}</p>
            )}
          </>
        )}

        {datumNote && ok.length > 0 && <p className="text-xs text-[color:var(--color-muted)]">{datumNote}</p>}

        {ok.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-[color:var(--color-hairline)] pt-5">
            {s.dst.kind === "utm" ? (
              <button type="button" onClick={() => exportAs("civil3d")} className="btn-primary px-4 py-2 text-sm">
                {labels.exportCivil3d}
              </button>
            ) : (
              <button type="button" onClick={() => exportAs("csv")} className="btn-primary px-4 py-2 text-sm">
                {labels.exportCsv}
              </button>
            )}
            <button type="button" onClick={() => exportAs("xlsx")} className="btn-ghost px-4 py-2 text-sm">
              {labels.exportExcel}
            </button>
            <button type="button" onClick={() => exportAs("kml")} className="btn-ghost px-4 py-2 text-sm">
              {labels.exportKml}
            </button>
          </div>
        )}
        {needsRenumber && <p className="text-xs text-[color:var(--color-muted)]">{labels.renumbered}</p>}
      </div>

      {/* ================================ MAP =============================== */}
      {mapPoints.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl">{labels.mapTitle}</h3>
            <p className="text-sm text-[color:var(--color-muted)]">{labels.mapHint}</p>
          </div>
          <PointsMap points={mapPoints} ariaLabel={labels.mapTitle} />
        </div>
      )}

      {/* ============================== HISTORY ============================= */}
      {history.length > 0 && (
        <div className="surface rounded-3xl p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg">{labels.recent}</h3>
            <p className="text-xs text-[color:var(--color-muted)]">{labels.recentHint}</p>
          </div>
          <ul className="mt-3 divide-y divide-[color:var(--color-hairline)]">
            {history.map((h) => (
              <li key={h.at} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
                <span>
                  <span className="font-semibold">{describeSide(h.state.src, labels)} → {describeSide(h.state.dst, labels)}</span>
                  <span className="text-[color:var(--color-muted)]">
                    {" · "}
                    {fill(labels.points, { n: h.count })}
                    {" · "}
                    {new Date(h.at).toLocaleString(locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-PE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </span>
                <button type="button" onClick={() => setS(h.state)} className="btn-ghost px-3 py-1.5 text-xs">
                  {labels.restore}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* =========================== SERVICE BRIDGE ========================= */}
      <aside className="turbo-border-soft rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink-950)] px-6 py-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-snug">{labels.cta.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{labels.cta.body}</p>
          </div>
          <a
            href={whatsappUrl(fill(labels.cta.prefill, { n: formatNumber(Math.max(ok.length, 1), 0, style) }))}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="tool-coords"
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

function describeSide(side: Side, labels: CoordLabels): string {
  const datum = labels.datums[side.datum].split(" (")[0];
  if (side.kind === "geo") return `${labels.geo} ${datum}`;
  return `UTM ${side.zone ? `${side.zone}${side.south ? "S" : "N"}` : labels.zoneAuto} ${datum}`;
}

function SideEditor({
  title,
  side,
  target,
  labels,
  onChange,
}: {
  title: string;
  side: Side;
  target: boolean;
  labels: CoordLabels;
  onChange: (patch: Partial<Side>) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mint-700)]">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>{labels.system}</span>
          <select value={side.kind} onChange={(e) => onChange({ kind: e.target.value as Side["kind"] })} className={FIELD}>
            <option value="utm">{labels.utm}</option>
            <option value="geo">{labels.geo}</option>
          </select>
        </label>
        <label className="block">
          <span className={LABEL}>{labels.datum}</span>
          <select value={side.datum} onChange={(e) => onChange({ datum: e.target.value as DatumId })} className={FIELD}>
            {labels.datumOrder.map((id) => (
              <option key={id} value={id}>
                {labels.datums[id]}
              </option>
            ))}
          </select>
        </label>
        {side.kind === "utm" && (
          <>
            <label className="block">
              <span className={LABEL}>{labels.zone}</span>
              <select value={side.zone} onChange={(e) => onChange({ zone: e.target.value })} className={FIELD}>
                {target && <option value="">{labels.zoneAuto}</option>}
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </label>
            {(!target || side.zone) && (
              <label className="block">
                <span className={LABEL}>{labels.hemisphere}</span>
                <select
                  value={side.south ? "S" : "N"}
                  onChange={(e) => onChange({ south: e.target.value === "S" })}
                  className={FIELD}
                >
                  <option value="S">{labels.south}</option>
                  <option value="N">{labels.north}</option>
                </select>
              </label>
            )}
          </>
        )}
      </div>
    </fieldset>
  );
}

function TextField({
  label,
  value,
  onChange,
  unit,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={hint ? "text" : "decimal"}
          spellCheck={false}
          className={`${FIELD} ${unit ? "pr-10" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-muted)]">{unit}</span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-[color:var(--color-muted)]">{hint}</span>}
    </label>
  );
}

function ResultLine({
  label,
  main,
  sub,
  copyLabel,
  onCopy,
}: {
  label: string;
  main: string;
  sub?: string;
  copyLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-hairline)] p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[color:var(--color-muted)]">{label}</p>
        <p className="mt-1 break-all font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tabular-nums text-[color:var(--color-mint-700)]">
          {main}
        </p>
        {sub && <p className="mt-0.5 text-sm tabular-nums text-[color:var(--color-muted)]">{sub}</p>}
      </div>
      <button type="button" onClick={onCopy} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
        {copyLabel}
      </button>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[color:var(--color-muted)]">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
