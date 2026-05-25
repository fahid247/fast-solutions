"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";


export default function DeveloperLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      authType: "developer",
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C0A09] text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors duration-300">
      {/* Background Grids & Orbs */}
      <div className="absolute inset-0 grid-texture opacity-10 dark:opacity-25 pointer-events-none" />
      


      {/* Large Glowing Radial Orbs */}
      <div 
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[150px] opacity-20 dark:opacity-40 animate-pulse-slow" 
        style={{
          background: "radial-gradient(circle, rgba(234,88,12,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)"
        }}
      />
      <div 
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full blur-[150px] opacity-20 dark:opacity-35 animate-pulse-slow" 
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(234,88,12,0.08) 50%, transparent 70%)"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3.5 mb-4 group justify-center">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.15)] group-hover:scale-105 transition-transform duration-300 border border-border bg-card/50 dark:bg-white/[0.02]">
              <img
                src="/logo.png"
                alt="Fast Solutions Logo"
                className="w-full h-full object-cover object-top scale-[1.35] origin-top transform dark:invert dark:hue-rotate-180"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase select-none">
              Fast <span className="text-[#EA580C]">Solutions</span>
            </h1>
          </Link>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-80">Developer & Operations Access</p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 border border-border bg-card/80 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Subtle line glow — violet for dev */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 dark:text-red-400 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Developer Email</Label>
              <Input
                type="email"
                placeholder="developer@fastsolutions.com"
                className="bg-background/50 dark:bg-white/[0.02] border-border dark:border-white/10 focus:border-[#8B5CF6] focus-visible:ring-[#8B5CF6] rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 font-medium transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Operations Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-background/50 dark:bg-white/[0.02] border-border dark:border-white/10 focus:border-[#8B5CF6] focus-visible:ring-[#8B5CF6] rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 font-medium pr-12 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EA580C] hover:opacity-95 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  Verify Credentials
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-xs font-semibold text-muted-foreground">
              Awaiting credentials?{" "}
              <Link href="/developer/register" className="text-[#8B5CF6] hover:underline transition-all">
                Request Developer Access
              </Link>
            </p>
            <p className="text-[10px] font-bold text-muted-foreground/60 mt-3 uppercase tracking-widest">
              Are you a client?{" "}
              <Link href="/client/login" className="text-[#EA580C] hover:underline transition-all">
                Client Portal
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
