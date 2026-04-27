"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { getConnectionConfig } from "@/backend/actions";

const Connection = () => {
  const [config, setConfig] = useState({
    titulo: "Conexión confiable para tu día a día",
    subtitulo: "Disfruta internet estable, rápido y pensado para tu hogar, con soporte cercano y una experiencia sin complicaciones.",
    buttonText: "Empezar ahora",
    features: [
      "Conexión estable",
      "Velocidad ideal para tu hogar",
      "Instalación rápida",
      "Soporte técnico cercano",
      "Planes adaptados a ti",
    ],
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getConnectionConfig();
      if (data) {
        setConfig({
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          buttonText: data.buttonText,
          features:
            data.features?.length > 0
              ? data.features.map((feature: { text: string }) => feature.text)
              : [
                  "Conexión estable",
                  "Velocidad ideal para tu hogar",
                  "Instalación rápida",
                  "Soporte técnico cercano",
                  "Planes adaptados a ti",
                ],
        });
      }
    };
    fetchConfig();
  }, []);

  return (
    <section className="py-16 bg-black overflow-hidden" id="connection">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[1.2rem] md:rounded-[1.6rem] overflow-hidden min-h-[500px] flex items-center justify-center border border-white/15">
          <div className="absolute inset-0 z-0">
             <Image 
              src="/images/fondito.png" 
              alt="Conexión confiable" 
              fill 
              priority
              sizes="100vw"
              className="object-cover" 
             />
             <div className="absolute inset-0 bg-black/45"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/35"></div>
          </div>

          <div className="relative z-10 w-full p-8 md:p-14 flex flex-col items-center text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-[3.2rem] font-semibold text-white mb-4 max-w-5xl leading-[1.05] tracking-tight"
            >
              {config.titulo}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-100/90 text-sm md:text-[1.08rem] max-w-3xl mb-7 leading-relaxed font-normal"
            >
              {config.subtitulo}
            </motion.p>

            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="px-8 py-2.5 bg-white text-black rounded-full font-semibold text-xs md:text-sm hover:bg-gray-100 transition-all active:scale-95 mb-10 cursor-pointer shadow-lg shadow-black/40"
            >
              {config.buttonText}
            </motion.button>

            <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
              {config.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-lg hover:bg-white/15 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-3.5 h-3.5 text-white/90" />
                  </div>
                  <span className="text-white text-[10px] md:text-lg font-medium text-left leading-tight">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connection;
