"use client";

import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// -----------------------------------------------------------------------------
// Verification map for converted points (WGS 84). The point of it: a point in
// the ocean means a wrong zone, hemisphere or swapped columns — caught before
// the file reaches Civil 3D. With `polygon`, the points are drawn as a lot
// boundary with permanent vertex names. Leaflet loads only on the client.
// -----------------------------------------------------------------------------

export type MapPoint = { lat: number; lon: number; label: string };

const MAX_MARKERS = 2000;

export function PointsMap({ points, ariaLabel, polygon = false }: { points: MapPoint[]; ariaLabel: string; polygon?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);

  // A stable key: re-draw only when the points actually change.
  const key = points
    .slice(0, MAX_MARKERS)
    .map((p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)},${p.label}`)
    .join("|") + (polygon ? "|polygon" : "");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !container.current) return;
      if (!map.current) {
        map.current = L.map(container.current, { scrollWheelZoom: false, worldCopyJump: true });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.current);
        layer.current = L.layerGroup().addTo(map.current);
      }
      layer.current!.clearLayers();
      const shown = points.slice(0, MAX_MARKERS);
      if (polygon && shown.length >= 3) {
        L.polygon(shown.map((p) => [p.lat, p.lon] as [number, number]), {
          color: "#00b894",
          weight: 2.5,
          fillColor: "#00FFCE",
          fillOpacity: 0.18,
        }).addTo(layer.current!);
      }
      for (const p of shown) {
        L.circleMarker([p.lat, p.lon], {
          radius: 6,
          color: "#041210",
          weight: 1.5,
          fillColor: "#00FFCE",
          fillOpacity: 0.9,
        })
          .bindTooltip(p.label, polygon ? { permanent: true, direction: "top", offset: [0, -6], className: "zeist-vertex-label" } : {})
          .addTo(layer.current!);
      }
      if (shown.length === 1) map.current.setView([shown[0].lat, shown[0].lon], 16);
      else if (shown.length > 1) map.current.fitBounds(L.latLngBounds(shown.map((p) => [p.lat, p.lon])), { padding: [24, 24], maxZoom: 18 });
    })();
    return () => {
      cancelled = true;
    };
    // `key` captures every change in `points`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(
    () => () => {
      map.current?.remove();
      map.current = null;
    },
    [],
  );

  return (
    <div
      ref={container}
      role="img"
      aria-label={ariaLabel}
      className="relative z-0 h-80 w-full overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-[color:var(--color-surface)]"
    />
  );
}
