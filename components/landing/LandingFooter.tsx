"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
            <img
              src="/logo.png"
              alt="Fast Solutions Logo"
              className="w-full h-full object-cover object-top scale-[1.35] origin-top transform"
              style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.15)" }}
            />
          </div>
          <span className="font-black text-sm uppercase text-white tracking-wider">
            FAST<span style={{ color: "#f97316" }}> SOLUTIONS</span>
          </span>
        </Link>
        <p className="text-[11px] font-semibold text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} Fast Solutions. Premium Digital Agency. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Link href="/client/login" className="hover:text-white transition-colors">Client Login</Link>
          <Link href="/developer/login" className="hover:text-white transition-colors text-primary">Developer Login</Link>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
        </div>
      </div>
    </footer>
  );
}
