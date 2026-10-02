"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import {
  GEO_ORDERS,
  UTM_ORDERS,
  elevationFactor,
  geoToUtm,
  parseAngle,
  parseTable,
  transformDatum,
  utmToGeo,
  utmZone,
  type DatumId,
  type OrderId,
} from "@/lib/tools/coordinates";
import { analyzeParcel, letterName, polygonFromMeasures, type Cardinal, type Parcel, type Vertex } from "@/lib/tools/parcel";
import { buildDescription, type DescCrs } from "@/lib/tools/parcel-text";
import { buildParcelDxf } from "@/lib/tools/parcel-dxf";
import { DxfReadError, readDxfPolylines, type DxfPolyline } from "@/lib/tools/dxf";
import { buildDocx, type DocBlock } from "@/lib/tools/docx";
import { buildXlsx, type Cell } from "@/lib/tools/xlsx";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { IconWhatsApp } from "@/components/icons";
import { downloadFile } from "@/components/tools/download";

const PointsMap = dynamic(() => import("@/components/tools/points-map").then((m) => m.PointsMap), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse rounded-2xl bg-[color:var(--color-hairline)]" />,
});

// -----------------------------------------------------------------------------
// Land area and perimeter plan: area, perimeter, table of technical data and
// the boundary description (memoria descriptiva / memorial descritivo /
// metes and bounds) from coordinates — pasted, or read from a DXF polyline —
// or from measured sides plus a diagonal. Exports Word, DXF and Excel.
// Geometry in lib/tools/parcel.ts; copy in lib/tools-content/terreno.ts.
// -----------------------------------------------------------------------------

type Locale3 = "es" | "pt" | "en";
type SystemKind = "utm" | "geo" | "local";
type Unit = "m" | "ft";
type Figure = "triangle" | "quad";
type SideKey = "ab" | "bc" | "cd" | "da" | "ac" | "ca";

export type ParcelLabels = {
  modeCoords: string;
  modeMeasures: string;
  system: string;
  systems: Record<SystemKind, string>;
  datum: string;
  datums: Record<DatumId, string>;
  datumOrder: DatumId[];
  zone: string;
  hemisphere: string;
  north: string;
  south: string;
  units: string;
  meters: string;
  feet: string;
  order: string;
  orders: Record<OrderId, string>;
  paste: string;
  pasteHint: string;
  loadExample: string;
  clear: string;
  importDxf: string;
  importDxfHint: string;
  /** {layer} {n} {area} */
  dxfOption: string;
  dxfChoose: string;
  dxfUse: string;
  dxfErrors: { binary: string; noEntities: string; none: string; dwg: string };
  dxfArcs: string;
  dxfOpen: string;
  figure: string;
  triangle: string;
  quad: string;
  side: string;
  diagonal: string;
  measuresHint: string;
  measureErrors: { invalid: string; abc: string; acd: string };
  title: string;
  titlePlaceholder: string;
  elevation: string;
  elevationHint: string;
  displayUnit: string;
  results: string;
  empty: string;
  area: string;
  perimeter: string;
  vertices: string;
  clockwise: string;
  counterclockwise: string;
  /** {area} {factor} {h} */
  groundArea: string;
  /** {sum} */
  angleCheck: string;
  /** {zone} */
  geoNote: string;
  errors: { few: string; zeroArea: string; /** {a} {b} */ selfIntersecting: string; zone: string };
  /** {n} {lines} */
  badRows: string;
  neighbors: string;
  neighborsHint: string;
  neighborPlaceholder: string;
  faces: Record<Cardinal, string>;
  relativeFaces: Record<Cardinal, string>;
  description: string;
  copy: string;
  copied: string;
  exportDocx: string;
  exportDxf: string;
  exportExcel: string;
  mapTitle: string;
  mapHint: string;
  sketchTitle: string;
  fileBase: string;
  xlsx: { sheet: string; boundaries: string; generatedBy: string; side: string; length: string; facing: string; neighbor: string; area: string; perimeter: string };
  cta: { title: string; body: string; button: string; /** {area} {n} */ prefill: string };
  vertexNames: "letters" | "V" | "numbers";
  example: {
    text: string;
    order: OrderId;
    system: { kind: SystemKind; datum: DatumId; zone: string; south: boolean };
    title: string;
    neighbors: string[];
    elevation: string;
    measures: Record<SideKey, string>;
  };
};

