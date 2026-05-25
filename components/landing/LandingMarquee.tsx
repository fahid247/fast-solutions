"use client";

import { Sparkles } from "lucide-react";

const TECH_MARQUEE = [
  "Next.js App Router", "Three.js WebGL", "Tailwind CSS", "Framer Motion",
  "MongoDB Atlas", "Socket.io", "Shopify Liquid", "WordPress", "Wix Velo",
  "Squarespace", "React", "TypeScript", "Node.js", "Vercel Edge",
];

export function LandingMarquee() {
  return (
    <section className="py-14 relative overflow-hidden select-none"
      style={{ background: "rgba(255,255,255,0.018)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 mb-7 flex items-center gap-5">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.3)" }}>
          Supported Platforms &amp; Technologies
        </span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(249,115,22,0.2), transparent)" }} />
      </div>

      <div className="flex overflow-hidden" style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center whitespace-nowrap gap-0 animate-marquee" aria-hidden={dup === 1}>
            {TECH_MARQUEE.map((tag) => (
              <div key={`${dup}-${tag}`}
                className="flex items-center gap-2.5 px-8 text-[12px] font-black uppercase tracking-[0.18em] transition-colors duration-300 cursor-default"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(249,115,22,0.5)" }} />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
