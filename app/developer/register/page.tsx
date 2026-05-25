"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import toast from "react-hot-toast";

export default function DeveloperRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role, // "member" (Developer) or "moderator" (Project Lead)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Developer request submitted successfully!");
      setSuccess(true);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/developer/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C0A09] text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors duration-300">
      {/* Background Grids & Orbs */}
      <div className="absolute inset-0 grid-texture opacity-10 dark:opacity-25 pointer-events-none" />
      
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

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
          <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.3)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-black text-2xl italic">F</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
              Fast <span className="text-[#EA580C]">Solutions</span>
            </h1>
          </Link>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-80">Join the Creative Crew</p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 border border-border bg-card/80 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[380px] flex flex-col justify-center">
          {/* Subtle line glow — violet for dev */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />
          
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 dark:text-red-400 text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Alan Turing"
                      className="bg-background/50 dark:bg-white/[0.02] border-border dark:border-white/10 focus:border-[#8B5CF6] focus-visible:ring-[#8B5CF6] rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 font-medium transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Developer Email</Label>
                    <Input
                      type="email"
                      placeholder="crew@fastsolutions.com"
                      className="bg-background/50 dark:bg-white/[0.02] border-border dark:border-white/10 focus:border-[#8B5CF6] focus-visible:ring-[#8B5CF6] rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 font-medium transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Password</Label>
                    <Input
                      type="password"
                      placeholder="•••••••• (Min. 6 chars)"
                      className="bg-background/50 dark:bg-white/[0.02] border-border dark:border-white/10 focus:border-[#8B5CF6] focus-visible:ring-[#8B5CF6] rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 font-medium transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Select Requested Role</Label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      suppressHydrationWarning
                      className="w-full bg-background/50 dark:bg-[#0C0A09]/50 border border-border dark:border-white/10 rounded-xl h-12 px-3 text-sm text-foreground focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all font-semibold"
                    >
                      <option value="member">Developer (Team Member)</option>
                      <option value="moderator">Project Lead (Moderator)</option>
                    </select>
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
                        Request Staff Access
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Footer Link */}
                <div className="pt-6 border-t border-border/50 text-center">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Already have credentials?{" "}
                    <Link href="/developer/login" className="text-[#8B5CF6] hover:underline transition-all">
                      Log In
                    </Link>
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-3 uppercase tracking-widest">
                    Are you a client?{" "}
                    <Link href="/client/register" className="text-[#EA580C] hover:underline transition-all">
                      Customer Sign Up
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse">
                  <ShieldAlert className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-foreground">Request Received</h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">
                  Your registration is submitted and is currently <strong className="text-foreground">pending approval</strong>. An admin has been notified. Redirecting you to login...
                </p>
                <div className="flex justify-center pt-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#EA580C]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
