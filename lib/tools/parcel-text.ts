// -----------------------------------------------------------------------------
// Boundary descriptions of a parcel, one per market, from the same geometry:
//  - es: "memoria descriptiva" (Peru): linderos por orientación + cuadro de
//    datos técnicos (vértice, lado, distancia, ángulo interno, E, N).
//  - pt: "memorial descritivo" (Brazil): vertex-by-vertex perimeter with
//    azimuths and distances, in the usual georeferencing wording.
//  - en: metes and bounds legal description (US): courses with quadrant
//    bearings and distances, area in square feet and acres.
// Output is structured (for the page, .docx and .dxf) plus plain text.
// -----------------------------------------------------------------------------

import { NUMBER_STYLES, formatNumber } from "./number";
import { boundaryGroups, formatAngle, formatBearing, type Cardinal, type Parcel } from "./parcel";

export type DescLocale = "es" | "pt" | "en";

export type DescCrs =
  | { kind: "utm"; zone: number; south: boolean; datum: string; /** SIRGAS 2000 → Brazilian geodetic system wording */ sgb?: boolean }
  | { kind: "local" }
  | { kind: "measures" };

export type DescriptionInput = {
  locale: DescLocale;
  parcel: Parcel;
  /** Adjoining owner or street per side index. */
  neighbors: string[];
  title?: string;
  crs: DescCrs;
  /** Units of the coordinates. */
  inputUnit: "m" | "ft";
  /** Units for distances and areas. */
  unit: "m" | "ft";
  /** Area on the ground (input units²) when it differs from the grid area. */
  groundArea?: number;
};

export type Run = { text: string; bold?: boolean };
export type ColumnKind = "text" | "distance" | "e" | "n";
export type DescBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; runs: Run[] }
  | { type: "table"; head: string[]; rows: string[][] };

export type Description = {
  title: string;
  blocks: DescBlock[];
  /** `kinds` says what each column holds, for typed exports (Excel). */
  table: { title: string; head: string[]; rows: string[][]; kinds: ColumnKind[] };
  /** "1,624.00 m² (0.1624 ha)" in the locale's style. */
  areaText: string;
  perimeterText: string;
  /** Datum / basis of bearings note. */
  note: string;
  /** Labels for the drawing: "ÁREA", "PERÍMETRO". */
  labels: { area: string; perimeter: string };
  text: string;
};

const FT = 0.3048;
const SQFT = FT * FT;

const CARDINAL_ES: Record<Cardinal, string> = { N: "Por el Norte", E: "Por el Este", S: "Por el Sur", W: "Por el Oeste" };
// Measured lots have no real north: side A-B is the front (urban lot convention).
const RELATIVE_ES: Record<Cardinal, string> = { S: "Por el Frente", E: "Por la Derecha entrando", W: "Por la Izquierda entrando", N: "Por el Fondo" };
const RELATIVE_ORDER: Cardinal[] = ["S", "E", "W", "N"];

function lengthFactor(from: "m" | "ft", to: "m" | "ft"): number {
  if (from === to) return 1;
  return from === "m" ? 1 / FT : FT;
}

