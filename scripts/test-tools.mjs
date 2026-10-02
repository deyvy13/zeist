// Regression tests for the calculators in /herramientas. Expected values were
// computed independently (Python, closed-form) — keep them that way.
//
// Run: npm run test:tools   (Node ≥ 23.6: imports the .ts modules directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, cuttingPlan, barsByLength, BARS } from "../lib/tools/steel.ts";
import {
  flowAtDepth,
  normalDepth,
  circularPeakDepth,
  geometry,
} from "../lib/tools/manning.ts";
import { formatNumber, parseDecimal, NUMBER_STYLES } from "../lib/tools/number.ts";
import { buildXlsx } from "../lib/tools/xlsx.ts";
import {
  convertRow,
  elevationFactor,
  formatDms,
  geoToUtm,
  hasPointNames,
  parseAngle,
  parseTable,
  toGeoCsv,
  toKml,
  toPnezd,
  transformDatum,
  utmToGeo,
  utmZone,
} from "../lib/tools/coordinates.ts";

const near = (actual, expected, rel = 1e-6, label = "") =>
  assert.ok(
    Math.abs(actual - expected) <= rel * Math.max(1, Math.abs(expected)),
    `${label} expected ${expected}, got ${actual}`,
  );

// --- Steel --------------------------------------------------------------------

test("bar table matches the density formula (7850 kg/m³) within 0.2 %", () => {
  // The table shows diameters rounded like the local catalogues (3/8" = 9.5 mm);
  // inch bars are checked against their exact nominal size.
  const exactMm = { "3/8": 9.525, "5/8": 15.875, "3/4": 19.05, "1-3/8": 35.814 };
  for (const bar of BARS) {
    if (bar.soldByWeight) continue;
    const formula = 0.0061654 * (exactMm[bar.id] ?? bar.diameterMm) ** 2;
    assert.ok(Math.abs(formula / bar.kgPerM - 1) < 0.002, `${bar.label}: ${formula} vs ${bar.kgPerM}`);
  }
});

test("column example: weights, bars by length and cutting plan", () => {
  const s = summarize(
    [
      { barId: "5/8", count: 6, lengthM: 3.6 },
      { barId: "3/8", count: 18, lengthM: 1.7 },
    ],
    9,
    5,
  );
  const [d38, d58] = s.diameters; // ordered by diameter
  assert.equal(d38.bar.id, "3/8");
  near(d38.lengthM, 30.6);
  near(d38.weightKg, 17.136);
  assert.equal(d38.barsByLength, 4);
  assert.equal(d38.plan.bars, 4);
  near(d38.plan.offcutM, 5.4);
  near(d58.lengthM, 21.6);
  near(d58.weightKg, 33.5232);
  assert.equal(d58.barsByLength, 3);
  assert.equal(d58.plan.bars, 3);
  near(s.totalKg, 50.6592);
  near(s.totalKgWithWaste, 53.19216);
});

test("length method under-counts when offcuts can't be reused", () => {
  const s = summarize([{ barId: "1/2", count: 10, lengthM: 5 }], 9, 5);
  assert.equal(s.diameters[0].barsByLength, 6);
  assert.equal(s.diameters[0].plan.bars, 10);
});

test("no floating-point overcount on exact multiples", () => {
  assert.equal(barsByLength(0.1 * 90, 9, 0), 1);
  const plan = cuttingPlan(Array(90).fill(0.1), 9);
  assert.equal(plan.bars, 1);
  near(plan.offcutM, 0);
});

test("pieces longer than a bar use full bars plus a remainder", () => {
  const plan = cuttingPlan([12], 9);
  assert.equal(plan.longPieces, 1);
  assert.equal(plan.bars, 2);
  near(plan.offcutM, 6);
});

test("wire rod is sold by weight; invalid rows are ignored", () => {
  const s = summarize(
    [
      { barId: "1/4", count: 10, lengthM: 2 },
      { barId: "nope", count: 5, lengthM: 2 },
      { barId: "3/8", count: 0, lengthM: 2 },
      { barId: "3/8", count: 3, lengthM: -1 },
    ],
    9,
    0,
  );
  assert.equal(s.diameters.length, 1);
  assert.equal(s.diameters[0].barsByLength, null);
  assert.equal(s.diameters[0].plan, null);
  near(s.totalKg, 5);
});

