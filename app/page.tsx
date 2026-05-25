"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowUpRight,
  Sparkles, 
  Code, 
  Layout, 
  Zap, 
  Send,
  CheckCircle2,
  Globe,
  Users,
  Check,
  Layers,
  Terminal,
  ShoppingBag,
  Star,
  Palette,
  Rocket,
  RefreshCw,
  Gauge,
  Search,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function LandingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Simulated dynamic progress loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Fullscreen Premium Mounting Progress Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -50,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0A09] select-none overflow-hidden"
          >
            {/* Background Grids & Orbs */}
            <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
            <div 
              className="pointer-events-none absolute h-[400px] w-[400px] rounded-full blur-[100px] opacity-40 animate-pulse-slow" 
              style={{
                background: "radial-gradient(circle, rgba(234,88,12,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)"
              }}
            />

            {/* Logo Drop in center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 text-center"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,88,12,0.35)] hover:rotate-12 transition-transform duration-500">
                <span className="text-white font-black text-3xl italic">F</span>
              </div>
              <h2 className="text-xl font-black tracking-[-0.04em] text-foreground uppercase mt-4">
                FAST <span className="text-primary">SOLUTIONS</span>
              </h2>
            </motion.div>

            {/* Linear Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 mt-12 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span 
                    key={dot}
                    className="block rounded-full bg-primary/80 animate-bounce"
                    style={{ 
                      width: "6px", 
                      height: "6px",
                      animationDelay: `${dot * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="relative h-[2px] w-64 overflow-hidden rounded-full bg-stone-900 border border-border/10">
                <motion.div 
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                />
              </div>
              
              <p className="text-[10px] font-black tracking-[0.2em] font-mono text-muted-foreground/60">
                LOADING {Math.min(loadingProgress, 100)}%
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 overflow-x-hidden relative font-sans transition-colors duration-300">
        {/* Animated background glow effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[600px] right-1/4 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-teal-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Header / Nav */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                <span className="text-white font-black text-lg italic">F</span>
              </div>
              <span className="text-xl font-black tracking-[-0.05em] text-foreground uppercase">
                Fast <span className="text-primary">Solutions</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-muted-foreground">
              <a href="#services" className="hover:text-foreground transition-colors">Services</a>
              <a href="#process" className="hover:text-foreground transition-colors">Process</a>
              <a href="#projects" className="hover:text-foreground transition-colors">Portfolio</a>
              <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {session ? (
                <>
                  {(session?.user as any)?.role === "client" && (
                    <>
                      <Link
                        href="/dashboard?tab=meeting"
                        className="hidden sm:inline-block text-xs font-bold hover:text-foreground text-muted-foreground transition-colors mr-3"
                      >
                        Book a Meeting
                      </Link>
                      <Link
                        href="/dashboard?tab=order"
                        className="hidden sm:inline-block text-xs font-bold hover:text-foreground text-muted-foreground transition-colors mr-3"
                      >
                        Order Solutions
                      </Link>
                    </>
                  )}
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 font-bold text-xs text-white transition-all shadow-lg shadow-primary/20"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/developer/login" className="text-xs font-bold hover:text-foreground text-muted-foreground transition-colors mr-2">
                    Developer Access
                  </Link>
                  <Link href="/client/login" className="text-xs font-bold hover:text-foreground text-muted-foreground transition-colors">
                    Client Portal
                  </Link>
                  <Link
                    href="/client/register"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 font-bold text-xs text-white transition-all shadow-lg shadow-primary/20"
                  >
                    Request Access
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section with typography reveal & operational preview */}
        <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute inset-0 grid-texture opacity-20 pointer-events-none -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side info */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-black text-primary">Premium Consulting & Build Studio</span>
              </motion.div>

              {/* Reveal line typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[0.98] text-foreground">
                <span className="block overflow-hidden relative py-0.5">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Professional
                  </motion.span>
                </span>
                <span className="block overflow-hidden relative py-0.5">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    consulting for your
                  </motion.span>
                </span>
                <span className="block overflow-hidden relative py-0.5">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.16, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    app & software.
                  </motion.span>
                </span>
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed font-medium"
              >
                We plan, design, and build polished custom CMS portals and product-ready dashboards with strict reliability, harmonic visual aesthetics, and robust real-time synchronization.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {session ? (
                  <>
                    <Link
                      href="/dashboard?tab=meeting"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-95 font-bold text-sm text-white shadow-xl shadow-primary/15 flex items-center justify-center gap-2 group transition-all"
                    >
                      Book a Meeting
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/dashboard?tab=order"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-secondary hover:bg-secondary/85 border border-border font-bold text-sm text-foreground transition-all flex items-center justify-center"
                    >
                      Order Solutions
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/client/register"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-95 font-bold text-sm text-white shadow-xl shadow-primary/15 flex items-center justify-center gap-2 group transition-all"
                    >
                      Partner With Us
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                      href="#services"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-secondary hover:bg-secondary/85 border border-border font-bold text-sm text-foreground transition-all flex items-center justify-center"
                    >
                      Explore Services
                    </a>
                  </>
                )}
              </motion.div>

              {/* Stats panel in grid */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-border/60 bg-border/60 rounded-2xl shadow-lg"
              >
                <div className="bg-card p-4 text-center">
                  <p className="text-xl sm:text-2xl font-black text-primary">2–14 days</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/50 mt-1">Avg. Launch Time</p>
                </div>
                <div className="bg-card p-4 text-center">
                  <p className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">500+</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/50 mt-1">CMS Ships Done</p>
                </div>
                <div className="bg-card p-4 text-center">
                  <p className="text-xl sm:text-2xl font-black text-accent">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/50 mt-1">Client Happiness</p>
                </div>
              </motion.div>
            </div>

            {/* Right side interactive project room preview */}
            <div className="lg:col-span-6 relative">
              <motion.div 
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="glass-card rounded-[2rem] border border-border/80 p-5 md:p-6 shadow-2xl space-y-6 relative overflow-hidden"
              >
                {/* Visual grid backdrop inside card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                
                {/* Header of Project Preview */}
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 font-mono">Live Project Room</span>
                    <h3 className="text-lg font-black text-foreground tracking-tight mt-0.5">FastSolutions Sprint</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 font-bold text-[10px] flex items-center gap-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Active Build
                  </Badge>
                </div>

                {/* Progress bars of preview */}
                <div className="space-y-4 text-left">
                  {[
                    { name: "Strategy & Trust Signals", value: 85, color: "from-primary to-orange-500" },
                    { name: "UX Wireframing & Figma", value: 92, color: "from-accent to-violet-500" },
                    { name: "Responsive Core Code", value: 68, color: "from-teal-500 to-emerald-500" },
                    { name: "Launch QA Testing", value: 45, color: "from-amber-500 to-amber-600" }
                  ].map((sprint) => (
                    <div key={sprint.name} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{sprint.name}</span>
                        <span className="font-mono text-foreground">{sprint.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden border border-border/40 p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${sprint.value}%` }}
                          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${sprint.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grid tag platform capabilities */}
                <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-2">
                  {[
                    "Next.js App", "Tailwind CSS", "Framer Motion", "MongoDB Atlas", "WebSockets Sync", "API Gateway"
                  ].map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1.5 rounded-xl border border-border/60 bg-secondary/30 text-[10px] font-black text-muted-foreground/80 hover:border-primary/20 hover:text-primary transition-all text-center"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
            
          </div>
        </section>

        {/* Dynamic Infinite Auto-Scrolling Technology Marquee */}
        <section className="relative border-y border-border bg-secondary/15 py-6 overflow-hidden select-none">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden">
            <div className="flex space-x-8 animate-marquee whitespace-nowrap">
              {[
                "Next.js App Router", "Tailwind CSS Layouts", "Responsive Design", "MongoDB Database", "Socket.io Sync", "Framer Motion Visuals", "UI/UX Figma Architecture", "API Custom Gateways", "NextAuth Security", "Premium Aesthetics"
              ].map((tag) => (
                <span 
                  key={tag}
                  className="px-6 py-2.5 rounded-full border border-border/80 bg-background/50 text-xs font-black text-muted-foreground/60 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Duplicated list to create infinite looping illusion */}
            <div className="flex space-x-8 animate-marquee whitespace-nowrap" aria-hidden="true">
              {[
                "Next.js App Router", "Tailwind CSS Layouts", "Responsive Design", "MongoDB Database", "Socket.io Sync", "Framer Motion Visuals", "UI/UX Figma Architecture", "API Custom Gateways", "NextAuth Security", "Premium Aesthetics"
              ].map((tag) => (
                <span 
                  key={tag + "-dup"}
                  className="px-6 py-2.5 rounded-full border border-border/80 bg-background/50 text-xs font-black text-muted-foreground/60 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section with high-fidelity glass cards */}
        <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
              Our Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Polished builds, no template filling.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
              We design around trust signals, content hierarchy, raw speeds, and modern interfaces that your team will actually enjoy using every single day.
            </p>
          </div>          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                slug: "shopify",
                badge: "Shopify",
                title: "Shopify Development",
                description: "Conversion-led storefronts built to sell.",
                icon: ShoppingBag,
                color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/40",
                badgeColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              },
              {
                slug: "wordpress",
                badge: "WordPress",
                title: "WordPress Development",
                description: "Custom WordPress sites built for growth.",
                icon: Code,
                color: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-400/40",
                badgeColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"
              },
              {
                slug: "wix",
                badge: "Wix",
                title: "Wix Development",
                description: "Professional Wix sites that look nothing like templates.",
                icon: Layout,
                color: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 hover:border-orange-400/40",
                badgeColor: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20"
              },
              {
                slug: "squarespace",
                badge: "Squarespace",
                title: "Squarespace Design",
                description: "Elegant Squarespace sites for premium brands.",
                icon: Palette,
                color: "text-violet-500 dark:text-violet-400 bg-violet-500/10 border-violet-500/20 hover:border-violet-400/40",
                badgeColor: "text-violet-500 dark:text-violet-400 bg-violet-500/10 border-violet-500/20"
              },
              {
                slug: "landing-page",
                badge: "Any CMS",
                title: "Landing Page Design",
                description: "High-converting pages built for one goal.",
                icon: Rocket,
                color: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-400/40",
                badgeColor: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20"
              },
              {
                slug: "website-redesign",
                badge: "Any CMS",
                title: "Website Redesign",
                description: "Transform your site into a real business asset.",
                icon: RefreshCw,
                color: "text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20 hover:border-teal-400/40",
                badgeColor: "text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20"
              },
              {
                slug: "speed-optimization",
                badge: "Any CMS",
                title: "Speed Optimization",
                description: "Faster pages. Better rankings. More conversions.",
                icon: Gauge,
                color: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 hover:border-orange-400/40",
                badgeColor: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20"
              },
              {
                slug: "seo-setup",
                badge: "Any CMS",
                title: "SEO Setup",
                description: "Technical SEO foundations that last.",
                icon: Search,
                color: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-400/40",
                badgeColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
              },
              {
                slug: "custom-code",
                badge: "Custom Code",
                title: "Custom Code Development",
                description: "Bespoke web solutions built exactly to your spec.",
                icon: Terminal,
                color: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-400/40",
                badgeColor: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
              },
              {
                slug: "full-stack",
                badge: "Full Stack",
                title: "Full Stack Development",
                description: "Complete web applications from frontend to database.",
                icon: Globe,
                color: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-400/40",
                badgeColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
              },
              {
                slug: "maintenance",
                badge: "All CMS",
                title: "Website Maintenance",
                description: "Keep your site fast, secure, and up to date.",
                icon: Settings,
                color: "text-stone-500 dark:text-stone-400 bg-stone-500/10 border-stone-500/20 hover:border-stone-400/40",
                badgeColor: "text-stone-500 dark:text-stone-400 bg-stone-500/10 border-stone-500/20"
              }
            ].map((srv, idx) => (
              <Link href={`/services/${srv.slug}`} key={srv.title} className="block h-full">
                <motion.div 
                  variants={cardVariants} 
                  className="relative bg-card/60 backdrop-blur-md rounded-[1.75rem] p-6 border border-border/60 space-y-6 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left h-full"
                >
                  <div className="space-y-4">
                    {/* Top Line: Icon & Diagonal Arrow */}
                    <div className="flex justify-between items-start">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${srv.color}`}>
                        <srv.icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>

                    {/* Middle Line: Kicker Badge, Title, Description */}
                    <div className="space-y-2.5">
                      <Badge className={`text-[8px] uppercase tracking-wider font-mono font-black rounded-full px-2 py-0.5 border border-transparent select-none shrink-0 ${srv.badgeColor}`}>
                        {srv.badge}
                      </Badge>
                      <h3 className="text-base font-black text-foreground tracking-tight leading-snug">{srv.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Line: Learn more link */}
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-tight cursor-pointer">
                      <span className={`${srv.color.split(" ")[0]} group-hover:underline transition-all`}>Learn more</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-all group-hover:translate-x-1 ${srv.color.split(" ")[0]}`} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* Operational Process Timeline Section */}
        <section id="process" className="py-24 bg-secondary/5 border-y border-border/30 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                Our Operations Blueprint
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                How We Execute Sprints
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-medium">
                Our strict operational roadmap carries your initiative from discovery blueprints directly to final launch QA. Click each step to see deep operational workflows.
              </p>
            </div>

            {/* Split Interactive Station Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Selector (Cols 1-5) */}
              <div className="lg:col-span-5 space-y-4">
                {[
                  {
                    step: "01",
                    title: "Discovery & Scope Blueprint",
                    desc: "Mapping client goals, creating technical architectures, and locking down deliverables and specs.",
                    badge: "Discovery Phase",
                    accent: "border-primary hover:border-primary/60",
                    glow: "rgba(234, 88, 12, 0.15)"
                  },
                  {
                    step: "02",
                    title: "UX & Figma Design System",
                    desc: "Polishing wireframes, typography styles, asset layouts, and interactive prototypes in Figma.",
                    badge: "Design Phase",
                    accent: "border-accent hover:border-accent/60",
                    glow: "rgba(139, 92, 246, 0.15)"
                  },
                  {
                    step: "03",
                    title: "Resilient Full-Stack Build",
                    desc: "Writing dynamic React views, Next.js routing controllers, and robust MongoDB collections.",
                    badge: "Development Phase",
                    accent: "border-teal-500 hover:border-teal-500/60",
                    glow: "rgba(13, 148, 136, 0.15)"
                  },
                  {
                    step: "04",
                    title: "Launch & Production QA",
                    desc: "Validating edge-case logic, compiling files with zero warnings, and deploying live production builds.",
                    badge: "Verification Phase",
                    accent: "border-amber-500 hover:border-amber-500/60",
                    glow: "rgba(245, 158, 11, 0.15)"
                  }
                ].map((proc, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <motion.button
                      key={proc.step}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-5 rounded-[1.75rem] border transition-all duration-300 cursor-pointer flex gap-4 items-center relative overflow-hidden ${
                        isActive 
                          ? "bg-card border-foreground/15 shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.3)] z-10" 
                          : "bg-transparent border-border/40 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {isActive && (
                        <div 
                          className="absolute inset-0 opacity-10 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 10% 50%, ${proc.glow} 0%, transparent 60%)`
                          }}
                        />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                        isActive 
                          ? "bg-foreground text-background" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {proc.step}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-foreground tracking-tight">{proc.title}</h4>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 font-semibold">{proc.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Right Deep-Dive glass card (Cols 6-12) */}
              <div className="lg:col-span-7 h-full min-h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-card/60 backdrop-blur-md rounded-[2.25rem] border border-border/60 p-8 sm:p-10 relative overflow-hidden text-left flex flex-col justify-between shadow-2xl space-y-6"
                  >
                    {/* Glowing Accent Ring */}
                    <div 
                      className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[80px] opacity-20 pointer-events-none"
                      style={{
                        background: activeStep === 0 ? "#EA580C" : activeStep === 1 ? "#8B5CF6" : activeStep === 2 ? "#0D9488" : "#FBBF24"
                      }}
                    />

                    {/* Step Large Background Watermark */}
                    <div className="absolute right-6 bottom-4 text-[120px] font-mono font-black text-foreground/[0.03] select-none leading-none">
                      {activeStep === 0 ? "01" : activeStep === 1 ? "02" : activeStep === 2 ? "03" : "04"}
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <Badge className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 ${
                          activeStep === 0 
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20" 
                            : activeStep === 1 
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" 
                            : activeStep === 2 
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                          {activeStep === 0 ? "Discovery Phase" : activeStep === 1 ? "Design Phase" : activeStep === 2 ? "Development Phase" : "Verification Phase"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-wider font-mono">
                          Target SLA: {activeStep === 0 ? "24 - 48 Hours" : activeStep === 1 ? "3 - 5 Days" : activeStep === 2 ? "5 - 14 Days" : "24 Hours"}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        {activeStep === 0 ? "Discovery & Scope Blueprint" : activeStep === 1 ? "UX & Figma Design System" : activeStep === 2 ? "Resilient Full-Stack Build" : "Launch & Production QA"}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {activeStep === 0 
                          ? "Our process kicks off with structured blueprints. We define exact schema designs, align system specifications, design visual parameters, and establish rigid roadmap deadlines, preventing any downstream features drift." 
                          : activeStep === 1 
                          ? "Next, we translate specifications into highly interactive component libraries and layouts inside Figma. We build modern color palettes, strict typography grids, adaptive layouts, and complete responsive UX wireframes." 
                          : activeStep === 2 
                          ? "Our creative crew develops clean, type-safe code utilizing Next.js, robust MongoDB Atlas schemas, and real-time state managers. All modules are optimized for extreme load speeds and immediate rendering." 
                          : "Before shipping, we run static TypeScript compilers, full unit test matrices, responsive break-point validations, and SEO audits. Once approved, the project transitions dynamically to full-scale Vercel production hosting."
                        }
                      </p>
                    </div>

                    {/* Sub-deliverables Checklist */}
                    <div className="space-y-3 relative z-10">
                      <h5 className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Operational Deliverables</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(activeStep === 0 
                          ? [
                              "Interactive User Flow Blueprinting",
                              "Technical Stack Lock & Schema Definitions",
                              "Milestones & Scope Sign-off Specifications",
                              "Assigned Team Roster Allocation"
                            ] 
                          : activeStep === 1 
                          ? [
                              "Component-driven Figma Design System",
                              "High-fidelity Desktop & Mobile Prototypes",
                              "Usability Walkthrough Tapes",
                              "Interactive Layout Color Systems"
                            ] 
                          : activeStep === 2 
                          ? [
                              "Type-Safe Next.js Route Controllers",
                              "Responsive Tailwind Utility Modules",
                              "Dynamic MongoDB Aggregation Queries",
                              "WebSocket Real-time Client Interfaces"
                            ] 
                          : [
                              "Automated Build Testing & Type Checks",
                              "Vercel Production Edge Deployment",
                              "Post-Launch Core Web Vitals Audit",
                              "Project Deliverables Transfer Protocol"
                            ]
                        ).map((del, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                            </div>
                            <span className="text-xs text-foreground font-semibold tracking-tight">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive charging progressive bar */}
                    <div className="space-y-2 relative z-10 pt-4 border-t border-border/40">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-muted-foreground">Phase Completion Progress</span>
                        <span className="text-foreground">{activeStep === 0 ? "100%" : activeStep === 1 ? "100%" : activeStep === 2 ? "75%" : "20%"}</span>
                      </div>
                      <div className="h-2 w-full bg-stone-900 border border-border/10 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: activeStep === 0 ? "100%" : activeStep === 1 ? "100%" : activeStep === 2 ? "75%" : "20%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            activeStep === 0 
                              ? "bg-orange-500" 
                              : activeStep === 1 
                              ? "bg-violet-500" 
                              : activeStep === 2 
                              ? "bg-teal-500" 
                              : "bg-amber-500"
                          }`}
                        />
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Carousel Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
              Reviews
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              What Partners Say About Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: "Fast Solutions completely re-architected our agency platform. The new light/dark mode systems are gorgeous, and the real-time project rooms are dynamically synced.",
                author: "Sarah Chen",
                role: "Lead UI/UX Architect"
              },
              {
                text: "The split authentication systems and customer portal are extremely premium. Clients love booking consultations and ordering custom services directly from their console.",
                author: "Fahid Aqundow",
                role: "Operations Specialist"
              },
              {
                text: "Next.js routing compile speeds are incredibly fast, and their MongoDB Atlas aggregates resolved all our visual data discrepancy bugs permanently.",
                author: "Alex Rivera",
                role: "Senior Full Stack Dev"
              }
            ].map((tst, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-[2rem] p-6 border border-border/80 text-left space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    "{tst.text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40">
                  <p className="font-black text-sm text-foreground">{tst.author}</p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{tst.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Showcase section */}
        <section id="projects" className="py-24 bg-secondary/5 border-y border-border/30 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3 text-left">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                  Featured Case Studies
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                  Our Polished Initiatives
                </h2>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed font-semibold text-left">
                Explore real custom platforms, live aggregators, and creative motion systems successfully delivered by our studio.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Card 01: Crypto Pulse Indexer */}
              <div className="group space-y-6 text-left cursor-pointer">
                <div className="aspect-[16/10] w-full rounded-[2.5rem] border border-white/10 overflow-hidden relative flex items-center justify-center p-6 sm:p-10 transition-all duration-500 bg-[#0C0A09] shadow-2xl group-hover:border-primary/30">
                  <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-[100px] bg-teal-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Simulated Crypto Analytics Dashboard Mockup */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="w-full max-w-md bg-stone-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4 relative z-10 overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white tracking-tight">CryptoPulse Index</h4>
                          <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider font-mono">Aggregator V3.4</p>
                        </div>
                      </div>
                      <Badge className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[8px] uppercase tracking-wider font-black font-mono">Live Syncing</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
                        <span className="text-[8px] text-stone-500 uppercase font-black tracking-wider">BTC / USD</span>
                        <div className="text-sm font-black text-white tracking-tight">$96,432.50</div>
                        <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">▲ +4.82%</div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
                        <span className="text-[8px] text-stone-500 uppercase font-black tracking-wider">ETH / USD</span>
                        <div className="text-sm font-black text-white tracking-tight">$3,842.10</div>
                        <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">▲ +3.12%</div>
                      </div>
                    </div>

                    {/* Dynamic SVG Sparkline Graph */}
                    <div className="h-16 w-full relative pt-2">
                      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="tealGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* Shaded Area */}
                        <path 
                          d="M0 30 L5 25 L15 28 L25 15 L35 22 L45 8 L55 18 L65 5 L75 12 L85 2 L95 10 L100 5 L100 30 Z" 
                          fill="url(#tealGlow)" 
                        />
                        {/* Line Path */}
                        <motion.path 
                          d="M0 30 L5 25 L15 28 L25 15 L35 22 L45 8 L55 18 L65 5 L75 12 L85 2 L95 10 L100 5" 
                          fill="none" 
                          stroke="#14B8A6" 
                          strokeWidth="1.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />
                      </svg>
                      <div className="absolute right-2 top-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                        <span className="text-[8px] text-teal-400 font-mono font-black uppercase tracking-wider">42ms Latency</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Meta details */}
                <div className="space-y-3 px-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">Crypto Pulse Indexer</h3>
                    <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[9px] uppercase tracking-widest font-black rounded-full px-3 py-1">SaaS & FinTech</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    Real-time transaction aggregator displaying WebSocket stream indices, historical analytics, and server-side aggregation pipelines across global market nodes.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Next.js 16", "WebSockets", "MongoDB Atlas", "Tailwind CSS"].map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/40 font-bold uppercase tracking-wider font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 02: Eco Global Ecosystem */}
              <div className="group space-y-6 text-left cursor-pointer">
                <div className="aspect-[16/10] w-full rounded-[2.5rem] border border-white/10 overflow-hidden relative flex items-center justify-center p-6 sm:p-10 transition-all duration-500 bg-[#0C0A09] shadow-2xl group-hover:border-accent/30">
                  <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-[100px] bg-accent/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Simulated Design System Interface Mockup */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="w-full max-w-md bg-stone-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4 relative z-10 overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <Layers className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white tracking-tight">EcoGlobal System</h4>
                          <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider font-mono">Design System V1.2</p>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent-foreground border border-accent/20 text-[8px] uppercase tracking-wider font-black font-mono">Figma Connected</Badge>
                    </div>

                    {/* Circular Interactive Gauges Mockup */}
                    <div className="flex items-center justify-between gap-4 py-1">
                      <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-2.5 w-full">
                        <div className="relative w-10 h-10 rounded-full flex items-center justify-center border border-white/10 font-mono font-black text-[9px] text-white">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent"/>
                            <motion.circle 
                              cx="20" cy="20" r="16" 
                              stroke="#8B5CF6" strokeWidth="2.5" fill="transparent"
                              strokeDasharray="100"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{ strokeDashoffset: 25 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          75%
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[7px] text-stone-500 uppercase font-black tracking-wider">Performance</span>
                          <div className="text-[11px] font-black text-white">Projected Lift</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-2.5 w-full">
                        <div className="relative w-10 h-10 rounded-full flex items-center justify-center border border-white/10 font-mono font-black text-[9px] text-white">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent"/>
                            <motion.circle 
                              cx="20" cy="20" r="16" 
                              stroke="#8B5CF6" strokeWidth="2.5" fill="transparent"
                              strokeDasharray="100"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{ strokeDashoffset: 10 }}
                              transition={{ duration: 1.8, ease: "easeOut" }}
                            />
                          </svg>
                          90%
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[7px] text-stone-500 uppercase font-black tracking-wider">Eco Efficiency</span>
                          <div className="text-[11px] font-black text-white">-8.4t Carbon</div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive UI Color Swatches */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5 justify-between">
                      <span className="text-[8px] text-stone-500 uppercase font-black tracking-wider">Active Color Swatches</span>
                      <div className="flex items-center gap-1.5">
                        <motion.div whileHover={{ scale: 1.1 }} className="w-5 h-5 rounded-full bg-[#EA580C] border border-white/20 shadow-md cursor-pointer" />
                        <motion.div whileHover={{ scale: 1.1 }} className="w-5 h-5 rounded-full bg-[#8B5CF6] border border-white/20 shadow-md cursor-pointer" />
                        <motion.div whileHover={{ scale: 1.1 }} className="w-5 h-5 rounded-full bg-[#0D9488] border border-white/20 shadow-md cursor-pointer" />
                        <motion.div whileHover={{ scale: 1.1 }} className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-white/20 shadow-md cursor-pointer" />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Meta details */}
                <div className="space-y-3 px-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">Eco Global Ecosystem</h3>
                    <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-[9px] uppercase tracking-widest font-black rounded-full px-3 py-1">UX & Branding</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    A comprehensive design-token system and carbon offset dashboard featuring high-contrast interactive components, visual token mappings, and fluid UI flow diagrams.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Figma Tokens", "Framer Motion", "Recharts", "Three.js"].map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/40 font-bold uppercase tracking-wider font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive Contact Form Section */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
              Consultation Inquiry
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Let's build something beautiful.
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm font-semibold max-w-md mx-auto leading-relaxed">
              Submit your inquiry details today to receive a dynamic system proposal and customized timetable schedules.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2rem] p-8 sm:p-10 border border-border/80 space-y-6 shadow-xl"
          >
            <form className="space-y-5 text-left" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    suppressHydrationWarning
                    className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-primary transition-colors duration-300 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    suppressHydrationWarning
                    className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-primary transition-colors duration-300 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Requested</label>
                <select 
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-300 font-semibold"
                >
                  <option value="web" className="bg-background text-foreground">Creative Web Architecture</option>
                  <option value="saas" className="bg-background text-foreground">Next-Gen SaaS & API Development</option>
                  <option value="sync" className="bg-background text-foreground">Real-Time Operational Dashboard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Project Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you are scaling or planning..."
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-primary transition-colors duration-300 resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-95 font-bold text-xs text-white shadow-xl shadow-primary/10 flex items-center justify-center gap-2 group transition-all cursor-pointer border-none"
              >
                Send Inquiry Message
                <Send className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground/40 font-medium max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs italic">F</span>
            </div>
            <span className="font-bold text-muted-foreground/60 uppercase tracking-tighter">Fast Solutions</span>
          </div>
          <p>© 2026 Fast Solutions. Engineered with confidence.</p>
        </footer>
      </div>
    </>
  );
}
