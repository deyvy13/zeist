// -----------------------------------------------------------------------------
// Coordinate conversion: UTM ⇄ geographic, datum shifts (PSAD56, SAD69, …),
// batch parsing of pasted spreadsheets and exports (Civil 3D PNEZD, KML).
//
// UTM uses Krüger's series to 6th order (Karney 2011): sub-millimetre within a
// zone, with grid convergence and point scale factor. Datum shifts are the
// 3-parameter geocentric translations registered in EPSG. Validated against
// PROJ (pyproj) in scripts/test-tools.mjs.
//
// Pure and import-free on purpose: the client converter uses it and the tests
// run it directly with Node (no "@/..." aliases here).
// -----------------------------------------------------------------------------

const DEG = Math.PI / 180;
const K0 = 0.9996;

export type Ellipsoid = { a: number; f: number };

const WGS84_ELLIPSOID: Ellipsoid = { a: 6378137, f: 1 / 298.257223563 };
const GRS80: Ellipsoid = { a: 6378137, f: 1 / 298.257222101 };
const INTERNATIONAL_1924: Ellipsoid = { a: 6378388, f: 1 / 297 };
const GRS67_MODIFIED: Ellipsoid = { a: 6378160, f: 1 / 298.25 };

export const DATUM_IDS = ["wgs84", "sirgas2000", "nad83", "psad56", "sad69"] as const;
export type DatumId = (typeof DATUM_IDS)[number];

export type Datum = {
  ellipsoid: Ellipsoid;
  /** Geocentric translation to WGS 84 (or the equivalent modern frame), metres. */
  shift: readonly [number, number, number];
  /** Accuracy of that transformation according to EPSG, metres (0 = reference). */
  accuracyM: number;
  /** EPSG transformation, for the citation shown next to results. */
  source: string;
};

export const DATUMS: Record<DatumId, Datum> = {
  wgs84: { ellipsoid: WGS84_ELLIPSOID, shift: [0, 0, 0], accuracyM: 0, source: "WGS 84" },
  sirgas2000: { ellipsoid: GRS80, shift: [0, 0, 0], accuracyM: 1, source: "EPSG: SIRGAS 2000 to WGS 84 (1)" },
  nad83: { ellipsoid: GRS80, shift: [0, 0, 0], accuracyM: 4, source: "EPSG: NAD83 to WGS 84 (1)" },
  psad56: { ellipsoid: INTERNATIONAL_1924, shift: [-279, 175, -379], accuracyM: 16, source: "EPSG: PSAD56 to WGS 84 (8)" },
  sad69: { ellipsoid: GRS67_MODIFIED, shift: [-67.35, 3.88, -38.22], accuracyM: 5, source: "EPSG: SAD69 to SIRGAS 2000 (1)" },
};

/** Approximate accuracy of a datum change, metres (0 when the datum doesn't change). */
export function shiftAccuracy(from: DatumId, to: DatumId): number {
  return from === to ? 0 : Math.max(DATUMS[from].accuracyM, DATUMS[to].accuracyM);
}

// --- Datum shift (3-parameter geocentric translation) -------------------------

function toEcef(latDeg: number, lonDeg: number, h: number, ell: Ellipsoid): [number, number, number] {
  const e2 = ell.f * (2 - ell.f);
  const phi = latDeg * DEG;
  const lam = lonDeg * DEG;
  const sinPhi = Math.sin(phi);
  const n = ell.a / Math.sqrt(1 - e2 * sinPhi * sinPhi);
  return [
    (n + h) * Math.cos(phi) * Math.cos(lam),
    (n + h) * Math.cos(phi) * Math.sin(lam),
    (n * (1 - e2) + h) * sinPhi,
  ];
}

