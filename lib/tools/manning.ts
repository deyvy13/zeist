// -----------------------------------------------------------------------------
// Manning's equation for uniform free-surface flow — partially full pipes and
// open channels. Everything is SI internally (m, m³/s, Pa); the calculator
// converts at the edges.
//
//   V = (1/n) · R^(2/3) · S^(1/2)      Q = V · A
//
// Pure and import-free on purpose: the client calculator uses it, and
// scripts/test-tools.mjs runs it directly with Node (no "@/..." aliases here).
// -----------------------------------------------------------------------------

export const GRAVITY = 9.81; // m/s²
export const WATER_SPECIFIC_WEIGHT = 9810; // N/m³ (ρ·g)

export type Section =
  | { kind: "circular"; diameterM: number }
  | { kind: "rectangular"; widthM: number }
  | { kind: "trapezoidal"; bottomM: number; sideSlope: number } // z = horizontal : 1 vertical
  | { kind: "triangular"; sideSlope: number };

export type SectionKind = Section["kind"];

export type Geometry = {
  areaM2: number;
  perimeterM: number;
  radiusM: number;
  topWidthM: number;
};

export type Flow = Geometry & {
  depthM: number;
  velocityMs: number;
  flowM3s: number;
  /** null when there is no free surface (pipe flowing full). */
  froude: number | null;
  /** Mean boundary shear (tractive force), Pa. */
  shearPa: number;
};

export type DepthResult =
  | { ok: true; flow: Flow }
  | { ok: false; reason: "invalid" }
  | { ok: false; reason: "surcharged"; maxFlowM3s: number };

/** Typical Manning n by material. Labels live with the page content. */
export const ROUGHNESS = [
  { id: "pvc", n: 0.01, min: 0.009, max: 0.011 },
  { id: "concrete-pipe", n: 0.013, min: 0.011, max: 0.015 },
  { id: "cast-iron", n: 0.013, min: 0.01, max: 0.014 },
  { id: "corrugated-metal", n: 0.024, min: 0.021, max: 0.03 },
  { id: "concrete-channel", n: 0.015, min: 0.013, max: 0.016 },
  { id: "masonry", n: 0.025, min: 0.017, max: 0.03 },
  { id: "earth-clean", n: 0.022, min: 0.018, max: 0.025 },
  { id: "earth-grass", n: 0.027, min: 0.022, max: 0.033 },
  { id: "rock", n: 0.035, min: 0.025, max: 0.04 },
  { id: "natural-stream", n: 0.03, min: 0.025, max: 0.033 },
] as const;

export type RoughnessId = (typeof ROUGHNESS)[number]["id"];

/** Depth cap for the section: the diameter for pipes, none for channels. */
export function maxDepth(section: Section): number {
  return section.kind === "circular" ? section.diameterM : Infinity;
}

export function isValidSection(section: Section): boolean {
  switch (section.kind) {
    case "circular":
      return section.diameterM > 0;
    case "rectangular":
      return section.widthM > 0;
    case "trapezoidal":
      return section.bottomM >= 0 && section.sideSlope >= 0 && (section.bottomM > 0 || section.sideSlope > 0);
    case "triangular":
      return section.sideSlope > 0;
  }
}

export function geometry(section: Section, depthM: number): Geometry {
  let area = 0;
  let perimeter = 0;
  let top = 0;
  switch (section.kind) {
    case "circular": {
      const d = section.diameterM;
      const y = Math.min(Math.max(depthM, 0), d);
      const theta = 2 * Math.acos(1 - (2 * y) / d); // central angle of the wetted arc
      area = ((d * d) / 8) * (theta - Math.sin(theta));
      perimeter = (d * theta) / 2;
      top = y >= d ? 0 : d * Math.sin(theta / 2);
      break;
    }
    case "rectangular": {
      const y = Math.max(depthM, 0);
      area = section.widthM * y;
      perimeter = section.widthM + 2 * y;
      top = section.widthM;
      break;
    }
    case "trapezoidal": {
      const y = Math.max(depthM, 0);
      const { bottomM: b, sideSlope: z } = section;
      area = (b + z * y) * y;
      perimeter = b + 2 * y * Math.sqrt(1 + z * z);
      top = b + 2 * z * y;
      break;
    }
    case "triangular": {
      const y = Math.max(depthM, 0);
      const z = section.sideSlope;
      area = z * y * y;
      perimeter = 2 * y * Math.sqrt(1 + z * z);
      top = 2 * z * y;
      break;
    }
  }
  return {
    areaM2: area,
    perimeterM: perimeter,
    radiusM: perimeter > 0 ? area / perimeter : 0,
    topWidthM: top,
  };
}

export function flowAtDepth(section: Section, depthM: number, n: number, slope: number): Flow {
  const g = geometry(section, depthM);
  const velocity =
    g.radiusM > 0 && n > 0 && slope > 0 ? (1 / n) * Math.pow(g.radiusM, 2 / 3) * Math.sqrt(slope) : 0;
  const froude =
    g.topWidthM > 1e-9 && g.areaM2 > 0 ? velocity / Math.sqrt((GRAVITY * g.areaM2) / g.topWidthM) : null;
  return {
    ...g,
    depthM: Math.min(Math.max(depthM, 0), maxDepth(section)),
    velocityMs: velocity,
    flowM3s: velocity * g.areaM2,
    froude,
    shearPa: WATER_SPECIFIC_WEIGHT * g.radiusM * slope,
  };
}

/** Depth of maximum discharge in a circular pipe (≈ 0.938·D), by golden-section search. */
export function circularPeakDepth(diameterM: number): number {
  // n and S scale Q uniformly, so they don't move the peak.
  const q = (y: number) => flowAtDepth({ kind: "circular", diameterM }, y, 1, 1).flowM3s;
  const ratio = (Math.sqrt(5) - 1) / 2;
  let a = 0.5 * diameterM;
  let b = diameterM;
  let c = b - ratio * (b - a);
  let d = a + ratio * (b - a);
  for (let i = 0; i < 200 && b - a > 1e-12 * diameterM; i++) {
    if (q(c) > q(d)) b = d;
    else a = c;
    c = b - ratio * (b - a);
    d = a + ratio * (b - a);
  }
  return (a + b) / 2;
}

/**
 * Normal depth for a given discharge, by bisection on the rising branch of
 * Q(y). In a circular pipe Q peaks near 0.938·D and then drops to the
 * full-flow value, so flows between Q_full and Q_max have two depths — the
 * lower one is returned — and flows above Q_max cannot run with a free
 * surface at all (the pipe surcharges).
 */
export function normalDepth(section: Section, flowM3s: number, n: number, slope: number): DepthResult {
  if (!isValidSection(section) || !(flowM3s > 0) || !(n > 0) || !(slope > 0)) {
    return { ok: false, reason: "invalid" };
  }
  const q = (y: number) => flowAtDepth(section, y, n, slope).flowM3s;

  let lo = 0;
  let hi: number;
  if (section.kind === "circular") {
    hi = circularPeakDepth(section.diameterM);
    const maxFlow = q(hi);
    if (flowM3s > maxFlow) return { ok: false, reason: "surcharged", maxFlowM3s: maxFlow };
  } else {
    hi = 1;
    while (q(hi) < flowM3s && hi < 1e6) hi *= 2;
  }

  for (let i = 0; i < 300 && hi - lo > 1e-12 * Math.max(1, hi); i++) {
    const mid = (lo + hi) / 2;
    if (q(mid) < flowM3s) lo = mid;
    else hi = mid;
  }
  return { ok: true, flow: flowAtDepth(section, (lo + hi) / 2, n, slope) };
}
