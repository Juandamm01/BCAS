"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { getMapPoints } from "@/backend/actions";
import { COLOMBIA_SVG_PATH, COLOMBIA_VIEW_BOUNDS } from "@/lib/geo/colombiaSvgPath.generated";
import { META_SVG_PATH } from "@/lib/geo/metaSvgPath.generated";

interface MapPoint {
  id: number;
  nombre: string;
  x?: number | null;
  y?: number | null;
  lat?: number | null;
  lng?: number | null;
  color?: string | null;
  radio?: number | null;
}

const MapSection = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      const data = await getMapPoints();
      setPoints(data as MapPoint[]);
    };
    fetchPoints();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fallbackBarrios: MapPoint[] = [
    { id: 1, nombre: "La Azotea", lat: 4.142868, lng: -73.650565, color: "#DC2626", radio: 300 },
    { id: 2, nombre: "Mesetas Bajas", lat: 4.14546, lng: -73.655689, color: "#2563EB", radio: 350 },
    { id: 3, nombre: "Mesetas - La Sultana - El Triángulo - San Francisco - Mesetas Alto", lat: 4.151987, lng: -73.657689, color: "#F59E0B", radio: 400 },
    { id: 4, nombre: "Rondinella", lat: 4.156844, lng: -73.66036, color: "#10B981", radio: 300 },
    { id: 5, nombre: "Galán", lat: 4.155597, lng: -73.657949, color: "#9333EA", radio: 250 },
    { id: 6, nombre: "La Nohora", lat: 4.079677, lng: -73.696592, color: "#14B8A6", radio: 450 },
    { id: 7, nombre: "San Luis de Ocoa Bajo", lat: 4.0789, lng: -73.704115, color: "#F43F5E", radio: 400 },
    { id: 8, nombre: "Quintas de la Suria", lat: 4.082271, lng: -73.64096, color: "#64748B", radio: 350 },
  ];

  const pointsWithCoords = points
    .map((point) => {
      const lat = typeof point.lat === "number" ? point.lat : point.y;
      const lng = typeof point.lng === "number" ? point.lng : point.x;
      return { ...point, lat: lat ?? null, lng: lng ?? null };
    })
    .filter((point) => typeof point.lat === "number" && typeof point.lng === "number");
  const normalizedPoints = pointsWithCoords.length > 0 ? pointsWithCoords : fallbackBarrios;

  const projectToSvg = (lng: number, lat: number) => {
    const b = COLOMBIA_VIEW_BOUNDS;
    const w = b.viewW - b.pad * 2;
    const h = b.viewH - b.pad * 2;
    const sx = b.pad + ((lng - b.minLng) / (b.maxLng - b.minLng)) * w;
    const sy = b.pad + ((b.maxLat - lat) / (b.maxLat - b.minLat)) * h;
    return { sx, sy };
  };

  const vb = COLOMBIA_VIEW_BOUNDS;
  const cx = vb.viewW / 2;
  const cy = vb.viewH / 2;

  const mapPointToMeta = (point: MapPoint) => {
    const lat = point.lat as number;
    const lng = point.lng as number;
    const { sx, sy } = projectToSvg(lng, lat);
    const x = sx - cx;
    const y = sy - cy;
    return { x, y, sx, sy };
  };

  const anchors = normalizedPoints.map((point) => ({
    point,
    ...mapPointToMeta(point),
  }));

  const centroid = anchors.reduce(
    (acc, item) => ({ x: acc.x + item.x / anchors.length, y: acc.y + item.y / anchors.length }),
    { x: 0, y: 0 }
  );

  const distributeLabels = (
    sideItems: Array<{ point: MapPoint; x: number; y: number; sx: number; sy: number }>,
    side: "left" | "right"
  ) => {
    const sorted = [...sideItems].sort((a, b) => a.y - b.y);
    const minY = -220;
    const maxY = 220;
    const minGap = 58;

    const targets = sorted.map((item) => item.y * 2.2);
    const positioned: number[] = [];

    for (let i = 0; i < targets.length; i += 1) {
      const prev = positioned[i - 1] ?? minY - minGap;
      positioned.push(Math.max(targets[i], prev + minGap));
    }

    const overflow = (positioned[positioned.length - 1] ?? maxY) - maxY;
    if (overflow > 0) {
      for (let i = 0; i < positioned.length; i += 1) {
        positioned[i] -= overflow;
      }
    }

    for (let i = 0; i < positioned.length; i += 1) {
      positioned[i] = Math.max(minY + i * minGap, Math.min(maxY, positioned[i]));
    }

    return sorted.map((item, idx) => ({
      ...item,
      labelX: side === "left" ? -320 : 320,
      labelY: positioned[idx],
      side,
    }));
  };

  const leftLayouts = distributeLabels(
    anchors.filter((item) => item.x < centroid.x),
    "left"
  );
  const rightLayouts = distributeLabels(
    anchors.filter((item) => item.x >= centroid.x),
    "right"
  );
  const labelLayouts = [...leftLayouts, ...rightLayouts];

  const mobileLabelLayouts = [...anchors]
    .sort((a, b) => a.y - b.y)
    .map((item, idx) => ({
      ...item,
      labelX: idx % 2 === 0 ? -155 : 155,
      labelY: -185 + Math.floor(idx / 2) * 66,
    }));

  const handleZoneClick = (point: MapPoint) => {
    if (typeof point.lat !== "number" || typeof point.lng !== "number") return;

    const radio = Number(point.radio ?? 300);
    const zoomFromRadio =
      radio <= 200 ? 18 :
      radio <= 300 ? 17 :
      radio <= 450 ? 16 :
      radio <= 700 ? 15 : 14;

    const mapsUrl = `https://www.google.com/maps?q=${point.lat},${point.lng}&z=${zoomFromRadio}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="map" className="py-24 md:py-28 bg-black relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 mb-14 md:mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-5 tracking-tight leading-[1.05]">
          Cobertura <span className="text-gray-700">que no para de</span> <br /> crecer
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Revisa si ya estamos en tu zona o <span className="text-white font-bold underline cursor-pointer">regístrate</span> para saber dónde quieres que lleguemos.
        </p>
      </div>

      <div className="relative w-full max-w-[98rem] aspect-[1000/1320] min-h-[920px] max-h-[98vh] flex items-center justify-center border border-white/10 bg-black/40 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox={`0 0 ${vb.viewW} ${vb.viewH}`}
            className="w-full h-full absolute inset-0 pointer-events-none overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={COLOMBIA_SVG_PATH}
              className="stroke-white fill-none stroke-[2] opacity-95"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <motion.path
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              d={META_SVG_PATH}
              vectorEffect="nonScalingStroke"
              className="fill-[#1E6BFF] stroke-white stroke-[1.25]"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {(isMobile ? mobileLabelLayouts : labelLayouts).map((item) => {
              const k = isMobile ? 0.58 : 0.78;

              return (
                <g key={item.point.id}>
                  <line
                    x1={item.sx}
                    y1={item.sy}
                    x2={cx + item.labelX * k}
                    y2={cy + item.labelY * k}
                    className="stroke-white/70 stroke-[1]"
                  />
                  <circle
                    cx={item.sx}
                    cy={item.sy}
                    r={3.25}
                    fill="#FFFFFF"
                    className="stroke-white/30 stroke-[0.5]"
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-0 h-0">
              {(isMobile ? mobileLabelLayouts : labelLayouts).map((item) => {
                return (
                  <button
                    key={item.point.id}
                    type="button"
                    onClick={() => handleZoneClick(item.point)}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                      left: item.labelX,
                      top: item.labelY,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full shadow-2xl ${
                        isMobile ? "w-[190px]" : "w-[240px]"
                      } border transition-all bg-[#0f1013] border-white/15 hover:border-white/40 hover:scale-[1.02]`}
                    >
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                      </div>
                      <span className={`font-medium text-white tracking-wide leading-tight text-left ${isMobile ? "text-[9px] line-clamp-4" : "text-[10px] line-clamp-3"}`}>
                        {item.point.nombre}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