function fromEcef(x: number, y: number, z: number, ell: Ellipsoid): [number, number] {
  const e2 = ell.f * (2 - ell.f);
  const p = Math.hypot(x, y);
  let phi = Math.atan2(z, p * (1 - e2));
  for (let i = 0; i < 10; i++) {
    const sinPhi = Math.sin(phi);
    const n = ell.a / Math.sqrt(1 - e2 * sinPhi * sinPhi);
    const h = p / Math.cos(phi) - n;
    const next = Math.atan2(z, p * (1 - (e2 * n) / (n + h)));
    const done = Math.abs(next - phi) < 1e-14;
    phi = next;
    if (done) break;
  }
  return [phi / DEG, Math.atan2(y, x) / DEG];
}

/** Moves a geographic position between datums (2D: the height is taken as 0, like PROJ's geog2D). */
export function transformDatum(lat: number, lon: number, from: DatumId, to: DatumId): [number, number] {
  if (from === to) return [lat, lon];
  const a = DATUMS[from];
  const b = DATUMS[to];
  const [x, y, z] = toEcef(lat, lon, 0, a.ellipsoid);
  return fromEcef(x + a.shift[0] - b.shift[0], y + a.shift[1] - b.shift[1], z + a.shift[2] - b.shift[2], b.ellipsoid);
}

// --- Transverse Mercator (Krüger series, 6th order) ---------------------------

type TmConstants = { a: number; e: number; A: number; alpha: number[]; beta: number[] };
const tmCache = new Map<Ellipsoid, TmConstants>();

function tmConstants(ell: Ellipsoid): TmConstants {
  const cached = tmCache.get(ell);
  if (cached) return cached;
  const n = ell.f / (2 - ell.f);
  const [n2, n3, n4, n5, n6] = [n ** 2, n ** 3, n ** 4, n ** 5, n ** 6];
  const A = (ell.a / (1 + n)) * (1 + n2 / 4 + n4 / 64 + n6 / 256);
  const alpha = [
    0,
    n / 2 - (2 * n2) / 3 + (5 * n3) / 16 + (41 * n4) / 180 - (127 * n5) / 288 + (7891 * n6) / 37800,
    (13 * n2) / 48 - (3 * n3) / 5 + (557 * n4) / 1440 + (281 * n5) / 630 - (1983433 * n6) / 1935360,
    (61 * n3) / 240 - (103 * n4) / 140 + (15061 * n5) / 26880 + (167603 * n6) / 181440,
    (49561 * n4) / 161280 - (179 * n5) / 168 + (6601661 * n6) / 7257600,
    (34729 * n5) / 80640 - (3418889 * n6) / 1995840,
    (212378941 * n6) / 319334400,
  ];
  const beta = [
    0,
    n / 2 - (2 * n2) / 3 + (37 * n3) / 96 - n4 / 360 - (81 * n5) / 512 + (96199 * n6) / 604800,
    n2 / 48 + n3 / 15 - (437 * n4) / 1440 + (46 * n5) / 105 - (1118711 * n6) / 3870720,
    (17 * n3) / 480 - (37 * n4) / 840 - (209 * n5) / 4480 + (5569 * n6) / 90720,
    (4397 * n4) / 161280 - (11 * n5) / 504 - (830251 * n6) / 7257600,
    (4583 * n5) / 161280 - (108847 * n6) / 3991680,
    (20648693 * n6) / 638668800,
  ];
  const constants = { a: ell.a, e: Math.sqrt(ell.f * (2 - ell.f)), A, alpha, beta };
  tmCache.set(ell, constants);
  return constants;
}

type GridPoint = { x: number; y: number; convergence: number; scale: number };
type GeoPoint = { lat: number; lon: number; convergence: number; scale: number };

