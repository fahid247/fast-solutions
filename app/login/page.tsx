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


export default function LoginPage() {
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
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">


      {/* Background glows */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
              Fast <span className="text-primary">Solutions</span>
            </h1>
          </Link>
          <p className="text-muted-foreground font-medium text-sm">Sign in to your digital operations center</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-border/40 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Email Address</Label>
              <Input
                type="email"
                placeholder="you@fastsolutions.com"
                className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground placeholder:text-muted-foreground/30 font-medium transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-background/50 border-border focus:border-primary focus-visible:ring-primary rounded-xl h-12 text-foreground pr-12 placeholder:text-muted-foreground/30 font-medium transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black h-12 rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-muted-foreground/50 text-xs font-medium">
              No account yet?{" "}
              <Link href="/register" className="text-primary font-black hover:text-primary/80 transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
