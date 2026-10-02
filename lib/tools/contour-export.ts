// -----------------------------------------------------------------------------
// Contour exports: DXF (3D polylines at their elevation, in UTM, minor and
// major on separate layers, labels on the majors), PNEZD points to build the
// surface in Civil 3D, and KML for Google Earth.
// -----------------------------------------------------------------------------

import { DxfWriter } from "./dxf";

export type ContourLine = { level: number; major: boolean; points: { e: number; n: number }[]; closed: boolean };
export type Rect = { minE: number; minN: number; maxE: number; maxN: number };

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function contoursToDxf(
  lines: ContourLine[],
  opts: { rect: Rect; layers: { minor: string; major: string; labels: string; boundary: string }; comment: string; decimals?: number },
): Uint8Array {
  const { rect, layers } = opts;
  const size = Math.max(rect.maxE - rect.minE, rect.maxN - rect.minN);
  const h = Math.max(0.5, Math.round((size / 220) * 2) / 2);
  const dxf = new DxfWriter().layer(layers.minor, 8).layer(layers.major, 1).layer(layers.labels, 7).layer(layers.boundary, 3);
  for (const line of opts.comment.split("\n")) dxf.comment(line);
  dxf.polyline(
    [
      { x: rect.minE, y: rect.minN },
      { x: rect.maxE, y: rect.minN },
      { x: rect.maxE, y: rect.maxN },
      { x: rect.minE, y: rect.maxN },
    ],
    { layer: layers.boundary, closed: true },
  );
  for (const line of lines) {
    if (line.points.length < 2) continue;
    dxf.polyline(
      line.points.map((p) => ({ x: p.e, y: p.n, z: line.level })),
      { layer: line.major ? layers.major : layers.minor, closed: line.closed, threeD: true },
    );
    // One label per major line, mid-way along it, if the line is long enough to hold it.
    if (line.major && line.points.length >= 4) {
      let length = 0;
      for (let i = 1; i < line.points.length; i++) length += Math.hypot(line.points[i].e - line.points[i - 1].e, line.points[i].n - line.points[i - 1].n);
      if (length < 12 * h) continue;
      const mid = Math.floor(line.points.length / 2);
      const a = line.points[mid - 1];
      const b = line.points[mid];
      let angle = (Math.atan2(b.n - a.n, b.e - a.e) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle <= -90) angle += 180;
      dxf.text({ x: (a.e + b.e) / 2, y: (a.n + b.n) / 2 }, h, String(Number(line.level.toFixed(opts.decimals ?? 2))), {
        layer: layers.labels,
        rotation: angle,
        align: "center",
        valign: "middle",
      });
    }
  }
  return dxf.toBytes();
}

/** Civil 3D "PNEZD (comma delimited)": point, northing, easting, elevation, description. */
export function pointsToPnezd(points: { e: number; n: number; z: number }[], description: string): string {
  return points.map((p, i) => `${i + 1},${p.n.toFixed(3)},${p.e.toFixed(3)},${p.z.toFixed(3)},${description}`).join("\r\n") + "\r\n";
}

/** Google Earth KML; lines are clamped to the terrain. */
export function contoursToKml(lines: { level: number; major: boolean; latlon: { lat: number; lon: number }[] }[], name: string): string {
  const placemarks = lines
    .filter((l) => l.latlon.length > 1)
    .map(
      (l) =>
        `<Placemark><name>${l.level}</name><styleUrl>#${l.major ? "major" : "minor"}</styleUrl><LineString><tessellate>1</tessellate><coordinates>${l.latlon
          .map((p) => `${p.lon.toFixed(7)},${p.lat.toFixed(7)},0`)
          .join(" ")}</coordinates></LineString></Placemark>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${xml(name)}</name>\n` +
    `<Style id="major"><LineStyle><color>ff2a3fd6</color><width>2.2</width></LineStyle></Style>\n` +
    `<Style id="minor"><LineStyle><color>ff6e6e6e</color><width>1</width></LineStyle></Style>\n` +
    `${placemarks}\n</Document></kml>\n`
  );
}
