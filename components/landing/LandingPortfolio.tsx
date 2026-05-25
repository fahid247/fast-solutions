"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { fadeUp, stagger, cardFadeUp, TiltCard, SectionBadge } from "./shared";

const PORTFOLIO = [
  { title: "E-Commerce Platform", desc: "Shopify store with custom Liquid theme, 3D product viewer, and checkout optimisation.", tags: ["Shopify", "Liquid", "3D"], accent: "#10b981" },
  { title: "SaaS Dashboard", desc: "Real-time analytics dashboard with WebSocket sync, role-based access, and Recharts data visualisation.", tags: ["Next.js", "MongoDB", "Socket.io"], accent: "#f97316" },
  { title: "Agency Landing Page", desc: "Three.js hero, GSAP scroll animations, and a Framer Motion component library for a design agency.", tags: ["Three.js", "GSAP", "Framer"], accent: "#a78bfa" },
  { title: "WordPress Membership", desc: "Custom WordPress theme with WooCommerce subscriptions, protected content, and member portal.", tags: ["WordPress", "WooCommerce", "PHP"], accent: "#3b82f6" },
  { title: "Restaurant Booking", desc: "Squarespace site with custom booking logic, Acuity integration, and animated menu section.", tags: ["Squarespace", "CSS", "JS"], accent: "#14b8a6" },
  { title: "Startup Launchpad", desc: "High-velocity landing page with A/B tested CTAs, SEO schema markup, and 98 Lighthouse score.", tags: ["Next.js", "SEO", "Tailwind"], accent: "#fbbf24" },
];

export function LandingPortfolio() {
  const portfolioRef = useRef<HTMLElement>(null);
  const portfolioInView = useInView(portfolioRef, { once: true, margin: "-100px" });

  return (
    <section id="work" ref={portfolioRef} className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={portfolioInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <SectionBadge>Selected Work</SectionBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Our <span style={{ color: "#f97316" }}>Portfolio</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base font-medium max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            A sample of projects shipped with craft, speed, and a relentless focus on quality.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={portfolioInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PORTFOLIO.map((proj, i) => (
            <motion.div key={proj.title} variants={cardFadeUp}>
              <TiltCard className="group relative rounded-[2rem] p-7 overflow-hidden cursor-pointer h-full"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "200px" }}>
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: proj.accent, filter: "blur(60px)", opacity: 0.1 }} />

                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-[9px] font-mono font-black tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-black text-white mb-2">{proj.title}</h3>
                  <p className="text-xs font-medium leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {proj.desc}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                          style={{ background: `${proj.accent}18`, color: proj.accent, border: `1px solid ${proj.accent}30` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: proj.accent }} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
