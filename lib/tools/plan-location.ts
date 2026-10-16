// -----------------------------------------------------------------------------
// "Where is this plan?" Reads the coordinate table of a plan (cuadro de datos
// técnicos: vertex, side, length, interior angle, East, North) the way it comes
// out of a PDF, Excel or AutoCAD; checks the table against itself (stated vs
// computed sides and angles); converts the vertices to WGS 84 for web maps; and
// builds Google Maps links and a KML. Pure: relative imports only.
// -----------------------------------------------------------------------------

import { transformDatum, utmToGeo, type DatumId } from "./coordinates";
import { parseDecimal } from "./number";
import { analyzeParcel, formatAngle, type Parcel, type ParcelError, type Vertex } from "./parcel";

export type ColumnOrder = "auto" | "EN" | "NE";

export type PlanRow = {
  /** 1-based line in the pasted text (0 when read cell by cell). */
  line: number;
  /** Vertex name as written ("1", "A", "BM-1"); "" when the row has none. */
  name: string;
  e: number;
  n: number;
  /** Side label in the row, e.g. ["1", "2"] for "1 - 2". */
  side: [string, string] | null;
  /** Stated side length (m). Read only when the table has a side or length column. */
  length: number | null;
  /** Stated interior angle (decimal degrees), from a 90°09'45" cell. */
  angle: number | null;
};

export type PlanParse = {
  /** One group per table (a lot, a building footprint…), in reading order. */
  groups: PlanRow[][];
  /** Lines with numbers but no readable East/North pair (1-based). */
  skipped: number[];
  /** Column order used when the magnitudes couldn't tell East from North. */
  order: "EN" | "NE";
  /** True when the coordinates came one per line (a PDF table copied cell by cell). */
  stream: boolean;
};