type State = {
  mode: "coords" | "measures";
  kind: SystemKind;
  datum: DatumId;
  zone: string;
  south: boolean;
  localUnit: Unit;
  order: OrderId;
  text: string;
  figure: Figure;
  sides: Record<SideKey, string>;
  title: string;
  elevation: string;
  neighbors: Record<string, string>;
  unit: Unit;
};

type Computed =
  | { status: "empty" }
  | { status: "error"; message: string; badRows: number[] }
  | {
      status: "ok";
      parcel: Parcel;
      crs: DescCrs;
      inputUnit: Unit;
      badRows: number[];
      geo: { lat: number; lon: number; label: string }[] | null;
      ground: { area: number; factor: number; h: number } | null;
      geoZone: string | null;
    };

const FT = 0.3048;
const SQFT = FT * FT;
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

function vertexName(style: ParcelLabels["vertexNames"], i: number): string {
  if (style === "V") return `V${i + 1}`;
  if (style === "numbers") return String(i + 1);
  return letterName(i);
}

const sideKey = (parcel: Parcel, i: number) => `${parcel.vertices[i].name}>${parcel.vertices[(i + 1) % parcel.vertices.length].name}`;

function initialState(labels: ParcelLabels, locale: Locale3): State {
  const ex = labels.example;
  const st: State = {
    mode: "coords",
    kind: ex.system.kind,
    datum: ex.system.datum,
    zone: ex.system.zone,
    south: ex.system.south,
    localUnit: "m",
    order: ex.order,
    text: ex.text,
    figure: "quad",
    sides: { ...ex.measures },
    title: ex.title,
    elevation: ex.elevation,
    neighbors: {},
    unit: locale === "en" ? "ft" : "m",
  };
  // Pre-fill the example's neighbours on its sides (A>B, B>C, …).
  const names = ex.text.split("\n").map((l) => l.split("\t")[0]);
  ex.neighbors.forEach((n, i) => {
    st.neighbors[`${names[i]}>${names[(i + 1) % names.length]}`] = n;
  });
  return st;
}

