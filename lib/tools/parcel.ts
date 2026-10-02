// -----------------------------------------------------------------------------
// Land parcel geometry: area, perimeter, sides (distance, azimuth, bearing),
// interior angles and boundary directions of a polygon given by its vertices
// in plane coordinates (UTM or local), plus building a polygon from measured
// sides and a diagonal. Feeds the "cuadro de datos técnicos" and the
// description of boundaries (memoria descriptiva / memorial / metes & bounds).
//
// Everything is planar: with UTM input, areas and distances are grid values
// (the ground area comes from the combined scale factor, computed elsewhere).
// No "@/" aliases here: the tests import these modules directly with Node.
// -----------------------------------------------------------------------------

export type Vertex = { name: string; e: number; n: number };
export type Cardinal = "N" | "E" | "S" | "W";

export type Side = {
  /** Vertex indices. */
  from: number;
  to: number;
  length: number;
  /** Degrees from grid north, clockwise, in [0, 360). */
  azimuth: number;
  /** Direction the side faces, seen from inside the lot. */
  faces: Cardinal;
};

export type ParcelError = "few" | "zero-area" | "self-intersecting";

export type Parcel = {
  vertices: Vertex[];
  sides: Side[];
  /** Interior angle at each vertex, degrees. */
  angles: number[];
  area: number;
  perimeter: number;
  clockwise: boolean;
  centroid: { e: number; n: number };
};

export type ParcelResult =
  | { ok: true; parcel: Parcel }
  | { ok: false; error: ParcelError; sides?: [number, number] };

const DEG = 180 / Math.PI;
const EPS = 1e-9;

const mod360 = (a: number) => ((a % 360) + 360) % 360;

/** Interior angle between the incoming and outgoing sides, given the travel direction. */
function interiorAngle(prev: Vertex, at: Vertex, next: Vertex, clockwise: boolean): number {
  const toPrev = Math.atan2(prev.n - at.n, prev.e - at.e) * DEG;
  const toNext = Math.atan2(next.n - at.n, next.e - at.e) * DEG;
  return clockwise ? mod360(toNext - toPrev) : mod360(toPrev - toNext);
}

function cardinal(azimuth: number): Cardinal {
  const a = mod360(azimuth);
  if (a >= 315 || a < 45) return "N";
  if (a < 135) return "E";
  if (a < 225) return "S";
  return "W";
}

function orient(a: Vertex, b: Vertex, c: Vertex): number {
  return (b.e - a.e) * (c.n - a.n) - (b.n - a.n) * (c.e - a.e);
}

function onSegment(a: Vertex, b: Vertex, p: Vertex): boolean {
  return Math.min(a.e, b.e) - EPS <= p.e && p.e <= Math.max(a.e, b.e) + EPS &&
    Math.min(a.n, b.n) - EPS <= p.n && p.n <= Math.max(a.n, b.n) + EPS;
}

/** True when two segments cross or touch (collinear overlap included). */
function segmentsIntersect(p1: Vertex, p2: Vertex, q1: Vertex, q2: Vertex): boolean {
  const scale = Math.max(1, Math.abs(p1.e), Math.abs(p1.n));
  const tol = 1e-12 * scale * scale;
  const d1 = orient(q1, q2, p1);
  const d2 = orient(q1, q2, p2);
  const d3 = orient(p1, p2, q1);
  const d4 = orient(p1, p2, q2);
  if (((d1 > tol && d2 < -tol) || (d1 < -tol && d2 > tol)) && ((d3 > tol && d4 < -tol) || (d3 < -tol && d4 > tol))) return true;
  if (Math.abs(d1) <= tol && onSegment(q1, q2, p1)) return true;
  if (Math.abs(d2) <= tol && onSegment(q1, q2, p2)) return true;
  if (Math.abs(d3) <= tol && onSegment(p1, p2, q1)) return true;
  if (Math.abs(d4) <= tol && onSegment(p1, p2, q2)) return true;
  return false;
}

