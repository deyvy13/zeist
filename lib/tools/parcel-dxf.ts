// -----------------------------------------------------------------------------
// Perimeter plan as DXF: the lot boundary, vertex names, the distance on each
// side and the table of technical data drawn beside it, on separate layers.
// Coordinates go in as they are (UTM or local), so the drawing lands in place.
// -----------------------------------------------------------------------------

import { DxfWriter, type XY } from "./dxf";
import type { Parcel } from "./parcel";
import type { Description } from "./parcel-text";

export type ParcelDxfInput = {
  parcel: Parcel;
  description: Description;
  /** Distance factor from coordinate units to the labelled unit (e.g. m → ft). */
  lengthFactor?: number;
  decimal?: string;
  layers?: { boundary: string; vertices: string; distances: string; table: string };
};

/** DXF text: degree symbol as %%d (works with every font), m² as m2. */
const cad = (s: string) => s.replace(/°/g, "%%d").replace(/²/g, "2").replace(/–/g, "-");

/** 1, 2, 2.5 or 5 × 10^k: text heights that look deliberate. */
function niceHeight(raw: number): number {
  const exp = Math.floor(Math.log10(raw));
  const base = raw / 10 ** exp;
  const step = base < 1.5 ? 1 : base < 2.25 ? 2 : base < 3.75 ? 2.5 : base < 7.5 ? 5 : 10;
  return step * 10 ** exp;
}

export function buildParcelDxf(input: ParcelDxfInput): Uint8Array {
  const { parcel, description } = input;
  const layers = input.layers ?? { boundary: "PERIMETRO", vertices: "VERTICES", distances: "DISTANCIAS", table: "CUADRO" };
  const k = input.lengthFactor ?? 1;
  const decimal = input.decimal ?? ".";
  const pts: XY[] = parcel.vertices.map((v) => ({ x: v.e, y: v.n }));
  const count = pts.length;

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const box = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  const h = niceHeight(Math.max(box.maxX - box.minX, box.maxY - box.minY) / 45);

  const dxf = new DxfWriter()
    .layer(layers.boundary, 1)
    .layer(layers.vertices, 3)
    .layer(layers.distances, 7)
    .layer(layers.table, 7);
  dxf.comment("Zeist - zeist.vercel.app");
  dxf.polyline(pts, { layer: layers.boundary, closed: true });

  // Outward unit normal of each side (the outside is left of travel on a clockwise ring).
  const normals = parcel.sides.map((s) => {
    const a = pts[s.from];
    const b = pts[s.to];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const ux = (b.x - a.x) / len;
    const uy = (b.y - a.y) / len;
    return parcel.clockwise ? { x: -uy, y: ux } : { x: uy, y: -ux };
  });

  pts.forEach((p, i) => {
    const n1 = normals[(i - 1 + count) % count];
    const n2 = normals[i];
    const bx = n1.x + n2.x;
    const by = n1.y + n2.y;
    const len = Math.hypot(bx, by) || 1;
    dxf.text({ x: p.x + (bx / len) * 1.8 * h, y: p.y + (by / len) * 1.8 * h }, h, cad(parcel.vertices[i].name), {
      layer: layers.vertices,
      align: "center",
      valign: "middle",
    });
  });

  parcel.sides.forEach((s, i) => {
    const a = pts[s.from];
    const b = pts[s.to];
    let angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    if (angle > 90) angle -= 180;
    if (angle <= -90) angle += 180;
    const mid = { x: (a.x + b.x) / 2 + normals[i].x * 0.9 * h, y: (a.y + b.y) / 2 + normals[i].y * 0.9 * h };
    dxf.text(mid, h * 0.8, (s.length * k).toFixed(2).replace(".", decimal), {
      layer: layers.distances,
      rotation: angle,
      align: "center",
      valign: "middle",
    });
  });

  // The table, to the right of the lot.
  const { head, rows, title } = description.table;
  const cells = [head, ...rows].map((r) => r.map(cad));
  const widths = head.map((_, c) => Math.max(...cells.map((r) => (r[c] ?? "").length)) * 0.72 * h + 1.6 * h);
  const rowH = 1.9 * h;
  const x0 = box.maxX + 5 * h;
  const top = box.maxY;
  const totalW = widths.reduce((s, w) => s + w, 0);

  dxf.text({ x: x0 + totalW / 2, y: top + 1.2 * h }, 1.2 * h, cad(title), { layer: layers.table, align: "center", valign: "middle" });
  for (let r = 0; r <= cells.length; r++) {
    const y = top - r * rowH;
    dxf.line({ x: x0, y }, { x: x0 + totalW, y }, layers.table);
  }
  let x = x0;
  for (let c = 0; c <= widths.length; c++) {
    dxf.line({ x, y: top }, { x, y: top - cells.length * rowH }, layers.table);
    x += widths[c] ?? 0;
  }
  cells.forEach((row, r) => {
    let cx = x0;
    row.forEach((value, c) => {
      dxf.text({ x: cx + widths[c] / 2, y: top - r * rowH - rowH / 2 }, h * 0.75, value, { layer: layers.table, align: "center", valign: "middle" });
      cx += widths[c];
    });
  });

  const below = top - cells.length * rowH - 1.5 * h;
  [`${description.labels.area} = ${description.areaText}`, `${description.labels.perimeter} = ${description.perimeterText}`].forEach((line, i) => {
    dxf.text({ x: x0, y: below - i * 1.6 * h }, h * 0.85, cad(line), { layer: layers.table });
  });
  // The datum note can be long: wrap it to the table width.
  const maxChars = Math.max(30, Math.floor(totalW / (0.62 * h)));
  const words = cad(description.note).split(" ");
  const noteLines: string[] = [];
  for (const word of words) {
    const last = noteLines[noteLines.length - 1];
    if (last !== undefined && (last + " " + word).length <= maxChars) noteLines[noteLines.length - 1] = `${last} ${word}`;
    else noteLines.push(word);
  }
  noteLines.forEach((line, i) => dxf.text({ x: x0, y: below - (2 + i) * 1.6 * h - 0.4 * h }, h * 0.6, line, { layer: layers.table }));

  return dxf.toBytes();
}