function compute(s: State, labels: ParcelLabels): Computed {
  if (s.mode === "measures") {
    const v = (k: SideKey) => parseDecimal(s.sides[k]);
    const names = [0, 1, 2, 3].map((i) => vertexName(labels.vertexNames, i));
    const res =
      s.figure === "triangle"
        ? polygonFromMeasures({ kind: "triangle", ab: v("ab"), bc: v("bc"), ca: v("ca") }, names)
        : polygonFromMeasures({ kind: "quad", ab: v("ab"), bc: v("bc"), cd: v("cd"), da: v("da"), ac: v("ac") }, names);
    if (!res.ok) {
      const message = res.error === "invalid" ? labels.measureErrors.invalid : res.error === "triangle-abc" ? labels.measureErrors.abc : labels.measureErrors.acd;
      return { status: "error", message, badRows: [] };
    }
    const a = analyzeParcel(res.vertices);
    if (!a.ok) return { status: "error", message: labels.errors.zeroArea, badRows: [] };
    return { status: "ok", parcel: a.parcel, crs: { kind: "measures" }, inputUnit: s.unit, badRows: [], geo: null, ground: null, geoZone: null };
  }

  if (!s.text.trim()) return { status: "empty" };
  const { rows } = parseTable(s.text, s.order);
  const badRows: number[] = [];
  const points: { name: string; a: number; b: number }[] = [];
  rows.forEach((row, i) => {
    const v = row.values;
    const a = s.kind === "geo" ? parseAngle(v.LAT ?? "", "lat") : parseDecimal(v.E ?? "");
    const b = s.kind === "geo" ? parseAngle(v.LON ?? "", "lon") : parseDecimal(v.N ?? "");
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      // A first row without numbers is a header, not an error.
      if (i > 0 || /\d/.test(`${v.E ?? ""}${v.N ?? ""}${v.LAT ?? ""}${v.LON ?? ""}`)) badRows.push(row.line);
      return;
    }
    points.push({ name: (v.P ?? "").trim() || vertexName(labels.vertexNames, points.length), a, b });
  });
  if (points.length === 0) return { status: "error", message: labels.errors.few, badRows };

  let vertices: Vertex[];
  let crs: DescCrs;
  let geo: { lat: number; lon: number; label: string }[] | null = null;
  let utm: { zone: number; south: boolean } | null = null;
  let geoZone: string | null = null;

  if (s.kind === "geo") {
    const lat = points.reduce((sum, p) => sum + p.a, 0) / points.length;
    const lon = points.reduce((sum, p) => sum + p.b, 0) / points.length;
    utm = { zone: utmZone(lat, lon), south: lat < 0 };
    geoZone = `${utm.zone}${utm.south ? "S" : "N"}`;
    vertices = points.map((p) => {
      const u = geoToUtm(p.a, p.b, s.datum, utm!.zone, utm!.south);
      return { name: p.name, e: u.e, n: u.n };
    });
    geo = points.map((p) => {
      const [la, lo] = transformDatum(p.a, p.b, s.datum, "wgs84");
      return { lat: la, lon: lo, label: p.name };
    });
  } else {
    vertices = points.map((p) => ({ name: p.name, e: p.a, n: p.b }));
    if (s.kind === "utm") {
      const zone = Number(s.zone);
      if (!(zone >= 1 && zone <= 60)) return { status: "error", message: labels.errors.zone, badRows };
      utm = { zone, south: s.south };
      geo = vertices.map((v) => {
        const g = utmToGeo(v.e, v.n, zone, s.south, s.datum);
        const [la, lo] = transformDatum(g.lat, g.lon, s.datum, "wgs84");
        return { lat: la, lon: lo, label: v.name };
      });
    }
  }

  const res = analyzeParcel(vertices);
  if (!res.ok) {
    const message =
      res.error === "few"
        ? labels.errors.few
        : res.error === "zero-area"
          ? labels.errors.zeroArea
          : fill(labels.errors.selfIntersecting, {
              a: `${vertices[res.sides![0]].name}-${vertices[(res.sides![0] + 1) % vertices.length].name}`,
              b: `${vertices[res.sides![1]].name}-${vertices[(res.sides![1] + 1) % vertices.length].name}`,
            });
    return { status: "error", message, badRows };
  }
  const parcel = res.parcel;

  let ground: { area: number; factor: number; h: number } | null = null;
  if (utm) {
    crs = { kind: "utm", zone: utm.zone, south: utm.south, datum: labels.datums[s.datum].split(" (")[0], sgb: s.datum === "sirgas2000" };
    const c = utmToGeo(parcel.centroid.e, parcel.centroid.n, utm.zone, utm.south, s.datum);
    const h = Number.isFinite(parseDecimal(s.elevation)) ? parseDecimal(s.elevation) : 0;
    const factor = c.scale * elevationFactor(c.lat, h, s.datum);
    ground = { area: parcel.area / (factor * factor), factor, h };
  } else {
    crs = { kind: "local" };
  }
  return { status: "ok", parcel, crs, inputUnit: s.kind === "local" ? s.localUnit : "m", badRows, geo, ground, geoZone };
}

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]/70";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";
const ZONES = Array.from({ length: 60 }, (_, i) => String(i + 1));