// --- Manning ------------------------------------------------------------------

const pipe = { kind: "circular", diameterM: 0.2 };

test("full pipe D=200 mm, n=0.013, S=1 %", () => {
  const f = flowAtDepth(pipe, 0.2, 0.013, 0.01);
  near(f.velocityMs, 1.044007, 1e-5);
  near(f.flowM3s, 0.03279844, 1e-5);
  assert.equal(f.froude, null);
});

test("half-full pipe carries half the full flow at the same velocity", () => {
  const full = flowAtDepth(pipe, 0.2, 0.013, 0.01);
  const half = flowAtDepth(pipe, 0.1, 0.013, 0.01);
  near(half.flowM3s / full.flowM3s, 0.5, 1e-9);
  near(half.velocityMs, full.velocityMs, 1e-9);
});

test("circular pipe: max discharge at y/D ≈ 0.938, ≈ 7.6 % above full", () => {
  const yPeak = circularPeakDepth(1);
  near(yPeak, 0.9382, 2e-4);
  const ratio = flowAtDepth({ kind: "circular", diameterM: 1 }, yPeak, 1, 1).flowM3s /
    flowAtDepth({ kind: "circular", diameterM: 1 }, 1, 1, 1).flowM3s;
  near(ratio, 1.07571, 1e-4);
});

test("rectangular, trapezoidal and triangular channels", () => {
  const r = flowAtDepth({ kind: "rectangular", widthM: 2 }, 1, 0.015, 0.001);
  near(r.velocityMs, 1.328073, 1e-5);
  near(r.flowM3s, 2.656147, 1e-5);
  near(r.froude, 0.424021, 1e-5);
  const t = flowAtDepth({ kind: "trapezoidal", bottomM: 3, sideSlope: 2 }, 1.2, 0.025, 0.0005);
  near(t.areaM2, 6.48, 1e-9);
  near(t.flowM3s, 4.888083, 1e-5);
  near(t.froude, 0.264234, 1e-5);
  near(t.shearPa, 3.798979, 1e-5);
  const v = flowAtDepth({ kind: "triangular", sideSlope: 1.5 }, 0.4, 0.02, 0.002);
  near(v.flowM3s, 0.16236134, 1e-5);
});

test("normal depth: worked example D=200 mm PVC, S=1 %, Q=15 L/s", () => {
  const res = normalDepth(pipe, 0.015, 0.01, 0.01);
  assert.ok(res.ok);
  near(res.flow.depthM / 0.2, 0.4095, 2e-4);
  near(res.flow.velocityMs, 1.2387, 2e-4);
  near(res.flow.shearPa, 4.2767, 2e-4);
  near(res.flow.froude, 1.5939, 2e-4);
});

test("normal depth round-trips for every section", () => {
  const cases = [
    [{ kind: "circular", diameterM: 0.6 }, 0.37],
    [{ kind: "rectangular", widthM: 1.5 }, 0.8],
    [{ kind: "trapezoidal", bottomM: 1, sideSlope: 1.5 }, 0.65],
    [{ kind: "triangular", sideSlope: 2 }, 0.3],
  ];
  for (const [section, y] of cases) {
    const q = flowAtDepth(section, y, 0.014, 0.002).flowM3s;
    const res = normalDepth(section, q, 0.014, 0.002);
    assert.ok(res.ok, section.kind);
    near(res.flow.depthM, y, 1e-8, section.kind);
  }
});

test("pipe surcharges above the peak discharge; bad input is rejected", () => {
  const qFull = flowAtDepth(pipe, 0.2, 0.013, 0.01).flowM3s;
  const res = normalDepth(pipe, qFull * 1.1, 0.013, 0.01);
  assert.equal(res.ok, false);
  assert.equal(res.reason, "surcharged");
  near(res.maxFlowM3s / qFull, 1.07571, 1e-4);
  assert.equal(normalDepth(pipe, 0, 0.013, 0.01).reason, "invalid");
  assert.equal(normalDepth({ kind: "rectangular", widthM: 0 }, 1, 0.013, 0.01).reason, "invalid");
  near(geometry(pipe, 0.2).topWidthM, 0);
});

// --- Numbers & export -----------------------------------------------------------

