"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";



export function LandingNav() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-md">
      <div className="absolute inset-0 pointer-events-none bg-background/80" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/#hero" className="flex items-center gap-3 group">
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
        </div>
      </div>
    </header>
  );
}
