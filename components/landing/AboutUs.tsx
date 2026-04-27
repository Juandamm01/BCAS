"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Users, Target } from "lucide-react";

const AboutUs = () => {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10"
            >
              <Image src="/images/fondo.png" alt="About" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 mt-8"
            >
              <Image src="/images/fondo.png" alt="About 2" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 -mt-8"
            >
              <Image src="/images/fondo.png" alt="About 3" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10"
            >
              <Image src="/images/fondo.png" alt="About 4" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-blue-600/10"></div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 font-black tracking-[0.3em] uppercase mb-4"
            >
              Nuestra Historia
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-8 leading-[1.02] tracking-[-0.03em]"
            >
              Comprometidos con la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Excelencia Digital</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-medium"
            >
              Somos un proveedor de servicios de Internet (ISP) comprometido con ofrecer conectividad estable, segura y de alta calidad. Nuestra misión es garantizar que hogares y empresas cuenten con un servicio confiable, soporte técnico oportuno y soluciones adaptadas a sus necesidades.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Award, text: "Calidad Certificada" },
                { icon: Users, text: "Soporte 24/7" },
                { icon: Target, text: "Fibra Óptica Real" },
                { icon: CheckCircle2, text: "Sin Contratos Engañosos" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold tracking-tight">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <button className="px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl font-black tracking-wide transition-all duration-300 shadow-xl shadow-blue-800/20 active:scale-95 cursor-pointer">
                Conoce Más Sobre Nosotros
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