/** Removes repeated consecutive vertices and a closing vertex equal to the first. */
export function cleanRing(vertices: Vertex[]): Vertex[] {
  const same = (a: Vertex, b: Vertex) => Math.abs(a.e - b.e) < 1e-6 && Math.abs(a.n - b.n) < 1e-6;
  const out: Vertex[] = [];
  for (const v of vertices) if (!out.length || !same(out[out.length - 1], v)) out.push(v);
  while (out.length > 1 && same(out[0], out[out.length - 1])) out.pop();
  return out;
}

export function analyzeParcel(input: Vertex[]): ParcelResult {
  const vertices = cleanRing(input);
  const count = vertices.length;
  if (count < 3) return { ok: false, error: "few" };

  // Crossing sides first: a figure-eight can have zero net area, and the
  // crossing is the problem to report.
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === count - 1);
      if (adjacent) continue;
      if (segmentsIntersect(vertices[i], vertices[(i + 1) % count], vertices[j], vertices[(j + 1) % count])) {
        return { ok: false, error: "self-intersecting", sides: [i, j] };
      }
    }
  }

  // Work relative to the first vertex: UTM products (1e12) would eat the decimals.
  const o = vertices[0];
  const local = vertices.map((v) => ({ x: v.e - o.e, y: v.n - o.n }));
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < count; i++) {
    const a = local[i];
    const b = local[(i + 1) % count];
    const cross = a.x * b.y - b.x * a.y;
    twiceArea += cross;
    cx += (a.x + b.x) * cross;
    cy += (a.y + b.y) * cross;
  }
  const extent = Math.max(...local.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))), 1);
  if (Math.abs(twiceArea) < 1e-9 * extent * extent) return { ok: false, error: "zero-area" };

  const clockwise = twiceArea < 0;
  const sides: Side[] = vertices.map((a, i) => {
    const b = vertices[(i + 1) % count];
    const de = b.e - a.e;
    const dn = b.n - a.n;
    const azimuth = mod360(Math.atan2(de, dn) * DEG);
    // The outside is to the left of travel on a clockwise ring, to the right otherwise.
    const outward = clockwise ? azimuth - 90 : azimuth + 90;
    return { from: i, to: (i + 1) % count, length: Math.hypot(de, dn), azimuth, faces: cardinal(outward) };
  });
  const angles = vertices.map((v, i) => interiorAngle(vertices[(i - 1 + count) % count], v, vertices[(i + 1) % count], clockwise));

  return {
    ok: true,
    parcel: {
      vertices,
      sides,
      angles,
      area: Math.abs(twiceArea) / 2,
      perimeter: sides.reduce((s, x) => s + x.length, 0),
      clockwise,
      centroid: { e: o.e + cx / (3 * twiceArea), n: o.n + cy / (3 * twiceArea) },
    },
  };
}

/**
 * Consecutive sides facing the same direction, as the boundary description
 * groups them ("Por el Norte: línea quebrada de 2 tramos"). Ordered N, E, S, W;
 * a direction that appears twice (irregular lots) keeps its traversal order.
 */
export function boundaryGroups(parcel: Parcel): { faces: Cardinal; sides: number[] }[] {
  const { sides } = parcel;
  const count = sides.length;
  let start = 0;
  if (!sides.every((s) => s.faces === sides[0].faces)) {
    while (sides[(start - 1 + count) % count].faces === sides[start].faces) start = (start + 1) % count;
  }
  const groups: { faces: Cardinal; sides: number[] }[] = [];
  for (let k = 0; k < count; k++) {
    const i = (start + k) % count;
    const last = groups[groups.length - 1];
    if (last && last.faces === sides[i].faces) last.sides.push(i);
    else groups.push({ faces: sides[i].faces, sides: [i] });
  }
  const order: Cardinal[] = ["N", "E", "S", "W"];
  return groups
    .map((g, i) => ({ g, i }))
    .sort((a, b) => order.indexOf(a.g.faces) - order.indexOf(b.g.faces) || a.i - b.i)
    .map(({ g }) => g);
}

// --- Polygon from measurements ------------------------------------------------

export type Measures =
  | { kind: "triangle"; ab: number; bc: number; ca: number }
  | { kind: "quad"; ab: number; bc: number; cd: number; da: number; ac: number };

