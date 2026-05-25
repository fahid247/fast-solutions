"use client";

import { motion } from "framer-motion";
import { Clock, Mail, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function PendingPage() {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background glows */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center z-10"
      >
        {/* Animated Pending Icon */}
        <div className="relative mx-auto mb-8 w-28 h-28">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          />
          <div className="absolute inset-2 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.1)]">
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <span className="text-white text-[10px] font-black">!</span>
          </motion.div>
        </div>

        {/* Logo */}
        <div className="inline-flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
            <span className="text-white font-black text-xl italic">F</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
            Fast <span className="text-primary">Solutions</span>
          </h1>
        </div>

        {/* Content */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-border/40 shadow-2xl space-y-6">
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Awaiting <span className="text-primary">Clearance</span>
          </h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm mx-auto">
            Your registration has been received. An admin will review and approve your access within 24 hours.
          </p>

          {/* Status Info Cards */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-secondary/40 border border-border/60">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Status</p>
                <p className="text-sm font-black text-primary">Pending</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-secondary/40 border border-border/60">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Contact</p>
                <p className="text-sm font-black text-accent font-semibold">Admin</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-muted-foreground/60 text-xs font-bold hover:text-destructive transition-colors"
            >
              Sign out and try again later
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
