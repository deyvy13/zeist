"use client";

import { useEffect, useRef } from "react";
import type { CircleMarker, LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// -----------------------------------------------------------------------------
// Map for the plan locator (WGS 84). Draws several readings of the same plan as
// layers — the converted plan, where it would fall with the datum ignored, or
// one layer per candidate datum — so the difference is seen, not just stated.
// Leaflet loads only on the client.
// -----------------------------------------------------------------------------

export type PlanMapPoint = { lat: number; lon: number; label: string };
export type PlanMapShape = { points: PlanMapPoint[] };
export type PlanMapLayer = {
  id: string;
  color: string;
  /** Dashed outline, no fill: the "wrong" reading. */
  dashed?: boolean;
  /** Permanent vertex names (only for the main layer, to keep the map readable). */
  labels?: boolean;
  shapes: PlanMapShape[];
};

export function PlanMap({ layers, ariaLabel }: { layers: PlanMapLayer[]; ariaLabel: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const group = useRef<LayerGroup | null>(null);
  // Labeled vertices, most important first (see declutter).
  const labeled = useRef<CircleMarker[]>([]);

  // Redraw only when a coordinate, a label or a style changes.
  const key = layers
    .map(
      (l) =>
        `${l.id}:${l.color}:${l.dashed ? 1 : 0}:${l.labels ? 1 : 0}:` +
        l.shapes.map((s) => s.points.map((p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)},${p.label}`).join(";")).join("/"),
    )
    .join("|");

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
        group.current = L.layerGroup().addTo(map.current);
        map.current.on("zoomend", () => requestAnimationFrame(() => declutter(labeled.current)));
      }
      group.current!.clearLayers();
      labeled.current = [];
      const all: [number, number][] = [];
      // Dashed (secondary) layers first, so the main reading stays on top.
      for (const layer of [...layers].sort((a, b) => Number(!!b.dashed) - Number(!!a.dashed))) {
        // Bigger shapes first: their labels win when two collide, and small
        // shapes are drawn on top of big ones.
        const shapes = layer.labels ? [...layer.shapes].sort((a, b) => extent(b) - extent(a)) : layer.shapes;
        for (const shape of shapes) {
          const latlngs = shape.points.map((p) => [p.lat, p.lon] as [number, number]);
          all.push(...latlngs);
          if (latlngs.length >= 3) {
            L.polygon(latlngs, {
              color: layer.color,
              weight: layer.dashed ? 2 : 2.5,
              dashArray: layer.dashed ? "6 6" : undefined,
              fillColor: layer.color,
              fillOpacity: layer.dashed ? 0 : 0.16,
            }).addTo(group.current!);
          } else if (latlngs.length === 2) {
            L.polyline(latlngs, { color: layer.color, weight: 2.5, dashArray: layer.dashed ? "6 6" : undefined }).addTo(group.current!);
          }
          for (const p of shape.points) {
            const marker = L.circleMarker([p.lat, p.lon], {
              radius: layer.dashed ? 4 : 6,
              color: layer.dashed ? layer.color : "#041210",
              weight: 1.5,
              fillColor: layer.color,
              fillOpacity: layer.dashed ? 0.5 : 0.95,
            });
            if (layer.labels) {
              marker.bindTooltip(p.label, { permanent: true, direction: "top", offset: [0, -6], className: "zeist-vertex-label" });
              labeled.current.push(marker);
            }
            marker.addTo(group.current!);
          }
        }
      }
      if (all.length === 1) map.current.setView(all[0], 17);
      else if (all.length > 1) map.current.fitBounds(L.latLngBounds(all), { padding: [28, 28], maxZoom: 18 });
      requestAnimationFrame(() => declutter(labeled.current));
    })();
    return () => {
      cancelled = true;
    };
    // `key` captures every change in `layers`.
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
      className="relative z-0 h-[22rem] w-full overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-[color:var(--color-surface)] sm:h-[26rem]"
    />
  );
}

/** Rough size of a shape in degrees, to rank its labels. */
function extent(shape: PlanMapShape): number {
  const lats = shape.points.map((p) => p.lat);
  const lons = shape.points.map((p) => p.lon);
  return Math.max(...lats) - Math.min(...lats) + Math.max(...lons) - Math.min(...lons);
}

/**
 * Hides each vertex label that would overlap one shown before it, so a small
 * table drawn inside a big lot doesn't pile its names on top of the lot's.
 * Zooming in separates the points and brings the hidden labels back.
 */
function declutter(markers: CircleMarker[]) {
  const shown: DOMRect[] = [];
  for (const marker of markers) {
    const el = marker.getTooltip()?.getElement();
    if (!el) continue;
    el.style.visibility = "";
    const r = el.getBoundingClientRect();
    const clash = shown.some((q) => r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top);
    if (clash) el.style.visibility = "hidden";
    else shown.push(r);
  }
}
