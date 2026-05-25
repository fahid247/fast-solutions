"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { SectionBadge } from "./shared";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function LandingContact() {
  const { data: session } = useSession();

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, rgba(167,139,250,0.04) 50%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, ease: EASE_OUT }}
        >
          <SectionBadge>Let&apos;s Work Together</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            Ready to build something
            <br />
            <span style={{ color: "#f97316" }}>extraordinary?</span>
          </h2>
          <p className="mt-6 text-base font-medium leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Tell us about your project. We&apos;ll respond within 24 hours with a tailored scope blueprint and a free consultation call.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard?tab=meeting"
                  className="group px-10 py-4 rounded-2xl font-black text-sm text-white flex items-center gap-2 transition-all"
                  style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 8px 40px rgba(249,115,22,0.35)" }}>
                  Book a Meeting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard?tab=order"
                  className="px-10 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  Order Solutions
                </Link>
              </>
            ) : (
              <>
                <Link href="/client/register"
                  className="group px-10 py-4 rounded-2xl font-black text-sm text-white flex items-center gap-2 transition-all"
                  style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 8px 40px rgba(249,115,22,0.35)" }}>
                  Start Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/client/login"
                  className="px-10 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  Client Portal
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: CheckCircle2, label: "Free Consultation" },
              { icon: Zap, label: "24hr Response" },
              { icon: Star, label: "98% Satisfaction" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="w-4 h-4" style={{ color: "#f97316" }} />
                <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