const ANGLE_RE = /(\d{1,3})\s*[°º]\s*(?:(\d{1,2})\s*['’′´]\s*)?(?:(\d{1,2}(?:[.,]\d+)?)\s*(?:''|"|”|″|’’))?/g;
const SIDE_RE = /(?<![\w.,])([A-Za-z]{1,3}\d{0,3}|\d{1,4})\s*[-–—]\s*([A-Za-z]{1,3}\d{0,3}|\d{1,4})(?![\w.,])/;
// Grouped thousands first (773,650.1996 · 8.992.962,5553), then plain numbers.
const NUMBER_RE =
  /\d{1,3}(?:,\d{3})+\.\d+|\d{1,3}(?:\.\d{3})+,\d+|\d{1,3}(?:,\d{3}){2,}(?![\d.,])|\d{1,3}(?:\.\d{3}){2,}(?![\d.,])|\d+(?:[.,]\d+)?/g;
const NAME_RE = /^(?:[A-Za-z]{1,4}[-_.]?\d{0,5}[A-Za-z]?|\d{1,5}[A-Za-z]?)$/;
const NORTH_WORD = /\b(norte|north|northing)\b/i;
const EAST_WORD = /\b(este|east|easting|leste)\b/i;
const NORTH_LETTER = /(?:^|[^A-Za-z])[NY](?![A-Za-z])/;
const EAST_LETTER = /(?:^|[^A-Za-z])[EX](?![A-Za-z])/;
const LENGTH_WORD = /long|dist|lado|side|length|compr/i;

/** A coordinate needs five integer digits: East is 100 000–900 000 in any UTM zone. */
const COORD_MIN = 10_000;

type Num = { v: number; at: number; label: "E" | "N" | null };

function toNumbers(raw: string): number[] {
  if (/^\d{1,3}(?:,\d{3})+\.\d+$/.test(raw) || /^\d{1,3}(?:,\d{3}){2,}$/.test(raw)) return [Number(raw.replace(/,/g, ""))];
  if (/^\d{1,3}(?:\.\d{3})+,\d+$/.test(raw) || /^\d{1,3}(?:\.\d{3}){2,}$/.test(raw)) {
    return [Number(raw.replace(/\./g, "").replace(",", "."))];
  }
  // "773650,8992962": two whole coordinates in a CSV, not a decimal comma.
  const pair = /^(\d{5,}),(\d{6,})$/.exec(raw);
  if (pair) return [Number(pair[1]), Number(pair[2])];
  return [Number(raw.replace(",", "."))];
}

function labelBefore(text: string, at: number): "E" | "N" | null {
  const before = text.slice(Math.max(0, at - 14), at).replace(/[\s:=()m]+$/i, "");
  const tail = before.slice(-10);
  if (/(norte|north|northing)$/i.test(tail) || /(?:^|[^A-Za-z])[NY]$/.test(tail)) return "N";
  if (/(este|east|easting|leste)$/i.test(tail) || /(?:^|[^A-Za-z])[EX]$/.test(tail)) return "E";
  return null;
}

function numbersIn(text: string): Num[] {
  const out: Num[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const at = m.index ?? 0;
    const values = toNumbers(m[0]);
    const label = values.length === 1 ? labelBefore(text, at) : null;
    for (const v of values) out.push({ v, at, label });
  }
  return out;
}

/** East and North from the coordinate-sized numbers of a row. */
function pickEastNorth(coords: Num[], order: "EN" | "NE"): { e: Num; n: Num } {
  const labeledE = coords.find((c) => c.label === "E");
  const labeledN = coords.find((c) => c.label === "N");
  if (labeledE && labeledN) return { e: labeledE, n: labeledN };
  // A 7-digit value can only be a North (South hemisphere, or North above ~9°);
  // East never reaches 1 000 000.
  const big = coords.filter((c) => c.v >= 1_000_000 && c.v <= 10_000_000);
  const mid = coords.filter((c) => c.v >= 100_000 && c.v < 1_000_000);
  if (big.length === 1 && mid.length >= 1) {
    const n = big[0];
    const e = mid.reduce((best, c) => (Math.abs(c.at - n.at) < Math.abs(best.at - n.at) ? c : best));
    return { e, n };
  }
  const [a, b] = coords.slice(-2);
  return order === "NE" ? { e: b, n: a } : { e: a, n: b };
}

function angleValue(d: string, m?: string, s?: string): number {
  return Number(d) + Number(m ?? 0) / 60 + Number((s ?? "0").replace(",", ".")) / 3600;
}

function nameClass(name: string): string {
  if (/^\d+$/.test(name)) return "num";
  if (/^[A-Za-z]+$/.test(name)) return "alpha";
  return `mixed:${(/^[A-Za-z]*/.exec(name)?.[0] ?? "").toUpperCase()}`;
}

/** Order from a header like "VÉRTICE · LADO · ESTE (m) · NORTE (m)", or null. */
function headerOrder(line: string): "EN" | "NE" | null {
  const n = line.search(NORTH_WORD) >= 0 ? line.search(NORTH_WORD) : line.search(NORTH_LETTER);
  const e = line.search(EAST_WORD) >= 0 ? line.search(EAST_WORD) : line.search(EAST_LETTER);
  if (n < 0 || e < 0) return null;
  return e < n ? "EN" : "NE";
}

type Context = { order: "EN" | "NE"; lengthColumn: boolean };

function parseRow(raw: string, line: number, ctx: Context): PlanRow | null {
  let text = raw.replace(/ /g, " ");
  let angle: number | null = null;
  text = text.replace(ANGLE_RE, (_m, d: string, mi?: string, s?: string) => {
    if (angle === null) angle = angleValue(d, mi, s);
    return " ";
  });
  // A side joins two names of the same kind (1-2, A-B, P1-P2); "BM-1" or
  // "E-12" mix letters and digits, so they are vertex names, not sides.
  let side: [string, string] | null = null;
  for (const m of text.matchAll(new RegExp(SIDE_RE.source, "g"))) {
    if (nameClass(m[1]) !== nameClass(m[2])) continue;
    side = [m[1], m[2]];
    text = text.slice(0, m.index) + " " + text.slice((m.index ?? 0) + m[0].length);
    break;
  }

  // The vertex name is the first cell, unless the row starts with a coordinate.
  const first = text.trim().split(/[\s;,\t|]+/)[0] ?? "";
  let name = "";
  if (first && NAME_RE.test(first) && !(Number(first) >= COORD_MIN)) {
    name = first;
    text = text.replace(/^[\s;,\t|]*[^\s;,\t|]+/, " ");
  } else if (side) {
    name = (side as [string, string])[0];
  }

  const nums = numbersIn(text);
  const coords = nums.filter((x) => x.v >= COORD_MIN);
  if (coords.length < 2) return null;
  const { e, n } = pickEastNorth(coords, ctx.order);

  // What's left that isn't a coordinate: the stated length, when the table has one.
  const rest = nums.filter((x) => x !== e && x !== n && x.v > 0 && x.v < COORD_MIN);
  const length = rest.length === 1 && (side !== null || ctx.lengthColumn) ? rest[0].v : null;
  return { line, name, e: e.v, n: n.v, side, length, angle };
}

/** Reads a pasted coordinate table into groups of vertices (one per table). */
export function parsePlanTable(text: string, order: ColumnOrder = "auto"): PlanParse {
  const ctx: Context = { order: order === "auto" ? "EN" : order, lengthColumn: false };
  const groups: PlanRow[][] = [];
  const skipped: number[] = [];
  let current: PlanRow[] = [];
  const close = () => {
    if (current.length) groups.push(current);
    current = [];
  };

  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim()) return;
    const row = parseRow(raw, i + 1, ctx);
    if (!row) {
      // A header or a title between two tables starts a new group.
      if (/[A-Za-zÁÉÍÓÚáéíóú]{3,}/.test(raw)) {
        close();
        if (order === "auto") ctx.order = headerOrder(raw) ?? ctx.order;
        ctx.lengthColumn = LENGTH_WORD.test(raw);
      } else if (/\d/.test(raw)) {
        skipped.push(i + 1);
      }
      return;
    }
    const prev = current[current.length - 1];
    if (prev && prev.name && row.name && nameClass(prev.name) !== nameClass(row.name)) close();
    const firstRow = current[0];
    // A closing row that repeats the first vertex ends the table.
    if (firstRow && current.length >= 3 && row.name && row.name === firstRow.name && Math.hypot(row.e - firstRow.e, row.n - firstRow.n) < 0.001) {
      close();
      return;
    }
    current.push(row);
    // "4 - 1": the side back to the first vertex closes the table.
    if (row.side && current.length >= 3 && row.side[1] === current[0].name) close();
  });
  close();

  if (groups.length > 0) return { groups, skipped, order: ctx.order, stream: false };
  const stream = parseStream(text, ctx.order);
  // Read cell by cell, every line was used: nothing to report as skipped.
  return stream.length
    ? { groups: [stream], skipped: [], order: ctx.order, stream: true }
    : { groups: [], skipped, order: ctx.order, stream: false };
}