function tmForward(ell: Ellipsoid, latDeg: number, lonDeg: number, lon0Deg: number): GridPoint {
  const { a, e, A, alpha } = tmConstants(ell);
  const phi = latDeg * DEG;
  const lam = (lonDeg - lon0Deg) * DEG;
  const cosLam = Math.cos(lam);
  const tau = Math.tan(phi);
  const sigma = Math.sinh(e * Math.atanh((e * tau) / Math.sqrt(1 + tau * tau)));
  const tauP = tau * Math.sqrt(1 + sigma * sigma) - sigma * Math.sqrt(1 + tau * tau);
  const xiP = Math.atan2(tauP, cosLam);
  const etaP = Math.asinh(Math.sin(lam) / Math.sqrt(tauP * tauP + cosLam * cosLam));

  let xi = xiP;
  let eta = etaP;
  let pP = 1;
  let qP = 0;
  for (let j = 1; j <= 6; j++) {
    const s = Math.sin(2 * j * xiP);
    const c = Math.cos(2 * j * xiP);
    const sh = Math.sinh(2 * j * etaP);
    const ch = Math.cosh(2 * j * etaP);
    xi += alpha[j] * s * ch;
    eta += alpha[j] * c * sh;
    pP += 2 * j * alpha[j] * c * ch;
    qP += 2 * j * alpha[j] * s * sh;
  }

  const gamma = Math.atan((tauP / Math.sqrt(1 + tauP * tauP)) * Math.tan(lam)) + Math.atan2(qP, pP);
  const sinPhi = Math.sin(phi);
  const kP = (Math.sqrt(1 - e * e * sinPhi * sinPhi) * Math.sqrt(1 + tau * tau)) / Math.sqrt(tauP * tauP + cosLam * cosLam);
  const kPP = (A / a) * Math.sqrt(pP * pP + qP * qP);
  return { x: K0 * A * eta, y: K0 * A * xi, convergence: gamma / DEG, scale: K0 * kP * kPP };
}

function tmInverse(ell: Ellipsoid, x: number, y: number, lon0Deg: number): GeoPoint {
  const { a, e, A, beta } = tmConstants(ell);
  const eta = x / (K0 * A);
  const xi = y / (K0 * A);
  let xiP = xi;
  let etaP = eta;
  for (let j = 1; j <= 6; j++) {
    xiP -= beta[j] * Math.sin(2 * j * xi) * Math.cosh(2 * j * eta);
    etaP -= beta[j] * Math.cos(2 * j * xi) * Math.sinh(2 * j * eta);
  }
  const sinhEtaP = Math.sinh(etaP);
  const sinXiP = Math.sin(xiP);
  const cosXiP = Math.cos(xiP);
  const tauP = sinXiP / Math.sqrt(sinhEtaP * sinhEtaP + cosXiP * cosXiP);

  // Newton-Raphson for tau = tan(phi).
  let tau = tauP;
  for (let i = 0; i < 20; i++) {
    const sigma = Math.sinh(e * Math.atanh((e * tau) / Math.sqrt(1 + tau * tau)));
    const tauI = tau * Math.sqrt(1 + sigma * sigma) - sigma * Math.sqrt(1 + tau * tau);
    const delta =
      ((tauP - tauI) / Math.sqrt(1 + tauI * tauI)) *
      ((1 + (1 - e * e) * tau * tau) / ((1 - e * e) * Math.sqrt(1 + tau * tau)));
    tau += delta;
    if (Math.abs(delta) < 1e-14) break;
  }
  const phi = Math.atan(tau);
  const lam = Math.atan2(sinhEtaP, cosXiP);

  let p = 1;
  let q = 0;
  for (let j = 1; j <= 6; j++) {
    p -= 2 * j * beta[j] * Math.cos(2 * j * xi) * Math.cosh(2 * j * eta);
    q += 2 * j * beta[j] * Math.sin(2 * j * xi) * Math.sinh(2 * j * eta);
  }
  const gamma = Math.atan(Math.tan(xiP) * Math.tanh(etaP)) + Math.atan2(q, p);
  const sinPhi = Math.sin(phi);
  const kP =
    Math.sqrt(1 - e * e * sinPhi * sinPhi) * Math.sqrt(1 + tau * tau) * Math.sqrt(sinhEtaP * sinhEtaP + cosXiP * cosXiP);
  const kPP = A / a / Math.sqrt(p * p + q * q);
  return { lat: phi / DEG, lon: lon0Deg + lam / DEG, convergence: gamma / DEG, scale: K0 * kP * kPP };
}

