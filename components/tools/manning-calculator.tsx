"use client";

import { useId, useMemo, useState } from "react";
import {
  ROUGHNESS,
  flowAtDepth,
  isValidSection,
  normalDepth,
  type Flow,
  type RoughnessId,
  type Section,
  type SectionKind,
} from "@/lib/tools/manning";
import { NUMBER_STYLES, formatNumber, parseDecimal, type NumberStyle } from "@/lib/tools/number";

// -----------------------------------------------------------------------------
// Manning's equation calculator: partially full circular pipes and open
// channels, solving for discharge or normal depth, in SI or US units. All math
// runs in SI (lib/tools/manning.ts); this component converts at the edges.
// Copy comes from lib/tools-content/manning.ts.
// -----------------------------------------------------------------------------

export type ManningLabels = {
  units: string;
  si: string;
  us: string;
  section: string;
  sections: Record<SectionKind, string>;
  mode: string;
  modeDepth: string;
  modeFlow: string;
  diameter: string;
  width: string;
  bottomWidth: string;
  sideSlope: string;
  sideSlopeHint: string;
  depth: string;
  fill: string;
  flow: string;
  slope: string;
  material: string;
  custom: string;
  n: string;
  roughness: Record<RoughnessId, string>;
  results: string;
  normalDepth: string;
  relDepth: string;
  flowResult: string;
  velocity: string;
  froude: string;
  regimeSub: string;
  regimeCrit: string;
  regimeSuper: string;
  noFreeSurface: string;
  shear: string;
  area: string;
  perimeter: string;
  radius: string;
  topWidth: string;
  fullFlow: string;
  fullVelocity: string;
  capacity: string;
  invalid: string;
  /** {max} */
  surcharged: string;
  note: string;
};

type Units = "si" | "us";
type Mode = "depth" | "flow";
type FlowUnit = "lps" | "m3s" | "cfs" | "gpm";
type SlopeUnit = "pct" | "permil" | "ratio";

type State = {
  units: Units;
  kind: SectionKind;
  mode: Mode;
  diameter: string; // mm | in
  width: string; // rectangular, m | ft
  bottom: string; // trapezoidal, m | ft
  z: string; // trapezoidal side slope
  zTri: string; // triangular side slope
  depth: string; // channels, m | ft
  fill: string; // circular, % of D
  flow: string;
  flowUnit: FlowUnit;
  slope: string;
  slopeUnit: SlopeUnit;
  material: RoughnessId | "custom";
  n: string;
};

const FT = 0.3048;
const IN = 0.0254;
const CFS = 0.028316846592; // m³/s
const GPM = 0.0000630901964; // m³/s
const PSF = 47.880259; // Pa

const FLOW_UNITS: Record<Units, FlowUnit[]> = { si: ["lps", "m3s"], us: ["cfs", "gpm"] };
const FLOW_LABEL: Record<FlowUnit, string> = { lps: "L/s", m3s: "m³/s", cfs: "cfs", gpm: "gpm" };
const FLOW_FACTOR: Record<FlowUnit, number> = { lps: 0.001, m3s: 1, cfs: CFS, gpm: GPM };
const SLOPE_FACTOR: Record<SlopeUnit, number> = { pct: 0.01, permil: 0.001, ratio: 1 };

/**
 * Plain decimal string for an input: no grouping (it would parse back wrong).
 * Trailing decimal zeros are dropped unless `keepZeros` (n reads as 0.010).
 */
function toInput(value: number, digits: number, style: NumberStyle, keepZeros = false): string {
  if (!Number.isFinite(value)) return "";
  let text = value.toFixed(digits);
  if (!keepZeros && text.includes(".")) text = text.replace(/0+$/, "").replace(/\.$/, "");
  return text.replace(".", style.decimal);
}

function initialState(style: NumberStyle): State {
  return {
    units: "si",
    kind: "circular",
    mode: "depth",
    diameter: "200",
    width: toInput(1, 2, style),
    bottom: toInput(1, 2, style),
    z: toInput(1.5, 2, style),
    zTri: "2",
    depth: toInput(0.5, 2, style),
    fill: "50",
    flow: "15",
    flowUnit: "lps",
    slope: "1",
    slopeUnit: "pct",
    material: "pvc",
    n: toInput(0.01, 3, style, true),
  };
}

