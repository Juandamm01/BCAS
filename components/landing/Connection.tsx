"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { getConnectionConfig } from "@/backend/actions";
import { cn } from "@/lib/utils";

const Connection = () => {
  const [imageAspectRatio, setImageAspectRatio] = useState(3 / 2);
  /** En < md el bloque crece con el contenido; desde md se mantiene el encuadre por ratio de la imagen. */
  const [isMdUp, setIsMdUp] = useState(false);
  const [config, setConfig] = useState({
    titulo: "Conexión confiable para tu día a día",
    subtitulo: "Disfruta internet estable, rápido y pensado para tu hogar, con soporte cercano y una experiencia sin complicaciones.",
    buttonText: "Empezar ahora",
    backgroundImage: "/images/conexion.png",
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
          backgroundImage: data.backgroundImage || "/images/conexion.png",
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

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="overflow-hidden bg-black py-12 md:py-16" id="connection">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="relative flex w-full flex-col justify-center overflow-hidden rounded-[1.2rem] border border-white/15 md:min-h-0 md:rounded-[1.6rem] md:items-center"
          style={isMdUp ? { aspectRatio: imageAspectRatio } : undefined}
        >
          <div className="absolute inset-0 z-0 min-h-full">
            <Image
              src={config.backgroundImage}
              alt="Conexión confiable"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center md:object-contain"
              onLoadingComplete={(img) => {
                if (img.naturalWidth && img.naturalHeight) {
                  setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                }
              }}
            />
            <div className="absolute inset-0 bg-black/35 md:bg-black/32" />
            <div className="absolute inset-x-0 bottom-0 min-h-[45%] bg-gradient-to-t from-black/85 via-black/45 to-transparent backdrop-blur-md md:h-44 md:min-h-0 md:from-black/72 md:via-black/38 md:to-transparent" />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10 md:p-14">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 max-w-5xl text-2xl font-semibold leading-[1.08] tracking-tight text-white sm:mb-4 sm:text-3xl md:text-[3.2rem]"
            >
              {config.titulo}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-6 max-w-3xl text-sm font-normal leading-relaxed text-slate-100/90 md:mb-7 md:text-[1.08rem]"
            >
              {config.subtitulo}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              type="button"
              className="mb-2 cursor-pointer rounded-full bg-white px-7 py-2.5 text-xs font-semibold text-black shadow-lg shadow-black/40 transition-all hover:bg-gray-100 active:scale-95 md:mb-3 md:px-8 md:text-sm"
            >
              {config.buttonText}
            </motion.button>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-3 md:mt-12 lg:grid-cols-6">
              {config.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.06 }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 p-2.5 backdrop-blur-md transition-colors hover:bg-white/15 sm:gap-3 sm:p-3",
                    "lg:col-span-2",
                    idx === 3 && "lg:col-start-2"
                  )}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 sm:h-8 sm:w-8">
                    <Wifi className="h-3.5 w-3.5 text-white/90 sm:h-4 sm:w-4" />
                  </div>
                  <span className="min-w-0 text-left text-[12px] font-medium leading-snug text-white sm:text-sm md:text-base lg:text-lg">
                    {feature}
                  </span>
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
