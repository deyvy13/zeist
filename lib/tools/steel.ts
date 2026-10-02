// -----------------------------------------------------------------------------
// Rebar (acero corrugado) takeoff: weight per diameter and how many commercial
// bars to buy — by total length (the usual spreadsheet method) and by a
// cutting plan, which is what the site actually needs to order.
//
// Pure and import-free on purpose: the client calculator uses it, and
// scripts/test-tools.mjs runs it directly with Node (no "@/..." aliases there).
// -----------------------------------------------------------------------------

export type Bar = {
  id: string;
  label: string;
  diameterMm: number;
  /** Nominal weight, kg per metre. */
  kgPerM: number;
  /** Nominal cross-section area, cm². */
  areaCm2: number;
  /** Plain wire rod sold by weight in coils — no commercial bar count. */
  soldByWeight?: boolean;
};

// Nominal values for deformed bars per NTP 341.031 / ASTM A615 (Peru). 1/4" is
// plain wire rod (alambrón), listed because it is still common for stirrups.
export const BARS: readonly Bar[] = [
  { id: "6mm", label: "6 mm", diameterMm: 6, kgPerM: 0.222, areaCm2: 0.28 },
  { id: "1/4", label: '1/4"', diameterMm: 6.35, kgPerM: 0.25, areaCm2: 0.32, soldByWeight: true },
  { id: "8mm", label: "8 mm", diameterMm: 8, kgPerM: 0.395, areaCm2: 0.5 },
  { id: "3/8", label: '3/8"', diameterMm: 9.5, kgPerM: 0.56, areaCm2: 0.71 },
  { id: "12mm", label: "12 mm", diameterMm: 12, kgPerM: 0.888, areaCm2: 1.13 },
  { id: "1/2", label: '1/2"', diameterMm: 12.7, kgPerM: 0.994, areaCm2: 1.29 },
  { id: "5/8", label: '5/8"', diameterMm: 15.9, kgPerM: 1.552, areaCm2: 2.0 },
  { id: "3/4", label: '3/4"', diameterMm: 19.1, kgPerM: 2.235, areaCm2: 2.84 },
  { id: "1", label: '1"', diameterMm: 25.4, kgPerM: 3.973, areaCm2: 5.1 },
  { id: "1-3/8", label: '1 3/8"', diameterMm: 35.8, kgPerM: 7.907, areaCm2: 10.06 },
];

export const DEFAULT_STOCK_M = 9; // commercial bar length in Peru
/** Above this many pieces of one diameter the cutting plan is skipped (UI stays responsive). */
export const MAX_PLAN_PIECES = 10000;

const EPS = 1e-9;
const round6 = (x: number) => Math.round(x * 1e6) / 1e6;

export function findBar(id: string): Bar | undefined {
  return BARS.find((b) => b.id === id);
}

export type PieceRow = { barId: string; count: number; lengthM: number };

export type CutPattern = {
  /** Piece lengths cut from one bar, longest first. */
  pieces: number[];
  /** How many bars are cut with this pattern. */
  count: number;
  /** Leftover of each bar, in metres. */
  offcutM: number;
};

export type CuttingPlan = {
  bars: number;
  offcutM: number;
  /** Share of the purchased length that ends up in pieces (0-1). */
  usage: number;
  patterns: CutPattern[];
  /** Pieces longer than a stock bar: built from full bars + a remainder, laps excluded. */
  longPieces: number;
};

/** Bars to buy by total length plus a waste allowance (the spreadsheet method). */
export function barsByLength(lengthM: number, stockM: number, wastePct: number): number {
  if (!(lengthM > 0) || !(stockM > 0)) return 0;
  return Math.ceil(round6((lengthM * (1 + Math.max(0, wastePct) / 100)) / stockM));
}

/**
 * Cutting plan by first-fit decreasing: every piece goes into the first bar
 * that still has room, longest pieces first. Not guaranteed optimal, but
 * within a few percent of it and exactly what a person would do on site.
 */