function convertUnits(s: State, to: Units, style: NumberStyle): State {
  if (s.units === to) return s;
  const toUS = to === "us";
  const len = (v: string) => {
    const x = parseDecimal(v);
    return Number.isFinite(x) ? toInput(toUS ? x / FT : x * FT, 3, style) : v;
  };
  const d = parseDecimal(s.diameter);
  const q = parseDecimal(s.flow) * FLOW_FACTOR[s.flowUnit];
  const flowUnit: FlowUnit = toUS ? "cfs" : "lps";
  return {
    ...s,
    units: to,
    diameter: Number.isFinite(d) ? toInput(toUS ? d / 25.4 : d * 25.4, toUS ? 2 : 0, style) : s.diameter,
    width: len(s.width),
    bottom: len(s.bottom),
    depth: len(s.depth),
    flow: Number.isFinite(q) ? toInput(q / FLOW_FACTOR[flowUnit], 4, style) : s.flow,
    flowUnit,
  };
}

type Outcome =
  | { ok: true; flow: Flow; full: Flow | null; section: Section }
  | { ok: false; error: "invalid"; section: Section | null }
  | { ok: false; error: "surcharged"; maxFlowM3s: number; section: Section };

function solve(s: State): Outcome {
  const len = (v: string) => parseDecimal(v) * (s.units === "us" ? FT : 1);
  let section: Section;
  switch (s.kind) {
    case "circular":
      section = { kind: "circular", diameterM: parseDecimal(s.diameter) * (s.units === "us" ? IN : 0.001) };
      break;
    case "rectangular":
      section = { kind: "rectangular", widthM: len(s.width) };
      break;
    case "trapezoidal":
      section = { kind: "trapezoidal", bottomM: len(s.bottom), sideSlope: parseDecimal(s.z) };
      break;
    case "triangular":
      section = { kind: "triangular", sideSlope: parseDecimal(s.zTri) };
      break;
  }
  const n = parseDecimal(s.n);
  const slope = parseDecimal(s.slope) * SLOPE_FACTOR[s.slopeUnit];
  const okNumbers = isValidSection(section) && n > 0 && n < 1 && slope > 0 && slope < 1;
  if (!okNumbers) return { ok: false, error: "invalid", section: isValidSection(section) ? section : null };

  const full = section.kind === "circular" ? flowAtDepth(section, section.diameterM, n, slope) : null;

  if (s.mode === "depth") {
    const q = parseDecimal(s.flow) * FLOW_FACTOR[s.flowUnit];
    const res = normalDepth(section, q, n, slope);
    if (res.ok) return { ok: true, flow: res.flow, full, section };
    if (res.reason === "surcharged") return { ok: false, error: "surcharged", maxFlowM3s: res.maxFlowM3s, section };
    return { ok: false, error: "invalid", section };
  }

  const depthM =
    section.kind === "circular" ? (parseDecimal(s.fill) / 100) * section.diameterM : len(s.depth);
  const maxOk = section.kind === "circular" ? parseDecimal(s.fill) <= 100 : true;
  if (!(depthM > 0) || !maxOk) return { ok: false, error: "invalid", section };
  return { ok: true, flow: flowAtDepth(section, depthM, n, slope), full, section };
}

// Width lives outside the base so a field can be fixed-width without fighting w-full.
const FIELD_BASE =
  "rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] aria-[invalid=true]:border-red-400";
const FIELD = `w-full ${FIELD_BASE}`;
const LABEL = "mb-1 block text-xs font-medium text-[color:var(--color-muted)]";

