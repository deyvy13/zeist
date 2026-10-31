"use client";

import { useMemo, useState } from "react";
import { officeRework, siteRework, type ReworkRateId } from "@/lib/tools/rework";
import { NUMBER_STYLES, formatNumber, parseDecimal } from "@/lib/tools/number";

// -----------------------------------------------------------------------------
// Rework cost calculator: the office hours lost to redoing deliverables, and
// what published rework rates mean on the value of a project. Math in
// lib/tools/rework.ts; copy in lib/tools-content/reprocesos.ts.
// -----------------------------------------------------------------------------

export type ReworkLabels = {
  officeTitle: string;
  hours: string;
  hoursHint: string;
  hourlyCost: string;
  hourlyCostHint: string;
  revenue: string;
  revenueHint: string;
  currency: string;
  siteTitle: string;
  projectValue: string;
  results: string;
  monthly: string;
  annual: string;
  share: string;
  daysTitle: string;
  daysSub: string;
  scenarios: string;
  scenarioHead: [string, string, string];
  rates: Record<ReworkRateId, string>;
  invalid: string;
  note: string;
};

const FIELD =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] aria-[invalid=true]:border-red-400";
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";

export function ReworkCalculator({
  labels,
  locale,
  defaults,
}: {
  labels: ReworkLabels;
  locale: "es" | "pt" | "en";
  defaults: { currency: string; hours: string; hourlyCost: string; projectValue: string };
}) {
  const [hours, setHours] = useState(defaults.hours);
  const [cost, setCost] = useState(defaults.hourlyCost);
  const [revenue, setRevenue] = useState("");
  const [currency, setCurrency] = useState(defaults.currency);
  const [project, setProject] = useState(defaults.projectValue);
  const style = NUMBER_STYLES[locale];
  const money = (x: number) => `${currency} ${formatNumber(x, 0, style)}`;

  const office = useMemo(() => {
    const r = parseDecimal(revenue);
    return officeRework(parseDecimal(hours), parseDecimal(cost), Number.isFinite(r) ? r : null);
  }, [hours, cost, revenue]);
  const site = useMemo(() => siteRework(parseDecimal(project)), [project]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ============================ INPUTS ========================== */}
      <div className="surface space-y-5 rounded-3xl p-5 sm:p-6">
        <h3 className="text-base font-semibold">{labels.officeTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={labels.hours} hint={labels.hoursHint} value={hours} onChange={setHours} unit="h" />
          <Field label={labels.hourlyCost} hint={labels.hourlyCostHint} value={cost} onChange={setCost} unit={currency} />
          <Field label={labels.revenue} hint={labels.revenueHint} value={revenue} onChange={setRevenue} unit={currency} optional />
          <label className="block">
            <span className={LABEL}>{labels.currency}</span>
            <input value={currency} onChange={(e) => setCurrency(e.target.value.slice(0, 6))} className={FIELD} />
          </label>
        </div>
        <div className="border-t border-[color:var(--color-hairline)] pt-5">
          <h3 className="text-base font-semibold">{labels.siteTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={labels.projectValue} value={project} onChange={setProject} unit={currency} />
          </div>
        </div>
      </div>

      {/* ============================ RESULTS ========================= */}
      <div aria-live="polite" className="surface rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        {!office ? (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm">{labels.invalid}</p>
        ) : (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <Stat label={labels.annual} value={money(office.annual)} strong />
              <Stat label={labels.monthly} value={money(office.monthly)} />
              <Stat
                label={labels.share}
                value={office.shareOfRevenue === null ? "—" : `${formatNumber(office.shareOfRevenue * 100, 1, style)} %`}
              />
              <Stat label={labels.daysTitle} value={formatNumber(office.daysPerMonth, 1, style)} sub={labels.daysSub} />
            </dl>
          </>
        )}

        {site && (
          <>
            <h4 className="mt-6 text-sm font-semibold">{labels.scenarios}</h4>
            <div className="mt-2 overflow-x-auto rounded-xl border border-[color:var(--color-hairline)]">
              <table className="w-full text-left text-sm tabular-nums">
                <thead className="bg-[color:var(--color-surface)] text-xs">
                  <tr>
                    {labels.scenarioHead.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {site.map((r) => (
                    <tr key={r.id} className="border-t border-[color:var(--color-hairline)]">
                      <td className="px-3 py-2">{labels.rates[r.id]}</td>
                      <td className="px-3 py-2">{formatNumber(r.rate * 100, 1, style)} %</td>
                      <td className="px-3 py-2 font-semibold">{money(r.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <p className="mt-5 text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.note}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  unit,
  hint,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
  optional?: boolean;
}) {
  const invalid = !(optional && value.trim() === "") && !(parseDecimal(value) >= 0);
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="decimal"
          aria-invalid={invalid}
          className={`${FIELD} ${unit ? "pr-14" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-muted)]">
            {unit}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-[color:var(--color-muted)]">{hint}</span>}
    </label>
  );
}

function Stat({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-hairline)] p-4">
      <dt className="text-xs font-medium text-[color:var(--color-muted)]">{label}</dt>
      <dd
        className={`mt-1 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold tabular-nums sm:text-2xl ${
          strong ? "text-[color:var(--color-mint-700)]" : ""
        }`}
      >
        {value}
      </dd>
      {sub && <dd className="mt-0.5 text-sm text-[color:var(--color-muted)]">{sub}</dd>}
    </div>
  );
}
