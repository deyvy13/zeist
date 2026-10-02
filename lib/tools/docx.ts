// -----------------------------------------------------------------------------
// Minimal .docx writer — headings, paragraphs with bold runs, and bordered
// tables. Enough for a "memoria descriptiva" the user opens and edits in
// Word. Direct formatting only (no style part), packed with ./zip.
// No "@/" aliases here: the tests import these modules directly with Node.
// -----------------------------------------------------------------------------

import { zipStored } from "./zip";

export type Run = { text: string; bold?: boolean };
export type DocBlock =
  | { type: "heading"; text: string; level?: 1 | 2 }
  | { type: "paragraph"; runs: Run[] | string; align?: "left" | "center" | "justify" }
  | { type: "table"; rows: string[][]; header?: boolean; align?: ("left" | "center" | "right")[] };

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

const esc = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function run(r: Run, size?: number): string {
  const props = [r.bold ? "<w:b/>" : "", size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : ""].join("");
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${esc(r.text)}</w:t></w:r>`;
}

function paragraph(runs: Run[], opts: { align?: string; size?: number; spaceAfter?: number; keepNext?: boolean } = {}): string {
  const ppr = [
    opts.keepNext ? "<w:keepNext/>" : "",
    `<w:spacing w:after="${opts.spaceAfter ?? 120}"/>`,
    opts.align ? `<w:jc w:val="${opts.align === "justify" ? "both" : opts.align}"/>` : "",
  ].join("");
  return `<w:p><w:pPr>${ppr}</w:pPr>${runs.map((r) => run(r, opts.size)).join("")}</w:p>`;
}

function table(block: Extract<DocBlock, { type: "table" }>): string {
  const border = '<w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="808080"/>';
  const rows = block.rows
    .map((cells, r) => {
      const isHeader = block.header && r === 0;
      const tcs = cells
        .map((text, c) => {
          const align = block.align?.[c] ?? "left";
          const shade = isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="E8F5F2"/>' : "";
          return `<w:tc><w:tcPr>${shade}</w:tcPr>${paragraph([{ text, bold: isHeader }], { align, size: 18, spaceAfter: 0 })}</w:tc>`;
        })
        .join("");
      return `<w:tr>${isHeader ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${tcs}</w:tr>`;
    })
    .join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${border}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr>${rows}</w:tbl>${paragraph([{ text: "" }], { spaceAfter: 0 })}`;
}

export function buildDocx(blocks: DocBlock[], opts: { page?: "A4" | "Letter"; font?: string } = {}): Uint8Array {
  const font = opts.font ?? "Arial";
  const body = blocks
    .map((b) => {
      if (b.type === "heading") return paragraph([{ text: b.text, bold: true }], { size: b.level === 2 ? 24 : 28, spaceAfter: 160, keepNext: true });
      if (b.type === "paragraph") return paragraph(typeof b.runs === "string" ? [{ text: b.runs }] : b.runs, { align: b.align });
      return table(b);
    })
    .join("");
  const [w, h] = opts.page === "Letter" ? [12240, 15840] : [11906, 16838];
  const sect = `<w:sectPr><w:pgSz w:w="${w}" w:h="${h}"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>`;
  const document = `${XML_HEAD}<w:document xmlns:w="${W}"><w:body>${body}${sect}</w:body></w:document>`;

  const styles =
    `${XML_HEAD}<w:styles xmlns:w="${W}"><w:docDefaults><w:rPrDefault><w:rPr>` +
    `<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="22"/><w:szCs w:val="22"/>` +
    `</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`;

  const contentTypes =
    `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
    `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
    `</Types>`;
  const rels =
    `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const docRels =
    `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

  const enc = new TextEncoder();
  return zipStored([
    ["[Content_Types].xml", enc.encode(contentTypes)],
    ["_rels/.rels", enc.encode(rels)],
    ["word/document.xml", enc.encode(document)],
    ["word/styles.xml", enc.encode(styles)],
    ["word/_rels/document.xml.rels", enc.encode(docRels)],
  ]);
}
