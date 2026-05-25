"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
});

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function LandingHero() {
  const { data: session } = useSession();

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Three.js canvas */}
      <HeroCanvas />

      {/* Dynamic vignette overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 80% at center, transparent 20%, rgba(8,8,8,0.55) 70%, rgba(8,8,8,0.92) 100%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, transparent 30%, transparent 60%, rgba(8,8,8,0.75) 100%)",
      }} />

      {/* Hero Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center justify-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left justify-center">
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6"
          >
            <p className="text-xs md:text-sm tracking-[0.28em] uppercase font-light"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              Premium Consulting &amp; Build Studio
            </p>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.5rem] xl:text-[9rem] leading-none tracking-wide text-white font-black uppercase select-none"
            style={{
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              textShadow: "4px 4px 0px rgba(0,0,0,0.9), 0 0 80px rgba(249,115,22,0.4)",
            }}
          >
            FAST
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-2 text-xl sm:text-2xl md:text-3xl font-black tracking-[0.15em] uppercase"
            style={{ color: "#f97316", letterSpacing: "0.2em" }}
          >
            SOLUTIONS
          </motion.p>

          {/* Sub text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-6 text-sm md:text-base max-w-lg lg:max-w-xl leading-relaxed font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            We plan, design, and build polished custom CMS portals and product-ready dashboards — with strict reliability and premium aesthetics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            {session ? (
              <Link href="/dashboard"
                className="group px-8 py-4 rounded-2xl font-black text-sm text-white flex items-center gap-2 transition-all shadow-xl"
                style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 8px 32px rgba(249,115,22,0.3)" }}>
                Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link href="/client/register"
                  className="group px-8 py-4 rounded-2xl font-black text-sm text-white flex items-center gap-2 transition-all shadow-xl"
                  style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 8px 32px rgba(249,115,22,0.3)" }}>
                  Partner With Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#services"
                  className="px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  Explore Services
                </a>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="mt-10 flex items-center justify-center lg:justify-start gap-8 md:gap-12"
          >
            {[
              { value: "2–14 days", label: "Avg. Launch" },
              { value: "500+", label: "Projects Done" },
              { value: "98%", label: "Client Happiness" },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-lg md:text-2xl font-black" style={{ color: "#f97316" }}>{s.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Empty space to balance layout on desktop screens where 3D elements reside */}
        <div className="hidden lg:block lg:col-span-5 h-full pointer-events-none" />
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-10 z-10 flex items-center gap-5 tracking-[0.35em] text-[11px] uppercase transition-colors group"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        <span className="w-12 h-[1px] transition-all duration-300 group-hover:w-20" style={{ background: "rgba(255,255,255,0.2)" }} />
        Continue
        <span className="w-12 h-[1px] transition-all duration-300 group-hover:w-20" style={{ background: "rgba(255,255,255,0.2)" }} />
      </motion.a>
    </section>
  );
}
