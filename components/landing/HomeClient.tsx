"use client";

import React, { useLayoutEffect, useRef } from "react";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/landing/Hero";
import Plans, { PlanItem } from "@/components/landing/Plans";
import MapSection from "@/components/landing/Map";
import Connection from "@/components/landing/Connection";
import gsap from "gsap";

interface HomeClientProps {
  initialPlans: PlanItem[];
}

export default function HomeClient({ initialPlans }: HomeClientProps) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-reveal", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="landing-theme relative bg-black">
      <Navbar />
      <div className="section-reveal">
        <Hero />
      </div>
      <div className="section-reveal">
        <Plans initialPlans={initialPlans} />
      </div>
      <div className="section-reveal">
        <MapSection />
      </div>
      <div className="section-reveal">
        <Connection />
      </div>

      <footer className="py-12 border-t border-white/5 bg-black text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bioconstructores Asociados Sas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