export function ParcelCalculator({ labels, locale }: { labels: ParcelLabels; locale: Locale3 }) {
  const style = NUMBER_STYLES[locale];
  const fmt = (v: number, d: number) => formatNumber(v, d, style);
  const [s, setS] = useState<State>(() => initialState(labels, locale));
  const [dxf, setDxf] = useState<{ polys: DxfPolyline[]; error: string | null; arcs: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));

  const result = useMemo(() => compute(s, labels), [s, labels]);
  const allowFeet = locale === "en";
  const unit: Unit = allowFeet ? s.unit : "m";

  const view = useMemo(() => {
    if (result.status !== "ok") return null;
    const { parcel } = result;
    const neighbors = parcel.sides.map((_, i) => s.neighbors[sideKey(parcel, i)] ?? "");
    const description = buildDescription({ locale, parcel, neighbors, title: s.title, crs: result.crs, inputUnit: result.inputUnit, unit });
    return { parcel, neighbors, description };
  }, [result, s.neighbors, s.title, locale, unit]);

  // Display values in the chosen unit (areas: m² and ha, or ft² and acres).
  const lengthK = result.status === "ok" ? (result.inputUnit === unit ? 1 : unit === "ft" ? 1 / FT : FT) : 1;
  const areaM2 = result.status === "ok" ? (result.inputUnit === "m" ? result.parcel.area : result.parcel.area * SQFT) : 0;
  const areaMain = unit === "ft" ? `${fmt(areaM2 / SQFT, 2)} ft²` : `${fmt(areaM2, 2)} m²`;
  const areaSub = unit === "ft" ? `${fmt(areaM2 / SQFT / 43560, 3)} ac · ${fmt(areaM2, 2)} m²` : `${fmt(areaM2 / 10000, 4)} ha`;

  function onDxfFile(file: File) {
    if (/\.dwg$/i.test(file.name)) {
      setDxf({ polys: [], error: labels.dxfErrors.dwg, arcs: false });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const polys = readDxfPolylines(String(reader.result ?? ""))
          .filter((p) => p.points.length >= 3)
          .map((p) => ({ ...p, area: Math.abs(shoelace(p.points)) }))
          .sort((a, b) => b.area - a.area);
        if (polys.length === 0) setDxf({ polys: [], error: labels.dxfErrors.none, arcs: false });
        else if (polys.length === 1) loadPolyline(polys[0]);
        else setDxf({ polys, error: null, arcs: false });
      } catch (e) {
        const reason = e instanceof DxfReadError ? e.reason : "no-entities";
        setDxf({ polys: [], error: reason === "binary" ? labels.dxfErrors.binary : labels.dxfErrors.noEntities, arcs: false });
      }
    };
    reader.readAsText(file);
    trackEvent("tool_import", { tool: "calculadora-area-terreno", format: "dxf" });
  }

  function loadPolyline(p: DxfPolyline) {
    const text = p.points.map((pt, i) => `${vertexName(labels.vertexNames, i)}\t${pt.x.toFixed(3)}\t${pt.y.toFixed(3)}`).join("\n");
    setS((prev) => ({ ...prev, mode: "coords", kind: prev.kind === "geo" ? "utm" : prev.kind, order: "PENZD", text, neighbors: {} }));
    setDxf(p.hasArcs ? { polys: [], error: null, arcs: true } : null);
  }

  function exportFile(format: "docx" | "dxf" | "xlsx") {
    if (!view || result.status !== "ok") return;
    const { parcel, description } = view;
    const base = labels.fileBase;
    if (format === "docx") {
      const blocks: DocBlock[] = [{ type: "heading", text: description.title }];
      for (const b of description.blocks) {
        if (b.type === "heading") blocks.push({ type: "heading", text: b.text, level: 2 });
        else if (b.type === "paragraph") blocks.push({ type: "paragraph", runs: b.runs, align: "justify" });
        else blocks.push({ type: "table", header: true, rows: [b.head, ...b.rows], align: b.head.map((_, i) => (i < 2 ? "center" : "right")) });
      }
      downloadFile(`${base}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", buildDocx(blocks, { page: locale === "en" ? "Letter" : "A4" }));
    }
    if (format === "dxf") {
      downloadFile(`${base}.dxf`, "application/dxf", buildParcelDxf({ parcel, description, lengthFactor: lengthK, decimal: style.decimal }));
    }
    if (format === "xlsx") {
      const h = (value: string): Cell => ({ value, style: "header" });
      const tableRows: Cell[][] = [
        description.table.head.map(h),
        ...description.table.rows.map((row, i) =>
          row.map((cell, c): Cell => {
            const kind = description.table.kinds[c];
            if (kind === "distance") return { value: parcel.sides[i].length * lengthK, style: "dec2" };
            if (kind === "e") return { value: parcel.vertices[i].e, style: "dec3" };
            if (kind === "n") return { value: parcel.vertices[i].n, style: "dec3" };
            return cell;
          }),
        ),
        [],
        [labels.xlsx.area, description.areaText],
        [labels.xlsx.perimeter, description.perimeterText],
        [description.note],
        [labels.xlsx.generatedBy],
      ];
      const facesLabel = result.crs.kind === "measures" ? labels.relativeFaces : labels.faces;
      const boundaryRows: Cell[][] = [
        [h(labels.xlsx.side), h(labels.xlsx.length), h(labels.xlsx.facing), h(labels.xlsx.neighbor)],
        ...parcel.sides.map((sd, i): Cell[] => [
          `${parcel.vertices[sd.from].name}-${parcel.vertices[sd.to].name}`,
          { value: sd.length * lengthK, style: "dec2" },
          facesLabel[sd.faces],
          view.neighbors[i],
        ]),
      ];
      downloadFile(
        `${base}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        buildXlsx([
          { name: labels.xlsx.sheet, rows: tableRows, widths: [10, 10, 16, 16, 16, 16, 16] },
          { name: labels.xlsx.boundaries, rows: boundaryRows, widths: [10, 14, 22, 36] },
        ]),
      );
    }
    trackEvent("tool_export", { tool: "calculadora-area-terreno", format, vertices: parcel.vertices.length });
  }

  async function copyText() {
    if (!view) return;
    try {
      await navigator.clipboard.writeText(view.description.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const prefill = fill(labels.cta.prefill, {
    area: result.status === "ok" ? areaMain : "—",
    n: result.status === "ok" ? result.parcel.vertices.length : 0,
  });
  const ordersFor = s.kind === "geo" ? GEO_ORDERS : UTM_ORDERS;

  return (
    <div className="space-y-6">
      {/* =============================== INPUT ============================== */}
      <div className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${labels.modeCoords} / ${labels.modeMeasures}`}>
          {(["coords", "measures"] as const).map((m) => (
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
              {m === "coords" ? labels.modeCoords : labels.modeMeasures}
            </button>
          ))}
        </div>

        {s.mode === "coords" ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className={LABEL}>{labels.system}</span>
                <select
                  value={s.kind}
                  onChange={(e) => {
                    const kind = e.target.value as SystemKind;
                    const geoNow = kind === "geo";
                    const geoBefore = s.kind === "geo";
                    const order = geoNow === geoBefore ? s.order : geoNow ? "PLATLON" : "PENZD";
                    set({ kind, order });
                  }}
                  className={FIELD}
                >
                  {(["utm", "geo", "local"] as const).map((k) => (
                    <option key={k} value={k}>
                      {labels.systems[k]}
                    </option>
                  ))}
                </select>
              </label>
              {s.kind !== "local" ? (
                <label className="block">
                  <span className={LABEL}>{labels.datum}</span>
                  <select value={s.datum} onChange={(e) => set({ datum: e.target.value as DatumId })} className={FIELD}>
                    {labels.datumOrder.map((id) => (
                      <option key={id} value={id}>
                        {labels.datums[id]}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                allowFeet && (
                  <label className="block">
                    <span className={LABEL}>{labels.units}</span>
                    <select value={s.localUnit} onChange={(e) => set({ localUnit: e.target.value as Unit })} className={FIELD}>
                      <option value="m">{labels.meters}</option>
                      <option value="ft">{labels.feet}</option>
                    </select>
                  </label>
                )
              )}
              {s.kind === "utm" && (
                <>
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
                </>
              )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="block min-w-[14rem]">
                <span className={LABEL}>{labels.order}</span>
                <select value={s.order} onChange={(e) => set({ order: e.target.value as OrderId })} className={FIELD}>
                  {Object.keys(ordersFor).map((id) => (
                    <option key={id} value={id}>
                      {labels.orders[id as OrderId]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setS(initialState(labels, locale))} className="btn-ghost px-4 py-2 text-sm">
                  {labels.loadExample}
                </button>
                <button type="button" onClick={() => set({ text: "", neighbors: {} })} className="btn-ghost px-4 py-2 text-sm">
                  {labels.clear}
                </button>
                <button type="button" onClick={() => fileInput.current?.click()} className="btn-ghost px-4 py-2 text-sm">
                  {labels.importDxf}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".dxf,.dwg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onDxfFile(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <p className="-mt-2 text-xs text-[color:var(--color-muted)]">{labels.importDxfHint}</p>

            {dxf?.error && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{dxf.error}</p>}
            {dxf?.arcs && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{labels.dxfArcs}</p>}
            {dxf && dxf.polys.length > 1 && (
              <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
                <p className="text-sm font-semibold">{labels.dxfChoose}</p>
                <ul className="mt-3 space-y-2">
                  {dxf.polys.slice(0, 30).map((p, i) => (
                    <li key={i} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span>
                        {fill(labels.dxfOption, { layer: p.layer, n: p.points.length, area: fmt(Math.abs(shoelace(p.points)), 2) })}
                        {!p.closed && <span className="text-[color:var(--color-muted)]"> · {labels.dxfOpen}</span>}
                      </span>
                      <button type="button" onClick={() => loadPolyline(p)} className="btn-ghost px-3 py-1.5 text-xs">
                        {labels.dxfUse}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <label className="block">
              <span className={LABEL}>{labels.paste}</span>
              <textarea
                value={s.text}
                onChange={(e) => set({ text: e.target.value })}
                rows={7}
                spellCheck={false}
                placeholder={labels.pasteHint}
                className={`${FIELD} font-mono text-[13px] leading-relaxed`}
              />
            </label>
          </>
        ) : (
          <MeasuresInput s={s} set={set} labels={labels} unit={unit} />
        )}

        <div className="grid gap-3 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block">
            <span className={LABEL}>{labels.title}</span>
            <input value={s.title} onChange={(e) => set({ title: e.target.value })} placeholder={labels.titlePlaceholder} className={FIELD} />
          </label>
          {s.mode === "coords" && s.kind !== "local" && (
            <label className="block">
              <span className={LABEL}>{labels.elevation}</span>
              <input value={s.elevation} onChange={(e) => set({ elevation: e.target.value })} inputMode="decimal" className={FIELD} />
              <span className="mt-1 block text-xs text-[color:var(--color-muted)]">{labels.elevationHint}</span>
            </label>
          )}
          {allowFeet && (
            <label className="block">
              <span className={LABEL}>{labels.displayUnit}</span>
              <select value={s.unit} onChange={(e) => set({ unit: e.target.value as Unit })} className={FIELD}>
                <option value="ft">{labels.feet}</option>
                <option value="m">{labels.meters}</option>
              </select>
            </label>
          )}
        </div>
      </div>

      {/* ============================== RESULTS ============================= */}
      <div aria-live="polite" className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        {result.status === "empty" && <p className="text-[color:var(--color-muted)]">{labels.empty}</p>}
        {result.status === "error" && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{result.message}</p>}
        {result.status !== "empty" && result.badRows.length > 0 && (
          <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">
            {fill(labels.badRows, { n: result.badRows.length, lines: result.badRows.slice(0, 8).join(", ") })}
          </p>
        )}

        {result.status === "ok" && view && (
          <>
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Stat label={labels.area} value={areaMain} sub={areaSub} strong />
              <Stat label={labels.perimeter} value={`${fmt(result.parcel.perimeter * lengthK, 2)} ${unit}`} />
              <Stat
                label={labels.vertices}
                value={String(result.parcel.vertices.length)}
                sub={result.parcel.clockwise ? labels.clockwise : labels.counterclockwise}
              />
            </dl>
            {result.ground && (
              <p className="text-sm text-[color:var(--color-muted)]">
                {fill(labels.groundArea, {
                  area: unit === "ft" ? `${fmt(result.ground.area / SQFT, 2)} ft²` : `${fmt(result.ground.area, 2)} m²`,
                  factor: result.ground.factor.toFixed(8).replace(".", style.decimal),
                  h: fmt(result.ground.h, 0),
                })}
              </p>
            )}
            {result.geoZone && <p className="text-sm text-[color:var(--color-muted)]">{fill(labels.geoNote, { zone: result.geoZone })}</p>}
            <p className="text-sm text-[color:var(--color-muted)]">
              ✓ {fill(labels.angleCheck, { sum: `${(result.parcel.vertices.length - 2) * 180}°00'00"` })}
            </p>

            {/* Table of technical data */}
            <div>
              <h4 className="text-base font-semibold">{view.description.table.title}</h4>
              <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm tabular-nums">
                  <thead className="border-b border-[color:var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                    <tr>
                      {view.description.table.head.map((h, i) => (
                        <th key={h} className={`py-2.5 ${i === 0 ? "pr-3" : "px-3"} ${i >= 2 ? "text-right" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {view.description.table.rows.map((row) => (
                      <tr key={row[1]} className="border-b border-[color:var(--color-hairline)]">
                        {row.map((cell, i) => (
                          <td key={i} className={`py-2 ${i === 0 ? "pr-3 font-semibold" : "px-3"} ${i >= 2 ? "text-right" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Neighbours per side */}
            <div>
              <h4 className="text-base font-semibold">{labels.neighbors}</h4>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">{labels.neighborsHint}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {result.parcel.sides.map((sd, i) => {
                  const key = sideKey(result.parcel, i);
                  const faces = (result.crs.kind === "measures" ? labels.relativeFaces : labels.faces)[sd.faces];
                  return (
                    <li key={key}>
                      <label className="block">
                        <span className={LABEL}>
                          {`${result.parcel.vertices[sd.from].name}-${result.parcel.vertices[sd.to].name}`} · {fmt(sd.length * lengthK, 2)} {unit} · {faces}
                        </span>
                        <input
                          value={s.neighbors[key] ?? ""}
                          onChange={(e) => setS((prev) => ({ ...prev, neighbors: { ...prev.neighbors, [key]: e.target.value } }))}
                          placeholder={labels.neighborPlaceholder}
                          className={FIELD}
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-base font-semibold">{labels.description}</h4>
                <button type="button" onClick={copyText} className="btn-ghost px-3 py-1.5 text-xs">
                  {copied ? labels.copied : labels.copy}
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed">
                <p className="font-semibold">{view.description.title}</p>
                {view.description.blocks.map((b, i) =>
                  b.type === "heading" ? (
                    b.text === view.description.table.title ? null : (
                      <p key={i} className="pt-2 font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                        {b.text}
                      </p>
                    )
                  ) : b.type === "paragraph" ? (
                    <p key={i}>
                      {b.runs.map((r, j) => (r.bold ? <strong key={j}>{r.text}</strong> : <span key={j}>{r.text}</span>))}
                    </p>
                  ) : null,
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[color:var(--color-hairline)] pt-5">
              <button type="button" onClick={() => exportFile("docx")} className="btn-primary px-4 py-2 text-sm">
                {labels.exportDocx}
              </button>
              <button type="button" onClick={() => exportFile("dxf")} className="btn-ghost px-4 py-2 text-sm">
                {labels.exportDxf}
              </button>
              <button type="button" onClick={() => exportFile("xlsx")} className="btn-ghost px-4 py-2 text-sm">
                {labels.exportExcel}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ============================ MAP / SKETCH ========================== */}
      {result.status === "ok" &&
        (result.geo ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl">{labels.mapTitle}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{labels.mapHint}</p>
            </div>
            <PointsMap points={result.geo} ariaLabel={labels.mapTitle} polygon />
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xl">{labels.sketchTitle}</h3>
            <Sketch parcel={result.parcel} k={lengthK} decimal={style.decimal} />
          </div>
        ))}

      {/* =========================== SERVICE BRIDGE ========================= */}
      <aside className="turbo-border-soft rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink-950)] px-6 py-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-snug">{labels.cta.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{labels.cta.body}</p>
          </div>
          <a href={whatsappUrl(prefill)} target="_blank" rel="noopener noreferrer" data-cta="tool-parcel" className="btn-primary mt-5 shrink-0 sm:mt-0">
            <IconWhatsApp className="h-5 w-5" />
            {labels.cta.button}
          </a>
        </div>
      </aside>
    </div>
  );
}

function shoelace(points: { x: number; y: number }[]): number {
  const o = points[0];
  let twice = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    twice += (a.x - o.x) * (b.y - o.y) - (b.x - o.x) * (a.y - o.y);
  }
  return twice / 2;
}

function MeasuresInput({ s, set, labels, unit }: { s: State; set: (p: Partial<State>) => void; labels: ParcelLabels; unit: Unit }) {
  const names = [0, 1, 2, 3].map((i) => vertexName(labels.vertexNames, i));
  const fields: { key: SideKey; label: string }[] =
    s.figure === "triangle"
      ? [
          { key: "ab", label: `${labels.side} ${names[0]}-${names[1]}` },
          { key: "bc", label: `${labels.side} ${names[1]}-${names[2]}` },
          { key: "ca", label: `${labels.side} ${names[2]}-${names[0]}` },
        ]
      : [
          { key: "ab", label: `${labels.side} ${names[0]}-${names[1]}` },
          { key: "bc", label: `${labels.side} ${names[1]}-${names[2]}` },
          { key: "cd", label: `${labels.side} ${names[2]}-${names[3]}` },
          { key: "da", label: `${labels.side} ${names[3]}-${names[0]}` },
          { key: "ac", label: `${labels.diagonal} ${names[0]}-${names[2]}` },
        ];
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <fieldset>
          <legend className={LABEL}>{labels.figure}</legend>
          <div className="flex flex-wrap gap-1.5">
            {(["quad", "triangle"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={s.figure === f}
                onClick={() => set({ figure: f })}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  s.figure === f
                    ? "border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                    : "border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-mint-500)]"
                }`}
              >
                {f === "quad" ? labels.quad : labels.triangle}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className={LABEL}>
                {f.label} ({unit})
              </span>
              <input
                value={s.sides[f.key]}
                onChange={(e) => set({ sides: { ...s.sides, [f.key]: e.target.value } })}
                inputMode="decimal"
                className={FIELD}
              />
            </label>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.measuresHint}</p>
      </div>
      <svg viewBox="0 0 220 160" className="h-40 w-full text-[color:var(--color-foreground)]" aria-hidden>
        {s.figure === "quad" ? (
          <>
            <polygon points="30,130 190,130 170,40 50,25" className="fill-[color:var(--color-mint-500)]/15 stroke-current" strokeWidth="1.5" />
            <line x1="30" y1="130" x2="170" y2="40" className="stroke-[color:var(--color-mint-600)]" strokeWidth="1.5" strokeDasharray="5 4" />
            {[
              [30, 130, names[0], -10, 14],
              [190, 130, names[1], 6, 14],
              [170, 40, names[2], 6, -4],
              [50, 25, names[3], -12, -4],
            ].map(([x, y, n, dx, dy]) => (
              <text key={String(n)} x={Number(x) + Number(dx)} y={Number(y) + Number(dy)} className="fill-current text-[11px] font-semibold">
                {n}
              </text>
            ))}
          </>
        ) : (
          <>
            <polygon points="30,130 190,130 90,30" className="fill-[color:var(--color-mint-500)]/15 stroke-current" strokeWidth="1.5" />
            {[
              [30, 130, names[0], -10, 14],
              [190, 130, names[1], 6, 14],
              [90, 30, names[2], -4, -6],
            ].map(([x, y, n, dx, dy]) => (
              <text key={String(n)} x={Number(x) + Number(dx)} y={Number(y) + Number(dy)} className="fill-current text-[11px] font-semibold">
                {n}
              </text>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

function Stat({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
      <dt className="text-xs font-medium text-[color:var(--color-muted)]">{label}</dt>
      <dd className={`mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tabular-nums ${strong ? "text-[color:var(--color-mint-700)]" : ""}`}>
        {value}
      </dd>
      {sub && <dd className="mt-0.5 text-xs text-[color:var(--color-muted)]">{sub}</dd>}
    </div>
  );
}

/** Scaled drawing of the lot, for measured or local-coordinate parcels (no map). */
function Sketch({ parcel, k, decimal }: { parcel: Parcel; k: number; decimal: string }) {
  const W = 640;
  const H = 360;
  const pad = 46;
  const xs = parcel.vertices.map((v) => v.e);
  const ys = parcel.vertices.map((v) => v.n);
  const minX = Math.min(...xs);
  const maxY = Math.max(...ys);
  const span = Math.max(Math.max(...xs) - minX, maxY - Math.min(...ys)) || 1;
  const scale = Math.min((W - 2 * pad) / span, (H - 2 * pad) / span);
  const pt = (v: Vertex) => ({ x: pad + (v.e - minX) * scale, y: pad + (maxY - v.n) * scale });
  const pts = parcel.vertices.map(pt);
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl border border-[color:var(--color-hairline)] bg-[color:var(--color-surface)] text-[color:var(--color-foreground)]" role="img" aria-label="Croquis">
      <polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")} className="fill-[color:var(--color-mint-500)]/15 stroke-[color:var(--color-mint-600)]" strokeWidth="2" />
      {parcel.sides.map((sd, i) => {
        const a = pts[sd.from];
        const b = pts[sd.to];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <text key={i} x={mx + (dx / len) * 14} y={my + (dy / len) * 14} textAnchor="middle" dominantBaseline="middle" className="fill-current text-[12px] tabular-nums">
            {(sd.length * k).toFixed(2).replace(".", decimal)}
          </text>
        );
      })}
      {pts.map((p, i) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" className="fill-[color:var(--color-mint-500)]" />
            <text x={p.x + (dx / len) * 16} y={p.y + (dy / len) * 16} textAnchor="middle" dominantBaseline="middle" className="fill-current text-[13px] font-semibold">
              {parcel.vertices[i].name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
