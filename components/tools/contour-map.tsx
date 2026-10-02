"use client";

import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap, Rectangle } from "leaflet";
import "leaflet/dist/leaflet.css";

// -----------------------------------------------------------------------------
// Map for the contour generator: the selection square follows the map centre
// (pan to place it), and generated contours are drawn on top. Client only.
// -----------------------------------------------------------------------------

export type ContourOverlay = { major: boolean; latlon: [number, number][] }[];

type Props = {
  center: { lat: number; lon: number };
  /** Changing `seq` re-centres the map on `center` (e.g. "go to coordinates"). */
  seq: number;
  sizeMeters: number;
  lines: ContourOverlay;
  onMove: (center: { lat: number; lon: number }) => void;
  ariaLabel: string;
};

function squareBounds(lat: number, lon: number, size: number): [[number, number], [number, number]] {
  const half = size / 2;
  const dLat = half / 111320;
  const dLon = half / (111320 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat - dLat, lon - dLon],
    [lat + dLat, lon + dLon],
  ];
}

export function ContourMap({ center, seq, sizeMeters, lines, onMove, ariaLabel }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const square = useRef<Rectangle | null>(null);
  const overlay = useRef<LayerGroup | null>(null);
  const size = useRef(sizeMeters);
  const move = useRef(onMove);
  const latest = useRef({ center, lines });

  useEffect(() => {
    move.current = onMove;
    latest.current = { center, lines };
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !container.current || map.current) return;
      const { center: c } = latest.current;
      const m = L.map(container.current, { scrollWheelZoom: false, worldCopyJump: true }).setView([c.lat, c.lon], 14);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);
      square.current = L.rectangle(squareBounds(c.lat, c.lon, size.current), { color: "#00b894", weight: 2, fillOpacity: 0.06, dashArray: "6 6", interactive: false }).addTo(m);
      overlay.current = L.layerGroup().addTo(m);
      const sync = () => {
        const p = m.getCenter();
        square.current?.setBounds(squareBounds(p.lat, p.lng, size.current));
      };
      m.on("move", sync);
      m.on("moveend", () => {
        const p = m.getCenter();
        move.current({ lat: p.lat, lon: p.lng });
      });
      map.current = m;
      drawLines(L, latest.current.lines);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  function drawLines(L: typeof import("leaflet"), data: ContourOverlay) {
    if (!overlay.current) return;
    overlay.current.clearLayers();
    for (const line of data) {
      L.polyline(line.latlon, { color: line.major ? "#d63f2a" : "#6e6e6e", weight: line.major ? 2 : 1, opacity: 0.9, interactive: false }).addTo(overlay.current);
    }
  }

  // Re-centre on request.
  useEffect(() => {
    if (!map.current || seq === 0) return;
    map.current.setView([center.lat, center.lon], map.current.getZoom());
    // `center` is read only when `seq` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq]);

  // Size of the selection square.
  useEffect(() => {
    size.current = sizeMeters;
    if (!map.current) return;
    const p = map.current.getCenter();
    square.current?.setBounds(squareBounds(p.lat, p.lng, sizeMeters));
    map.current.fitBounds(squareBounds(p.lat, p.lng, sizeMeters * 1.4));
  }, [sizeMeters]);

  // Contours.
  useEffect(() => {
    (async () => {
      if (!map.current) return;
      const L = (await import("leaflet")).default;
      drawLines(L, lines);
    })();
  }, [lines]);

  return (
    <div className="relative">
      <div ref={container} role="img" aria-label={ariaLabel} className="relative z-0 h-[26rem] w-full overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-[color:var(--color-surface)]" />
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[400] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--color-mint-600)] bg-white/70" />
    </div>
  );
}