/** Fallback for tables copied cell by cell: pairs the coordinate-sized numbers in order. */
function parseStream(text: string, order: "EN" | "NE"): PlanRow[] {
  const coords = numbersIn(text.replace(ANGLE_RE, " ")).filter((x) => x.v >= 100_000);
  const rows: PlanRow[] = [];
  const push = (e: number, n: number) =>
    rows.push({ line: 0, name: String(rows.length + 1), e, n, side: null, length: null, angle: null });
  for (let i = 0; i + 1 < coords.length; ) {
    const a = coords[i].v;
    const b = coords[i + 1].v;
    const aBig = a >= 1_000_000;
    const bBig = b >= 1_000_000;
    if (aBig && !bBig) push(b, a);
    else if (!aBig && bBig) push(a, b);
    else if (!aBig && !bBig) {
      if (order === "NE") push(b, a);
      else push(a, b);
    } else {
      i += 1;
      continue;
    }
    i += 2;
  }
  return rows;
}

// --- Checks -----------------------------------------------------------------------

export type SideCheck = { from: string; to: string; computed: number; stated: number | null; ok: boolean | null };
export type AngleCheck = { at: string; computed: number; stated: number | null; ok: boolean | null };
export type GroupWarning = "e-range" | "n-range" | "spread";

export type GroupAnalysis = {
  vertices: Vertex[];
  /** Area, perimeter, centroid and angles; null under three vertices or when the ring is invalid. */
  parcel: Parcel | null;
  parcelError: ParcelError | null;
  sides: SideCheck[];
  angles: AngleCheck[];
  warnings: GroupWarning[];
  /** True when every stated length and angle matches; null when the table states none. */
  consistent: boolean | null;
};

