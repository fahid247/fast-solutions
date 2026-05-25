"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LandingLoaderProps {
  isLoading: boolean;
  loadingProgress: number;
}

export function LandingLoader({ isLoading, loadingProgress }: LandingLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: "#080808" }}
        >
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          {/* Glow orb */}
          <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{
            background: "radial-gradient(circle,rgba(249,115,22,0.12) 0%,rgba(167,139,250,0.06) 50%,transparent 70%)",
            filter: "blur(60px)",
          }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="w-16 h-16 rounded-[1.5rem] mx-auto mb-5 flex items-center justify-center shadow-2xl"
              style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)" }}>
              <span className="text-white font-black text-3xl italic select-none">F</span>
            </div>
            <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Initialising
            </p>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white uppercase">
              Fast <span style={{ color: "#f97316" }}>Solutions</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="relative z-10 mt-10 flex flex-col items-center gap-3"
          >
            <div className="relative h-[2px] w-60 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${Math.min(loadingProgress, 100)}%`,
                  background: "linear-gradient(90deg,#f97316,#a78bfa)",
                }}
              />
            </div>
            <p className="text-[10px] font-black tracking-[0.25em] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
              {Math.min(loadingProgress, 100)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
