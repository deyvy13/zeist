// -----------------------------------------------------------------------------
// DXF R12 (AC1009) writer and polyline reader — for AutoCAD and Civil 3D.
//
// R12 is the oldest DXF every CAD program still opens, and the simplest to
// write: no object handles or class tables. Text is stored in Windows-1252
// (declared in $DWGCODEPAGE) with an Arial text style, so Spanish and
// Portuguese accents survive in any viewer.
//
// The reader only extracts polylines (LWPOLYLINE and POLYLINE) from the
// ENTITIES section — enough to pull a lot boundary out of a drawing.
// No "@/" aliases here: the tests import these modules directly with Node.
// -----------------------------------------------------------------------------

export type XY = { x: number; y: number };
export type XYZ = XY & { z: number };

export type TextOptions = {
  layer?: string;
  /** Degrees, counterclockwise from the X axis. */
  rotation?: number;
  align?: "left" | "center" | "right";
  valign?: "baseline" | "middle";
};

const num = (v: number) => (Number.isFinite(v) ? (Math.round(v * 1e6) / 1e6).toString() : "0");

export class DxfWriter {
  private layers = new Map<string, number>();
  private body: string[] = [];
  private min = { x: Infinity, y: Infinity };
  private max = { x: -Infinity, y: -Infinity };

  /** Declares a layer with an AutoCAD Color Index (1 red, 2 yellow, 3 green, 7 white/black, 8 gray). */
  layer(name: string, color = 7): this {
    this.layers.set(name, color);
    return this;
  }

  /** Free comment (group 999), e.g. data sources. */
  comment(text: string): this {
    for (const line of text.split(/\r?\n/)) this.body.push("999", line);
    return this;
  }

  line(a: XY, b: XY, layer = "0"): this {
    this.extend(a);
    this.extend(b);
    this.body.push("0", "LINE", "8", layer, "10", num(a.x), "20", num(a.y), "30", "0", "11", num(b.x), "21", num(b.y), "31", "0");
    return this;
  }

  /** 2D polyline (z = 0) or, with `threeD`, a 3D polyline using each point's z. */
  polyline(points: (XY | XYZ)[], opts: { layer?: string; closed?: boolean; threeD?: boolean } = {}): this {
    if (points.length < 2) return this;
    const layer = opts.layer ?? "0";
    const flags = (opts.closed ? 1 : 0) | (opts.threeD ? 8 : 0);
    this.body.push("0", "POLYLINE", "8", layer, "66", "1", "10", "0", "20", "0", "30", "0", "70", String(flags));
    for (const p of points) {
      this.extend(p);
      const z = opts.threeD && "z" in p ? p.z : 0;
      this.body.push("0", "VERTEX", "8", layer, "10", num(p.x), "20", num(p.y), "30", num(z), "70", opts.threeD ? "32" : "0");
    }
    this.body.push("0", "SEQEND", "8", layer);
    return this;
  }

  text(at: XY, height: number, value: string, opts: TextOptions = {}): this {
    this.extend(at);
    const h = { left: 0, center: 1, right: 2 }[opts.align ?? "left"];
    const v = { baseline: 0, middle: 2 }[opts.valign ?? "baseline"];
    this.body.push("0", "TEXT", "8", opts.layer ?? "0", "10", num(at.x), "20", num(at.y), "30", "0", "40", num(height), "1", value.replace(/[\r\n]+/g, " "));
    if (opts.rotation) this.body.push("50", num(opts.rotation));
    if (h || v) this.body.push("72", String(h), "73", String(v), "11", num(at.x), "21", num(at.y), "31", "0");
    return this;
  }

  private extend(p: XY) {
    this.min = { x: Math.min(this.min.x, p.x), y: Math.min(this.min.y, p.y) };
    this.max = { x: Math.max(this.max.x, p.x), y: Math.max(this.max.y, p.y) };
  }

  toString(): string {
    const ext = Number.isFinite(this.min.x) ? { min: this.min, max: this.max } : { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
    const out: string[] = [];
    out.push("0", "SECTION", "2", "HEADER");
    out.push("9", "$ACADVER", "1", "AC1009", "9", "$DWGCODEPAGE", "3", "ANSI_1252");
    out.push("9", "$INSBASE", "10", "0", "20", "0", "30", "0");
    out.push("9", "$EXTMIN", "10", num(ext.min.x), "20", num(ext.min.y), "30", "0");
    out.push("9", "$EXTMAX", "10", num(ext.max.x), "20", num(ext.max.y), "30", "0");
    out.push("0", "ENDSEC");
    out.push("0", "SECTION", "2", "TABLES");
    out.push("0", "TABLE", "2", "LTYPE", "70", "1");
    out.push("0", "LTYPE", "2", "CONTINUOUS", "70", "0", "3", "Solid line", "72", "65", "73", "0", "40", "0");
    out.push("0", "ENDTAB");
    const layers = new Map([["0", 7], ...this.layers]);
    out.push("0", "TABLE", "2", "LAYER", "70", String(layers.size));
    for (const [name, color] of layers) out.push("0", "LAYER", "2", name, "70", "0", "62", String(color), "6", "CONTINUOUS");
    out.push("0", "ENDTAB");
    out.push("0", "TABLE", "2", "STYLE", "70", "1");
    out.push("0", "STYLE", "2", "STANDARD", "70", "0", "40", "0", "41", "1", "50", "0", "71", "0", "42", "2.5", "3", "arial.ttf", "4", "");
    out.push("0", "ENDTAB");
    out.push("0", "ENDSEC");
    out.push("0", "SECTION", "2", "ENTITIES", ...this.body, "0", "ENDSEC");
    out.push("0", "EOF");
    return out.join("\r\n") + "\r\n";
  }

  /** The file bytes, in the Windows-1252 code page the header declares. */
  toBytes(): Uint8Array {
    return encodeCp1252(this.toString());
  }
}

const CP1252_EXTRA: Record<string, number> = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89,
  "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95,
  "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
};