/** Tables round lengths to the cm and angles to the second: anything beyond is a real mismatch. */
export const lengthTolerance = (stated: number) => Math.max(0.02, stated * 1e-4);
export const ANGLE_TOLERANCE = 2 / 3600;

function statedLength(rows: PlanRow[], a: string, b: string): number | null {
  const labeled = rows.find((r) => r.side && ((r.side[0] === a && r.side[1] === b) || (r.side[0] === b && r.side[1] === a)));
  if (labeled) return labeled.length;
  const own = rows.find((r) => r.name === a && !r.side);
  return own?.length ?? null;
}

export function analyzeGroup(rows: PlanRow[]): GroupAnalysis {
  const vertices: Vertex[] = rows.map((r, i) => ({ name: r.name || String(i + 1), e: r.e, n: r.n }));
  const warnings: GroupWarning[] = [];
  if (vertices.some((v) => v.e < 100_000 || v.e > 900_000)) warnings.push("e-range");
  if (vertices.some((v) => v.n < 0 || v.n > 10_000_000)) warnings.push("n-range");
  let spread = 0;
  for (const a of vertices) for (const b of vertices) spread = Math.max(spread, Math.hypot(a.e - b.e, a.n - b.n));
  if (spread > 20_000) warnings.push("spread");

  const ring = vertices.length >= 3;
  const sides: SideCheck[] = [];
  const count = ring ? vertices.length : vertices.length - 1;
  for (let i = 0; i < count; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    const computed = Math.hypot(b.e - a.e, b.n - a.n);
    const stated = statedLength(rows, a.name, b.name);
    sides.push({ from: a.name, to: b.name, computed, stated, ok: stated === null ? null : Math.abs(computed - stated) <= lengthTolerance(stated) });
  }

  let parcel: Parcel | null = null;
  let parcelError: ParcelError | null = null;
  const angles: AngleCheck[] = [];
  if (ring) {
    const result = analyzeParcel(vertices);
    if (result.ok) {
      parcel = result.parcel;
      parcel.vertices.forEach((v, i) => {
        const stated = rows.find((r) => r.name === v.name)?.angle ?? null;
        const computed = parcel!.angles[i];
        angles.push({ at: v.name, computed, stated, ok: stated === null ? null : Math.abs(computed - stated) <= ANGLE_TOLERANCE });
      });
    } else {
      parcelError = result.error;
    }
  }

  const checks = [...sides, ...angles].filter((c) => c.ok !== null);
  return {
    vertices,
    parcel,
    parcelError,
    sides,
    angles,
    warnings,
    consistent: checks.length ? checks.every((c) => c.ok) : null,
  };
}

// --- Editable table -----------------------------------------------------------------
// The tool shows the coordinate table as an editable grid. Cells stay strings so a
// half-typed value survives; each row carries the side that starts at its vertex.

export type TableRow = { name: string; e: string; n: string; length: string; angle: string };
export type TableField = keyof TableRow;

export const emptyRow = (name = ""): TableRow => ({ name, e: "", n: "", length: "", angle: "" });

/**
 * An interior angle as people type it: 90°09'45", 90 09 45, 90-09-45, 90:09:45 or
 * 90.1625 (decimal degrees). Null when empty, unreadable or outside 0–360°.
 */
export function parseAngleText(text: string): number | null {
  const parts = text.trim().replace(/,/g, ".").split(/[^\d.]+/).filter(Boolean);
  if (parts.length === 0 || parts.length > 3 || parts.some((p) => !/^\d+(?:\.\d+)?$/.test(p))) return null;
  const [d, m = 0, s = 0] = parts.map(Number);
  if (parts.length > 1 && (!Number.isInteger(d) || !Number.isInteger(m) || m >= 60 || s >= 60)) return null;
  const value = d + m / 60 + s / 3600;
  return value > 0 && value < 360 ? value : null;
}