// --- UTM ----------------------------------------------------------------------

export function normalizeLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/** Standard UTM zone, including the Norway and Svalbard exceptions. */
export function utmZone(lat: number, lon: number): number {
  const l = normalizeLon(lon);
  let zone = Math.min(Math.floor((l + 180) / 6) + 1, 60);
  if (lat >= 56 && lat < 64 && l >= 3 && l < 12) zone = 32;
  if (lat >= 72 && lat < 84) {
    if (l >= 0 && l < 9) zone = 31;
    else if (l >= 9 && l < 21) zone = 33;
    else if (l >= 21 && l < 33) zone = 35;
    else if (l >= 33 && l < 42) zone = 37;
  }
  return zone;
}

export const centralMeridian = (zone: number) => zone * 6 - 183;

export type UtmPoint = { e: number; n: number; zone: number; south: boolean; convergence: number; scale: number };

/** Geographic → UTM. `zone`/`south` may be forced (projects spanning two zones keep one). */
export function geoToUtm(lat: number, lon: number, datum: DatumId, zone?: number, south?: boolean): UtmPoint {
  const z = zone ?? utmZone(lat, lon);
  const s = south ?? lat < 0;
  const r = tmForward(DATUMS[datum].ellipsoid, lat, lon, centralMeridian(z));
  return { e: r.x + 500000, n: r.y + (s ? 10000000 : 0), zone: z, south: s, convergence: r.convergence, scale: r.scale };
}

export function utmToGeo(e: number, n: number, zone: number, south: boolean, datum: DatumId): GeoPoint {
  const r = tmInverse(DATUMS[datum].ellipsoid, e - 500000, south ? n - 10000000 : n, centralMeridian(zone));
  return { ...r, lon: normalizeLon(r.lon) };
}

/**
 * Elevation factor R / (R + h), with R the Gaussian mean radius at the latitude.
 * h is taken from the point's elevation (geoid undulation ignored: ~5 ppm per 30 m).
 */
export function elevationFactor(lat: number, h: number, datum: DatumId): number {
  const { a, f } = DATUMS[datum].ellipsoid;
  const e2 = f * (2 - f);
  const sinPhi = Math.sin(lat * DEG);
  const r = (a * Math.sqrt(1 - e2)) / (1 - e2 * sinPhi * sinPhi);
  return r / (r + h);
}

// --- Angles -------------------------------------------------------------------

export type Hemispheres = { n: string; s: string; e: string; w: string };

/** 8°06'42.123" S — ASCII marks so the text pastes into Google Maps and Excel. */
export function formatDms(value: number, kind: "lat" | "lon", hemi: Hemispheres, decimal = ".", secDigits = 3): string {
  const negative = value < 0;
  const factor = 10 ** secDigits;
  // Work in rounded seconds so 59.9996" never prints as 60.000".
  let total = Math.round(Math.abs(value) * 3600 * factor) / factor;
  const d = Math.floor(total / 3600);
  total -= d * 3600;
  const m = Math.floor(total / 60);
  const s = total - m * 60;
  const sText = s.toFixed(secDigits).padStart(secDigits ? secDigits + 3 : 2, "0").replace(".", decimal);
  const h = kind === "lat" ? (negative ? hemi.s : hemi.n) : negative ? hemi.w : hemi.e;
  return `${d}°${String(m).padStart(2, "0")}'${sText}" ${h}`;
}