test("number formatting and parsing", () => {
  assert.equal(formatNumber(1234.567, 2, NUMBER_STYLES.es), "1,234.57");
  assert.equal(formatNumber(1234.567, 2, NUMBER_STYLES.pt), "1.234,57");
  assert.equal(formatNumber(-0.001, 2, NUMBER_STYLES.en), "0.00");
  assert.equal(parseDecimal("0,56"), 0.56);
  assert.equal(parseDecimal(" 1.234,5 "), 1234.5);
  assert.equal(parseDecimal("1,234.5"), 1234.5);
  assert.ok(Number.isNaN(parseDecimal("abc")));
  assert.ok(Number.isNaN(parseDecimal("")));
});

test("xlsx is a well-formed stored zip", () => {
  const bytes = buildXlsx([{ name: "Resumen", rows: [["Diámetro", { value: 1.5, style: "dec2" }]] }]);
  assert.equal(String.fromCharCode(...bytes.slice(0, 4)), "PK\u0003\u0004");
  const tail = bytes.slice(-22);
  assert.equal(new DataView(tail.buffer, tail.byteOffset).getUint32(0, true), 0x06054b50);
  const text = new TextDecoder().decode(bytes);
  for (const part of ["[Content_Types].xml", "xl/workbook.xml", "xl/worksheets/sheet1.xml", "Diámetro"]) {
    assert.ok(text.includes(part), part);
  }
});

// Reference values computed with PROJ 9.5 (pyproj 3.7) — EPSG:326xx/327xx, and the
// EPSG transformations PSAD56 to WGS 84 (8) and SAD69 to SIRGAS 2000 (1).
const PROJ_FORWARD = [
  {"name":"trujillo","lat":-8.11165,"lon":-79.0287,"zone":17,"south":true,"e":717217.5751104329,"n":9102831.61259455,"scale":1.0001839701129176,"convergence":-0.2782651834069045},
  {"name":"lima","lat":-12.04564,"lon":-77.03048,"zone":18,"south":true,"e":278958.52408431156,"n":8667581.942818232,"scale":1.0002045219406266,"convergence":0.423915511877962},
  {"name":"cusco","lat":-13.5167,"lon":-71.9785,"zone":19,"south":true,"e":177558.39891575865,"n":8503763.045466641,"scale":1.0008863296944683,"convergence":0.6967659840139594},
  {"name":"saopaulo","lat":-23.55052,"lon":-46.63331,"zone":23,"south":true,"e":333286.919438475,"n":7394586.092160614,"scale":0.9999433274838405,"convergence":0.6527524219266931},
  {"name":"newyork","lat":40.7128,"lon":-74.006,"zone":18,"south":false,"e":583959.372324085,"n":4507350.998243321,"scale":0.9996867641116934,"convergence":0.6483919586127717},
  {"name":"tromso","lat":69.6492,"lon":18.9553,"zone":34,"south":false,"e":420653.59408477886,"n":7728081.222099982,"scale":0.9996770203890329,"convergence":-1.9171704460642651},
  {"name":"far_from_cm","lat":-5.0,"lon":-83.9,"zone":17,"south":true,"e":178386.22086739034,"n":9446625.868383944,"scale":1.0008805407116772,"convergence":0.2529703955739796},
  {"name":"trujillo_forced_z18","lat":-8.11165,"lon":-79.0287,"zone":18,"south":true,"e":55808.21622416016,"n":9101152.778518144,"scale":1.0020427519000563,"convergence":0.5693980786426193},
  {"name":"equator_north","lat":0.0005,"lon":-78.5,"zone":17,"south":false,"e":778276.316818102,"n":55.31802857097933,"scale":1.0005587314544444,"convergence":2.1830707743677763e-05},
];
const PROJ_DATUM = [
  {"name":"trujillo","from":"psad56","to":"wgs84","lat":-8.11165,"lon":-79.0287,"outLat":-8.115099407256846,"outLon":-79.03088299062931},
  {"name":"lima","from":"psad56","to":"wgs84","lat":-12.04564,"lon":-77.03048,"outLat":-12.04909429410711,"outLon":-77.03261627017456},
  {"name":"cusco","from":"psad56","to":"wgs84","lat":-13.5167,"lon":-71.9785,"outLat":-13.52019041935985,"outLon":-71.98045067448015},
  {"name":"saopaulo","from":"sad69","to":"sirgas2000","lat":-23.55052,"lon":-46.63331,"outLat":-23.55100944567162,"outLon":-46.63376344492811},
  {"name":"manaus","from":"sad69","to":"sirgas2000","lat":-3.119,"lon":-60.0217,"outLat":-3.1193627582272736,"outLon":-60.02220740503238},
];
const PROJ_DATUM_UTM = [
  {"name":"psad56_17s_to_wgs84_17s","e":717500.0,"n":9102800.0,"outE":717248.8987515783,"outN":9102429.632441718,"zone":17,"south":true,"from":"psad56","to":"wgs84"},
  {"name":"sad69_23s_to_sirgas_23s","e":333500.0,"n":7394700.0,"outE":333454.9292347492,"outN":7394654.277764527,"zone":23,"south":true,"from":"sad69","to":"sirgas2000"},
];

