// -----------------------------------------------------------------------------
// Number parsing/formatting for the calculators. Formatting is done by hand,
// not with Intl: the results are server-rendered and then hydrated, and ICU
// data can differ between Node and the browser — a mismatched separator would
// be a hydration error. Pure and import-free (see steel.ts).
// -----------------------------------------------------------------------------

export type NumberStyle = { decimal: string; group: string };

// es follows Peru (0.560 kg/m, as in the local steel tables); pt follows Brazil.
export const NUMBER_STYLES: Record<"es" | "pt" | "en", NumberStyle> = {
  es: { decimal: ".", group: "," },
  pt: { decimal: ",", group: "." },
  en: { decimal: ".", group: "," },
};

export function formatNumber(value: number, digits: number, style: NumberStyle): string {
  if (!Number.isFinite(value)) return "—";
  const fixed = Math.abs(value).toFixed(digits);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, style.group);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  return sign + grouped + (frac ? style.decimal + frac : "");
}

/** Accepts "0.56", "0,56", "1,234.5" or "1.234,5". Returns NaN when it isn't a number. */
export function parseDecimal(input: string): number {
  let s = input.trim().replace(/\s+/g, "");
  if (!s) return NaN;
  if (s.includes(",") && s.includes(".")) {
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else {
    s = s.replace(",", ".");
  }
  return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}
