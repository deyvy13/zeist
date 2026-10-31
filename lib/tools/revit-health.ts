// -----------------------------------------------------------------------------
// Revit model health check. Reads the warnings report Revit exports (Manage ›
// Warnings › Export, an HTML table of message + elements) and four numbers the
// user reads in Revit, and rates each indicator against Zeist's reference
// thresholds. The thresholds are a first reading, not an Autodesk standard:
// they are stated on the tool page and live here so the team can tune them.
// Pure and import-free (see steel.ts).
// -----------------------------------------------------------------------------

export type WarningGroup = { message: string; count: number; elements: number };

export type WarningReport = { total: number; groups: WarningGroup[]; elements: number };

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/gi, "&");

const cellText = (html: string) =>
  decodeEntities(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

/** Header rows of the report in the languages Revit ships in. */
const HEADER_ROW = /^(error message|mensaje de error|mensagem de erro|message d'erreur|fehlermeldung|messaggio di errore|warning|advertencia|aviso)$/i;

/**
 * Parses the HTML report Revit writes from the Warnings dialog: one table row
 * per warning, the message in the first cell and the elements involved after
 * it (each with "id 123456"). Tolerant of the markup: it only needs rows.
 */
export function parseWarningsReport(html: string): WarningReport {
  const groups = new Map<string, WarningGroup>();
  let total = 0;
  const ids = new Set<string>();
  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t([dh])[^>]*>([\s\S]*?)<\/t[dh]>/gi)];
    if (!cells.length || cells.every((c) => c[1].toLowerCase() === "h")) continue;
    const message = cellText(cells[0][2]).join(" ");
    if (!message || HEADER_ROW.test(message)) continue;
    const elementText = cells.slice(1).map((c) => cellText(c[2]).join("\n")).join("\n");
    const rowIds = [...elementText.matchAll(/\bid\s*(\d+)/gi)].map((m) => m[1]);
    rowIds.forEach((id) => ids.add(id));
    total++;
    // The same warning type differs only in the numbers it quotes: group without them.
    const key = message.replace(/\d+([.,]\d+)?/g, "#");
    const g = groups.get(key) ?? { message, count: 0, elements: 0 };
    g.count++;
    g.elements += rowIds.length;
    groups.set(key, g);
  }
  return { total, groups: [...groups.values()].sort((a, b) => b.count - a.count), elements: ids.size };
}

export type HealthIndicator = "warnings" | "fileSize" | "importedCad" | "inPlace";
export type HealthLevel = "good" | "fair" | "poor";

/**
 * Zeist's reference thresholds: up to the first value is good, up to the
 * second is fair, above it is poor. A first reading, not a norm.
 */
export const HEALTH_THRESHOLDS: Record<HealthIndicator, [number, number]> = {
  warnings: [200, 1000],
  fileSize: [200, 500], // MB
  importedCad: [0, 2],
  inPlace: [5, 20],
};

export type HealthInput = Partial<Record<HealthIndicator, number | null>>;

export type HealthResult = {
  /** 0-100, the average over the indicators given; null when none is. */
  score: number | null;
  band: HealthLevel | null;
  items: { id: HealthIndicator; value: number; level: HealthLevel }[];
};

const POINTS: Record<HealthLevel, number> = { good: 100, fair: 50, poor: 0 };

export function assessHealth(input: HealthInput): HealthResult {
  const items: HealthResult["items"] = [];
  for (const id of Object.keys(HEALTH_THRESHOLDS) as HealthIndicator[]) {
    const value = input[id];
    if (value === null || value === undefined || !(value >= 0)) continue;
    const [good, fair] = HEALTH_THRESHOLDS[id];
    items.push({ id, value, level: value <= good ? "good" : value <= fair ? "fair" : "poor" });
  }
  if (!items.length) return { score: null, band: null, items };
  const score = Math.round(items.reduce((s, i) => s + POINTS[i.level], 0) / items.length);
  return { score, band: score >= 80 ? "good" : score >= 50 ? "fair" : "poor", items };
}