// --- Coordinates ----------------------------------------------------------------

test("UTM forward matches PROJ to 1 mm, with scale and convergence", () => {
  for (const r of PROJ_FORWARD) {
    const u = geoToUtm(r.lat, r.lon, "wgs84", r.zone, r.south);
    near(u.e, r.e, 1e-3 / Math.max(1, r.e), `${r.name} E`);
    near(u.n, r.n, 1e-3 / Math.max(1, r.n), `${r.name} N`);
    near(u.scale, r.scale, 1e-9, `${r.name} k`);
    near(u.convergence, r.convergence, 1e-7, `${r.name} convergence`);
  }
});

test("UTM inverse round-trips PROJ grid values to 0.1 mm", () => {
  for (const r of PROJ_FORWARD) {
    const g = utmToGeo(r.e, r.n, r.zone, r.south, "wgs84");
    near(g.lat, r.lat, 1e-9, `${r.name} lat`);
    near(g.lon, r.lon, 1e-9, `${r.name} lon`);
    near(g.scale, r.scale, 1e-9, `${r.name} k (inverse)`);
  }
});

test("datum shifts match the EPSG transformations to 1 mm", () => {
  for (const r of PROJ_DATUM) {
    const [lat, lon] = transformDatum(r.lat, r.lon, r.from, r.to);
    near(lat, r.outLat, 1e-8, `${r.name} lat`);
    near(lon, r.outLon, 1e-8, `${r.name} lon`);
  }
  for (const r of PROJ_DATUM_UTM) {
    const res = convertRow(
      { line: 1, values: { E: String(r.e), N: String(r.n) } },
      { kind: "utm", datum: r.from, zone: r.zone, south: r.south },
      { kind: "utm", datum: r.to, zone: r.zone, south: r.south },
      parseDecimal,
    );
    near(res.utm.e, r.outE, 2e-3 / r.outE, `${r.name} E`);
    near(res.utm.n, r.outN, 2e-3 / r.outN, `${r.name} N`);
  }
});

test("UTM zones, including Norway and Svalbard", () => {
  assert.equal(utmZone(-8.11, -79.03), 17); // Trujillo
  assert.equal(utmZone(-12.05, -77.03), 18); // Lima
  assert.equal(utmZone(-13.52, -71.98), 19); // Cusco
  assert.equal(utmZone(-23.55, -46.63), 23); // São Paulo
  assert.equal(utmZone(60, 5), 32);
  assert.equal(utmZone(78, 15), 33);
  assert.equal(utmZone(0, 179.9), 60);
  assert.equal(utmZone(0, -180), 1);
});

test("angles: parse decimal and DMS in es/pt/en notations, format with carry", () => {
  near(parseAngle(`8°06'42.12"S`, "lat"), -(8 + 6 / 60 + 42.12 / 3600), 1e-12);
  near(parseAngle("79 1 43.32 W", "lon"), -(79 + 1 / 60 + 43.32 / 3600), 1e-12);
  near(parseAngle("79,0287 O", "lon"), -79.0287, 1e-12);
  near(parseAngle("46,6333 L", "lon"), 46.6333, 1e-12);
  near(parseAngle("S 8 6 42", "lat"), -(8 + 6 / 60 + 42 / 3600), 1e-12);
  near(parseAngle("-79.0287", "lon"), -79.0287, 1e-12);
  assert.ok(Number.isNaN(parseAngle("91", "lat")));
  assert.ok(Number.isNaN(parseAngle("8 61 0", "lat")));
  assert.ok(Number.isNaN(parseAngle("-8 S", "lat")));
  assert.ok(Number.isNaN(parseAngle("8 E", "lat")));
  const hemi = { n: "N", s: "S", e: "E", w: "W" };
  assert.equal(formatDms(-8.11165, "lat", hemi), `8°06'41.940" S`);
  assert.equal(formatDms(-79.99999999, "lon", hemi), `80°00'00.000" W`);
});

