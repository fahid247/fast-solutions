"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Code, Layout, Zap, Globe, Terminal, ShoppingBag,
  Palette, Rocket, RefreshCw, Gauge, Search, Settings, ChevronRight,
} from "lucide-react";
import { fadeUp, stagger, cardFadeUp, TiltCard, SectionBadge } from "./shared";

const SERVICES = [
  { slug: "shopify", badge: "Shopify", title: "Shopify Development", description: "Conversion-led storefronts built to sell. Custom Liquid, theme architecture, and checkout flows.", icon: ShoppingBag, accent: "#10b981" },
  { slug: "wordpress", badge: "WordPress", title: "WordPress Development", description: "Custom WordPress sites, Gutenberg blocks, ACF integrations built for growth.", icon: Code, accent: "#3b82f6" },
  { slug: "wix", badge: "Wix", title: "Wix & Velo Development", description: "Professional Wix sites with custom Velo logic, DB collections, and dynamic pages.", icon: Layout, accent: "#f97316" },
  { slug: "squarespace", badge: "Squarespace", title: "Squarespace Design", description: "Elegant Squarespace sites for premium brands with custom CSS/JS enhancements.", icon: Palette, accent: "#8b5cf6" },
  { slug: "landing-page", badge: "Any CMS", title: "Landing Page Design", description: "High-converting pages built for one goal. Engineered around trust signals and conversion.", icon: Rocket, accent: "#ef4444" },
  { slug: "website-redesign", badge: "Any CMS", title: "Website Redesign", description: "Transform your outdated site into a real business asset with modern UX.", icon: RefreshCw, accent: "#14b8a6" },
  { slug: "speed-optimization", badge: "Performance", title: "Speed Optimization", description: "Faster pages. Better rankings. More conversions. Core Web Vitals excellence.", icon: Gauge, accent: "#f59e0b" },
  { slug: "seo-setup", badge: "SEO", title: "SEO Setup", description: "Technical SEO foundations, schema markup, and on-page optimizations that last.", icon: Search, accent: "#6366f1" },
  { slug: "custom-code", badge: "Custom Code", title: "Custom Code Development", description: "Bespoke web solutions built exactly to your spec — no templates, no shortcuts.", icon: Terminal, accent: "#06b6d4" },
  { slug: "full-stack", badge: "Full Stack", title: "Full Stack Development", description: "Complete web applications — React frontend, Node.js backend, MongoDB database.", icon: Globe, accent: "#a855f7" },
  { slug: "maintenance", badge: "All CMS", title: "Website Maintenance", description: "Keep your site fast, secure, and up to date with ongoing expert care.", icon: Settings, accent: "#78716c" },
];

export function LandingServices() {
  const servicesRef = useRef<HTMLElement>(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={servicesRef} className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-16 max-w-2xl"
        >
          <SectionBadge>Precision Engineering</SectionBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] leading-none text-white">
            Digital Solutions Designed With{" "}
            <span style={{ color: "#f97316" }}>Precision</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            Eleven specialisations. One agency. All built to an ultra-premium visual and technical standard.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {SERVICES.map((srv) => (
            <motion.div key={srv.slug} variants={cardFadeUp}>
              <Link href={`/services/${srv.slug}`} className="block h-full">
                <TiltCard className="group relative h-full rounded-[2rem] p-7 flex flex-col justify-between cursor-pointer overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "220px" }}>
                  <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${srv.accent}18, transparent 60%)` }} />

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${srv.accent}18`, border: `1px solid ${srv.accent}30`, color: srv.accent }}>
                        <srv.icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-20 group-hover:opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        style={{ color: srv.accent }} />
                    </div>

                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest font-mono px-2 py-0.5 rounded-full"
                        style={{ background: `${srv.accent}18`, color: srv.accent }}>
                        {srv.badge}
                      </span>
                      <h3 className="mt-2.5 text-sm font-black text-white tracking-tight">{srv.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors duration-200 relative z-10 opacity-30 group-hover:opacity-80"
                    style={{ color: srv.accent }}>
                    Learn more <ChevronRight className="w-3 h-3" />
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