/** The name that follows: 4 → 5, D → E, P07 → P08; "" when there's no obvious next one. */
export function nextVertexName(name: string): string {
  const numbered = /^(.*?)(\d+)$/.exec(name.trim());
  if (numbered) return numbered[1] + String(Number(numbered[2]) + 1).padStart(numbered[2].length, "0");
  if (/^[A-Ya-y]$/.test(name.trim())) return String.fromCharCode(name.trim().charCodeAt(0) + 1);
  return "";
}

/** Grid rows → the vertex groups the checks and the map read. Rows without a valid East and North are left out. */
export function tableToGroups(tables: TableRow[][]): PlanRow[][] {
  return tables
    .map((rows) =>
      rows.flatMap((r, i): PlanRow[] => {
        const e = parseDecimal(r.e);
        const n = parseDecimal(r.n);
        if (!Number.isFinite(e) || !Number.isFinite(n)) return [];
        const length = parseDecimal(r.length);
        return [
          {
            line: i + 1,
            name: r.name.trim() || String(i + 1),
            e,
            n,
            side: null,
            length: Number.isFinite(length) && length > 0 ? length : null,
            angle: parseAngleText(r.angle),
          },
        ];
      }),
    )
    .filter((rows) => rows.length > 0);
}

/** Parsed groups → grid rows, with each stated length on the vertex where its side starts. */
export function groupsToTable(groups: PlanRow[][], decimal: "." | "," = "."): TableRow[][] {
  const num = (v: number) => String(v).replace(".", decimal);
  return groups.map((rows) => {
    const named = rows.map((r, i) => ({ ...r, name: r.name || String(i + 1) }));
    return named.map((r, i) => {
      const next = named[i + 1] ?? (named.length >= 3 ? named[0] : null);
      const length = next ? statedLength(named, r.name, next.name) : null;
      return {
        name: r.name,
        e: num(r.e),
        n: num(r.n),
        length: length === null ? "" : num(length),
        angle: r.angle === null ? "" : formatAngle(r.angle),
      };
    });
  });
}

/** Rows that have something typed but no valid East and North. */
export function incompleteRows(tables: TableRow[][]): number {
  return tables
    .flat()
    .filter((r) => (r.e.trim() || r.n.trim()) && !(Number.isFinite(parseDecimal(r.e)) && Number.isFinite(parseDecimal(r.n)))).length;
}

/**
 * What a paste holds: one value (let the cell take it), one column of values
 * (fill down from the cell) or a table (read it with the plan parser).
 */
export function pasteKind(text: string): "cell" | "column" | "table" {
  const lines = text.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1 && !/\t/.test(text.trim())) return "cell";
  if (lines.every((l) => !/[\t;]/.test(l) && !/\s/.test(l))) return "column";
  return "table";
}

/** One value per line, written down a column from `start`; adds rows when the block is longer. */
export function fillColumn(rows: TableRow[], start: number, field: TableField, text: string): TableRow[] {
  const values = text.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
  const out = rows.map((r) => ({ ...r }));
  values.forEach((value, k) => {
    const i = start + k;
    if (!out[i]) out[i] = emptyRow(i > 0 ? nextVertexName(out[i - 1].name) : "1");
    out[i][field] = value;
  });
  return out;
}

// --- Location -----------------------------------------------------------------------

export type LatLon = { lat: number; lon: number };

/** UTM in any supported datum → WGS 84 latitude/longitude (what Google Maps and GPS use). */
export function toWgs84(e: number, n: number, zone: number, south: boolean, datum: DatumId): LatLon {
  const g = utmToGeo(e, n, zone, south, datum);
  const [lat, lon] = transformDatum(g.lat, g.lon, datum, "wgs84");
  return { lat, lon };
}