test("pasted tables: tabs with header, decimal commas, descriptions with spaces", () => {
  const tab = parseTable("Punto\tNorte\tEste\tCota\tDesc\n1\t9102831.61\t717217.58\t32.5\tPlaza de Armas\n", "PNEZD");
  assert.equal(tab.delimiter, "tab");
  assert.equal(tab.rows.length, 2);
  assert.equal(tab.rows[1].values.D, "Plaza de Armas");
  const spaced = parseTable("1 9102831,61 717217,58 32,5 BM 1 norte\n", "PNEZD");
  assert.equal(spaced.delimiter, "space");
  assert.equal(spaced.rows[0].values.E, "717217,58");
  assert.equal(spaced.rows[0].values.D, "BM 1 norte");
  const semi = parseTable("1;9102831,61;717217,58\n", "PNEZD");
  assert.equal(semi.delimiter, "semicolon");
  assert.equal(semi.rows[0].values.N, "9102831,61");
});

test("row conversion flags swapped, out-of-range and unreadable values", () => {
  const src = { kind: "utm", datum: "wgs84", zone: 17, south: true };
  const dst = { kind: "geo", datum: "wgs84", zone: null, south: true };
  const conv = (E, N, Z) => convertRow({ line: 1, values: { E, N, Z } }, src, dst, parseDecimal);
  assert.equal(conv("9102831.61", "717217.58").error, "swapped");
  assert.equal(conv("1717217", "9102831").error, "range");
  assert.equal(conv("717217", "12000000").error, "range");
  assert.equal(conv("abc", "9102831").error, "number");
  const header = conv("Este", "Norte");
  assert.equal(header.error, "number");
  const ok = conv("717217,5751", "9102831,6126", "32.5");
  near(ok.lat, -8.11165, 1e-8);
  near(ok.combined, ok.scale * elevationFactor(ok.lat, 32.5, "wgs84"), 1e-12);
  near(elevationFactor(0, 0, "wgs84"), 1, 1e-15);
  assert.ok(elevationFactor(-12, 1000, "wgs84") < 0.99985 && elevationFactor(-12, 1000, "wgs84") > 0.99984);
});

test("exports: Civil 3D PNEZD renumbers alphanumeric points; KML is WGS 84 lon,lat", () => {
  const src = { kind: "geo", datum: "wgs84", zone: null, south: true };
  const dst = { kind: "utm", datum: "wgs84", zone: 17, south: true };
  const rows = parseTable("BM-1\t-8.11165\t-79.0287\t32.5\tPlaza, centro\nBM-2\t-8.112\t-79.03\n", "PLATLON").rows;
  const pts = rows.map((r) => convertRow(r, src, dst, parseDecimal));
  const pnezd = toPnezd(pts);
  assert.equal(pnezd.renumbered, true);
  assert.equal(pnezd.text.split("\r\n")[0], "1,9102831.613,717217.575,32.500,BM-1 Plaza centro");
  assert.equal(hasPointNames(pts), true);
  const unnamed = convertRow({ line: 1, values: { LAT: "-8.11165", LON: "-79.0287" } }, src, dst, parseDecimal);
  assert.equal(hasPointNames([unnamed]), false); // no "names moved" warning for a bare point
  assert.equal(toPnezd([unnamed]).text.split(",")[0], "1");
  const kml = toKml(pts, "Puntos & más");
  assert.ok(kml.includes("<coordinates>-79.028700000,-8.111650000,0</coordinates>"));
  assert.ok(kml.includes("Puntos &amp; más"));
  assert.ok(toGeoCsv(pts).startsWith("BM-1,"));
});