/**
 * Parses decimal degrees or degrees-minutes-seconds: "-8.1116", "8,1116 S",
 * "8°06'42.1\"S", "8 6 42.1 S", "S 8°6'42". Hemisphere letters: N S E W, plus
 * O (oeste) and L (leste). Returns NaN when it can't be read.
 */
export function parseAngle(input: string, kind: "lat" | "lon"): number {
  let s = input.trim().toUpperCase();
  if (!s) return NaN;
  let sign = 1;
  const letters = s.match(/[A-Z]/g) ?? [];
  if (letters.length > 1) return NaN;
  if (letters.length === 1) {
    const h = letters[0];
    const valid = kind === "lat" ? "NS" : "EWOL";
    if (!valid.includes(h)) return NaN;
    if (h === "S" || h === "W" || h === "O") sign = -1;
    s = s.replace(h, " ");
  }
  if (!s.includes(".")) s = s.replace(/,/g, ".");
  const parts = s.split(/[°º'"′″’”\s]+/).filter(Boolean);
  if (parts.length === 0 || parts.length > 3) return NaN;
  if (parts.some((p) => !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(p))) return NaN;
  const nums = parts.map(Number);
  if (nums.slice(1).some((x) => x < 0 || x >= 60)) return NaN;
  if (nums[0] < 0) {
    if (sign === -1) return NaN; // "-8 S" is contradictory
    sign = -1;
  }
  const value = sign * (Math.abs(nums[0]) + (nums[1] ?? 0) / 60 + (nums[2] ?? 0) / 3600);
  const max = kind === "lat" ? 90 : 180;
  return Math.abs(value) <= max ? value : NaN;
}

// --- Batch input --------------------------------------------------------------

export type Field = "P" | "N" | "E" | "Z" | "D" | "LAT" | "LON";

/** Column orders a user can pick. Z and D are optional trailing columns. */
export const UTM_ORDERS = {
  PNEZD: ["P", "N", "E", "Z", "D"],
  PENZD: ["P", "E", "N", "Z", "D"],
  NEZD: ["N", "E", "Z", "D"],
  ENZD: ["E", "N", "Z", "D"],
} as const satisfies Record<string, readonly Field[]>;

export const GEO_ORDERS = {
  PLATLON: ["P", "LAT", "LON", "Z", "D"],
  PLONLAT: ["P", "LON", "LAT", "Z", "D"],
  LATLON: ["LAT", "LON", "Z", "D"],
  LONLAT: ["LON", "LAT", "Z", "D"],
} as const satisfies Record<string, readonly Field[]>;

export type OrderId = keyof typeof UTM_ORDERS | keyof typeof GEO_ORDERS;

export function orderFields(order: OrderId): readonly Field[] {
  return (UTM_ORDERS as Record<string, readonly Field[]>)[order] ?? (GEO_ORDERS as Record<string, readonly Field[]>)[order];
}

export type Delimiter = "tab" | "semicolon" | "comma" | "space";

/**
 * Tab (pasted from Excel) > semicolon (CSV with decimal commas) > comma >
 * whitespace. "512345,67 8650123,45" is whitespace with decimal commas.
 */
export function detectDelimiter(lines: string[]): Delimiter {
  const sample = lines.slice(0, 50);
  const share = (re: RegExp) => sample.filter((l) => re.test(l)).length / Math.max(sample.length, 1);
  if (share(/\t/) >= 0.5) return "tab";
  if (share(/;/) >= 0.5) return "semicolon";
  if (share(/,/) >= 0.5) {
    const decimalCommas = sample.every((l) => l.trim().split(/\s+/).every((t) => /^-?\d+(,\d+)?$|^\D/.test(t)));
    const spaced = sample.some((l) => /\d,\d+\s+\S/.test(l));
    return decimalCommas && spaced ? "space" : "comma";
  }
  return "space";
}

function splitLine(line: string, delimiter: Delimiter, columns: number): string[] {
  const parts =
    delimiter === "tab"
      ? line.split("\t")
      : delimiter === "semicolon"
        ? line.split(";")
        : delimiter === "comma"
          ? line.split(",")
          : line.trim().split(/\s+/);
  const trimmed = parts.map((p) => p.trim());
  // Descriptions may contain the delimiter (or spaces): keep the tail together.
  if (trimmed.length > columns) {
    return [...trimmed.slice(0, columns - 1), trimmed.slice(columns - 1).join(" ")];
  }
  return trimmed;
}

export type InputRow = { line: number; values: Partial<Record<Field, string>> };

export function parseTable(text: string, order: OrderId): { rows: InputRow[]; delimiter: Delimiter } {
  const fields = orderFields(order);
  const lines = text.split(/\r?\n/);
  const delimiter = detectDelimiter(lines.filter((l) => l.trim()));
  const rows: InputRow[] = [];
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const parts = splitLine(line, delimiter, fields.length);
    const values: Partial<Record<Field, string>> = {};
    fields.forEach((f, j) => {
      if (parts[j] !== undefined && parts[j] !== "") values[f] = parts[j];
    });
    rows.push({ line: i + 1, values });
  });
  return { rows, delimiter };
}