/** Windows-1252 encoding; characters outside it become "?". */
export function encodeCp1252(text: string): Uint8Array {
  const out = new Uint8Array(text.length * 2);
  let n = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x80 || (code >= 0xa0 && code <= 0xff)) out[n++] = code;
    else out[n++] = CP1252_EXTRA[ch] ?? 0x3f;
  }
  return out.slice(0, n);
}

// --- Reader -------------------------------------------------------------------

export type DxfPolyline = {
  layer: string;
  closed: boolean;
  points: XY[];
  /** True when some segment is an arc (bulge): it is read as a straight chord. */
  hasArcs: boolean;
};

export class DxfReadError extends Error {
  reason: "binary" | "no-entities";
  constructor(reason: "binary" | "no-entities") {
    super(reason);
    this.reason = reason;
  }
}

/**
 * Polylines in the ENTITIES section (blocks and xrefs are not expanded).
 * Throws DxfReadError for binary DXF or text without an ENTITIES section.
 */
export function readDxfPolylines(text: string): DxfPolyline[] {
  if (text.startsWith("AutoCAD Binary DXF")) throw new DxfReadError("binary");
  const lines = text.split(/\r\n|\r|\n/);
  const pairs: [number, string][] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const code = Number(lines[i].trim());
    if (!Number.isInteger(code)) continue;
    pairs.push([code, lines[i + 1].trim()]);
  }

  let start = -1;
  for (let i = 0; i + 1 < pairs.length; i++) {
    if (pairs[i][0] === 0 && pairs[i][1] === "SECTION" && pairs[i + 1][0] === 2 && pairs[i + 1][1] === "ENTITIES") {
      start = i + 2;
      break;
    }
  }
  if (start < 0) throw new DxfReadError("no-entities");

  const result: DxfPolyline[] = [];
  let i = start;
  const nextEntity = (from: number) => {
    let j = from;
    while (j < pairs.length && pairs[j][0] !== 0) j++;
    return j;
  };

  while (i < pairs.length) {
    const [code, value] = pairs[i];
    if (code !== 0) {
      i++;
      continue;
    }
    if (value === "ENDSEC" || value === "EOF") break;

    if (value === "LWPOLYLINE") {
      const end = nextEntity(i + 1);
      const poly: DxfPolyline = { layer: "0", closed: false, points: [], hasArcs: false };
      for (let j = i + 1; j < end; j++) {
        const [c, v] = pairs[j];
        if (c === 8) poly.layer = v;
        else if (c === 70) poly.closed = (Number(v) & 1) === 1;
        else if (c === 10) poly.points.push({ x: Number(v), y: NaN });
        else if (c === 20 && poly.points.length) poly.points[poly.points.length - 1].y = Number(v);
        else if (c === 42 && Number(v) !== 0) poly.hasArcs = true;
      }
      result.push(poly);
      i = end;
      continue;
    }

    if (value === "POLYLINE") {
      let end = nextEntity(i + 1);
      const poly: DxfPolyline = { layer: "0", closed: false, points: [], hasArcs: false };
      let flags = 0;
      for (let j = i + 1; j < end; j++) {
        const [c, v] = pairs[j];
        if (c === 8) poly.layer = v;
        else if (c === 70) flags = Number(v);
      }
      poly.closed = (flags & 1) === 1;
      const isMesh = (flags & 16) === 16 || (flags & 64) === 64;
      while (end < pairs.length && pairs[end][0] === 0 && pairs[end][1] === "VERTEX") {
        const vEnd = nextEntity(end + 1);
        let x = NaN;
        let y = NaN;
        let vFlags = 0;
        for (let j = end + 1; j < vEnd; j++) {
          const [c, v] = pairs[j];
          if (c === 10) x = Number(v);
          else if (c === 20) y = Number(v);
          else if (c === 70) vFlags = Number(v);
          else if (c === 42 && Number(v) !== 0) poly.hasArcs = true;
        }
        // Skip spline frame points (16) and polyface records (128).
        if (!(vFlags & 16) && !(vFlags & 128)) poly.points.push({ x, y });
        end = vEnd;
      }
      if (end < pairs.length && pairs[end][1] === "SEQEND") end = nextEntity(end + 1);
      if (!isMesh) result.push(poly);
      i = end;
      continue;
    }

    i = nextEntity(i + 1);
  }

  return result
    .map((p) => ({ ...p, points: p.points.filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y)) }))
    .filter((p) => p.points.length >= 2);
}
