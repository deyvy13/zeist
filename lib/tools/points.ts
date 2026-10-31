// -----------------------------------------------------------------------------
// Excel → Civil 3D point file (PNEZD / PENZD, comma delimited). Reads a table
// pasted from Excel in any column order, with or without a header row, with
// decimal points or commas, and writes a file Civil 3D imports at the first
// try: no header row, integer point numbers, no commas inside descriptions.
// Pure and relative-import only (see steel.ts).
// -----------------------------------------------------------------------------

import { detectDelimiter, type Delimiter } from "./coordinates";
import { parseDecimal } from "./number";

export type PointColumn = "P" | "N" | "E" | "Z" | "D" | "skip";

export type PointTable = {
  delimiter: Delimiter;
  /** The header row, when the first row is one (it never reaches the output). */
  header: string[] | null;
  rows: { line: number; cells: string[] }[];
  /** Best guess of what each column holds; the user can override it. */
  columns: PointColumn[];
  /** E and N were told apart by order, not by header or magnitude: worth a look. */
  ambiguousEN: boolean;
};

const strip = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9#]+/g, " ")
    .trim();

/** Header names in es/pt/en, as surveyors and Civil 3D write them. */
const HEADER: [Exclude<PointColumn, "skip">, RegExp][] = [
  ["P", /^(p|pt|pto|punto|ponto|point|point number|numero|num|nro|no|n de punto|n punto|id|#|vertice|vertex|est|estacion)$/],
  ["N", /^(n|norte|northing|north|y|coord y|coordenada y|coordenada norte)$/],
  ["E", /^(e|este|leste|easting|east|x|coord x|coordenada x|coordenada este|coordenada leste)$/],
  ["Z", /^(z|cota|elev|elevacion|elevation|altura|altitude|alt|h|nivel)$/],
  ["D", /^(d|desc|descripcion|descricao|description|codigo|code|cod|obs|observacion|observacao|nota|note)$/],
];

function splitLine(line: string, delimiter: Delimiter): string[] {
  const parts =
    delimiter === "tab"
      ? line.split("\t")
      : delimiter === "semicolon"
        ? line.split(";")
        : delimiter === "comma"
          ? line.split(",")
          : line.trim().split(/\s+/);
  return parts.map((p) => p.trim());
}

const isNumber = (s: string) => Number.isFinite(parseDecimal(s));

export function parsePointTable(text: string): PointTable {
  const lines = text.split(/\r?\n/).map((l, i) => ({ line: i + 1, raw: l })).filter((l) => l.raw.trim());
  const delimiter = detectDelimiter(lines.map((l) => l.raw));
  let rows = lines.map((l) => ({ line: l.line, cells: splitLine(l.raw, delimiter) }));
  // With spaces as the delimiter, a description may hold spaces: keep the tail together.
  if (delimiter === "space" && rows.length) {
    const width = Math.min(...rows.map((r) => r.cells.length).filter((n) => n >= 3), 5);
    rows = rows.map((r) => (r.cells.length > width ? { ...r, cells: [...r.cells.slice(0, width - 1), r.cells.slice(width - 1).join(" ")] } : r));
  }

  // A first row with no numbers, or with a known column name, is a header.
  let header: string[] | null = null;
  const first = rows[0]?.cells ?? [];
  const known = first.filter((c) => HEADER.some(([, re]) => re.test(strip(c)))).length;
  if (first.length && (first.every((c) => !isNumber(c)) || known >= 2)) {
    header = first;
    rows = rows.slice(1);
  }

  const width = Math.max(0, ...rows.map((r) => r.cells.length));
  const columns: PointColumn[] = Array.from({ length: width }, () => "skip");
  let ambiguousEN = false;

  if (header) {
    header.forEach((h, i) => {
      if (i >= width) return;
      const hit = HEADER.find(([, re]) => re.test(strip(h)));
      if (hit && !columns.includes(hit[0])) columns[i] = hit[0];
    });
  }

  // Fill what the header didn't settle from the values themselves.
  const stats = Array.from({ length: width }, (_, i) => {
    const values = rows.map((r) => r.cells[i] ?? "").filter((v) => v !== "");
    const nums = values.map(parseDecimal).filter(Number.isFinite);
    const share = values.length ? nums.length / values.length : 0;
    const integers = nums.length > 0 && nums.every((n) => Number.isInteger(n) && n > 0);
    const magnitude = nums.length ? nums.reduce((a, n) => a + Math.abs(n), 0) / nums.length : 0;
    return { share, integers, magnitude, filled: values.length };
  });
  const free = (i: number) => columns[i] === "skip" && stats[i].filled > 0;
  const has = (c: PointColumn) => columns.includes(c);

  // Coordinates: the two columns with the largest values (UTM or local grids).
  if (!has("E") || !has("N")) {
    const coords = stats
      .map((s, i) => ({ ...s, i }))
      .filter((s) => free(s.i) && s.share >= 0.6 && s.magnitude >= 1000)
      .sort((a, b) => a.i - b.i);
    const open = (has("E") ? [] : ["E"]).concat(has("N") ? [] : ["N"]) as ("E" | "N")[];
    const picks = coords.slice(0, open.length);
    if (open.length === 2 && picks.length === 2) {
      const [a, b] = picks;
      const digits = (m: number) => Math.floor(Math.log10(Math.max(m, 1))) + 1;
      // UTM in the southern hemisphere: Northing has 7 digits, Easting 6.
      if (digits(a.magnitude) !== digits(b.magnitude)) {
        const north = digits(a.magnitude) > digits(b.magnitude) ? a : b;
        columns[north.i] = "N";
        columns[(north === a ? b : a).i] = "E";
      } else {
        // Same size: Latin American tables usually read Este, Norte.
        columns[a.i] = "E";
        columns[b.i] = "N";
        ambiguousEN = true;
      }
    } else picks.forEach((p, k) => (columns[p.i] = open[k]));
  }
  // Point number: a column of positive whole numbers to the left of the
  // coordinates (an integer column to their right is more likely an elevation).
  const firstCoord = Math.min(width, ...[columns.indexOf("E"), columns.indexOf("N")].filter((x) => x >= 0));
  if (!has("P")) {
    const i = stats.findIndex((s, i) => free(i) && i < firstCoord && s.share >= 0.6 && s.integers && s.magnitude < 1e6);
    if (i >= 0) columns[i] = "P";
  }
  // Or names such as BM-1 in the first column, left of the coordinates.
  if (!has("P") && free(0) && firstCoord > 0 && stats[0].share < 0.6) columns[0] = "P";
  // Elevation: the next numeric column.
  if (!has("Z")) {
    const i = stats.findIndex((s, i) => free(i) && s.share >= 0.6);
    if (i >= 0) columns[i] = "Z";
  }
  // Description: the first column that is mostly text.
  if (!has("D")) {
    const i = stats.findIndex((s, i) => free(i) && s.share < 0.6);
    if (i >= 0) columns[i] = "D";
  }

  return { delimiter, header, rows, columns, ambiguousEN };
}

export type PointFormat = "PNEZD" | "PENZD";

export type PointIssue = "coordinates" | "elevation";

export type BuiltPoints = {
  text: string;
  points: { p: string; n: number; e: number; z: number; d: string }[];
  /** Rows left out, with the reason. */
  skipped: { line: number; reason: PointIssue }[];
  /** Point numbers had letters, were missing or repeated: all were numbered from `start`. */
  renumbered: boolean;
  duplicates: string[];
  /** Rows with no elevation, written as 0. */
  missingZ: number;
};

/** CSV-safe description: no commas or line breaks, single spaces. */
const clean = (s: string) => s.replace(/[,;\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();

export function buildPointFile(
  table: Pick<PointTable, "rows">,
  columns: PointColumn[],
  options: { format: PointFormat; start?: number; decimals?: number },
): BuiltPoints {
  const at = (cells: string[], c: PointColumn) => {
    const i = columns.indexOf(c);
    return i >= 0 ? (cells[i] ?? "").trim() : "";
  };
  const skipped: BuiltPoints["skipped"] = [];
  const raw: { p: string; n: number; e: number; z: number | null; d: string }[] = [];
  for (const { line, cells } of table.rows) {
    const n = parseDecimal(at(cells, "N"));
    const e = parseDecimal(at(cells, "E"));
    if (!Number.isFinite(n) || !Number.isFinite(e)) {
      skipped.push({ line, reason: "coordinates" });
      continue;
    }
    const zText = at(cells, "Z");
    const z = zText === "" ? null : parseDecimal(zText);
    if (z !== null && !Number.isFinite(z)) {
      skipped.push({ line, reason: "elevation" });
      continue;
    }
    raw.push({ p: at(cells, "P"), n, e, z, d: at(cells, "D") });
  }

  const seen = new Map<string, number>();
  for (const r of raw) if (r.p) seen.set(r.p, (seen.get(r.p) ?? 0) + 1);
  const duplicates = [...seen].filter(([, k]) => k > 1).map(([p]) => p);
  // Civil 3D needs a unique whole number for every point.
  const renumbered = raw.some((r) => !/^\d+$/.test(r.p) || Number(r.p) === 0) || duplicates.length > 0;
  const start = Math.max(1, Math.floor(options.start ?? 1));
  const decimals = options.decimals ?? 3;

  const points = raw.map((r, i) => ({
    p: renumbered ? String(start + i) : String(Number(r.p)),
    n: r.n,
    e: r.e,
    z: r.z ?? 0,
    // Keep a renamed point's original name in its description.
    d: clean(renumbered && r.p ? `${r.p} ${r.d}` : r.d),
  }));
  const lines = points.map((pt) => {
    const [a, b] = options.format === "PNEZD" ? [pt.n, pt.e] : [pt.e, pt.n];
    return [pt.p, a.toFixed(decimals), b.toFixed(decimals), pt.z.toFixed(decimals), pt.d].join(",");
  });
  return {
    text: lines.length ? lines.join("\r\n") + "\r\n" : "",
    points,
    skipped,
    renumbered,
    duplicates,
    missingZ: raw.filter((r) => r.z === null).length,
  };
}
