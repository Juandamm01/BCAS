"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getHeroConfig } from "@/backend/actions";

/** Ratio intrínseco por defecto de `public/images/fondo.png` (1536×1024). */
const DEFAULT_HERO_IMG_W = 1536;
const DEFAULT_HERO_IMG_H = 1024;

const Hero = () => {
  const [config, setConfig] = useState({
    bienvenido: "Velocidad estable incluso en zonas donde otros no llegan.",
    empresa: "Bioconstructores Asociados SAS",
    slogan: "Disfruta de hasta +200MB en Villavicencio.",
    heroImage: "/images/fondo.png"
  });
  const [heroImgSize, setHeroImgSize] = useState({
    w: DEFAULT_HERO_IMG_W,
    h: DEFAULT_HERO_IMG_H
  });

  const heroMinHeight = useMemo(() => {
    const { w, h } = heroImgSize;
    if (!w || !h) return "100dvh";
    return `max(100dvh, calc(100vw * ${h} / ${w}))`;
  }, [heroImgSize]);

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getHeroConfig();
      if (data) {
        setConfig({
          bienvenido: data.bienvenido,
          empresa: data.empresa,
          slogan: data.slogan,
          heroImage: data.heroImage
        });
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    setHeroImgSize({ w: DEFAULT_HERO_IMG_W, h: DEFAULT_HERO_IMG_H });
  }, [config.heroImage]);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden bg-black"
      style={{ minHeight: heroMinHeight }}
    >
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src={config.heroImage || "/images/fondo.png"}
          alt="BCAS Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-100"
          onLoadingComplete={(img) => {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setHeroImgSize({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(37,99,235,0.18),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/18 via-black/10 to-black/35" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full mb-7"
        >
          <div className="flex">
            <div className="w-7 h-7 rounded-full border border-white/70 overflow-hidden relative bg-black/40">
              <Image src="/images/Logo_BCAS_MODO_OSCURO.png" alt="BCAS" fill sizes="28px" className="object-contain p-1.5" />
            </div>
          </div>
          <span className="text-white text-[10px] md:text-[11px] font-semibold tracking-wide whitespace-nowrap">
            {config.empresa || "+25.000 Clientes confían en nosotros"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.7rem] font-semibold text-white mb-5 sm:mb-6 leading-[1.12] max-w-4xl tracking-tight px-1"
        >
          {config.bienvenido}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-200 text-sm sm:text-base md:text-xl mb-8 sm:mb-9 md:mb-11 max-w-2xl font-light leading-relaxed px-1"
        >
          {config.slogan}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 w-full max-w-md sm:max-w-none"
        >
          <a
            href="#map"
            className="px-7 md:px-10 py-3 md:py-3 bg-white/20 border border-white/20 text-white rounded-full font-semibold text-sm md:text-[15px] hover:bg-white/30 transition-all active:scale-95 text-center cursor-pointer backdrop-blur-md w-full sm:w-auto"
          >
            Ver cobertura
          </a>
          <a
            href="#plans"
            className="px-7 md:px-10 py-3 md:py-3 bg-white text-black rounded-full font-semibold text-sm md:text-[15px] hover:bg-gray-100 transition-all active:scale-95 text-center cursor-pointer w-full sm:w-auto"
          >
            Ver planes de internet
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
