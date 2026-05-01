import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as turf from "@turf/turf";
import { COLOMBIA_VIEW_BOUNDS } from "../lib/geo/colombiaSvgPath.generated.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const query = `
[out:json][timeout:90];
relation["ISO3166-2"="CO-MET"]["boundary"="administrative"]["type"="boundary"];
out geom;
`;

function closeCoord(a, b, eps = 4e-4) {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

/** Empalme entre ways OSM (redondeo / gaps pequeños entre nodos). */
function snapOuter(a, b, eps = 0.0012) {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

const VILLAVICENCIO = turf.point([-73.651, 4.141]);

function project(lng, lat) {
  const { minLng, maxLng, minLat, maxLat, viewW, viewH, pad } = COLOMBIA_VIEW_BOUNDS;
  const w = viewW - pad * 2;
  const h = viewH - pad * 2;
  const x = pad + ((lng - minLng) / (maxLng - minLng)) * w;
  const y = pad + ((maxLat - lat) / (maxLat - minLat)) * h;
  return [x, y];
}

/** Anillo abierto (sin repetir el primer punto al final): mide las n aristas del polígono. */
function maxSvgPolygonSegPx(ringOpen) {
  const n = ringOpen.length;
  if (n < 3) return 0;
  let m = 0;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    const [x1, y1] = project(ringOpen[i][0], ringOpen[i][1]);
    const [x2, y2] = project(ringOpen[j][0], ringOpen[j][1]);
    m = Math.max(m, Math.hypot(x2 - x1, y2 - y1));
  }
  return m;
}

function ringFromOrderedOuterWays(outerMembers) {
  /** @type {[number, number][]} */
  const ring = [];
  for (const m of outerMembers) {
    const g = m.geometry.map((p) => [p.lon, p.lat]);
    if (g.length < 2) continue;
    if (ring.length === 0) {
      ring.push(...g);
      continue;
    }
    const last = ring[ring.length - 1];
    if (snapOuter(last, g[0])) {
      ring.push(...g.slice(1));
    } else if (snapOuter(last, g[g.length - 1])) {
      ring.push(...[...g].reverse().slice(1));
    } else {
      return null;
    }
  }
  return ring;
}

function ringFromGreedyMerge(segments) {
  let bestRing = null;
  let bestJump = Infinity;

  for (let seed = 0; seed < segments.length; seed += 1) {
    const pool = segments.map((s) => [...s]);
    let ring = pool.splice(seed, 1)[0];
    if (!ring || ring.length < 2) continue;

    while (pool.length > 0) {
      let attached = false;
      for (let i = 0; i < pool.length; i += 1) {
        const seg = pool[i];
        const reversed = [...seg].reverse();
        for (const cand of [seg, reversed]) {
          const end = ring[ring.length - 1];
          const beg = ring[0];
          if (snapOuter(end, cand[0])) {
            ring = ring.concat(cand.slice(1));
            pool.splice(i, 1);
            attached = true;
            break;
          }
          if (snapOuter(beg, cand[cand.length - 1])) {
            ring = cand.slice(0, -1).concat(ring);
            pool.splice(i, 1);
            attached = true;
            break;
          }
        }
        if (attached) break;
      }
      if (!attached) break;
    }

    if (pool.length > 0) continue;

    let closed = ring;
    if (!closeCoord(closed[0], closed[closed.length - 1])) {
      closed = [...closed, [...closed[0]]];
    }

    let poly;
    try {
      poly = turf.polygon([closed]);
    } catch {
      continue;
    }
    if (!turf.booleanPointInPolygon(VILLAVICENCIO, poly)) continue;

    const open = closeCoord(closed[0], closed[closed.length - 1]) ? closed.slice(0, -1) : closed;
    const jump = maxSvgPolygonSegPx(open);
    if (jump < bestJump) {
      bestJump = jump;
      bestRing = closed;
    }
  }

  return bestRing;
}

const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Accept: "application/json",
    "User-Agent": "bioconstructores-map-generator/1.0",
  },
  body: `data=${encodeURIComponent(query)}`,
});
if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
const data = await res.json();

const rel = data.elements?.find((e) => e.type === "relation" && e.members);
if (!rel || !rel.members) throw new Error("Meta relation not found");

const outerMembers = rel.members.filter(
  (m) => m.type === "way" && m.role === "outer" && Array.isArray(m.geometry) && m.geometry.length >= 2
);

const segments = outerMembers.map((m) => m.geometry.map((g) => [g.lon, g.lat]));

let ringLngLat = ringFromOrderedOuterWays(outerMembers);

if (ringLngLat) {
  if (!closeCoord(ringLngLat[0], ringLngLat[ringLngLat.length - 1])) {
    ringLngLat = [...ringLngLat, [...ringLngLat[0]]];
  }
  let poly;
  try {
    poly = turf.polygon([ringLngLat]);
  } catch {
    ringLngLat = null;
  }
  const open = ringLngLat && closeCoord(ringLngLat[0], ringLngLat[ringLngLat.length - 1])
    ? ringLngLat.slice(0, -1)
    : ringLngLat;
  if (
    !ringLngLat ||
    !poly ||
    !turf.booleanPointInPolygon(VILLAVICENCIO, poly) ||
    maxSvgPolygonSegPx(open) > 72
  ) {
    ringLngLat = null;
  }
}

if (!ringLngLat) {
  ringLngLat = ringFromGreedyMerge(segments);
}

if (!ringLngLat) {
  throw new Error("No se pudo construir el anillo del Meta");
}

let coords = [...ringLngLat];
if (closeCoord(coords[0], coords[coords.length - 1])) {
  coords = coords.slice(0, -1);
}

/**
 * Paso fijo 4: mantiene el contorno del Meta reconocible (≈47px arista máx. en pruebas)
 * sin el artefacto de pasos grandes (p. ej. 38) que reintroducía cortes verticales falsos.
 */
const decimateStep = coords.length > 4500 ? 4 : coords.length > 2200 ? 3 : 1;
coords = coords.filter((_, i) => i % decimateStep === 0);
if (!closeCoord(coords[0], coords[coords.length - 1])) {
  coords = [...coords, [...coords[0]]];
}

const d = `${coords
  .map((c, i) => {
    const [x, y] = project(c[0], c[1]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ")} Z`;

const out = `// Auto-generated por scripts/generate-meta-svg-path.mjs (OSM outer en orden + snap; sin convex hull)
export const META_SVG_PATH = ${JSON.stringify(d)} as const;
`;

const target = path.join(__dirname, "..", "lib", "geo", "metaSvgPath.generated.ts");
fs.writeFileSync(target, out, "utf8");
const openForLog = closeCoord(ringLngLat[0], ringLngLat[ringLngLat.length - 1])
  ? ringLngLat.slice(0, -1)
  : ringLngLat;
const outOpen = closeCoord(coords[0], coords[coords.length - 1]) ? coords.slice(0, -1) : coords;
console.log(
  "Wrote",
  target,
  "vertices",
  coords.length,
  "step",
  decimateStep,
  "maxSvgPx",
  maxSvgPolygonSegPx(outOpen).toFixed(1)
);
