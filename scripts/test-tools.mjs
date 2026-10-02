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
