"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp, SectionBadge } from "./shared";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Scope Blueprint",
    desc: "Mapping client goals, creating technical architectures, and locking down deliverables.",
    badge: "Discovery Phase",
    color: "#f97316",
    details: "Our process kicks off with structured blueprints. We define exact schema designs, align system specifications, design visual parameters, and establish rigid roadmap deadlines, preventing any downstream feature drift.",
    deliverables: ["Interactive User Flow Blueprinting", "Technical Stack Lock & Schema Definitions", "Milestones & Scope Sign-off Specifications", "Assigned Team Roster Allocation"],
    sla: "24 – 48 Hours",
  },
  {
    step: "02",
    title: "UX & Figma Design System",
    desc: "Polishing wireframes, typography styles, asset layouts, and interactive prototypes.",
    badge: "Design Phase",
    color: "#a78bfa",
    details: "Next, we translate specifications into highly interactive component libraries and layouts inside Figma. We build modern color palettes, strict typography grids, adaptive layouts, and complete responsive UX wireframes.",
    deliverables: ["Component-driven Figma Design System", "High-fidelity Desktop & Mobile Prototypes", "Usability Walkthrough Tapes", "Interactive Layout Color Systems"],
    sla: "3 – 5 Days",
  },
  {
    step: "03",
    title: "Resilient Full-Stack Build",
    desc: "Writing dynamic React views, Next.js routing controllers, and robust MongoDB collections.",
    badge: "Development Phase",
    color: "#14b8a6",
    details: "Our crew develops clean, type-safe code utilizing Next.js, robust MongoDB Atlas schemas, and real-time state managers. All modules are optimized for extreme load speeds and immediate rendering.",
    deliverables: ["Type-Safe Next.js Route Controllers", "Responsive Tailwind Utility Modules", "Dynamic MongoDB Aggregation Queries", "WebSocket Real-time Client Interfaces"],
    sla: "5 – 14 Days",
  },
  {
    step: "04",
    title: "Launch & Production QA",
    desc: "Validating edge-case logic, compiling with zero warnings, deploying live production builds.",
    badge: "Verification Phase",
    color: "#fbbf24",
    details: "Before shipping, we run TypeScript compilers, full unit test matrices, responsive breakpoint validations, and SEO audits. Once approved, the project transitions dynamically to full-scale Vercel production hosting.",
    deliverables: ["Automated Build Testing & Type Checks", "Vercel Production Edge Deployment", "Post-Launch Core Web Vitals Audit", "Project Deliverables Transfer Protocol"],
    sla: "24 Hours",
  },
];

export function LandingProcess() {
  const processRef = useRef<HTMLElement>(null);
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" ref={processRef} className="py-28 relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={processInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <SectionBadge>Operations Blueprint</SectionBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            How We Execute Sprints
          </h2>
          <p className="mt-4 text-sm sm:text-base font-medium max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            Our strict operational roadmap carries your initiative from discovery blueprints directly to final launch QA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left selector */}
          <div className="lg:col-span-5 space-y-3">
            {PROCESS_STEPS.map((proc, idx) => {
              const isActive = activeStep === idx;
              return (
                <motion.button
                  key={proc.step}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveStep(idx)}
                  className="w-full text-left p-5 rounded-[1.5rem] transition-all duration-300 flex gap-4 items-center relative overflow-hidden"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                    border: isActive ? `1px solid rgba(255,255,255,0.12)` : "1px solid rgba(255,255,255,0.04)",
                    opacity: isActive ? 1 : 0.55,
                  }}
                >
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
                      style={{ background: `radial-gradient(circle at 10% 50%, ${proc.color}18 0%, transparent 60%)` }} />
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 transition-all duration-300"
                    style={{ background: isActive ? proc.color : "rgba(255,255,255,0.05)", color: isActive ? "#000" : "rgba(255,255,255,0.4)" }}>
                    {proc.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white tracking-tight">{proc.title}</h4>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: proc.color }} />}
                    </div>
                    <p className="text-[11px] font-semibold line-clamp-1 mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {proc.desc}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right detail */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="relative rounded-[2.5rem] p-8 sm:p-10 overflow-hidden text-left flex flex-col gap-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: `0 0 80px ${PROCESS_STEPS[activeStep].color}12`,
                }}
              >
                <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full pointer-events-none"
                  style={{ background: PROCESS_STEPS[activeStep].color, filter: "blur(80px)", opacity: 0.15 }} />
                <div className="absolute right-6 bottom-4 font-mono font-black select-none leading-none pointer-events-none"
                  style={{ fontSize: "9rem", color: "rgba(255,255,255,0.025)" }}>
                  {PROCESS_STEPS[activeStep].step}
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase"
                      style={{ background: `${PROCESS_STEPS[activeStep].color}18`, color: PROCESS_STEPS[activeStep].color, border: `1px solid ${PROCESS_STEPS[activeStep].color}30` }}>
                      {PROCESS_STEPS[activeStep].badge}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                      SLA: {PROCESS_STEPS[activeStep].sla}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {PROCESS_STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {PROCESS_STEPS[activeStep].details}
                  </p>
                </div>

                <div className="relative z-10 space-y-3">
                  <h5 className="text-[10px] uppercase font-black tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Operational Deliverables
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PROCESS_STEPS[activeStep].deliverables.map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${PROCESS_STEPS[activeStep].color}18`, border: `1px solid ${PROCESS_STEPS[activeStep].color}30` }}>
                          <Check className="w-2.5 h-2.5" style={{ color: PROCESS_STEPS[activeStep].color }} />
                        </div>
                        <span className="text-xs text-white font-semibold">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