export function ManningCalculator({
  labels,
  locale,
}: {
  labels: ManningLabels;
  locale: "es" | "pt" | "en";
}) {
  const style = NUMBER_STYLES[locale];
  const [s, setS] = useState<State>(() => initialState(style));
  const set = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));
  const outcome = useMemo(() => solve(s), [s]);
  const fmt = (value: number, digits: number) => formatNumber(value, digits, style);
  const us = s.units === "us";

  const lengthUnit = us ? "ft" : "m";
  const show = {
    length: (m: number, d = 3) => `${fmt(us ? m / FT : m, d)} ${lengthUnit}`,
    area: (m2: number) => `${fmt(us ? m2 / (FT * FT) : m2, 4)} ${us ? "ft²" : "m²"}`,
    velocity: (ms: number) => `${fmt(us ? ms / FT : ms, 2)} ${us ? "ft/s" : "m/s"}`,
    shear: (pa: number) => (us ? `${fmt(pa / PSF, 3)} lb/ft²` : `${fmt(pa, 2)} Pa`),
    flow: (m3s: number) =>
      us
        ? [`${fmt(m3s / CFS, 3)} cfs`, `${fmt(m3s / GPM, 0)} gpm`]
        : [`${fmt(m3s * 1000, 2)} L/s`, `${fmt(m3s, 4)} m³/s`],
  };

  const regime = (fr: number | null) =>
    fr === null ? labels.noFreeSurface : fr < 0.95 ? labels.regimeSub : fr > 1.05 ? labels.regimeSuper : labels.regimeCrit;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {/* ============================ INPUTS ========================== */}
      <div className="surface space-y-5 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Segmented
            label={labels.section}
            value={s.kind}
            onChange={(kind) => set({ kind })}
            options={(["circular", "rectangular", "trapezoidal", "triangular"] as const).map((k) => ({
              value: k,
              label: labels.sections[k],
            }))}
          />
          <Segmented
            label={labels.units}
            value={s.units}
            onChange={(units) => setS((prev) => convertUnits(prev, units, style))}
            options={[
              { value: "si", label: labels.si },
              { value: "us", label: labels.us },
            ]}
          />
        </div>

        <Segmented
          label={labels.mode}
          value={s.mode}
          onChange={(mode) => set({ mode })}
          options={[
            { value: "depth", label: labels.modeDepth },
            { value: "flow", label: labels.modeFlow },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {s.kind === "circular" && (
            <NumberField label={labels.diameter} unit={us ? "in" : "mm"} value={s.diameter} onChange={(diameter) => set({ diameter })} />
          )}
          {s.kind === "rectangular" && (
            <NumberField label={labels.width} unit={lengthUnit} value={s.width} onChange={(width) => set({ width })} />
          )}
          {s.kind === "trapezoidal" && (
            <>
              <NumberField label={labels.bottomWidth} unit={lengthUnit} value={s.bottom} onChange={(bottom) => set({ bottom })} />
              <NumberField label={labels.sideSlope} unit="H:1V" value={s.z} onChange={(z) => set({ z })} hint={labels.sideSlopeHint} />
            </>
          )}
          {s.kind === "triangular" && (
            <NumberField label={labels.sideSlope} unit="H:1V" value={s.zTri} onChange={(zTri) => set({ zTri })} hint={labels.sideSlopeHint} />
          )}

          {s.mode === "flow" ? (
            s.kind === "circular" ? (
              <NumberField label={labels.fill} unit="% D" value={s.fill} onChange={(fill) => set({ fill })} />
            ) : (
              <NumberField label={labels.depth} unit={lengthUnit} value={s.depth} onChange={(depth) => set({ depth })} />
            )
          ) : (
            <WithUnit
              label={labels.flow}
              value={s.flow}
              onChange={(flow) => set({ flow })}
              unit={s.flowUnit}
              units={FLOW_UNITS[s.units].map((u) => ({ value: u, label: FLOW_LABEL[u] }))}
              onUnit={(u) => {
                // Keep the same discharge when only the unit changes.
                const q = parseDecimal(s.flow) * FLOW_FACTOR[s.flowUnit];
                set({ flowUnit: u, flow: Number.isFinite(q) ? toInput(q / FLOW_FACTOR[u], 4, style) : s.flow });
              }}
            />
          )}

          <WithUnit
            label={labels.slope}
            value={s.slope}
            onChange={(slope) => set({ slope })}
            unit={s.slopeUnit}
            units={[
              { value: "pct", label: "%" },
              { value: "permil", label: "‰" },
              { value: "ratio", label: us ? "ft/ft" : "m/m" },
            ]}
            onUnit={(u) => {
              const v = parseDecimal(s.slope) * SLOPE_FACTOR[s.slopeUnit];
              set({ slopeUnit: u, slope: Number.isFinite(v) ? toInput(v / SLOPE_FACTOR[u], 6, style) : s.slope });
            }}
          />
        </div>

        <div className="grid gap-4 border-t border-[color:var(--color-hairline)] pt-5 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <label className="block">
            <span className={LABEL}>{labels.material}</span>
            <select
              value={s.material}
              onChange={(e) => {
                const id = e.target.value as RoughnessId | "custom";
                const preset = ROUGHNESS.find((r) => r.id === id);
                set({ material: id, n: preset ? toInput(preset.n, 3, style, true) : s.n });
              }}
              className={FIELD}
            >
              {ROUGHNESS.map((r) => (
                <option key={r.id} value={r.id}>
                  {labels.roughness[r.id]} · {toInput(r.n, 3, style, true)}
                </option>
              ))}
              <option value="custom">{labels.custom}</option>
            </select>
          </label>
          <NumberField label={labels.n} value={s.n} onChange={(n) => set({ n, material: "custom" })} />
        </div>
      </div>

      {/* ============================ RESULTS ========================= */}
      <div aria-live="polite" className="surface rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl">{labels.results}</h3>
        <SectionSketch section={outcome.section} depthM={outcome.ok ? outcome.flow.depthM : null} />

        {!outcome.ok ? (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-[color:var(--color-foreground)]/90">
            {outcome.error === "surcharged"
              ? labels.surcharged.replace("{max}", show.flow(outcome.maxFlowM3s).join(" · "))
              : labels.invalid}
          </p>
        ) : (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {s.mode === "depth" ? (
                <Stat
                  label={labels.normalDepth}
                  value={show.length(outcome.flow.depthM)}
                  sub={
                    outcome.full && outcome.section.kind === "circular"
                      ? `${labels.relDepth} ${fmt((outcome.flow.depthM / outcome.section.diameterM) * 100, 1)} %`
                      : undefined
                  }
                  strong
                />
              ) : (
                <Stat label={labels.flowResult} value={show.flow(outcome.flow.flowM3s)[0]} sub={show.flow(outcome.flow.flowM3s)[1]} strong />
              )}
              <Stat label={labels.velocity} value={show.velocity(outcome.flow.velocityMs)} strong />
              <Stat
                label={labels.froude}
                value={outcome.flow.froude === null ? "—" : fmt(outcome.flow.froude, 2)}
                sub={regime(outcome.flow.froude)}
              />
              <Stat label={labels.shear} value={show.shear(outcome.flow.shearPa)} />
            </dl>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[color:var(--color-hairline)] pt-5 text-sm sm:grid-cols-3">
              {s.mode === "depth" && <Pair label={labels.flowResult} value={show.flow(outcome.flow.flowM3s)[0]} />}
              {s.mode === "flow" && <Pair label={labels.normalDepth} value={show.length(outcome.flow.depthM)} />}
              <Pair label={labels.area} value={show.area(outcome.flow.areaM2)} />
              <Pair label={labels.perimeter} value={show.length(outcome.flow.perimeterM)} />
              <Pair label={labels.radius} value={show.length(outcome.flow.radiusM, 4)} />
              <Pair label={labels.topWidth} value={show.length(outcome.flow.topWidthM)} />
              {outcome.full && (
                <>
                  <Pair label={labels.fullFlow} value={show.flow(outcome.full.flowM3s)[0]} />
                  <Pair label={labels.fullVelocity} value={show.velocity(outcome.full.velocityMs)} />
                  <Pair
                    label={labels.capacity}
                    value={`${fmt((outcome.flow.flowM3s / outcome.full.flowM3s) * 100, 1)} %`}
                  />
                </>
              )}
            </dl>
          </>
        )}
        <p className="mt-5 text-xs leading-relaxed text-[color:var(--color-muted)]">{labels.note}</p>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className={LABEL}>{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <label
              key={o.value}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--color-mint-500)] ${
                active
                  ? "border-[color:var(--color-mint-500)] bg-[color:var(--color-mint-500)] text-[color:var(--color-ink-950)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  onChange,
  unit,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
}) {
  const invalid = !(parseDecimal(value) >= 0);
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="decimal"
          aria-invalid={invalid}
          className={`${FIELD} ${unit ? "pr-16" : ""}`}
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

function WithUnit<U extends string>({
  label,
  value,
  onChange,
  unit,
  units,
  onUnit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: U;
  units: { value: U; label: string }[];
  onUnit: (unit: U) => void;
}) {
  const unitId = useId();
  return (
    <div>
      <label className="block">
        <span className={LABEL}>{label}</span>
        <span className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            inputMode="decimal"
            aria-invalid={!(parseDecimal(value) >= 0)}
            className={`${FIELD_BASE} min-w-0 flex-1`}
          />
          <select
            id={unitId}
            aria-label={`${label} (unit)`}
            value={unit}
            onChange={(e) => onUnit(e.target.value as U)}
            className={`${FIELD_BASE} w-24 shrink-0`}
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </span>
      </label>
    </div>
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
      {sub && <dd className="mt-0.5 text-xs text-[color:var(--color-muted)]">{sub}</dd>}
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[color:var(--color-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/** Cross-section schematic with the computed water level. Not to scale for channels. */
function SectionSketch({ section, depthM }: { section: Section | null; depthM: number | null }) {
  if (!section) return null;
  const water = "fill-[color:var(--color-mint-500)]/35";
  const line = "fill-none stroke-[color:var(--color-foreground)]/70";

  if (section.kind === "circular") {
    const r = 46;
    const cx = 100;
    const cy = 60;
    const f = depthM === null ? 0 : Math.min(Math.max(depthM / section.diameterM, 0), 1);
    const level = cy + r - 2 * r * f;
    const half = Math.sqrt(Math.max(r * r - (cy - level) ** 2, 0));
    return (
      <svg viewBox="0 0 200 120" className="mt-4 h-28 w-full" aria-hidden>
        {f >= 0.999 ? (
          <circle cx={cx} cy={cy} r={r} className={water} />
        ) : f > 0.001 ? (
          <path
            d={`M ${cx - half} ${level} A ${r} ${r} 0 ${f > 0.5 ? 1 : 0} 0 ${cx + half} ${level} Z`}
            className={water}
          />
        ) : null}
        <circle cx={cx} cy={cy} r={r} className={line} strokeWidth={2} />
      </svg>
    );
  }

  const b = section.kind === "rectangular" ? section.widthM : section.kind === "trapezoidal" ? section.bottomM : 0;
  const z = section.kind === "rectangular" ? 0 : section.sideSlope;
  const y = depthM ?? 1;
  const wallH = y * 1.5;
  const topAt = (h: number) => b + 2 * z * h;
  const scale = Math.min(84 / wallH, 168 / Math.max(topAt(wallH), 1e-9));
  const base = 106;
  const cx = 100;
  const pt = (x: number, h: number) => `${(cx + x * scale).toFixed(2)},${(base - h * scale).toFixed(2)}`;
  const outline = [pt(-topAt(wallH) / 2, wallH), pt(-b / 2, 0), pt(b / 2, 0), pt(topAt(wallH) / 2, wallH)].join(" ");
  const waterPoly =
    depthM === null ? null : [pt(-topAt(y) / 2, y), pt(-b / 2, 0), pt(b / 2, 0), pt(topAt(y) / 2, y)].join(" ");
  return (
    <svg viewBox="0 0 200 120" className="mt-4 h-28 w-full" aria-hidden>
      {waterPoly && <polygon points={waterPoly} className={water} />}
      <polyline points={outline} className={line} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}
