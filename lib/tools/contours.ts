// -----------------------------------------------------------------------------
// Contour lines from an elevation grid: marching squares with segment linking
// (closed and open lines), Douglas-Peucker simplification, polyline clipping,
// plus the Web Mercator / Terrarium helpers to build the grid from public
// elevation tiles (AWS Terrain Tiles: elevation = R·256 + G + B/256 − 32768).
// No "@/" aliases here: the tests import these modules directly with Node.
// -----------------------------------------------------------------------------

export type Pt = { x: number; y: number };
export type Isoline = { level: number; points: Pt[]; closed: boolean };

export const TERRAIN_TILES = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
export const TILE_SIZE = 256;

export function terrariumElevation(r: number, g: number, b: number): number {
  return r * 256 + g + b / 256 - 32768;
}

/** Global Web Mercator pixel coordinates at zoom z. */
export function lonLatToPixel(lon: number, lat: number, z: number): Pt {
  const size = TILE_SIZE * 2 ** z;
  const sin = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * size,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size,
  };
}

export function pixelToLonLat(x: number, y: number, z: number): { lon: number; lat: number } {
  const size = TILE_SIZE * 2 ** z;
  const n = Math.PI - (2 * Math.PI * y) / size;
  return { lon: (x / size) * 360 - 180, lat: (180 / Math.PI) * Math.atan(Math.sinh(n)) };
}

/** Ground size of one pixel at a latitude, in metres (equatorial radius 6378137 m). */
export function metersPerPixel(lat: number, z: number): number {
  return (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * 6378137) / (TILE_SIZE * 2 ** z);
}

/**
 * Elevation grid for a pixel window [px0, px0+width) × [py0, py0+height) at
 * zoom z, from decoded RGBA tiles keyed "x/y". Missing tiles give NaN.
 */
export function assembleGrid(tiles: Map<string, Uint8ClampedArray>, px0: number, py0: number, width: number, height: number): Float32Array {
  const values = new Float32Array(width * height);
  for (let gy = 0; gy < height; gy++) {
    const Y = py0 + gy;
    const ty = Math.floor(Y / TILE_SIZE);
    const ly = Y - ty * TILE_SIZE;
    for (let gx = 0; gx < width; gx++) {
      const X = px0 + gx;
      const tx = Math.floor(X / TILE_SIZE);
      const lx = X - tx * TILE_SIZE;
      const tile = tiles.get(`${tx}/${ty}`);
      if (!tile) {
        values[gy * width + gx] = NaN;
        continue;
      }
      const o = (ly * TILE_SIZE + lx) * 4;
      values[gy * width + gx] = terrariumElevation(tile[o], tile[o + 1], tile[o + 2]);
    }
  }
  return values;
}

export function gridStats(values: Float32Array | number[]): { min: number; max: number; mean: number } {
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let n = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
    n++;
  }
  return { min, max, mean: n ? sum / n : NaN };
}

/** Bilinear sample at fractional grid coordinates (sample (i, j) sits at x = i, y = j). */
export function sampleGrid(values: Float32Array | number[], width: number, height: number, x: number, y: number): number {
  if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return NaN;
  const i = Math.min(Math.floor(x), width - 2);
  const j = Math.min(Math.floor(y), height - 2);
  const fx = x - i;
  const fy = y - j;
  const v00 = values[j * width + i];
  const v10 = values[j * width + i + 1];
  const v01 = values[(j + 1) * width + i];
  const v11 = values[(j + 1) * width + i + 1];
  return v00 * (1 - fx) * (1 - fy) + v10 * fx * (1 - fy) + v01 * (1 - fx) * fy + v11 * fx * fy;
}

/** Contour levels: multiples of `interval` strictly inside (min, max). */
export function contourLevels(min: number, max: number, interval: number, base = 0): number[] {
  if (!(interval > 0) || !(max > min)) return [];
  const levels: number[] = [];
  const start = Math.ceil((min - base) / interval);
  for (let k = start; base + k * interval < max; k++) {
    const level = Math.round((base + k * interval) * 1e6) / 1e6;
    if (level > min) levels.push(level);
    if (levels.length > 2000) break;
  }
  return levels;
}

