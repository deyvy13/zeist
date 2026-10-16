"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { emptyRow, nextVertexName, parseAngleText, type TableField, type TableRow } from "@/lib/tools/plan-location";
import { parseDecimal } from "@/lib/tools/number";

// -----------------------------------------------------------------------------
// Editable coordinate table for the plan locator: one block per table on the
// plan (the lot, a second area…), one row per vertex. On a phone each row folds
// into a small card. Enter moves down the column (adding a row at the end);
// multi-cell pastes are handed to the parent, which reads them with the plan
// parser. Templates use {placeholders}.
// -----------------------------------------------------------------------------

export type PlanTableLabels = {
  /** {n} */
  title: string;
  /** [one, other] with {n} */
  count: [string, string];
  cols: { name: string; e: string; n: string; length: string; angle: string };
  /** {from} {to} */
  side: string;
  optional: string;
  addRow: string;
  addTable: string;
  /** {name} */
  removeRow: string;
  /** {n} */
  removeTable: string;
  placeholders: { e: string; n: string; angle: string };
};

export type PasteTarget = { table: number; row: number; field: TableField };

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

// Vertex · East · North · distance to the next vertex · interior angle · remove
const DESKTOP_GRID = "sm:grid-cols-[4.75rem_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_2.25rem]";
const CELL =
  "w-full min-w-0 rounded-lg border bg-[color:var(--color-surface)] px-2.5 py-2 text-sm tabular-nums outline-none transition placeholder:text-[color:var(--color-muted)]/55 focus:border-[color:var(--color-mint-500)] focus:ring-2 focus:ring-[color:var(--color-mint-500)]/25";
const FIELDS: TableField[] = ["name", "e", "n", "length", "angle"];

const invalidNumber = (v: string) => v.trim() !== "" && !Number.isFinite(parseDecimal(v));
const invalidAngle = (v: string) => v.trim() !== "" && parseAngleText(v) === null;