// --- Conversion ---------------------------------------------------------------

export type Crs = {
  kind: "utm" | "geo";
  datum: DatumId;
  /** UTM zone; null on the target means "automatic, from each point". */
  zone: number | null;
  south: boolean;
};

export type PointError = "number" | "range" | "swapped" | "zone";

export type Converted = {
  line: number;
  p: string;
  z: number | null;
  d: string;
  error?: PointError;
  /** Target geographic coordinates (target datum). */
  lat?: number;
  lon?: number;
  /** Target UTM, when the target is UTM. */
  utm?: UtmPoint;
  /** WGS 84 position, for the map and KML. */
  wgs?: { lat: number; lon: number };
  /** Grid scale factor and convergence of the UTM grid involved (target, else source). */
  scale?: number;
  convergence?: number;
  /** scale × elevation factor, when there is an elevation. */
  combined?: number;
};

const numberOrNull = (v: string | undefined, parse: (s: string) => number) => {
  if (v === undefined || v.trim() === "") return null;
  const x = parse(v);
  return Number.isFinite(x) ? x : NaN;
};

export function convertRow(
  row: InputRow,
  src: Crs,
  dst: Crs,
  parseNumber: (s: string) => number,
): Converted {
  const v = row.values;
  const z = numberOrNull(v.Z, parseNumber);
  const base: Converted = { line: row.line, p: v.P ?? "", z: z !== null && Number.isFinite(z) ? z : null, d: v.D ?? "" };
  if (z !== null && !Number.isFinite(z)) return { ...base, error: "number" };

  let lat: number;
  let lon: number;
  let srcGrid: { scale: number; convergence: number } | null = null;

  if (src.kind === "utm") {
    const e = parseNumber(v.E ?? "");
    const n = parseNumber(v.N ?? "");
    if (!Number.isFinite(e) || !Number.isFinite(n)) return { ...base, error: "number" };
    if (e >= 1e6 && n < 1e6) return { ...base, error: "swapped" };
    if (!(e > 0 && e < 1e6 && n >= 0 && n <= 1e7)) return { ...base, error: "range" };
    if (src.zone === null || src.zone < 1 || src.zone > 60) return { ...base, error: "zone" };
    const g = utmToGeo(e, n, src.zone, src.south, src.datum);
    lat = g.lat;
    lon = g.lon;
    srcGrid = { scale: g.scale, convergence: g.convergence };
  } else {
    const la = parseAngle(v.LAT ?? "", "lat");
    const lo = parseAngle(v.LON ?? "", "lon");
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      // Longitudes beyond ±90° typed in the latitude column: the columns are swapped.
      const swapped = Number.isFinite(parseAngle(v.LON ?? "", "lat")) && Math.abs(parseNumber(v.LAT ?? "")) > 90;
      return { ...base, error: swapped ? "swapped" : "number" };
    }
    lat = la;
    lon = lo;
  }

  const [tLat, tLon] = transformDatum(lat, lon, src.datum, dst.datum);
  const [wLat, wLon] = transformDatum(lat, lon, src.datum, "wgs84");
  const out: Converted = { ...base, lat: tLat, lon: tLon, wgs: { lat: wLat, lon: wLon } };

  let grid = srcGrid;
  let gridLat = lat;
  let gridDatum = src.datum;
  if (dst.kind === "utm") {
    if (tLat < -80 || tLat > 84) return { ...base, error: "range" };
    if (dst.zone !== null && (dst.zone < 1 || dst.zone > 60)) return { ...base, error: "zone" };
    const u = dst.zone === null ? geoToUtm(tLat, tLon, dst.datum) : geoToUtm(tLat, tLon, dst.datum, dst.zone, dst.south);
    out.utm = u;
    grid = { scale: u.scale, convergence: u.convergence };
    gridLat = tLat;
    gridDatum = dst.datum;
  }
  if (grid) {
    out.scale = grid.scale;
    out.convergence = grid.convergence;
    if (base.z !== null) out.combined = grid.scale * elevationFactor(gridLat, base.z, gridDatum);
  }
  return out;
}