export type MeasuresError = "invalid" | "triangle-abc" | "triangle-acd";

/** Third vertex of a triangle from its base (0,0)-(base,0) and the two other sides; NaN if impossible. */
function apex(base: number, fromStart: number, fromEnd: number): { x: number; y: number } {
  const x = (base * base + fromStart * fromStart - fromEnd * fromEnd) / (2 * base);
  const h2 = fromStart * fromStart - x * x;
  return { x, y: h2 > 1e-12 * fromStart * fromStart ? Math.sqrt(h2) : NaN };
}

/**
 * Local coordinates (A at the origin, AB along +X, counterclockwise) of a
 * triangle from its three sides, or of a quadrilateral from its four sides and
 * the diagonal AC — with only four sides the shape (and the area) is undefined.
 */
export function polygonFromMeasures(m: Measures, names = ["A", "B", "C", "D"]): { ok: true; vertices: Vertex[] } | { ok: false; error: MeasuresError } {
  const values = m.kind === "triangle" ? [m.ab, m.bc, m.ca] : [m.ab, m.bc, m.cd, m.da, m.ac];
  if (!values.every((v) => Number.isFinite(v) && v > 0)) return { ok: false, error: "invalid" };

  if (m.kind === "triangle") {
    const c = apex(m.ab, m.ca, m.bc);
    if (!Number.isFinite(c.y)) return { ok: false, error: "triangle-abc" };
    return {
      ok: true,
      vertices: [
        { name: names[0], e: 0, n: 0 },
        { name: names[1], e: m.ab, n: 0 },
        { name: names[2], e: c.x, n: c.y },
      ],
    };
  }

  // Diagonal AC on the X axis: B below it, D above it (A-B-C-D counterclockwise).
  const b = apex(m.ac, m.ab, m.bc);
  if (!Number.isFinite(b.y)) return { ok: false, error: "triangle-abc" };
  const d = apex(m.ac, m.da, m.cd);
  if (!Number.isFinite(d.y)) return { ok: false, error: "triangle-acd" };
  const raw = [
    { x: 0, y: 0 },
    { x: b.x, y: -b.y },
    { x: m.ac, y: 0 },
    { x: d.x, y: d.y },
  ];
  // Rotate so that AB lies along +X (the front of the lot at the bottom).
  const t = -Math.atan2(raw[1].y, raw[1].x);
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  return {
    ok: true,
    vertices: raw.map((p, i) => ({ name: names[i], e: p.x * cos - p.y * sin, n: p.x * sin + p.y * cos })),
  };
}

// --- Angle formatting ----------------------------------------------------------

/** 89.99944 → 89°59'58" (whole seconds, with carry). `deg` marks the degrees symbol. */
export function formatAngle(value: number, deg = "°"): string {
  let total = Math.round(Math.abs(value) * 3600);
  const d = Math.floor(total / 3600);
  total -= d * 3600;
  const m = Math.floor(total / 60);
  const s = total - m * 60;
  return `${value < 0 ? "-" : ""}${d}${deg}${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}

/** Quadrant bearing from an azimuth: 135° → S 45°00'00" E. */
export function formatBearing(azimuth: number, deg = "°", letters = { n: "N", s: "S", e: "E", w: "W" }): string {
  // Round first so 89°59'59.6" doesn't print as N 90°00'00" E in the wrong quadrant.
  const a = mod360(Math.round(mod360(azimuth) * 3600) / 3600);
  if (a <= 90) return `${letters.n} ${formatAngle(a, deg)} ${letters.e}`;
  if (a <= 180) return `${letters.s} ${formatAngle(180 - a, deg)} ${letters.e}`;
  if (a <= 270) return `${letters.s} ${formatAngle(a - 180, deg)} ${letters.w}`;
  return `${letters.n} ${formatAngle(360 - a, deg)} ${letters.w}`;
}

/** Default vertex names: A, B, …, Z, AA, AB, … */
export function letterName(index: number): string {
  let name = "";
  for (let i = index + 1; i > 0; i = Math.floor((i - 1) / 26)) name = String.fromCharCode(65 + ((i - 1) % 26)) + name;
  return name;
}
