"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { DATUMS, formatDms, type DatumId, type Hemispheres } from "@/lib/tools/coordinates";
import { formatAngle, type ParcelError } from "@/lib/tools/parcel";
import {
  analyzeGroup,
  distanceM,
  googleMapsLinks,
  groupCenter,
  latLonText,
  outsideDatumArea,
  parsePlanTable,
  planKml,
  toWgs84,
  type ColumnOrder,
  type GroupAnalysis,
  type GroupWarning,
  type LatLon,
  type PlanParse,
} from "@/lib/tools/plan-location";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { downloadFile } from "@/components/tools/download";
import { IconWhatsApp } from "@/components/icons";
import type { PlanMapLayer } from "@/components/tools/plan-map";

// Leaflet touches `window` on import: client only, loaded on first use.
const PlanMap = dynamic(() => import("@/components/tools/plan-map").then((m) => m.PlanMap), {
  ssr: false,
  loading: () => <div className="h-[22rem] w-full animate-pulse rounded-2xl bg-[color:var(--color-hairline)] sm:h-[26rem]" />,
});

// -----------------------------------------------------------------------------
// "Where is this plan?": paste the coordinate table of a plan (or type one
// point), pick zone and datum, and see the place on a map with links to open it
// in Google Maps. It also checks the table against itself. Logic in
// lib/tools/plan-location.ts; copy in lib/tools-content/coordenadas-google-maps.ts.
// Templates use {placeholders}.
// -----------------------------------------------------------------------------

const SLUG = "coordenadas-utm-en-google-maps";

export type CompareId = "wgs84" | "psad56" | "sad69";

export type PlanLocatorLabels = {
  modeTable: string;
  modeSingle: string;
  zone: string;
  hemisphere: string;
  north: string;
  south: string;
  zoneHint: string;
  datum: string;
  datums: Record<DatumId, string>;
  datumOrder: DatumId[];
  datumUnknown: string;
  order: string;
  orders: Record<ColumnOrder, string>;
  paste: string;
  pasteHint: string;
  loadExample: string;
  clear: string;
  easting: string;
  northing: string;
  pointName: string;
  /** {points} {groups} */
  readSummary: string;
  /** {order} */
  columnsRead: string;
  /** {lines} */
  skipped: string;
  streamNote: string;
  empty: string;
  whereTitle: string;
  /** {name} */
  centerOfGroup: string;
  /** {name} */
  pointLabel: string;
  copy: string;
  copied: string;
  openMaps: string;
  directions: string;
  satellite: string;
  kml: string;
  /** {source} {m} */
  accuracy: string;
  /** {m} */
  rawNote: string;
  showRaw: string;
  compareTitle: string;
  compareBody: string;
  /** {m} */
  compareDistance: string;
  compareNames: Record<CompareId, string>;
  outsideArea: Partial<Record<DatumId, string>>;
  mapTitle: string;
  mapHint: string;
  legendPlan: string;
  legendRaw: string;
  checkTitle: string;
  checkIntro: string;
  /** {n} {first} {last} */
  groupTitle: string;
  area: string;
  perimeter: string;
  hectares: string;
  consistent: string;
  inconsistent: string;
  noStated: string;
  sideCol: string;
  statedCol: string;
  computedCol: string;
  diffCol: string;
  vertexCol: string;
  angleCol: string;
  ok: string;
  mismatch: string;
  warnings: Record<GroupWarning, string>;
  parcelErrors: Record<ParcelError, string>;
  verticesTitle: string;
  cols: { name: string; e: string; n: string; lat: string; lon: string; link: string };
  view: string;
  kmlName: string;
  fileName: string;
  hemi: Hemispheres;
  cta: { title: string; body: string; button: string; prefill: string };
  example: { text: string; zone: number; south: boolean; datum: DatumId; e: string; n: string };
};

type DatumChoice = DatumId | "compare";
type State = {
  mode: "table" | "single";
  text: string;
  e: string;
  n: string;
  zone: string;
  south: boolean;
  datum: DatumChoice;
  order: ColumnOrder;
  showRaw: boolean;
};

