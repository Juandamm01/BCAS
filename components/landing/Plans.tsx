"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { getPlans } from "@/backend/actions";

interface PlanItem {
  id: number;
  speed: string;
  price: string;
  tv: string;
  monthLabel?: string;
  description?: string;
  buttonLabel?: string;
  includeLabel?: string;
  popularLabel?: string;
  zona: string;
  order: number;
  isPopular?: boolean;
}

const ZONE_LABELS: Record<string, string> = {
  mesetas: "Mesetas, El Triángulo, La Sultana...",
  nohora: "La Nohora y San Luis",
  zuria: "La Zuria",
};

const formatZoneLabel = (zone: string) => {
  const key = zone.trim().toLowerCase();
  return ZONE_LABELS[key] || zone;
};

const Plans = () => {
  const [activeTab, setActiveTab] = useState("");
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const data = (await getPlans()) as PlanItem[];
      setPlans(data);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const zones = Array.from(new Set(plans.map((plan) => plan.zona))).map((zona) => ({
    id: zona,
    label: formatZoneLabel(zona),
  }));
  useEffect(() => {
    if (!activeTab && zones.length > 0) {
      setActiveTab(zones[0].id);
    }
  }, [activeTab, zones]);

  const plansByZone = plans.filter((plan) => plan.zona === activeTab);

  const normalizeTvLabel = (value?: string) => {
    if (!value) return "1 Punto de TV GRATIS";
    if (value.trim() === "+1 TV") return "1 Punto de TV GRATIS";
    if (value.trim() === "+2 TV") return "2 Punto de TV GRATIS";
    return value;
  };

  return (
    <section id="plans" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <svg viewBox="0 0 500 500" className="w-full h-full text-white">
          <path d="M500,100 Q400,150 300,100 T100,150" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M500,150 Q400,200 300,150 T100,200" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M500,200 Q400,250 300,200 T100,250" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M500,250 Q400,300 300,250 T100,300" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M500,300 Q400,350 300,300 T100,350" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-12">
          <h2 className="text-[2rem] md:text-[3.35rem] font-semibold text-white mb-8 leading-[1.05] tracking-tight">
            Elige el plan <span className="text-slate-400">que mejor se</span> <br className="hidden md:block" /> adapte a ti
          </h2>
          
          <div className="flex space-x-6 md:space-x-10 border-b border-white/10 overflow-x-auto no-scrollbar pb-1">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveTab(zone.id)}
                className={cn(
                  "pb-4 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer flex-shrink-0",
                  activeTab === zone.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {zone.label}
                {activeTab === zone.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white/70 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {plansByZone.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative p-6 border border-white/10 transition-all duration-500 flex flex-col group min-h-[330px]",
                      plan.isPopular 
                        ? "bg-[#0d0d0d] border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.45)]" 
                        : "bg-[#070707] hover:border-white/25"
                    )}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex flex-col">
                        <span className="text-white text-[1.75rem] font-medium">{`Plan ${plan.speed}`}</span>
                      </div>
                      {plan.isPopular && (
                        <span className="bg-white/10 text-white text-[10px] font-medium px-3 py-1 rounded-full border border-white/20">
                          {plan.popularLabel || "Popular"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-white text-5xl font-semibold tracking-tight">${plan.price}</span>
                      <span className="text-white text-2xl font-light">{plan.monthLabel || "/mes"}</span>
                    </div>

                    <div className="space-y-2 mb-8 flex-1">
                      <p className="text-white text-sm leading-relaxed">
                        {plan.description || "Ideal para hogares que buscan conexión estable para navegar, estudiar y disfrutar contenido sin interrupciones."}
                      </p>
                    </div>

                    <button className="w-fit px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer bg-white text-black hover:bg-gray-200">
                      {plan.buttonLabel || "Elegir plan"}
                    </button>

                    <div className="mt-5 border-t border-white/10 relative pt-5">
                      <p className={cn(
                        "text-white text-xs text-center absolute left-1/2 -translate-x-1/2 -top-2.5 px-3",
                        plan.isPopular ? "bg-[#0d0d0d]" : "bg-[#070707]"
                      )}>
                        {plan.includeLabel || "Incluye"}
                      </p>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Check className="w-4 h-4 text-slate-400 mr-2" />
                        <span>{normalizeTvLabel(plan.tv)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="text-center mt-10">
          <p className="text-slate-500 text-xs font-medium">
             Instalación única de $99.000. Aplican <span className="text-white underline cursor-pointer hover:text-white/80 transition-colors">términos y condiciones</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Plans;