/** About 20 contours over the relief, on a round interval (≥ 1 m). */
export function suggestInterval(relief: number): number {
  const options = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  const target = relief / 20;
  return options.find((o) => o >= target) ?? 500;
}

export function isMajor(level: number, interval: number, every: number): boolean {
  const step = interval * every;
  const r = Math.abs(level / step - Math.round(level / step));
  return r < 1e-6;
}

/**
 * Isolines at `level` by marching squares. Corners with value >= level count
 * as "above"; saddles are resolved with the cell's mean. Segments are linked
 * through the cell edges they cross, so every line is continuous; lines that
 * reach the grid border stay open, the rest close. Cells with NaN are skipped.
 */
export function isolines(values: Float32Array | number[], width: number, height: number, level: number): Isoline[] {
  // Edge ids: horizontal edge (i,j)-(i+1,j) → 2·(j·width + i); vertical (i,j)-(i,j+1) → 2·(j·width + i) + 1.
  const points = new Map<number, Pt>();
  const links = new Map<number, number[]>();
  const value = (i: number, j: number) => values[j * width + i];

  const crossing = (id: number): Pt => {
    let p = points.get(id);
    if (p) return p;
    const cell = id >> 1;
    const i = cell % width;
    const j = Math.floor(cell / width);
    if ((id & 1) === 0) {
      const a = value(i, j);
      const b = value(i + 1, j);
      p = { x: i + (level - a) / (b - a), y: j };
    } else {
      const a = value(i, j);
      const b = value(i, j + 1);
      p = { x: i, y: j + (level - a) / (b - a) };
    }
    points.set(id, p);
    return p;
  };
  const link = (a: number, b: number) => {
    crossing(a);
    crossing(b);
    (links.get(a) ?? links.set(a, []).get(a)!).push(b);
    (links.get(b) ?? links.set(b, []).get(b)!).push(a);
  };

  for (let j = 0; j < height - 1; j++) {
    for (let i = 0; i < width - 1; i++) {
      const tl = value(i, j);
      const tr = value(i + 1, j);
      const br = value(i + 1, j + 1);
      const bl = value(i, j + 1);
      if (!(Number.isFinite(tl) && Number.isFinite(tr) && Number.isFinite(br) && Number.isFinite(bl))) continue;
      const code = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
      if (code === 0 || code === 15) continue;
      const T = 2 * (j * width + i);
      const B = 2 * ((j + 1) * width + i);
      const L = 2 * (j * width + i) + 1;
      const R = 2 * (j * width + i + 1) + 1;
      const centerAbove = (tl + tr + br + bl) / 4 >= level;
      switch (code) {
        case 1: case 14: link(L, B); break;
        case 2: case 13: link(B, R); break;
        case 3: case 12: link(L, R); break;
        case 4: case 11: link(T, R); break;
        case 6: case 9: link(T, B); break;
        case 7: case 8: link(T, L); break;
        case 5: // tr + bl above
          if (centerAbove) { link(T, L); link(B, R); } else { link(T, R); link(L, B); }
          break;
        case 10: // tl + br above
          if (centerAbove) { link(T, R); link(L, B); } else { link(T, L); link(B, R); }
          break;
      }
    }
  }

  const visited = new Set<string>();
  const key = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);
  const walk = (start: number): number[] => {
    const chain = [start];
    let prev = -1;
    let current = start;
    for (;;) {
      const next = (links.get(current) ?? []).find((n) => n !== prev && !visited.has(key(current, n)));
      if (next === undefined) break;
      visited.add(key(current, next));
      chain.push(next);
      prev = current;
      current = next;
      if (current === start) break;
    }
    return chain;
  };

  const lines: Isoline[] = [];
  // Open lines first: they start at border crossings (a single link).
  for (const [id, ns] of links) {
    if (ns.length === 1 && !visited.has(key(id, ns[0]))) {
      const chain = walk(id);
      if (chain.length > 1) lines.push({ level, points: chain.map((c) => points.get(c)!), closed: false });
    }
  }
  for (const [id, ns] of links) {
    for (const n of ns) {
      if (visited.has(key(id, n))) continue;
      const chain = walk(id);
      if (chain.length > 2) {
        const closed = chain[0] === chain[chain.length - 1];
        lines.push({ level, points: (closed ? chain.slice(0, -1) : chain).map((c) => points.get(c)!), closed });
      }
    }
  }
  return lines;
}