export function PlanTable({
  tables,
  onChange,
  onPaste,
  labels,
}: {
  tables: TableRow[][];
  onChange: (next: TableRow[][]) => void;
  /** A paste with several values; return true when it was handled. */
  onPaste: (text: string, at: PasteTarget) => boolean;
  labels: PlanTableLabels;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  // Focus the cell an action asked for once the new row exists.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const el = root.current?.querySelector<HTMLInputElement>(`[data-cell="${pendingFocus.current}"]`);
    pendingFocus.current = null;
    el?.focus();
    el?.select();
  });

  const setRows = (t: number, rows: TableRow[]) => onChange(tables.map((r, i) => (i === t ? rows : r)));
  const setCell = (t: number, r: number, field: TableField, value: string) =>
    setRows(t, tables[t].map((row, i) => (i === r ? { ...row, [field]: value } : row)));

  function addRow(t: number, focusField: TableField = "name") {
    const rows = tables[t];
    const last = rows[rows.length - 1];
    setRows(t, [...rows, emptyRow(last ? nextVertexName(last.name) : "1")]);
    pendingFocus.current = `${t}-${rows.length}-${focusField}`;
  }

  function removeRow(t: number, r: number) {
    const rows = tables[t];
    setRows(t, rows.length > 1 ? rows.filter((_, i) => i !== r) : [emptyRow("1")]);
  }

  function addTable() {
    onChange([...tables, [emptyRow("1")]]);
    pendingFocus.current = `${tables.length}-0-e`;
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, t: number, r: number, field: TableField) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (r + 1 < tables[t].length) {
      const el = root.current?.querySelector<HTMLInputElement>(`[data-cell="${t}-${r + 1}-${field}"]`);
      el?.focus();
      el?.select();
    } else {
      addRow(t, field);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>, at: PasteTarget) {
    const text = e.clipboardData.getData("text/plain");
    if (onPaste(text, at)) e.preventDefault();
  }

  return (
    <div ref={root} className="space-y-4">
      {tables.map((rows, t) => {
        const filled = rows.filter((r) => r.e.trim() && r.n.trim()).length;
        const title = fill(labels.title, { n: t + 1 });
        return (
          <section key={t} aria-label={title} className="overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-hairline)] bg-[color:var(--color-hairline)]/40 px-3 py-2 sm:px-4">
              <p className="text-sm font-semibold">
                {title}
                <span className="font-normal text-[color:var(--color-muted)]"> · {fill(labels.count[filled === 1 ? 0 : 1], { n: filled })}</span>
              </p>
              {tables.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange(tables.filter((_, i) => i !== t))}
                  aria-label={fill(labels.removeTable, { n: t + 1 })}
                  title={fill(labels.removeTable, { n: t + 1 })}
                  className="rounded-lg px-2 py-1 text-lg leading-none text-[color:var(--color-muted)] transition hover:bg-red-500/10 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>

            <div
              aria-hidden
              className={`hidden gap-2 px-4 pb-1 pt-3 text-xs font-semibold text-[color:var(--color-muted)] sm:grid ${DESKTOP_GRID}`}
            >
              <span>{labels.cols.name}</span>
              <span>{labels.cols.e}</span>
              <span>{labels.cols.n}</span>
              <span>
                {labels.cols.length} <span className="font-normal">({labels.optional})</span>
              </span>
              <span>
                {labels.cols.angle} <span className="font-normal">({labels.optional})</span>
              </span>
              <span />
            </div>

            <ol className="divide-y divide-[color:var(--color-hairline)] sm:divide-y-0">
              {rows.map((row, r) => {
                const name = row.name.trim() || String(r + 1);
                const nextRow = rows[r + 1] ?? (rows.length >= 3 ? rows[0] : null);
                const next = nextRow ? nextRow.name.trim() || String(r + 2 > rows.length ? 1 : r + 2) : "";
                const side = next ? fill(labels.side, { from: name, to: next }) : labels.cols.length;
                const cellLabel: Record<TableField, string> = {
                  name: labels.cols.name,
                  e: `${labels.cols.e} · ${name}`,
                  n: `${labels.cols.n} · ${name}`,
                  length: side,
                  angle: `${labels.cols.angle} · ${name}`,
                };
                const invalid: Record<TableField, boolean> = {
                  name: false,
                  e: invalidNumber(row.e),
                  n: invalidNumber(row.n),
                  length: invalidNumber(row.length),
                  angle: invalidAngle(row.angle),
                };
                return (
                  <li key={r} className={`grid grid-cols-2 gap-x-2 gap-y-2.5 px-3 py-3 sm:items-center sm:gap-y-0 sm:px-4 sm:py-1.5 ${DESKTOP_GRID}`}>
                    {FIELDS.map((field) => (
                      <label key={field} className={`block min-w-0 ${field === "name" ? "col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto" : ""}`}>
                        <span aria-hidden className="mb-1 block text-[11px] font-medium text-[color:var(--color-muted)] sm:hidden">
                          {field === "length" ? side : field === "name" ? labels.cols.name : labels.cols[field]}
                          {(field === "length" || field === "angle") && <span className="font-normal"> · {labels.optional}</span>}
                        </span>
                        <input
                          value={row[field]}
                          data-cell={`${t}-${r}-${field}`}
                          onChange={(e) => setCell(t, r, field, e.target.value)}
                          onKeyDown={(e) => onKeyDown(e, t, r, field)}
                          onPaste={(e) => handlePaste(e, { table: t, row: r, field })}
                          aria-label={cellLabel[field]}
                          aria-invalid={invalid[field] || undefined}
                          inputMode={field === "name" || field === "angle" ? "text" : "decimal"}
                          enterKeyHint="next"
                          autoComplete="off"
                          spellCheck={false}
                          placeholder={
                            field === "e"
                              ? labels.placeholders.e
                              : field === "n"
                                ? labels.placeholders.n
                                : field === "angle"
                                  ? labels.placeholders.angle
                                  : field === "length" && next
                                    ? `${name}–${next}`
                                    : ""
                          }
                          className={`${CELL} ${field === "name" ? "font-semibold" : ""} ${
                            invalid[field] ? "border-red-500/70 bg-red-500/5" : "border-[color:var(--color-border)]"
                          }`}
                        />
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => removeRow(t, r)}
                      aria-label={fill(labels.removeRow, { name })}
                      title={fill(labels.removeRow, { name })}
                      className="col-start-2 row-start-1 self-end justify-self-end rounded-lg px-2.5 py-1.5 text-lg leading-none text-[color:var(--color-muted)] transition hover:bg-red-500/10 hover:text-red-600 sm:col-start-auto sm:row-start-auto sm:self-center sm:justify-self-center"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="border-t border-[color:var(--color-hairline)] px-3 py-2 sm:border-t-0 sm:px-4 sm:pb-3">
              <button
                type="button"
                onClick={() => addRow(t)}
                className="rounded-lg px-2 py-1.5 text-sm font-semibold text-[color:var(--color-mint-700)] transition hover:bg-[color:var(--color-mint-500)]/10"
              >
                + {labels.addRow}
              </button>
            </div>
          </section>
        );
      })}

      <button
        type="button"
        onClick={addTable}
        className="w-full rounded-2xl border border-dashed border-[color:var(--color-border)] px-4 py-3 text-sm font-semibold text-[color:var(--color-muted)] transition hover:border-[color:var(--color-mint-500)] hover:text-[color:var(--color-foreground)]"
      >
        + {labels.addTable}
      </button>
    </div>
  );
}