// --- Exports ------------------------------------------------------------------

/** CSV-safe text: no delimiters or line breaks, single spaces. */
const clean = (s: string) => s.replace(/[,\r\n]+/g, " ").replace(/\s+/g, " ").trim();

const xmlEscape = (s: string) =>
  s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** True when some point name isn't a plain number (BM-1): PNEZD can't keep it. */
export function hasPointNames(points: Converted[]): boolean {
  return points.some((p) => p.p !== "" && !/^\d+$/.test(p.p));
}

/**
 * Civil 3D "PNEZD (comma delimited)". Point numbers must be integers there:
 * unless every point already has one, all are numbered 1..n, and names with
 * letters move into the description so nothing is lost.
 */
export function toPnezd(points: Converted[]): { text: string; renumbered: boolean } {
  const ok = points.filter((p) => p.utm);
  const renumbered = !ok.every((p) => /^\d+$/.test(p.p));
  const lines = ok.map((p, i) => {
    const number = renumbered ? String(i + 1) : p.p;
    const desc = renumbered && p.p ? clean(`${p.p} ${p.d}`) : clean(p.d);
    return [number, p.utm!.n.toFixed(3), p.utm!.e.toFixed(3), (p.z ?? 0).toFixed(3), desc].join(",");
  });
  return { text: lines.join("\r\n") + "\r\n", renumbered };
}

/** Geographic CSV (P,Lat,Lon,Z,D) in the target datum, decimal degrees. */
export function toGeoCsv(points: Converted[]): string {
  return (
    points
      .filter((p) => p.lat !== undefined)
      .map((p, i) => [clean(p.p) || String(i + 1), p.lat!.toFixed(9), p.lon!.toFixed(9), (p.z ?? 0).toFixed(3), clean(p.d)].join(","))
      .join("\r\n") + "\r\n"
  );
}

/** Google Earth KML — always WGS 84 longitude,latitude, as the format requires. */
export function toKml(points: Converted[], name: string): string {
  const marks = points
    .filter((p) => p.wgs)
    .map((p, i) => {
      const title = xmlEscape(p.p || String(i + 1));
      const desc = p.d ? `<description>${xmlEscape(p.d)}</description>` : "";
      return `<Placemark><name>${title}</name>${desc}<Point><coordinates>${p.wgs!.lon.toFixed(9)},${p.wgs!.lat.toFixed(9)},0</coordinates></Point></Placemark>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${xmlEscape(name)}</name>\n${marks}\n</Document></kml>\n`;
}