/** Douglas-Peucker simplification (iterative). Closed rings keep at least 4 points. */
export function simplify(points: Pt[], tolerance: number, closed = false): Pt[] {
  if (points.length <= 2 || tolerance <= 0) return points;
  const pts = closed ? [...points, points[0]] : points;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  const tol2 = tolerance * tolerance;
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let maxD = -1;
    let index = -1;
    const ax = pts[a].x;
    const ay = pts[a].y;
    const dx = pts[b].x - ax;
    const dy = pts[b].y - ay;
    const len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      let t = len2 ? ((pts[i].x - ax) * dx + (pts[i].y - ay) * dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const ex = pts[i].x - (ax + t * dx);
      const ey = pts[i].y - (ay + t * dy);
      const d = ex * ex + ey * ey;
      if (d > maxD) {
        maxD = d;
        index = i;
      }
    }
    if (maxD > tol2 && index > 0) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  const out = pts.filter((_, i) => keep[i]);
  if (closed) {
    out.pop();
    if (out.length < 4) return points.length >= 4 ? [points[0], points[Math.floor(points.length / 4)], points[Math.floor(points.length / 2)], points[Math.floor((3 * points.length) / 4)]] : points;
  }
  return out;
}

/** Clips a polyline to an axis-aligned rectangle; returns the inside pieces. */
export function clipPolyline(points: Pt[], rect: { minX: number; minY: number; maxX: number; maxY: number }, closed = false): Pt[][] {
  const pts = closed && points.length > 2 ? [...points, points[0]] : points;
  const inside = (p: Pt) => p.x >= rect.minX && p.x <= rect.maxX && p.y >= rect.minY && p.y <= rect.maxY;
  // Liang-Barsky segment clip.
  const clipSegment = (a: Pt, b: Pt): [Pt, Pt] | null => {
    let t0 = 0;
    let t1 = 1;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const checks: [number, number][] = [
      [-dx, a.x - rect.minX],
      [dx, rect.maxX - a.x],
      [-dy, a.y - rect.minY],
      [dy, rect.maxY - a.y],
    ];
    for (const [p, q] of checks) {
      if (p === 0) {
        if (q < 0) return null;
      } else {
        const r = q / p;
        if (p < 0) {
          if (r > t1) return null;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) return null;
          if (r < t1) t1 = r;
        }
      }
    }
    return [
      { x: a.x + t0 * dx, y: a.y + t0 * dy },
      { x: a.x + t1 * dx, y: a.y + t1 * dy },
    ];
  };

  if (pts.every(inside)) return [closed ? points : pts];
  const pieces: Pt[][] = [];
  let current: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = clipSegment(pts[i], pts[i + 1]);
    if (!seg) {
      if (current.length > 1) pieces.push(current);
      current = [];
      continue;
    }
    const [a, b] = seg;
    if (current.length === 0) current.push(a);
    else {
      const last = current[current.length - 1];
      if (Math.abs(last.x - a.x) > 1e-9 || Math.abs(last.y - a.y) > 1e-9) {
        if (current.length > 1) pieces.push(current);
        current = [a];
      }
    }
    current.push(b);
    if (!inside(pts[i + 1])) {
      if (current.length > 1) pieces.push(current);
      current = [];
    }
  }
  if (current.length > 1) pieces.push(current);
  // A closed ring cut open: join the last piece with the first if they meet.
  if (closed && pieces.length > 1) {
    const first = pieces[0];
    const last = pieces[pieces.length - 1];
    const a = last[last.length - 1];
    const b = first[0];
    if (Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9) {
      pieces[0] = [...last, ...first.slice(1)];
      pieces.pop();
    }
  }
  return pieces;
}
