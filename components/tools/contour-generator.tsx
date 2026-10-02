"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { geoToUtm, parseAngle, utmToGeo, utmZone } from "@/lib/tools/coordinates";
import {
  TERRAIN_TILES,
  TILE_SIZE,
  assembleGrid,
  clipPolyline,
  contourLevels,
  gridStats,
  isMajor,
  isolines,
  lonLatToPixel,
  metersPerPixel,
  pixelToLonLat,
  sampleGrid,
  simplify,
  suggestInterval,
} from "@/lib/tools/contours";
import { contoursToDxf, contoursToKml, pointsToPnezd, type ContourLine, type Rect } from "@/lib/tools/contour-export";
import { NUMBER_STYLES, formatNumber } from "@/lib/tools/number";
import { whatsappUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { IconWhatsApp } from "@/components/icons";
import { downloadFile } from "@/components/tools/download";
import type { ContourOverlay } from "@/components/tools/contour-map";

const ContourMap = dynamic(() => import("@/components/tools/contour-map").then((m) => m.ContourMap), {
  ssr: false,
  loading: () => <div className="h-[26rem] w-full animate-pulse rounded-2xl bg-[color:var(--color-hairline)]" />,
});

// -----------------------------------------------------------------------------
// Contour generator: pick a square on the map, contours are computed in the
// browser from open elevation tiles (AWS Terrain Tiles) and exported as DXF
// (3D polylines in UTM), PNEZD points for a Civil 3D surface, or KML.
// Math in lib/tools/contours.ts; copy in lib/tools-content/curvas.ts.
// -----------------------------------------------------------------------------

const SIZES = ["0.5", "1", "2", "5"] as const;
const INTERVALS = ["auto", "1", "2", "5", "10", "20", "50", "100"] as const;
const SPACINGS = ["10", "20", "30", "50"] as const;
type Size = (typeof SIZES)[number];
type Interval = (typeof INTERVALS)[number];
type Spacing = (typeof SPACINGS)[number];

export type ContourLabels = {
  goTo: string;
  goToPlaceholder: string;
  goToButton: string;
  goToError: string;
  moveHint: string;
  size: string;
  sizes: Record<Size, string>;
  interval: string;
  auto: string;
  majorEvery: string;
  belowSea: string;
  generate: string;
  generating: string;
  mapTitle: string;
  results: string;
  idle: string;
  stats: { min: string; max: string; relief: string; lines: string; interval: string; zone: string; resolution: string };
  errorFetch: string;
  errorFlat: string;
  exportDxf: string;
  exportPoints: string;
  exportKml: string;
  spacing: string;
  /** {n} */
  pointsCount: string;
  accuracyTitle: string;
  accuracy: string;
  attribution: string;
  attributionLink: string;
  layers: { minor: string; major: string; labels: string; boundary: string };
  pointsDescription: string;
  fileBase: string;
  kmlName: string;
  dxfComment: string;
  cta: { title: string; body: string; button: string; prefill: string };
  example: { lat: number; lon: number };
};

type Result = {
  lines: ContourLine[];
  overlay: ContourOverlay;
  min: number;
  max: number;
  interval: number;
  zone: number;
  south: boolean;
  rect: Rect;
  resolution: number;
};

type GridContext = { values: Float32Array; width: number; height: number; px0: number; py0: number; z: number };

async function fetchTile(z: number, x: number, y: number): Promise<Uint8ClampedArray> {
  const url = TERRAIN_TILES.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`tile ${response.status}`);
  // No colour management: any conversion would change the encoded elevations.
  const bitmap = await createImageBitmap(await response.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE).data;
}

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]/70";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";