function list(items: string[], and: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

export function buildDescription(input: DescriptionInput): Description {
  const { locale, parcel, crs } = input;
  const style = NUMBER_STYLES[locale];
  const fmt = (v: number, d: number) => formatNumber(v, d, style);
  const plain = (v: number, d: number) => v.toFixed(d).replace(".", style.decimal); // coordinates, no grouping
  const k = lengthFactor(input.inputUnit, input.unit);
  const dist = (v: number) => fmt(v * k, 2);
  const names = parcel.vertices.map((v) => v.name);
  const next = (i: number) => (i + 1) % parcel.vertices.length;
  const hasCoords = crs.kind !== "measures";
  const neighbor = (i: number) => (input.neighbors[i] ?? "").trim();

  // Areas in m² and ft² from the input units.
  const areaM2 = input.inputUnit === "m" ? parcel.area : parcel.area * SQFT;
  const groundM2 = input.groundArea === undefined ? undefined : input.inputUnit === "m" ? input.groundArea : input.groundArea * SQFT;

  const blocks: DescBlock[] = [];
  const p = (...runs: Run[]) => blocks.push({ type: "paragraph", runs });
  let title: string;
  let areaText: string;
  let perimeterText: string;
  let note: string;
  let table: Description["table"];

  if (locale === "es") {
    title = "MEMORIA DESCRIPTIVA";
    areaText = `${fmt(areaM2, 2)} m² (${fmt(areaM2 / 10000, 4)} ha)`;
    perimeterText = `${dist(parcel.perimeter)} m`;
    note =
      crs.kind === "utm"
        ? `Coordenadas UTM, datum ${crs.datum}, zona ${crs.zone} ${crs.south ? "Sur" : "Norte"}. Distancias, ángulos y área calculados en el plano de proyección UTM.`
        : crs.kind === "local"
          ? "Coordenadas en un sistema local."
          : "Medidas de campo, sin coordenadas georreferenciadas.";
    const head = ["Vértice", "Lado", "Distancia (m)", "Ángulo interno"];
    table = {
      title: "CUADRO DE DATOS TÉCNICOS",
      head: hasCoords ? [...head, "Este (X)", "Norte (Y)"] : head,
      kinds: hasCoords ? ["text", "text", "distance", "text", "e", "n"] : ["text", "text", "distance", "text"],
      rows: parcel.vertices.map((v, i) => {
        const row = [v.name, `${v.name}-${names[next(i)]}`, dist(parcel.sides[i].length), formatAngle(parcel.angles[i])];
        return hasCoords ? [...row, plain(v.e, 3), plain(v.n, 3)] : row;
      }),
    };

    if (input.title?.trim()) p({ text: "Predio: ", bold: true }, { text: input.title.trim() });
    blocks.push({ type: "heading", text: "Linderos y medidas perimétricas" });
    const groups = boundaryGroups(parcel);
    if (!hasCoords) groups.sort((a, b) => RELATIVE_ORDER.indexOf(a.faces) - RELATIVE_ORDER.indexOf(b.faces));
    for (const g of groups) {
      const who = [...new Set(g.sides.map(neighbor).filter(Boolean))];
      const whoText = who.length ? `colinda con ${who.join(" y con ")}` : "colinda con [completar]";
      let body: string;
      if (g.sides.length === 1) {
        const i = g.sides[0];
        body = `${whoText}, en línea recta de un tramo, entre los vértices ${names[i]} y ${names[next(i)]}, de ${dist(parcel.sides[i].length)} m.`;
      } else {
        const parts = g.sides.map((i) => `${names[i]}-${names[next(i)]} de ${dist(parcel.sides[i].length)} m`);
        const total = g.sides.reduce((s, i) => s + parcel.sides[i].length, 0);
        body = `${whoText}, en línea quebrada de ${g.sides.length} tramos: ${list(parts, "y")}, con un total de ${dist(total)} m.`;
      }
      p({ text: `${(hasCoords ? CARDINAL_ES : RELATIVE_ES)[g.faces]}: `, bold: true }, { text: body });
    }
    blocks.push({ type: "heading", text: "Área y perímetro" });
    p({ text: "Área: ", bold: true }, { text: `${areaText}.` });
    p({ text: "Perímetro: ", bold: true }, { text: `${perimeterText}.` });
    if (groundM2 !== undefined) {
      p({ text: `Área en el plano UTM. En el terreno, corregida por el factor de escala combinado, equivale a ${fmt(groundM2, 2)} m².` });
    }
  } else if (locale === "pt") {
    title = "MEMORIAL DESCRITIVO";
    areaText = `${fmt(areaM2, 2)} m² (${fmt(areaM2 / 10000, 4)} ha)`;
    perimeterText = `${dist(parcel.perimeter)} m`;
    if (crs.kind === "utm") {
      const mc = crs.zone * 6 - 183;
      const mcText = `${Math.abs(mc)}° ${mc < 0 ? "WGr" : "EGr"}`;
      note = crs.sgb
        ? `Todas as coordenadas aqui descritas estão georreferenciadas ao Sistema Geodésico Brasileiro e encontram-se representadas no Sistema UTM, referenciadas ao Meridiano Central ${mcText}, fuso ${crs.zone}, tendo como datum o ${crs.datum}. Todos os azimutes e distâncias, área e perímetro foram calculados no plano de projeção UTM.`
        : `As coordenadas encontram-se representadas no Sistema UTM, referenciadas ao Meridiano Central ${mcText}, fuso ${crs.zone}, tendo como datum o ${crs.datum}. Todos os azimutes e distâncias, área e perímetro foram calculados no plano de projeção UTM.`;
    } else {
      note = crs.kind === "local" ? "As coordenadas estão em um sistema local; os azimutes são referidos ao norte desse sistema." : "Medidas de campo, sem coordenadas georreferenciadas.";
    }
    const head = hasCoords ? ["Vértice", "Lado", "Azimute", "Distância (m)", "Ângulo interno", "E (m)", "N (m)"] : ["Vértice", "Lado", "Distância (m)", "Ângulo interno"];
    table = {
      title: "QUADRO DE COORDENADAS",
      head,
      kinds: hasCoords ? ["text", "text", "text", "distance", "text", "e", "n"] : ["text", "text", "distance", "text"],
      rows: parcel.vertices.map((v, i) => {
        const side = `${v.name}-${names[next(i)]}`;
        return hasCoords
          ? [v.name, side, formatAngle(parcel.sides[i].azimuth), dist(parcel.sides[i].length), formatAngle(parcel.angles[i]), plain(v.e, 3), plain(v.n, 3)]
          : [v.name, side, dist(parcel.sides[i].length), formatAngle(parcel.angles[i])];
      }),
    };

    if (input.title?.trim()) p({ text: "Imóvel: ", bold: true }, { text: input.title.trim() });
    p({ text: "Área: ", bold: true }, { text: `${areaText}. ` }, { text: "Perímetro: ", bold: true }, { text: `${perimeterText}.` });
    blocks.push({ type: "heading", text: "Descrição do perímetro" });
    const coord = (i: number) => (hasCoords ? `, de coordenadas N ${fmt(parcel.vertices[i].n, 3)} m e E ${fmt(parcel.vertices[i].e, 3)} m` : "");
    const parts: string[] = [`Inicia-se a descrição deste perímetro no vértice ${names[0]}${coord(0)}`];
    parcel.sides.forEach((s, i) => {
      const who = neighbor(i) || "[confrontante]";
      const azimuth = hasCoords ? `com azimute de ${formatAngle(s.azimuth)} e ` : "com ";
      const to = next(i);
      const end = to === 0 ? `até o vértice ${names[0]}, ponto inicial da descrição deste perímetro.` : `até o vértice ${names[to]}${coord(to)}`;
      parts.push(`deste, segue confrontando com ${who}, ${azimuth}distância de ${dist(s.length)} m, ${end}`);
    });
    p({ text: parts.join("; ") });
    if (groundM2 !== undefined) {
      p({ text: `Área no plano de projeção UTM. No terreno, corrigida pelo fator de escala combinado, equivale a ${fmt(groundM2, 2)} m².` });
    }
  } else {
    title = "LEGAL DESCRIPTION";
    const feet = input.unit === "ft";
    const areaFt2 = areaM2 / SQFT;
    areaText = feet ? `${fmt(areaFt2, 2)} square feet (${fmt(areaFt2 / 43560, 3)} acres)` : `${fmt(areaM2, 2)} square meters (${fmt(areaM2 / 10000, 4)} hectares)`;
    perimeterText = `${dist(parcel.perimeter)} ${feet ? "feet" : "meters"}`;
    note =
      crs.kind === "utm"
        ? `Bearings, distances and area are grid values referenced to UTM Zone ${crs.zone} ${crs.south ? "South" : "North"}, ${crs.datum}.`
        : crs.kind === "local"
          ? "Bearings are referenced to the north of the local coordinate system."
          : `Basis of bearings: assumed, with course ${names[0]}–${names[1]} taken as due east.`;
    const unitLabel = feet ? "ft" : "m";
    const coordUnit = input.inputUnit;
    table = {
      title: "TABLE OF COURSES",
      kinds: hasCoords ? ["text", "text", "text", "distance", "text", "e", "n"] : ["text", "text", "text", "distance", "text"],
      head: hasCoords
        ? ["Point", "Course", "Bearing", `Distance (${unitLabel})`, "Interior angle", `Easting (${coordUnit})`, `Northing (${coordUnit})`]
        : ["Point", "Course", "Bearing", `Distance (${unitLabel})`, "Interior angle"],
      rows: parcel.vertices.map((v, i) => {
        const row = [v.name, `${v.name}–${names[next(i)]}`, formatBearing(parcel.sides[i].azimuth), dist(parcel.sides[i].length), formatAngle(parcel.angles[i])];
        return hasCoords ? [...row, plain(v.e, 3), plain(v.n, 3)] : row;
      }),
    };

    if (input.title?.trim()) p({ text: input.title.trim(), bold: true });
    const first = parcel.vertices[0];
    p({
      text:
        crs.kind === "utm"
          ? `Beginning at point ${names[0]}, having grid coordinates of Northing ${fmt(first.n, 3)} and Easting ${fmt(first.e, 3)};`
          : crs.kind === "local"
            ? `Beginning at point ${names[0]}, having coordinates of North ${fmt(first.n, 3)} and East ${fmt(first.e, 3)};`
            : `Beginning at point ${names[0]};`,
    });
    parcel.sides.forEach((s, i) => {
      const along = neighbor(i) ? `, along the lands of ${neighbor(i)}` : "";
      const to = next(i);
      const end = to === 0 ? "to the point of beginning," : `to point ${names[to]};`;
      p({ text: `thence ${formatBearing(s.azimuth)}, a distance of ${dist(s.length)} ${feet ? "feet" : "meters"}${along}, ${end}` });
    });
    p({ text: `containing ${areaText}, more or less.` });
    if (groundM2 !== undefined) {
      const ground = feet ? `${fmt(groundM2 / SQFT, 2)} square feet` : `${fmt(groundM2, 2)} square meters`;
      p({ text: `Grid area; at ground level, corrected by the combined scale factor, it is ${ground}.` });
    }
  }

  blocks.push({ type: "paragraph", runs: [{ text: note }] });
  blocks.push({ type: "heading", text: table.title });
  blocks.push({ type: "table", head: table.head, rows: table.rows });

  const text = [
    title,
    "",
    ...blocks.map((b) =>
      b.type === "heading"
        ? `\n${b.text.toUpperCase()}`
        : b.type === "paragraph"
          ? b.runs.map((r) => r.text).join("")
          : [b.head.join("\t"), ...b.rows.map((r) => r.join("\t"))].join("\n"),
    ),
  ].join("\n");

  const labels = locale === "en" ? { area: "AREA", perimeter: "PERIMETER" } : { area: "ÁREA", perimeter: "PERÍMETRO" };
  return { title, blocks, table, areaText, perimeterText, note, labels, text };
}