const ZONES = Array.from({ length: 60 }, (_, i) => String(i + 1));
const COMPARE: { id: CompareId; datum: DatumId; color: string }[] = [
  { id: "wgs84", datum: "wgs84", color: "#00a887" },
  { id: "psad56", datum: "psad56", color: "#ea580c" },
  { id: "sad69", datum: "sad69", color: "#7c3aed" },
];
const PLAN_COLOR = "#00a887";
const RAW_COLOR = "#64748b";
const TABLE_LIMIT = 200;
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]/70";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";

function initialState(labels: PlanLocatorLabels): State {
  const ex = labels.example;
  return {
    mode: "table",
    text: ex.text,
    e: ex.e,
    n: ex.n,
    zone: String(ex.zone),
    south: ex.south,
    datum: ex.datum,
    order: "auto",
    showRaw: true,
  };
}

const finite = (p: LatLon) => Number.isFinite(p.lat) && Number.isFinite(p.lon);

export function PlanLocator({ labels, locale }: { labels: PlanLocatorLabels; locale: "es" | "pt" | "en" }) {
  const style = NUMBER_STYLES[locale];
  const [s, setS] = useState<State>(() => initialState(labels));
  const [copied, setCopied] = useState(false);
  const set = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));

  const parsed = useMemo<PlanParse>(() => {
    if (s.mode === "single") {
      const e = parseDecimal(s.e);
      const n = parseDecimal(s.n);
      if (!Number.isFinite(e) || !Number.isFinite(n)) return { groups: [], skipped: [], order: "EN", stream: false };
      return {
        groups: [[{ line: 1, name: labels.pointName, e, n, side: null, length: null, angle: null }]],
        skipped: [],
        order: "EN",
        stream: false,
      };
    }
    return parsePlanTable(s.text, s.order);
  }, [s.mode, s.e, s.n, s.text, s.order, labels.pointName]);

  const analyses = useMemo(() => parsed.groups.map(analyzeGroup), [parsed]);
  const zone = Number(s.zone);
  const compare = s.datum === "compare";
  const mainDatum: DatumId = compare ? "wgs84" : (s.datum as DatumId);
  const shifted = !compare && DATUMS[mainDatum].shift.some((x) => x !== 0);

  // Read every group in a datum: vertices and the point to send people to.
  const read = (datum: DatumId) =>
    analyses.map((a) => ({
      points: a.vertices.map((v) => ({ ...toWgs84(v.e, v.n, zone, s.south, datum), label: v.name })),
      center: toWgs84(groupCenter(a).e, groupCenter(a).n, zone, s.south, datum),
    }));
  const main = read(mainDatum);
  const raw = shifted ? read("wgs84") : null;
  const valid = main.length > 0 && main.every((g) => finite(g.center) && g.points.every(finite));

  // The lot to point at: the biggest polygon, or the first group.
  let primary = 0;
  analyses.forEach((a, i) => {
    if ((a.parcel?.area ?? 0) > (analyses[primary].parcel?.area ?? 0)) primary = i;
  });
  const center = valid ? main[primary].center : null;
  const links = center ? googleMapsLinks(center) : null;
  const rawDistance = center && raw ? distanceM(center, raw[primary].center) : null;
  const totalPoints = analyses.reduce((n, a) => n + a.vertices.length, 0);
  const groupName = (a: GroupAnalysis, i: number) =>
    a.vertices.length === 1
      ? fill(labels.pointLabel, { name: a.vertices[0].name })
      : fill(labels.groupTitle, { n: i + 1, first: a.vertices[0].name, last: a.vertices[a.vertices.length - 1].name });

  const candidates = compare && valid
    ? COMPARE.map((c) => ({ ...c, groups: read(c.datum) })).filter((c) => c.groups.every((g) => finite(g.center)))
    : [];

  const layers: PlanMapLayer[] = !valid
    ? []
    : compare
      ? candidates.map((c) => ({ id: c.id, color: c.color, labels: c.id === "wgs84", dashed: c.id !== "wgs84", shapes: c.groups.map((g) => ({ points: g.points })) }))
      : [
          { id: "plan", color: PLAN_COLOR, labels: true, shapes: main.map((g) => ({ points: g.points })) },
          ...(raw && s.showRaw ? [{ id: "raw", color: RAW_COLOR, dashed: true, shapes: raw.map((g) => ({ points: g.points })) }] : []),
        ];

  const datumNote =
    !compare && DATUMS[mainDatum].accuracyM > 0
      ? fill(labels.accuracy, { source: DATUMS[mainDatum].source, m: DATUMS[mainDatum].accuracyM })
      : null;
  const outside = center && !compare && outsideDatumArea(center, mainDatum) ? labels.outsideArea[mainDatum] : null;

  const dec = (x: number, d: number) => x.toFixed(d).replace(".", style.decimal);
  const dms = (x: number, kind: "lat" | "lon") => formatDms(x, kind, labels.hemi, style.decimal, 2);
  const metres = (m: number) => formatNumber(m, m < 100 ? 1 : 0, style);

  function track(format: string) {
    trackEvent("tool_export", { tool: SLUG, format, points: totalPoints });
  }

  async function copyCenter() {
    if (!center) return;
    try {
      await navigator.clipboard.writeText(latLonText(center));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      track("copy");
    } catch {
      setCopied(false);
    }
  }

  function exportKml() {
    const shapes = main.map((g, i) => ({ name: groupName(analyses[i], i), points: g.points.map((p) => ({ lat: p.lat, lon: p.lon, name: p.label })) }));
    downloadFile(labels.fileName, "application/vnd.google-earth.kml+xml", planKml(shapes, labels.kmlName));
    track("kml");
  }

  return (
    <div className="space-y-6">
      {/* ================================ INPUT ============================== */}
      <div className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${labels.modeTable} / ${labels.modeSingle}`}>
          {(["table", "single"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={s.mode === m}
              onClick={() => set({ mode: m })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                s.mode === m
                  ? "border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              {m === "table" ? labels.modeTable : labels.modeSingle}
            </button>
          ))}
        </div>

        <div className={`grid gap-3 sm:grid-cols-2 ${s.mode === "table" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          <label className="block">
            <span className={LABEL}>{labels.zone}</span>
            <select value={s.zone} onChange={(e) => set({ zone: e.target.value })} className={FIELD}>
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>{labels.hemisphere}</span>
            <select value={s.south ? "S" : "N"} onChange={(e) => set({ south: e.target.value === "S" })} className={FIELD}>
              <option value="S">{labels.south}</option>
              <option value="N">{labels.north}</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>{labels.datum}</span>
            <select value={s.datum} onChange={(e) => set({ datum: e.target.value as DatumChoice })} className={FIELD}>
              {labels.datumOrder.map((id) => (
                <option key={id} value={id}>
                  {labels.datums[id]}
                </option>
              ))}
              <option value="compare">{labels.datumUnknown}</option>
            </select>
          </label>
          {s.mode === "table" && (
            <label className="block">
              <span className={LABEL}>{labels.order}</span>
              <select value={s.order} onChange={(e) => set({ order: e.target.value as ColumnOrder })} className={FIELD}>
                {(["auto", "EN", "NE"] as const).map((o) => (
                  <option key={o} value={o}>
                    {labels.orders[o]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.zoneHint}</p>

        {s.mode === "single" ? (
          <div className="grid gap-4 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-2">
            <CoordField label={labels.easting} value={s.e} onChange={(e) => set({ e })} />
            <CoordField label={labels.northing} value={s.n} onChange={(n) => set({ n })} />
          </div>
        ) : (
          <div className="space-y-3 border-t border-[color:var(--color-hairline)] pt-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <span className="text-xs font-medium text-[color:var(--color-muted)]">{labels.paste}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => set({ text: labels.example.text, mode: "table" })} className="btn-ghost px-4 py-2 text-sm">
                  {labels.loadExample}
                </button>
                <button type="button" onClick={() => set({ text: "" })} className="btn-ghost px-4 py-2 text-sm">
                  {labels.clear}
                </button>
              </div>
            </div>
            <textarea
              value={s.text}
              onChange={(e) => set({ text: e.target.value })}
              rows={9}
              spellCheck={false}
              aria-label={labels.paste}
              placeholder={labels.pasteHint}
              className={`${FIELD} font-mono text-[13px] leading-relaxed`}
            />
            {totalPoints > 0 && (
              <p className="text-xs text-[color:var(--color-muted)]">
                {fill(labels.readSummary, { points: totalPoints, groups: analyses.length })}{" "}
                {fill(labels.columnsRead, { order: labels.orders[parsed.order] })}
                {parsed.stream && ` ${labels.streamNote}`}
              </p>
            )}
            {parsed.skipped.length > 0 && (
              <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs">{fill(labels.skipped, { lines: parsed.skipped.slice(0, 12).join(", ") })}</p>
            )}
          </div>
        )}
      </div>

      {/* ============================= WHERE IT IS ============================ */}
      <div aria-live="polite" className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <h3 className="text-xl">{labels.whereTitle}</h3>
        {!valid && <p className="text-[color:var(--color-muted)]">{labels.empty}</p>}

        {valid && compare && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{labels.compareBody}</p>
            <ul className="divide-y divide-[color:var(--color-hairline)] rounded-2xl border border-[color:var(--color-hairline)]">
              {candidates.map((c) => {
                const point = c.groups[primary].center;
                const away = c.id === "wgs84" ? null : distanceM(candidates[0].groups[primary].center, point);
                return (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span aria-hidden className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: c.color }} />
                      <div className="min-w-0">
                        <p className="font-semibold">{labels.compareNames[c.id]}</p>
                        <p className="text-sm tabular-nums text-[color:var(--color-muted)]">
                          {latLonText(point)}
                          {away !== null && ` · ${fill(labels.compareDistance, { m: metres(away) })}`}
                        </p>
                      </div>
                    </div>
                    <a
                      href={googleMapsLinks(point).place}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track(`maps-${c.id}`)}
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      {labels.openMaps} ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {valid && !compare && center && links && (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
              <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
                <p className="text-xs font-medium text-[color:var(--color-muted)]">
                  {analyses.length && analyses[primary].vertices.length > 1
                    ? fill(labels.centerOfGroup, { name: groupName(analyses[primary], primary) })
                    : fill(labels.pointLabel, { name: analyses[primary]?.vertices[0]?.name ?? "" })}
                </p>
                <p className="mt-1 break-all font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tabular-nums text-[color:var(--color-mint-700)] sm:text-3xl">
                  {latLonText(center).replace(",", ", ")}
                </p>
                <p className="mt-1 text-sm tabular-nums text-[color:var(--color-muted)]">
                  {dms(center.lat, "lat")} · {dms(center.lon, "lon")}
                </p>
                <button type="button" onClick={copyCenter} className="btn-ghost mt-3 px-3 py-1.5 text-xs">
                  {copied ? labels.copied : labels.copy}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <a href={links.place} target="_blank" rel="noopener noreferrer" onClick={() => track("maps")} className="btn-primary justify-center">
                  <PinIcon />
                  {labels.openMaps}
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a href={links.directions} target="_blank" rel="noopener noreferrer" onClick={() => track("directions")} className="btn-ghost justify-center px-3 py-2.5 text-sm">
                    {labels.directions}
                  </a>
                  <a href={links.satellite} target="_blank" rel="noopener noreferrer" onClick={() => track("satellite")} className="btn-ghost justify-center px-3 py-2.5 text-sm">
                    {labels.satellite}
                  </a>
                </div>
                <button type="button" onClick={exportKml} className="btn-ghost justify-center px-3 py-2.5 text-sm">
                  {labels.kml}
                </button>
              </div>
            </div>
            {rawDistance !== null && (
              <p className="rounded-xl border-l-4 border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)]/[0.06] px-4 py-3 text-sm leading-relaxed">
                {fill(labels.rawNote, { m: metres(rawDistance) })}
              </p>
            )}
            {outside && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{outside}</p>}
            {datumNote && <p className="text-xs text-[color:var(--color-muted)]">{datumNote}</p>}
          </>
        )}
      </div>

      {/* ================================= MAP =============================== */}
      {valid && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl">{compare ? labels.compareTitle : labels.mapTitle}</h3>
            <p className="text-sm text-[color:var(--color-muted)]">{labels.mapHint}</p>
          </div>
          <PlanMap layers={layers} ariaLabel={labels.mapTitle} />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {compare
              ? candidates.map((c) => <Legend key={c.id} color={c.color} dashed={c.id !== "wgs84"} label={labels.compareNames[c.id]} />)
              : (
                  <>
                    <Legend color={PLAN_COLOR} label={labels.legendPlan} />
                    {raw && s.showRaw && <Legend color={RAW_COLOR} dashed label={labels.legendRaw} />}
                    {raw && (
                      <label className="inline-flex cursor-pointer items-center gap-2 text-[color:var(--color-muted)]">
                        <input type="checkbox" checked={s.showRaw} onChange={(e) => set({ showRaw: e.target.checked })} className="h-4 w-4 accent-[color:var(--color-mint-600)]" />
                        {labels.showRaw}
                      </label>
                    )}
                  </>
                )}
          </div>
        </div>
      )}

      {/* ============================ TABLE CHECK ============================ */}
      {valid && analyses.some((a) => a.vertices.length > 1) && (
        <div className="surface space-y-6 rounded-3xl p-4 sm:p-6">
          <div>
            <h3 className="text-xl">{labels.checkTitle}</h3>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">{labels.checkIntro}</p>
          </div>
          {analyses.map((a, i) =>
            a.vertices.length > 1 ? (
              <GroupCheck key={i} title={groupName(a, i)} analysis={a} labels={labels} dec={dec} grouped={(x) => formatNumber(x, 2, style)} />
            ) : null,
          )}
        </div>
      )}

      {/* ============================== VERTICES ============================= */}
      {valid && (
        <div className="surface rounded-3xl p-4 sm:p-6">
          <h3 className="text-xl">{labels.verticesTitle}</h3>
          <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm tabular-nums">
              <thead className="border-b border-[color:var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                <tr>
                  <th className="py-2.5 pr-3">{labels.cols.name}</th>
                  <th className="px-3 py-2.5 text-right">{labels.cols.e}</th>
                  <th className="px-3 py-2.5 text-right">{labels.cols.n}</th>
                  <th className="px-3 py-2.5 text-right">{labels.cols.lat}</th>
                  <th className="px-3 py-2.5 text-right">{labels.cols.lon}</th>
                  <th className="py-2.5 pl-3 text-right">{labels.cols.link}</th>
                </tr>
              </thead>
              <tbody>
                {analyses
                  .flatMap((a, gi) => a.vertices.map((v, vi) => ({ v, p: main[gi].points[vi], key: `${gi}-${vi}` })))
                  .slice(0, TABLE_LIMIT)
                  .map(({ v, p, key }) => (
                    <tr key={key} className="border-b border-[color:var(--color-hairline)]">
                      <td className="py-2 pr-3 font-semibold">{v.name}</td>
                      <td className="px-3 py-2 text-right">{dec(v.e, 3)}</td>
                      <td className="px-3 py-2 text-right">{dec(v.n, 3)}</td>
                      <td className="px-3 py-2 text-right">{p.lat.toFixed(7)}</td>
                      <td className="px-3 py-2 text-right">{p.lon.toFixed(7)}</td>
                      <td className="py-2 pl-3 text-right">
                        <a
                          href={googleMapsLinks(p).place}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("maps-vertex")}
                          className="font-semibold text-[color:var(--color-mint-700)] hover:underline"
                        >
                          {labels.view} ↗
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
            href={whatsappUrl(labels.cta.prefill)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="tool-plan"
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

function GroupCheck({
  title,
  analysis,
  labels,
  dec,
  grouped,
}: {
  title: string;
  analysis: GroupAnalysis;
  labels: PlanLocatorLabels;
  dec: (x: number, d: number) => string;
  /** Two decimals with thousands separators. */
  grouped: (x: number) => string;
}) {
  const statedSides = analysis.sides.some((x) => x.stated !== null);
  const statedAngles = analysis.angles.some((x) => x.stated !== null);
  const status =
    analysis.consistent === true ? labels.consistent : analysis.consistent === false ? labels.inconsistent : labels.noStated;
  return (
    <section className="border-t border-[color:var(--color-hairline)] pt-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-lg">{title}</h4>
        {analysis.parcel && (
          <p className="text-sm tabular-nums text-[color:var(--color-muted)]">
            {labels.area}: <span className="font-semibold text-[color:var(--color-foreground)]">{grouped(analysis.parcel.area)} m²</span> (
            {dec(analysis.parcel.area / 10_000, 4)} {labels.hectares}) · {labels.perimeter}:{" "}
            <span className="font-semibold text-[color:var(--color-foreground)]">{grouped(analysis.parcel.perimeter)} m</span>
          </p>
        )}
      </div>
      <p
        className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
          analysis.consistent === true
            ? "bg-[color:var(--color-mint-500)]/10"
            : analysis.consistent === false
              ? "bg-amber-500/10"
              : "bg-[color:var(--color-hairline)]/60 text-[color:var(--color-muted)]"
        }`}
      >
        {status}
      </p>
      {analysis.warnings.map((w) => (
        <p key={w} className="mt-2 rounded-xl bg-amber-500/10 px-4 py-2 text-sm">
          {labels.warnings[w]}
        </p>
      ))}
      {analysis.parcelError && <p className="mt-2 rounded-xl bg-amber-500/10 px-4 py-2 text-sm">{labels.parcelErrors[analysis.parcelError]}</p>}

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[22rem] border-collapse text-left text-sm tabular-nums">
            <thead className="border-b border-[color:var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
              <tr>
                <th className="py-2 pr-3">{labels.sideCol}</th>
                {statedSides && <th className="px-3 py-2 text-right">{labels.statedCol}</th>}
                <th className="px-3 py-2 text-right">{labels.computedCol}</th>
                {statedSides && <th className="py-2 pl-3 text-right">{labels.diffCol}</th>}
              </tr>
            </thead>
            <tbody>
              {analysis.sides.map((x) => (
                <tr key={`${x.from}-${x.to}`} className="border-b border-[color:var(--color-hairline)]">
                  <td className="py-2 pr-3 font-semibold">
                    {x.from} – {x.to}
                  </td>
                  {statedSides && <td className="px-3 py-2 text-right">{x.stated === null ? "—" : dec(x.stated, 4)}</td>}
                  <td className="px-3 py-2 text-right">{dec(x.computed, 4)}</td>
                  {statedSides && (
                    <td className={`py-2 pl-3 text-right ${x.ok === false ? "font-semibold text-amber-600" : ""}`}>
                      {x.stated === null ? "—" : `${x.ok ? "✓" : "✗"} ${dec(x.computed - x.stated, 3)}`}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {analysis.angles.length > 0 && (
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[20rem] border-collapse text-left text-sm tabular-nums">
              <thead className="border-b border-[color:var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                <tr>
                  <th className="py-2 pr-3">{labels.vertexCol}</th>
                  {statedAngles && <th className="px-3 py-2 text-right">{labels.statedCol}</th>}
                  <th className="px-3 py-2 text-right">{labels.angleCol}</th>
                  {statedAngles && <th className="py-2 pl-3 text-right" aria-label={labels.ok} />}
                </tr>
              </thead>
              <tbody>
                {analysis.angles.map((x) => (
                  <tr key={x.at} className="border-b border-[color:var(--color-hairline)]">
                    <td className="py-2 pr-3 font-semibold">{x.at}</td>
                    {statedAngles && <td className="px-3 py-2 text-right">{x.stated === null ? "—" : formatAngle(x.stated)}</td>}
                    <td className="px-3 py-2 text-right">{formatAngle(x.computed)}</td>
                    {statedAngles && (
                      <td className={`py-2 pl-3 text-right ${x.ok === false ? "font-semibold text-amber-600" : ""}`}>
                        {x.stated === null ? "—" : x.ok ? `✓ ${labels.ok}` : `✗ ${labels.mismatch}`}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function CoordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal" spellCheck={false} className={`${FIELD} pr-10`} />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-muted)]">m</span>
      </span>
    </label>
  );
}

function Legend({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-3 w-6 rounded-sm"
        style={dashed ? { border: `2px dashed ${color}` } : { background: `${color}33`, border: `2px solid ${color}` }}
      />
      {label}
    </span>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