export function cuttingPlan(pieces: number[], stockM: number): CuttingPlan {
  const pool: number[] = [];
  let fullBars = 0;
  let longPieces = 0;

  for (const raw of pieces) {
    const p = round6(raw);
    if (!(p > 0)) continue;
    if (p > stockM + EPS) {
      longPieces++;
      const n = Math.floor(round6(p / stockM));
      fullBars += n;
      const rest = round6(p - n * stockM);
      if (rest > EPS) pool.push(rest);
    } else {
      pool.push(p);
    }
  }

  pool.sort((a, b) => b - a);
  const bins: { free: number; items: number[] }[] = [];
  for (const p of pool) {
    const bin = bins.find((b) => b.free + EPS >= p);
    if (bin) {
      bin.items.push(p);
      bin.free = round6(bin.free - p);
    } else {
      bins.push({ free: round6(stockM - p), items: [p] });
    }
  }

  const byKey = new Map<string, CutPattern>();
  for (const bin of bins) {
    const key = bin.items.join("+");
    const found = byKey.get(key);
    if (found) found.count++;
    else byKey.set(key, { pieces: bin.items, count: 1, offcutM: bin.free });
  }
  const patterns = [...byKey.values()].sort((a, b) => b.count - a.count || a.offcutM - b.offcutM);
  if (fullBars > 0) patterns.unshift({ pieces: [stockM], count: fullBars, offcutM: 0 });

  const bars = bins.length + fullBars;
  const offcutM = round6(bins.reduce((s, b) => s + b.free, 0));
  const usage = bars > 0 ? round6(1 - offcutM / (bars * stockM)) : 0;
  return { bars, offcutM, usage, patterns, longPieces };
}

export type DiameterSummary = {
  bar: Bar;
  pieces: number;
  lengthM: number;
  weightKg: number;
  /** null for bars sold by weight. */
  barsByLength: number | null;
  /** null for bars sold by weight or when there are too many pieces to plan. */
  plan: CuttingPlan | null;
  planSkipped: boolean;
};

export type SteelSummary = {
  diameters: DiameterSummary[];
  totalLengthM: number;
  totalKg: number;
  totalKgWithWaste: number;
  totalBarsByLength: number;
  totalBarsPlan: number;
};

/** Rows with an unknown bar or non-positive count/length are ignored. */
export function summarize(rows: PieceRow[], stockM: number, wastePct: number): SteelSummary {
  const groups = new Map<string, PieceRow[]>();
  for (const row of rows) {
    if (!findBar(row.barId) || !(row.count > 0) || !(row.lengthM > 0)) continue;
    groups.set(row.barId, [...(groups.get(row.barId) ?? []), row]);
  }

  const diameters: DiameterSummary[] = [];
  for (const bar of BARS) {
    const group = groups.get(bar.id);
    if (!group) continue;
    const count = group.reduce((s, r) => s + Math.round(r.count), 0);
    const lengthM = round6(group.reduce((s, r) => s + Math.round(r.count) * r.lengthM, 0));
    const weightKg = round6(lengthM * bar.kgPerM);

    let plan: CuttingPlan | null = null;
    let planSkipped = false;
    if (!bar.soldByWeight && stockM > 0) {
      if (count <= MAX_PLAN_PIECES) {
        const pieces: number[] = [];
        for (const r of group) for (let i = 0; i < Math.round(r.count); i++) pieces.push(r.lengthM);
        plan = cuttingPlan(pieces, stockM);
      } else {
        planSkipped = true;
      }
    }

    diameters.push({
      bar,
      pieces: count,
      lengthM,
      weightKg,
      barsByLength: bar.soldByWeight ? null : barsByLength(lengthM, stockM, wastePct),
      plan,
      planSkipped,
    });
  }

  const totalKg = round6(diameters.reduce((s, d) => s + d.weightKg, 0));
  return {
    diameters,
    totalLengthM: round6(diameters.reduce((s, d) => s + d.lengthM, 0)),
    totalKg,
    totalKgWithWaste: round6(totalKg * (1 + Math.max(0, wastePct) / 100)),
    totalBarsByLength: diameters.reduce((s, d) => s + (d.barsByLength ?? 0), 0),
    totalBarsPlan: diameters.reduce((s, d) => s + (d.plan?.bars ?? 0), 0),
  };
}
