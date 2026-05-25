"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";



export function LandingNav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-md">
      <div className="absolute inset-0 pointer-events-none bg-background/80" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/#hero" onClick={(e) => {
          if (typeof window !== "undefined" && window.location.pathname === "/") {
            e.preventDefault();
            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
          }
        }} className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <img
              src="/logo.png"
              alt="Fast Solutions Logo"
              className="w-full h-full object-cover object-top scale-[1.35] origin-top transform"
              style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.15)" }}
            />
          </div>
          <span className="text-base md:text-lg font-black tracking-wider text-foreground uppercase select-none" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            FAST<span style={{ color: "#f97316" }}> SOLUTIONS</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
          {["Services", "Process", "Work", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="nav-underline hover:text-foreground transition-colors duration-200">
              {item}
            </a>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-3">

          {session ? (
            <>
              <Link href="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-95"
                style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 0 20px rgba(249,115,22,0.25)" }}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/client/login"
                className="hidden sm:block text-[10px] font-black uppercase tracking-wider transition-colors text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link href="/client/register"
                className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground">
                Start Project <ChevronRight className="w-3 h-3" />
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Navigation Dropdown Card */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-[68px] left-4 right-4 md:hidden z-50 bg-[#0c0c0c]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5"
        >
          {/* Nav links with hover animations */}
          <div className="flex flex-col gap-1.5">
            {[
              { name: "Services", href: "#services" },
              { name: "Process", href: "#process" },
              { name: "Work", href: "#work" },
              { name: "Contact", href: "#contact" },
            ].map((item, idx) => (
              <motion.a
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 + 0.05 }}
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-[0.12em] text-white/90 hover:text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/5 flex items-center justify-between group"
              >
                <span>{item.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: "#f97316" }} />
              </motion.a>
            ))}
          </div>

          {/* Bottom Actions inside Mobile Dropdown */}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider text-white transition-all"
                style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 4px 20px rgba(249,115,22,0.2)" }}
              >
                Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/client/login"
                  onClick={() => setIsOpen(false)}
                  className="py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider text-white/80 border border-white/10 hover:text-white hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/client/register"
                  onClick={() => setIsOpen(false)}
                  className="py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-1"
                  style={{ background: "linear-gradient(135deg,#f97316,#a78bfa)", boxShadow: "0 4px 15px rgba(249,115,22,0.2)" }}
                >
                  Start Project <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
