/*  */"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Fingerprint, Lock, FileText, ExternalLink } from "lucide-react";

const Policy = () => {
  const policies = [
    {
      icon: ShieldAlert,
      title: "Internet Sano",
      text: "Nos unimos a la campaña del Ministerio TIC para promover el uso seguro de Internet, generando conciencia sobre la prevención de la explotación infantil en entornos digitales.",
      link: "#"
    },
    {
      icon: Fingerprint,
      title: "Ley 679 de 2001",
      text: "Adoptamos medidas técnicas y administrativas para prevenir la difusión de contenido ilegal relacionado con menores de edad, implementando controles y filtros.",
      link: "#"
    },
    {
      icon: FileText,
      title: "Ley 1336 de 2009",
      text: "Fortalecemos la protección de menores mediante códigos de conducta y políticas de prevención en servicios digitales para evitar la explotación sexual infantil.",
      link: "#"
    },
    {
      icon: Lock,
      title: "Protección de Datos",
      text: "Garantizamos la confidencialidad de la información personal, aplicamos medidas de protección para prevenir fraude y accesos no autorizados.",
      link: "#"
    }
  ];

  return (
    <section id="policies" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 font-black tracking-[0.3em] uppercase mb-4 block"
            >
              Cumplimiento Legal
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.02] tracking-[-0.03em]"
            >
              Nuestras <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Políticas ISP</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-medium"
            >
              BCAS ofrece a todos sus clientes servicios normativos que garantizan seguridad digital, responsabilidad social y cumplimiento legal en Villavicencio.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button className="flex items-center space-x-2 text-white font-black tracking-wide hover:text-blue-400 transition-colors group cursor-pointer">
                <span>Ver documentación completa</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, idx) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <policy.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{policy.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {policy.text}
                </p>
                <a href={policy.link} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 cursor-pointer">
                  Leer más
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
    </section>
  );
};

export default Policy;