export function ContourGenerator({ labels, locale }: { labels: ContourLabels; locale: "es" | "pt" | "en" }) {
  const style = NUMBER_STYLES[locale];
  const fmt = (v: number, d: number) => formatNumber(v, d, style);
  const [center, setCenter] = useState({ lat: labels.example.lat, lon: labels.example.lon });
  const [seq, setSeq] = useState(0);
  const [goTo, setGoTo] = useState("");
  const [goToError, setGoToError] = useState(false);
  const [size, setSize] = useState<Size>("2");
  const [intervalChoice, setIntervalChoice] = useState<Interval>("auto");
  const [majorEvery, setMajorEvery] = useState(5);
  const [skipBelowSea, setSkipBelowSea] = useState(true);
  const [spacing, setSpacing] = useState<Spacing>("20");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const grid = useRef<GridContext | null>(null);
  const centerRef = useRef(center);
  const generateRef = useRef<() => void>(() => undefined);

  async function generate() {
    setStatus("loading");
    setError("");
    try {
      const c = centerRef.current;
      const half = (Number(size) * 1000) / 2;
      const zone = utmZone(c.lat, c.lon);
      const south = c.lat < 0;
      const u = geoToUtm(c.lat, c.lon, "wgs84", zone, south);
      const rect: Rect = { minE: u.e - half, maxE: u.e + half, minN: u.n - half, maxN: u.n + half };
      const z = Number(size) <= 1 ? 15 : Number(size) <= 2 ? 14 : 13;

      const corners = [
        [rect.minE, rect.minN],
        [rect.minE, rect.maxN],
        [rect.maxE, rect.minN],
        [rect.maxE, rect.maxN],
      ].map(([e, n]) => {
        const g = utmToGeo(e, n, zone, south, "wgs84");
        return lonLatToPixel(g.lon, g.lat, z);
      });
      const px0 = Math.floor(Math.min(...corners.map((p) => p.x))) - 2;
      const py0 = Math.floor(Math.min(...corners.map((p) => p.y))) - 2;
      const width = Math.ceil(Math.max(...corners.map((p) => p.x))) - px0 + 3;
      const height = Math.ceil(Math.max(...corners.map((p) => p.y))) - py0 + 3;

      const tiles = new Map<string, Uint8ClampedArray>();
      const jobs: Promise<void>[] = [];
      for (let ty = Math.floor(py0 / TILE_SIZE); ty <= Math.floor((py0 + height - 1) / TILE_SIZE); ty++) {
        for (let tx = Math.floor(px0 / TILE_SIZE); tx <= Math.floor((px0 + width - 1) / TILE_SIZE); tx++) {
          jobs.push(fetchTile(z, tx, ty).then((data) => void tiles.set(`${tx}/${ty}`, data)));
        }
      }
      await Promise.all(jobs);
      const values = assembleGrid(tiles, px0, py0, width, height);
      grid.current = { values, width, height, px0, py0, z };

      const stats = gridStats(values);
      const relief = stats.max - stats.min;
      const step = intervalChoice === "auto" ? suggestInterval(Math.max(relief, 1)) : Number(intervalChoice);
      const levels = contourLevels(stats.min, stats.max, step).filter((l) => !skipBelowSea || l > 0);
      if (!levels.length) {
        setResult(null);
        setStatus("error");
        setError(labels.errorFlat);
        return;
      }

      const lines: ContourLine[] = [];
      for (const level of levels) {
        const major = isMajor(level, step, majorEvery);
        for (const iso of isolines(values, width, height, level)) {
          // Rings smaller than ~2.5 pixels are noise of the elevation model, not relief.
          if (iso.closed) {
            const xs = iso.points.map((p) => p.x);
            const ys = iso.points.map((p) => p.y);
            if (Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < 2.5) continue;
          }
          const simple = simplify(iso.points, 0.3, iso.closed);
          const utm = simple.map((p) => {
            const g = pixelToLonLat(px0 + p.x + 0.5, py0 + p.y + 0.5, z);
            const q = geoToUtm(g.lat, g.lon, "wgs84", zone, south);
            return { x: q.e, y: q.n };
          });
          const pieces = clipPolyline(utm, { minX: rect.minE, minY: rect.minN, maxX: rect.maxE, maxY: rect.maxN }, iso.closed);
          const wasClipped = pieces.length !== 1 || pieces[0] !== utm;
          for (const piece of pieces) {
            lines.push({ level, major, closed: iso.closed && !wasClipped, points: piece.map((p) => ({ e: p.x, n: p.y })) });
          }
        }
      }
      const overlay: ContourOverlay = lines.map((l) => ({
        major: l.major,
        latlon: l.points.map((p) => {
          const g = utmToGeo(p.e, p.n, zone, south, "wgs84");
          return [g.lat, g.lon] as [number, number];
        }),
      }));
      setResult({ lines, overlay, min: stats.min, max: stats.max, interval: step, zone, south, rect, resolution: metersPerPixel(c.lat, z) });
      setStatus("done");
      trackEvent("tool_run", { tool: "generador-curvas-de-nivel", size, interval: step });
    } catch {
      setStatus("error");
      setError(labels.errorFetch);
    }
  }

  useEffect(() => {
    centerRef.current = center;
    generateRef.current = () => void generate();
  });

  // Show the example's contours on arrival.
  useEffect(() => {
    const t = setTimeout(() => generateRef.current(), 0);
    return () => clearTimeout(t);
  }, []);

  function go() {
    const parts = goTo.split(/[,;]\s*|\s+(?=[-+]?\d)/).filter(Boolean);
    const lat = parseAngle(parts[0] ?? "", "lat");
    const lon = parseAngle(parts[1] ?? "", "lon");
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setGoToError(true);
      return;
    }
    setGoToError(false);
    setCenter({ lat, lon });
    centerRef.current = { lat, lon };
    setSeq((s) => s + 1);
  }

  function exportFile(format: "dxf" | "points" | "kml") {
    if (!result) return;
    const base = labels.fileBase;
    if (format === "dxf") {
      const comment = labels.dxfComment
        .replace("{zone}", `${result.zone}${result.south ? "S" : "N"}`)
        .replace("{interval}", String(result.interval));
      downloadFile(`${base}.dxf`, "application/dxf", contoursToDxf(result.lines, { rect: result.rect, layers: labels.layers, comment }));
    }
    if (format === "points" && grid.current) {
      const g = grid.current;
      const step = Number(spacing);
      const points: { e: number; n: number; z: number }[] = [];
      for (let n = result.rect.minN; n <= result.rect.maxN + 1e-6; n += step) {
        for (let e = result.rect.minE; e <= result.rect.maxE + 1e-6; e += step) {
          const geo = utmToGeo(e, n, result.zone, result.south, "wgs84");
          const px = lonLatToPixel(geo.lon, geo.lat, g.z);
          const z = sampleGrid(g.values, g.width, g.height, px.x - g.px0 - 0.5, px.y - g.py0 - 0.5);
          if (Number.isFinite(z)) points.push({ e, n, z });
        }
      }
      downloadFile(`${base}-puntos-pnezd.csv`, "text/csv", pointsToPnezd(points, labels.pointsDescription));
    }
    if (format === "kml") {
      const lines = result.lines.map((l, i) => ({ level: l.level, major: l.major, latlon: result.overlay[i].latlon.map(([lat, lon]) => ({ lat, lon })) }));
      downloadFile(`${base}.kml`, "application/vnd.google-earth.kml+xml", contoursToKml(lines, labels.kmlName));
    }
    trackEvent("tool_export", { tool: "generador-curvas-de-nivel", format });
  }

  const pointsCount = result ? (Math.floor((result.rect.maxE - result.rect.minE) / Number(spacing)) + 1) ** 2 : 0;

  return (
    <div className="space-y-6">
      <div className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <label className="block" htmlFor="contour-goto">
              <span className={LABEL}>{labels.goTo}</span>
            </label>
            <div className="flex gap-2">
              <input
                id="contour-goto"
                value={goTo}
                onChange={(e) => setGoTo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder={labels.goToPlaceholder}
                aria-invalid={goToError}
                className={`${FIELD} min-w-0 flex-1 aria-[invalid=true]:border-red-400`}
              />
              <button type="button" onClick={go} className="btn-ghost shrink-0 px-4 py-2 text-sm">
                {labels.goToButton}
              </button>
            </div>
            {goToError && <span className="mt-1 block text-xs text-red-500">{labels.goToError}</span>}
          </div>
          <label className="block">
            <span className={LABEL}>{labels.size}</span>
            <select value={size} onChange={(e) => setSize(e.target.value as Size)} className={FIELD}>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {labels.sizes[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>{labels.interval}</span>
            <select value={intervalChoice} onChange={(e) => setIntervalChoice(e.target.value as Interval)} className={FIELD}>
              {INTERVALS.map((i) => (
                <option key={i} value={i}>
                  {i === "auto" ? labels.auto : `${i} m`}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>{labels.majorEvery}</span>
            <select value={majorEvery} onChange={(e) => setMajorEvery(Number(e.target.value))} className={FIELD}>
              {[4, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
            <input type="checkbox" checked={skipBelowSea} onChange={(e) => setSkipBelowSea(e.target.checked)} className="h-4 w-4 accent-[color:var(--color-mint-600)]" />
            {labels.belowSea}
          </label>
          <button type="button" onClick={() => void generate()} disabled={status === "loading"} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
            {status === "loading" ? labels.generating : labels.generate}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl">{labels.mapTitle}</h3>
          <p className="text-sm text-[color:var(--color-muted)]">{labels.moveHint}</p>
        </div>
        <ContourMap
          center={center}
          seq={seq}
          sizeMeters={Number(size) * 1000}
          lines={result?.overlay ?? []}
          onMove={(c) => {
            centerRef.current = c;
            setCenter(c);
          }}
          ariaLabel={labels.mapTitle}
        />
        <p className="text-xs text-[color:var(--color-muted)]">
          {labels.attribution}{" "}
          <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {labels.attributionLink}
          </a>
        </p>
      </div>

      <div aria-live="polite" className="surface space-y-5 rounded-3xl p-4 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        {status === "idle" && <p className="text-[color:var(--color-muted)]">{labels.idle}</p>}
        {status === "loading" && <p className="text-[color:var(--color-muted)]">{labels.generating}</p>}
        {status === "error" && <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{error}</p>}
        {result && status !== "error" && (
          <>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Stat label={labels.stats.min} value={`${fmt(result.min, 0)} m`} />
              <Stat label={labels.stats.max} value={`${fmt(result.max, 0)} m`} />
              <Stat label={labels.stats.relief} value={`${fmt(result.max - result.min, 0)} m`} strong />
              <Stat label={labels.stats.interval} value={`${fmt(result.interval, 0)} m`} />
              <Stat label={labels.stats.lines} value={fmt(result.lines.length, 0)} />
              <Stat label={labels.stats.zone} value={`UTM ${result.zone}${result.south ? "S" : "N"} · WGS 84`} />
              <Stat label={labels.stats.resolution} value={`≈ ${fmt(result.resolution, 1)} m`} />
            </dl>
            <div className="flex flex-wrap items-end gap-3 border-t border-[color:var(--color-hairline)] pt-5">
              <button type="button" onClick={() => exportFile("dxf")} className="btn-primary px-4 py-2 text-sm">
                {labels.exportDxf}
              </button>
              <div className="flex items-end gap-2">
                <label className="block">
                  <span className={LABEL}>{labels.spacing}</span>
                  <select value={spacing} onChange={(e) => setSpacing(e.target.value as Spacing)} className={`${FIELD} w-28`}>
                    {SPACINGS.map((s) => (
                      <option key={s} value={s}>
                        {s} m
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => exportFile("points")} className="btn-ghost px-4 py-2 text-sm">
                  {labels.exportPoints}
                </button>
              </div>
              <button type="button" onClick={() => exportFile("kml")} className="btn-ghost px-4 py-2 text-sm">
                {labels.exportKml}
              </button>
            </div>
            <p className="text-xs text-[color:var(--color-muted)]">{labels.pointsCount.replace("{n}", fmt(pointsCount, 0))}</p>
          </>
        )}
        <aside className="rounded-2xl border border-l-4 border-[color:var(--color-border)] border-l-amber-500 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold">{labels.accuracyTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-foreground)]/90">{labels.accuracy}</p>
        </aside>
      </div>

      <aside className="turbo-border-soft rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink-950)] px-6 py-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-snug">{labels.cta.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{labels.cta.body}</p>
          </div>
          <a href={whatsappUrl(labels.cta.prefill)} target="_blank" rel="noopener noreferrer" data-cta="tool-contours" className="btn-primary mt-5 shrink-0 sm:mt-0">
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
      <dd className={`mt-1 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold tabular-nums ${strong ? "text-[color:var(--color-mint-700)]" : ""}`}>{value}</dd>
    </div>
  );
}
