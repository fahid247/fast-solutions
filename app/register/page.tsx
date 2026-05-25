"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(234,88,12,0.15)]">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Access Requested</h2>
          <p className="text-muted-foreground font-medium leading-relaxed mb-8">
            Your registration is pending admin approval. You&apos;ll be notified once your account is activated.
          </p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black rounded-xl px-8 h-12 shadow-xl shadow-primary/10">
              Back to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="text-white font-black text-2xl italic">F</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
              Fast <span className="text-primary">Solutions</span>
            </h1>
          </Link>
          <p className="text-muted-foreground font-medium text-sm">Request access to the operations center</p>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-border/40 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-xs font-bold text-center">
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Full Name</Label>
              <Input placeholder="Your name" className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground placeholder:text-muted-foreground/30 font-medium transition-colors" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Email Address</Label>
              <Input type="email" placeholder="you@fastsolutions.com" className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground placeholder:text-muted-foreground/30 font-medium transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground pr-12 placeholder:text-muted-foreground/30 font-medium transition-colors" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Confirm Password</Label>
              <Input type="password" placeholder="Repeat password" className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground placeholder:text-muted-foreground/30 font-medium transition-colors" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black h-12 rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] border-none mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Access"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/40 text-center">
            <p className="text-muted-foreground/50 text-xs font-medium">
              Already have access?{" "}
              <Link href="/login" className="text-primary font-black hover:text-primary/80 transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
