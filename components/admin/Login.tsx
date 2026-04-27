"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { signInAdminAction } from "@/app/admin/actions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gifIndex, setGifIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const gifts = ["/gifts/Camarita.gif", "/gifts/Compu.gif", "/gifts/esqueleto.gif", "/gifts/HoraDeAventura.gif"];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".login-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.to(".login-gif", {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".login-submit", {
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGifIndex((prev) => (prev + 1) % gifts.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [gifts.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signInAdminAction({ email, password });

    if (result.success) {
      toast.success("Inicio de sesión exitoso");
      router.push("/admin/dashboard");
      return;
    }

    setIsLoading(false);
    toast.error(result.message);
  };

  return (
    <div ref={wrapperRef} className="h-[100dvh] max-h-[100dvh] bg-[#020617] flex font-sans overflow-hidden">
      {/* Left Side: Branding */}
      <div className="relative hidden lg:flex w-1/2 flex-col items-center justify-center p-10 bg-gradient-to-br from-[#07133a] via-[#020617] to-black">
        <div className="absolute top-8 left-8 login-reveal">
           <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
             <Image src="/images/Logo_BCAS_MODO_OSCURO.png" alt="Logo" width={32} height={32} />
           </div>
        </div>

        <div className="relative z-10 flex flex-col items-center login-reveal w-full max-w-[520px]">
           <div className="relative w-64 h-64 xl:w-72 xl:h-72 rounded-[2.5rem] bg-[#0a1f5a]/30 border border-white/10 p-8 xl:p-10 mb-8 shadow-2xl flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={gifts[gifIndex]}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative w-full h-full animate-float login-gif"
                >
                  <Image
                    src={gifts[gifIndex]}
                    alt="Admin visual"
                    fill
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain drop-shadow-[0_0_20px_rgba(30,64,175,0.45)]"
                  />
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="text-center">
              <h1 className="text-[3.2rem] xl:text-[3.6rem] font-black text-white leading-[0.95] mb-4 tracking-[-0.03em]">
                Bioconstructores
                <br />
                Asociados SAS
              </h1>
              <span className="text-[#1c459f] font-bold tracking-[0.28em] uppercase text-xs xl:text-sm">
                Soluciones Innovadoras
              </span>
           </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-b from-[#030c2c] to-[#020617] flex flex-col items-center justify-center p-8 lg:p-16 xl:p-20 relative">
        <div className="max-w-md w-full login-reveal">
           <div className="flex justify-center mb-9 login-reveal">
              <Image src="/images/Logo_BCAS_MODO_OSCURO.png" alt="Logo" width={60} height={60} className="brightness-200" />
           </div>

           <div className="text-center mb-9 login-reveal">
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">¡Hola de Nuevo!</h2>
              <p className="text-slate-400 font-medium">Accede a tu panel de administración.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5 login-reveal">
              <div className="space-y-2">
                 <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      className="w-full bg-slate-950/60 border border-blue-950/80 rounded-2xl px-6 py-5 text-white placeholder-slate-600 outline-none focus:border-blue-800/80 focus:bg-slate-950 transition-all"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full bg-slate-950/60 border border-blue-950/80 rounded-2xl px-6 py-5 text-white placeholder-slate-600 outline-none focus:border-blue-800/80 focus:bg-slate-950 transition-all"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#0b255f] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#07163d]/70 hover:bg-[#091f50] transition-all active:scale-95 flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed login-submit"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <span>Entrar al Sistema</span>
                )}
              </button>
           </form>

        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