/** The point to send people to: the lot's centroid, or the average of the points. */
export function groupCenter(analysis: GroupAnalysis): { e: number; n: number } {
  if (analysis.parcel) return analysis.parcel.centroid;
  const v = analysis.vertices;
  return { e: v.reduce((s, p) => s + p.e, 0) / v.length, n: v.reduce((s, p) => s + p.n, 0) / v.length };
}

/** Where the EPSG shift used for each legacy datum is valid ([latMin, latMax, lonMin, lonMax]). */
const DATUM_AREA: Partial<Record<DatumId, [number, number, number, number]>> = {
  psad56: [-18.4, 0.1, -81.5, -68.6], // Peru — PSAD56 to WGS 84 (8)
  sad69: [-35.8, 7.1, -74.1, -25.2], // Brazil — SAD69 to SIRGAS 2000 (1)
};

/** True when a point falls outside the area its datum shift was defined for. */
export function outsideDatumArea(point: LatLon, datum: DatumId): boolean {
  const box = DATUM_AREA[datum];
  if (!box) return false;
  const [latMin, latMax, lonMin, lonMax] = box;
  return point.lat < latMin || point.lat > latMax || point.lon < lonMin || point.lon > lonMax;
}

/**
 * Distance in metres on the WGS 84 ellipsoid, using the radii of curvature at
 * the mid-latitude. A sphere overstates north–south distances by ~0.3 % near
 * the equator; this stays within centimetres for the metre-to-kilometre gaps
 * between two readings of the same plan.
 */
export function distanceM(a: LatLon, b: LatLon): number {
  const rad = Math.PI / 180;
  const axis = 6_378_137;
  const flattening = 1 / 298.257223563;
  const e2 = flattening * (2 - flattening);
  const phi = ((a.lat + b.lat) / 2) * rad;
  const w = Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const meridian = (axis * (1 - e2)) / w ** 3;
  const primeVertical = axis / w;
  let dLon = (b.lon - a.lon) * rad;
  if (dLon > Math.PI) dLon -= 2 * Math.PI;
  else if (dLon < -Math.PI) dLon += 2 * Math.PI;
  return Math.hypot((b.lat - a.lat) * rad * meridian, dLon * primeVertical * Math.cos(phi));
}

/** "-9.1071019,-78.5130932": the text Google Maps reads in its search box. */
export function latLonText({ lat, lon }: LatLon): string {
  return `${lat.toFixed(7)},${lon.toFixed(7)}`;
}

/** Google Maps URLs (no API key; see developers.google.com/maps/documentation/urls). */
export function googleMapsLinks(point: LatLon): { place: string; directions: string; satellite: string } {
  const ll = `${point.lat.toFixed(7)}%2C${point.lon.toFixed(7)}`;
  return {
    place: `https://www.google.com/maps/search/?api=1&query=${ll}`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${ll}`,
    satellite: `https://www.google.com/maps/@?api=1&map_action=map&center=${ll}&zoom=18&basemap=satellite`,
  };
}

const xmlEscape = (s: string) =>
  s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type KmlShape = { name: string; points: (LatLon & { name: string })[] };

/** KML for Google Earth: each table as a polygon (3+ vertices) plus its vertices as points. */
export function planKml(shapes: KmlShape[], documentName: string): string {
  const coord = (p: LatLon) => `${p.lon.toFixed(9)},${p.lat.toFixed(9)},0`;
  const marks = shapes.flatMap((shape) => {
    const out: string[] = [];
    if (shape.points.length >= 3) {
      const ring = [...shape.points, shape.points[0]].map(coord).join(" ");
      out.push(
        `<Placemark><name>${xmlEscape(shape.name)}</name><styleUrl>#lot</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>${ring}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>`,
      );
    }
    for (const p of shape.points) {
      out.push(`<Placemark><name>${xmlEscape(p.name)}</name><Point><coordinates>${coord(p)}</coordinates></Point></Placemark>`);
    }
    return out;
  });
  const style =
    '<Style id="lot"><LineStyle><color>ff94b800</color><width>3</width></LineStyle><PolyStyle><color>4dceff00</color></PolyStyle></Style>';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${xmlEscape(documentName)}</name>${style}\n${marks.join("\n")}\n</Document></kml>\n`;
}
