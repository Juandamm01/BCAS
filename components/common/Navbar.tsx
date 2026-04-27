"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        
        gsap.to(navRef.current, {
          paddingTop: scrolled ? "0.75rem" : "2rem",
          paddingBottom: scrolled ? "0.75rem" : "2rem",
          backgroundColor: scrolled ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          duration: 0.4,
          ease: "power2.out"
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const navLinks = [
    { name: "Inicio", href: "#hero" },
    { name: "Sobre nosotros", href: "#about" },
    { name: "Cobertura", href: "#map" },
    { name: "Planes", href: "#plans" },
    { name: "¿Por qué nosotros?", href: "#policies" },
  ];

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-10 py-6 border-none",
        isScrolled ? "bg-black/60 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex w-full items-center justify-between rounded-full border border-white/15 bg-[#0f1f31]/75 backdrop-blur-md px-6 py-3">
          <Link href="/" className="relative flex items-center group">
            <span className="text-white/90 text-[13px] font-semibold tracking-tight">BCAS SAS</span>
          </Link>

          <div className="flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-[12px] font-medium text-gray-200 hover:text-white rounded-full transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
            className="text-[12px] md:text-[13px] font-medium text-white underline underline-offset-4 hover:text-white/90 transition-all cursor-not-allowed"
          >
            <span>Empezar ahora</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 ml-auto"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 mx-4 p-8 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 md:hidden flex flex-col space-y-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="mt-4 bg-white text-black text-center py-4 rounded-2xl font-bold"
            >
              Admin Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
