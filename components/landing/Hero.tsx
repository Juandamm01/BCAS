"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getHeroConfig } from "@/backend/actions";

const Hero = () => {
  const [config, setConfig] = useState({
    bienvenido: "Velocidad estable incluso en zonas donde otros no llegan.",
    empresa: "Bioconstructores Asociados SAS",
    slogan: "Disfruta de hasta +200MB en Villavicencio.",
    heroImage: "/images/fondo.png"
  });

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

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={config.heroImage || "/images/fondo.png"}
          alt="BCAS Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(37,99,235,0.18),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/10 to-black/35"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 md:pt-32 pb-16 md:pb-20 flex flex-col items-center text-center">
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
          className="text-4xl md:text-5xl lg:text-[3.7rem] font-semibold text-white mb-6 leading-[1.1] max-w-4xl tracking-tight"
        >
          {config.bienvenido}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-200 text-base md:text-xl mb-9 md:mb-11 max-w-2xl font-light leading-relaxed"
        >
          {config.slogan}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5"
        >
          <a
            href="#map"
            className="px-7 md:px-10 py-2.5 md:py-3 bg-white/20 border border-white/20 text-white rounded-full font-semibold text-sm md:text-[15px] hover:bg-white/30 transition-all active:scale-95 text-center cursor-pointer backdrop-blur-md"
          >
            Ver cobertura
          </a>
          <a
            href="#plans"
            className="px-7 md:px-10 py-2.5 md:py-3 bg-white text-black rounded-full font-semibold text-sm md:text-[15px] hover:bg-gray-100 transition-all active:scale-95 text-center cursor-pointer"
          >
            Ver planes de internet
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
