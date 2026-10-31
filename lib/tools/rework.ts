// -----------------------------------------------------------------------------
// Rework cost calculator. Two readings of the same problem:
//  - Office: the hours the team spends redoing deliverables, at its loaded cost.
//  - Site: the share of a project's value that studies attribute to rework.
// The rates come from published studies (sources on the tool page); the tool
// only multiplies. Pure and import-free (see steel.ts).
// -----------------------------------------------------------------------------

export type OfficeRework = {
  monthly: number;
  annual: number;
  /** Share of annual revenue, when revenue is given. */
  shareOfRevenue: number | null;
  /** Eight-hour working days lost per month. */
  daysPerMonth: number;
};

export function officeRework(hoursPerMonth: number, hourlyCost: number, annualRevenue?: number | null): OfficeRework | null {
  if (!(hoursPerMonth >= 0) || !(hourlyCost >= 0)) return null;
  const monthly = hoursPerMonth * hourlyCost;
  const annual = monthly * 12;
  return {
    monthly,
    annual,
    shareOfRevenue: annualRevenue && annualRevenue > 0 ? annual / annualRevenue : null,
    daysPerMonth: hoursPerMonth / 8,
  };
}

/**
 * Published rework rates, as a share of project value:
 *  - giri-direct: Get It Right Initiative (UK) — direct cost of avoidable errors ≈ 5 %.
 *  - colombia: Universidad EAN and UNAD — up to 12.4 % in rework alone.
 *  - giri-total: Get It Right Initiative — up to 25 % with indirect costs.
 */
export const REWORK_RATES = [
  { id: "giri-direct", rate: 0.05 },
  { id: "colombia", rate: 0.124 },
  { id: "giri-total", rate: 0.25 },
] as const;

export type ReworkRateId = (typeof REWORK_RATES)[number]["id"];

export function siteRework(projectValue: number): { id: ReworkRateId; rate: number; cost: number }[] | null {
  if (!(projectValue > 0)) return null;
  return REWORK_RATES.map((r) => ({ id: r.id, rate: r.rate, cost: projectValue * r.rate }));
}
