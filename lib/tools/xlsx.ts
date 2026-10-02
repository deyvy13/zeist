// -----------------------------------------------------------------------------
// Minimal .xlsx writer — no dependency. A real workbook beats CSV for the
// calculators' exports: numbers stay numbers, so Excel shows them with the
// user's own decimal separator (Peru, Spain and Brazil disagree on it).
//
// Writes SpreadsheetML with inline strings and a small style sheet, packed in
// an uncompressed ("stored") ZIP (./zip). No "@/" aliases: the tests import
// these modules directly with Node.
// -----------------------------------------------------------------------------

import { zipStored } from "./zip";

export type CellStyle = "header" | "dec2" | "dec3" | "int";
export type CellValue = string | number | null | undefined;
export type Cell = CellValue | { value: CellValue; style?: CellStyle };
export type Sheet = { name: string; rows: Cell[][]; widths?: number[] };

const STYLE_INDEX: Record<CellStyle, number> = { header: 1, dec2: 2, dec3: 3, int: 4 };

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships";

function escapeXml(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function columnName(index: number): string {
  let name = "";
  for (let i = index + 1; i > 0; i = Math.floor((i - 1) / 26)) {
    name = String.fromCharCode(65 + ((i - 1) % 26)) + name;
  }
  return name;
}

function cellXml(cell: Cell, ref: string): string {
  const { value, style } =
    cell !== null && typeof cell === "object" ? cell : { value: cell, style: undefined };
  const s = style ? ` s="${STYLE_INDEX[style]}"` : "";
  if (typeof value === "number") {
    return Number.isFinite(value) ? `<c r="${ref}"${s}><v>${value}</v></c>` : "";
  }
  if (value === null || value === undefined || value === "") return "";
  return `<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function worksheetXml(sheet: Sheet): string {
  const cols = sheet.widths?.length
    ? `<cols>${sheet.widths
        .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
        .join("")}</cols>`
    : "";
  const rows = sheet.rows
    .map((row, r) => {
      const cells = row.map((cell, c) => cellXml(cell, `${columnName(c)}${r + 1}`)).join("");
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join("");
  return `${XML_HEAD}<worksheet xmlns="${NS_MAIN}">${cols}<sheetData>${rows}</sheetData></worksheet>`;
}

const STYLES_XML =
  `${XML_HEAD}<styleSheet xmlns="${NS_MAIN}">` +
  `<numFmts count="1"><numFmt numFmtId="164" formatCode="0.000"/></numFmts>` +
  `<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font>` +
  `<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>` +
  `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>` +
  `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="5">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>` +
  `<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

/** Excel sheet names: ≤ 31 chars, none of []:*?/\ and unique in the workbook. */
function sheetNames(sheets: Sheet[]): string[] {
  const used = new Set<string>();
  return sheets.map((sheet, i) => {
    const base =
      sheet.name.replace(/[[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 31) || `Hoja${i + 1}`;
    let name = base;
    for (let k = 2; used.has(name.toLowerCase()); k++) name = `${base.slice(0, 28)} ${k}`;
    used.add(name.toLowerCase());
    return name;
  });
}

export function buildXlsx(sheets: Sheet[]): Uint8Array {
  const names = sheetNames(sheets);
  const count = sheets.length;

  const contentTypes =
    `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    names
      .map(
        (_, i) =>
          `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
      )
      .join("") +
    `</Types>`;

  const rootRels =
    `${XML_HEAD}<Relationships xmlns="${NS_PKG_REL}">` +
    `<Relationship Id="rId1" Type="${NS_REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const workbook =
    `${XML_HEAD}<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}"><sheets>` +
    names.map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("") +
    `</sheets></workbook>`;

  const workbookRels =
    `${XML_HEAD}<Relationships xmlns="${NS_PKG_REL}">` +
    names
      .map((_, i) => `<Relationship Id="rId${i + 1}" Type="${NS_REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
      .join("") +
    `<Relationship Id="rId${count + 1}" Type="${NS_REL}/styles" Target="styles.xml"/></Relationships>`;

  const encoder = new TextEncoder();
  const files: [string, Uint8Array][] = [
    ["[Content_Types].xml", encoder.encode(contentTypes)],
    ["_rels/.rels", encoder.encode(rootRels)],
    ["xl/workbook.xml", encoder.encode(workbook)],
    ["xl/_rels/workbook.xml.rels", encoder.encode(workbookRels)],
    ["xl/styles.xml", encoder.encode(STYLES_XML)],
    ...sheets.map(
      (sheet, i) => [`xl/worksheets/sheet${i + 1}.xml`, encoder.encode(worksheetXml(sheet))] as [string, Uint8Array],
    ),
  ];
  return zipStored(files);
}
