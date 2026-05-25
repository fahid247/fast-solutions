"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Code, 
  Layout, 
  Zap, 
  ShoppingBag,
  Palette,
  Rocket,
  RefreshCw,
  Gauge,
  Search,
  Settings,
  Terminal,
  Globe,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


// Map slugs to standard Lucide icons
const iconMap: Record<string, any> = {
  ShoppingBag,
  Code,
  Layout,
  Palette,
  Rocket,
  RefreshCw,
  Gauge,
  Search,
  Terminal,
  Globe,
  Settings
};

// Database-like catalog of the 11 capabilities
const servicesData: Record<string, {
  title: string;
  badge: string;
  description: string;
  iconName: string;
  color: string;
  badgeColor: string;
  accentColor: string;
  glow: string;
  pricing: string;
  deliveryTime: string;
  longDesc: string;
  features: string[];
  timeline: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}> = {
  shopify: {
    title: "Shopify Storefronts Development",
    badge: "Shopify",
    description: "Conversion-led storefronts built to sell.",
    iconName: "ShoppingBag",
    color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badgeColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    accentColor: "#10B981",
    glow: "rgba(16, 185, 129, 0.2)",
    pricing: "$1,899",
    deliveryTime: "7 - 14 Days",
    longDesc: "We build custom Shopify storefronts designed to maximize conversions, lower cart abandonment, and scale your brand. Our setups utilize dynamic Liquid modeling, custom section blocks, optimized checkout sequences, and lightweight scripts for extreme performance.",
    features: [
      "Custom Shopify Liquid Section Architecture",
      "Conversion-Optimized Checkout Journeys",
      "Dynamic Cart drawer & Cross-sell Blocks",
      "Third-Party App Integrations & Clean Scripts",
      "Mobile-First Responsive Liquid Layouts"
    ],
    timeline: [
      { step: "01", title: "Theme Architecture & Scope", desc: "Setting up shop structures, design parameters, and app integration mapping." },
      { step: "02", title: "Figma Draft & Asset Packaging", desc: "Crafting wireframes, responsive grids, checkout banners, and loading tokens." },
      { step: "03", title: "Liquid Coding & Integrations", desc: "Writing custom code blocks, connecting gateways, and launching inventory telemetry." }
    ],
    faqs: [
      { q: "Can you migrate my existing store to Shopify?", a: "Yes. We execute complete migrations including customer registries, product catalogues, variant assets, and billing logs safely." },
      { q: "Do you support custom checkout architectures?", a: "Yes. We support custom Liquid overrides, cart Drawer hooks, and custom shipping script allocations." },
      { q: "Will the store remain fast with multiple apps?", a: "We minimize app bloat by writing native features directly in custom section code, avoiding heavy third-party plugins." }
    ]
  },
  wordpress: {
    title: "WordPress Custom Development",
    badge: "WordPress",
    description: "Custom WordPress sites built for growth.",
    iconName: "Code",
    color: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    badgeColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    accentColor: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.2)",
    pricing: "$1,499",
    deliveryTime: "5 - 10 Days",
    longDesc: "Custom-coded WordPress theme architectures engineered from the ground up with clean PHP controllers and Gutenberg blocks. No visual page builders or bulk themes, resulting in lightweight, high-ranking, and secure business platforms.",
    features: [
      "Custom Gutenberg Block Blocksuite",
      "Security Hardened Core & Asset Cleanups",
      "Advanced Custom Fields (ACF) Setup",
      "Dynamic Custom Post Types (CPT) mapping",
      "Loom Video Administrator Walkthrough"
    ],
    timeline: [
      { step: "01", title: "Database & Structure Blueprint", desc: "Configuring database routes, user schemas, and dynamic categories." },
      { step: "02", title: "UX Layout Tokenization", desc: "Prototyping typography hierarchies, navigation, and block blocks." },
      { step: "03", title: "ACF Block Coding", desc: "Developing custom block modules and deploying secure hosting arrays." }
    ],
    faqs: [
      { q: "Do you use Elementor or Divi builders?", a: "No. We write lightweight native Gutenberg blocks or custom ACF architectures to ensure maximum load speeds and security." },
      { q: "Can I manage the text content easily myself?", a: "Yes. We customize WordPress editing pages so you can edit images, text arrays, and blogs effortlessly without breaking the site structure." },
      { q: "Are WordPress sites secure from bots?", a: "We hardcode security filters, block directory traversal routes, and enforce strict database injection boundaries." }
    ]
  },
  wix: {
    title: "Wix Premium Development",
    badge: "Wix",
    description: "Professional Wix sites that look nothing like templates.",
    iconName: "Layout",
    color: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    badgeColor: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    accentColor: "#F97316",
    glow: "rgba(249, 115, 22, 0.2)",
    pricing: "$999",
    deliveryTime: "4 - 7 Days",
    longDesc: "High-end Wix Studio builds designed to be gorgeous, responsive, and professional. We configure Wix Velo custom scripts, lightweight animations, dynamic datasets, database routers, and high-performance assets so they stand out from standard templates.",
    features: [
      "Responsive Wix Studio Flex Layouts",
      "Custom Wix Velo Database Scripting",
      "Dynamic Database Collections & Lists",
      "Lightweight Custom Animations Layout",
      "Fully Integrated Wix Bookings & Stores"
    ],
    timeline: [
      { step: "01", title: "Canvas Dimensions Setup", desc: "Setting responsive grids, canvas layers, and Wix workspace parameters." },
      { step: "02", title: "Velo Database Integration", desc: "Creating collection models and database query schemas." },
      { step: "03", title: "Final Responsive Alignment", desc: "Fine-tuning breakpoint nodes (tablet, mobile) and optimizing load paths." }
    ],
    faqs: [
      { q: "What is Wix Velo?", a: "Velo is Wix's JavaScript framework. It allows us to build custom databases, write advanced event listeners, and connect APIs directly." },
      { q: "Will the site look like a generic template?", a: "No. We build exclusively on Wix Studio from completely blank canvases, drafting bespoke agency-grade visual layouts." },
      { q: "Can you connect my domain name?", a: "Yes, we handle full domain configuration, SEO redirects, and DNS records routing." }
    ]
  },
  squarespace: {
    title: "Squarespace Premium Design",
    badge: "Squarespace",
    description: "Elegant Squarespace sites for premium brands.",
    iconName: "Palette",
    color: "text-violet-500 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    badgeColor: "text-violet-500 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    accentColor: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.2)",
    pricing: "$1,199",
    deliveryTime: "4 - 8 Days",
    longDesc: "Artistic, typography-centered Squarespace experiences built for portfolios, boutique consultancies, and digital agencies. We integrate custom CSS overrides, premium grid layouts, custom navigation effects, and beautiful animations that feel extremely premium.",
    features: [
      "Fluid Engine Layout Token Systems",
      "Custom CSS Navigation & Button Overrides",
      "Typography Scale & Balance Config",
      "Custom Javascript Form Popups",
      "Full Squarespace Scheduling Integrations"
    ],
    timeline: [
      { step: "01", title: "Visual Style Framework", desc: "Mapping color matrices, selecting premium fonts, and packaging brand assets." },
      { step: "02", title: "CSS Styles Injection", desc: "Writing custom code blocks to override default grid limits." },
      { step: "03", title: "Domain & SEO Handover", desc: "Mapping DNS records, testing mobile responsive scales, and pushing indexes." }
    ],
    faqs: [
      { q: "Do you write custom CSS for Squarespace?", a: "Yes. We utilize custom code injection and custom CSS sheets to style elements that the standard editor cannot modify." },
      { q: "Is Squarespace easy for me to manage later?", a: "Yes, its dashboard is highly user-friendly. We provide a video guide showing how to update text and add items." },
      { q: "Can I sell digital products?", a: "Absolutely. We can connect Squarespace commerce blocks for downloads, courses, and scheduling." }
    ]
  },
  "landing-page": {
    title: "High-Converting Landing Pages",
    badge: "Any CMS",
    description: "High-converting pages built for one goal.",
    iconName: "Rocket",
    color: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20",
    badgeColor: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20",
    accentColor: "#EF4444",
    glow: "rgba(239, 68, 68, 0.2)",
    pricing: "$999",
    deliveryTime: "3 - 5 Days",
    longDesc: "Bespoke, conversion-led landing pages designed to drive a single primary objective. Ideal for ad campaigns, software launches, and lead capture. Built on any platform of your choice (Next.js, Wix, WordPress, or Webflow) and optimized for extreme loading times.",
    features: [
      "High-Contrast Hero Section Layout",
      "Psychology-Driven Call-To-Action Flow",
      "Trust Signals & Review Component Integrations",
      "A/B Testing Ready Structure",
      "Lightweight Image & Asset Packaging"
    ],
    timeline: [
      { step: "01", title: "Conversion Goal Definition", desc: "Locking down target audience profiles, core value propositions, and CTA triggers." },
      { step: "02", title: "Figma Copywriting & Layout", desc: "Drafting high-conversion copy and laying out the layout grid." },
      { step: "03", title: "Page Code & Speed QA", desc: "Coding the page, optimizing mobile rendering speeds, and launching trackers." }
    ],
    faqs: [
      { q: "Can you write the page copy?", a: "Yes, we write high-impact copywriting designed to convert prospects and highlight pain points." },
      { q: "Do you integrate analytics tracking?", a: "Yes. We set up Google Analytics, Facebook Pixels, and custom form event tracking out of the box." },
      { q: "Which platforms do you build this on?", a: "Next.js for ultimate speed, Wix Studio or Webflow for visual control, and WordPress depending on your active ecosystem." }
    ]
  },
  "website-redesign": {
    title: "Complete Website Redesign",
    badge: "Any CMS",
    description: "Transform your site into a real business asset.",
    iconName: "RefreshCw",
    color: "text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
    badgeColor: "text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
    accentColor: "#0D9488",
    glow: "rgba(13, 148, 136, 0.2)",
    pricing: "$2,499",
    deliveryTime: "7 - 14 Days",
    longDesc: "Wipe out outdated visual debt. We transform your obsolete website into a premium, responsive, fast, and lead-generating business asset. We preserve your existing SEO rankings while delivering a stunning layout overhaul inspired by modern agencies.",
    features: [
      "Outdated Asset Auditing & Cleanups",
      "SEO Route URL Redirect Preservations",
      "Harmonious Curated Accent Palette",
      "Component-Driven Responsive UX Architecture",
      "Mobile Fluid Layout Re-Alignments"
    ],
    timeline: [
      { step: "01", title: "SEO Rank & Asset Audit", desc: "Auditing existing index keywords, assets, and mapping URL redirects." },
      { step: "02", title: "Figma Layout Redraft", desc: "Laying out a gorgeous premium replacement wireframe." },
      { step: "03", title: "Dynamic Code Override", desc: "Developing the site and deploying with zero downtime redirects." }
    ],
    faqs: [
      { q: "Will I lose my current Google rankings?", a: "No. We map absolute 301 redirects, maintain metadata integrity, and submit XML sitemaps to prevent ranking drops." },
      { q: "Can you import my historical database content?", a: "Yes. We preserve database integrity, importing existing blogs, portfolios, and reviews seamlessly." },
      { q: "How long does a redesign take?", a: "A comprehensive redesign takes 7-14 days depending on the catalog size." }
    ]
  },
  "speed-optimization": {
    title: "Performance & Speed Optimization",
    badge: "Any CMS",
    description: "Faster pages. Better rankings. More conversions.",
    iconName: "Gauge",
    color: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    badgeColor: "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    accentColor: "#F97316",
    glow: "rgba(249, 115, 22, 0.2)",
    pricing: "$799",
    deliveryTime: "2 - 4 Days",
    longDesc: "Slow sites kill business. We compress heavy media, defer non-critical scripts, clean up CSS/JS bloat, configure edge CDN caching, and refactor rendering blocks to skyrocket your Core Web Vitals to 90+ scores on PageSpeed Insights.",
    features: [
      "Next-Gen Image & Video Conversions",
      "Deferral of Blocking JS / CSS Bloats",
      "Caching Rules & CDN Configs",
      "Server Response Latency Fine-Tuning",
      "Database Query Index Optimizations"
    ],
    timeline: [
      { step: "01", title: "Core Web Vitals Audit", desc: "Auditing paint latency metrics, server bottlenecks, and asset payloads." },
      { step: "02", title: "Asset Minimization & Compression", desc: "Converting files to next-gen formats and deferring heavy scripts." },
      { step: "03", title: "Production Performance Test", desc: "Validating PageSpeed scores and committing cache rules." }
    ],
    faqs: [
      { q: "What scores can I expect?", a: "We guarantee scores of 90+ for desktop and significant performance leaps for mobile platforms." },
      { q: "Do you delete any of my visual assets?", a: "No. We compress files using advanced lossless algorithms so the visuals look identical but weigh 80% less." },
      { q: "Will the speed changes break my analytics tracking?", a: "We safely set asynchronous loading triggers to ensure scripts load without blocking layout rendering." }
    ]
  },
  "seo-setup": {
    title: "Technical SEO Foundation Setup",
    badge: "Any CMS",
    description: "Technical SEO foundations that last.",
    iconName: "Search",
    color: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    badgeColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    accentColor: "#6366F1",
    glow: "rgba(99, 102, 241, 0.2)",
    pricing: "$899",
    deliveryTime: "3 - 5 Days",
    longDesc: "Be discovered by your future partners. We audit heading schemas, construct XML sitemaps, formulate high-impact meta tags, implement JSON-LD Schema markup, and configure search indexes to ensure search engines rank you immediately.",
    features: [
      "JSON-LD Rich Schema Structured Markups",
      "Descriptive Meta Tag Formulations",
      "XML Sitemap & Robots.txt Configurations",
      "Semantic HTML Heading Structural Audits",
      "Google Search Console Index Pushing"
    ],
    timeline: [
      { step: "01", title: "Keyword & Struct Audit", desc: "Analyzing heading orders, meta gaps, and target search keywords." },
      { step: "02", title: "JSON-LD & Tag Embedding", desc: "Injecting semantic structured data blocks across templates." },
      { step: "03", title: "Search Index Verification", desc: "Submitting XML maps and verifying crawling on Search Console." }
    ],
    faqs: [
      { q: "When will I see Google results?", a: "Technical setup ensures indexes crawl immediately. Visible ranking increases usually reflect within 2-4 weeks." },
      { q: "What is JSON-LD schema?", a: "It is structured code that tells search engines exactly what your brand is (logo, reviews, articles) for rich search results." },
      { q: "Do you write weekly blog articles?", a: "No. This service focuses on core technical SEO foundations. We make your platform readable for search engine spiders." }
    ]
  },
  "custom-code": {
    title: "Bespoke Custom Code Solutions",
    badge: "Custom Code",
    description: "Bespoke web solutions built exactly to your spec.",
    iconName: "Terminal",
    color: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    badgeColor: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    accentColor: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.2)",
    pricing: "$3,499",
    deliveryTime: "10 - 20 Days",
    longDesc: "When templated builders fall short. We engineer custom-coded platforms, client portals, APIs, dashboard telemetry, and operations centers from blank files. We use type-safe React, Next.js, and secure databases tailored to your unique agency guidelines.",
    features: [
      "Custom React / Next.js Client Portals",
      "Type-Safe Server Route Controllers",
      "RESTful API & Webhook Implementations",
      "Secure Database Operations & Encryption",
      "Microservice Modular Architecture Layouts"
    ],
    timeline: [
      { step: "01", title: "API Schema Specification", desc: "Drafting complete technical plans, user routes, and entity relations." },
      { step: "02", title: "Backend Database Coding", desc: "Writing safe server middleware, controllers, and schema fields." },
      { step: "03", title: "Frontend Layout Mapping", desc: "Building responsive screens and hooking up live state managers." }
    ],
    faqs: [
      { q: "Why choose custom code over a CMS?", a: "Custom code is 100% proprietary, carries zero licensing fee limits, performs at raw speeds, and scales infinitely." },
      { q: "Do you host the platform?", a: "We deploy systems to Vercel, Netlify, or AWS, transferring absolute registry rights to your company." },
      { q: "Is the platform easy to update?", a: "We document code cleanly, write custom endpoints, and provide looms so your developers can coordinate extensions." }
    ]
  },
  "full-stack": {
    title: "Full Stack Web Architectures",
    badge: "Full Stack",
    description: "Complete web applications from frontend to database.",
    iconName: "Globe",
    color: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    badgeColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    accentColor: "#A855F7",
    glow: "rgba(168, 85, 247, 0.2)",
    pricing: "$4,999",
    deliveryTime: "14 - 30 Days",
    longDesc: "The ultimate command hub for your digital enterprise. We build complete double-sided applications containing admin controls, secure user roles, dynamic transactions, real-time sync nodes, messaging systems, and database telemetry.",
    features: [
      "Secure Multi-Role NextAuth Auth",
      "WebSocket Real-time Client Interfaces",
      "MongoDB Mongoose Schema Alignments",
      "Dynamic Dashboard Analytics Engines",
      "High-Fidelity Automated Email Triggers"
    ],
    timeline: [
      { step: "01", title: "Database Model Architect", desc: "Creating secure entity-relationship plans and token scopes." },
      { step: "02", title: "Auth & Backend Middleware", desc: "Coding secure gatekeepers, route locks, and WebSocket hubs." },
      { step: "03", title: "Responsive Dashboard Build", desc: "Compiling visual dashboards, invoice trackers, and calendars." }
    ],
    faqs: [
      { q: "Do you integrate payment gateways?", a: "Yes. We integrate safe checkout setups using Stripe, PayPal, or custom transaction gateways." },
      { q: "How are real-time updates managed?", a: "We configure Socket.io WebSocket channels that trigger instant view invalidations on data changes." },
      { q: "Is the database secure?", a: "We encrypt user credentials, secure environment keys, and block cross-origin script injection routes." }
    ]
  },
  maintenance: {
    title: "Continuous Website Maintenance",
    badge: "All CMS",
    description: "Keep your site fast, secure, and up to date.",
    iconName: "Settings",
    color: "text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    badgeColor: "text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    accentColor: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.2)",
    pricing: "$299/mo",
    deliveryTime: "Ongoing",
    longDesc: "Worry-free maintenance for your digital footprint. We perform routine security patches, module updates, core database backups, loading speed checks, asset swaps, and priority support requests to keep your enterprise online 24/7.",
    features: [
      "Routine Plugin & Core Security Updates",
      "Weekly Core Database Cloud Backups",
      "Monthly Load Speed Analytics Audit",
      "Unlimited Visual Content Swaps",
      "Priority SLA Critical Support Tickets"
    ],
    timeline: [
      { step: "01", title: "System Scan Setup", desc: "Injecting automatic monitoring scripts and cloud backup rules." },
      { step: "02", title: "Routine Plugin Polish", desc: "Performing weekly database checks and upgrading modules." },
      { step: "03", title: "Emergency Priority Care", desc: "Standing by with dedicated priority response schedules." }
    ],
    faqs: [
      { q: "What is included in unlimited content swaps?", a: "You can request text revisions, image swaps, pricing edits, new blog posts, and menu layout changes at any time." },
      { q: "How often do you perform database backups?", a: "We run fully automated cloud database backups weekly (stored in secure external locations)." },
      { q: "What is your critical support response time?", a: "For priority tickets (site crashes), our team responds and initiates repairs in under 2 hours." }
    ]
  }
};

export default function ServicePage() {
  const params = useParams();
  const serviceSlug = (params?.service as string) || "";
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const srv = servicesData[serviceSlug];

  // Return a beautiful, dynamic 404 page if service is not found
  if (!srv) {
    return (
      <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col items-center justify-center p-6 relative select-none">
        <div className="absolute inset-0 grid-texture opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="space-y-6 max-w-sm text-center relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 mx-auto animate-pulse">
            <HelpCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Capability Not Found</h1>
          <p className="text-stone-400 text-sm font-semibold leading-relaxed">
            The capability or service slug you are attempting to locate is not in our operations index catalog.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#EA580C] to-[#8B5CF6] text-white font-bold h-11 px-6 rounded-xl text-xs gap-2 cursor-pointer shadow-lg shadow-primary/20 mt-4">
              <ArrowLeft className="w-4 h-4" /> Return to Command Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = iconMap[srv.iconName] || Globe;

  return (
    <div className="min-h-screen mesh-bg text-foreground relative overflow-hidden font-sans select-none pb-24 transition-colors duration-300">
      {/* Background Grids & Orbs */}
      <div className="absolute inset-0 grid-texture opacity-25 pointer-events-none" />
      
      {/* Floating radial orbs representing the service accent color */}
      <div 
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[150px] opacity-25 animate-pulse-slow" 
        style={{
          background: `radial-gradient(circle, ${srv.glow} 0%, transparent 70%)`
        }}
      />
      <div 
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full blur-[150px] opacity-15 animate-pulse-slow" 
        style={{
          background: `radial-gradient(circle, ${srv.glow} 0%, transparent 70%)`
        }}
      />

      {/* Navigation Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <img
                src="/logo.png"
                alt="Fast Solutions Logo"
                className="w-full h-full object-cover object-top scale-[1.35] origin-top transform"
                style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.15)" }}
              />
            </div>
            <span className="text-base font-black tracking-wider text-foreground uppercase select-none" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              FAST<span style={{ color: "#EA580C" }}> SOLUTIONS</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 bg-secondary border border-border/40 px-3.5 py-2 rounded-xl">
              <ArrowLeft className="w-3.5 h-3.5" /> Back Home
            </Link>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 space-y-20 relative z-10 text-left">
        
        {/* Section 1: Hero & Metadata Banner */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Info) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <Badge className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 ${srv.badgeColor}`}>
                {srv.badge} Capability
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                Delivery: {srv.deliveryTime}
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-none">
              {srv.title}
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-semibold max-w-2xl">
              {srv.longDesc}
            </p>

            {/* Checklist of deliverables */}
            <div className="space-y-3 pt-2">
              <h5 className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Delivered Modules</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {srv.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-xs text-foreground font-semibold tracking-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (CTA Price Card) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[360px]"
            >
              {/* Subtle line glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#EA580C]/50 to-transparent" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${srv.color}`}>
                      <ServiceIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black tracking-tight text-foreground">Interactive Order Portal</span>
                  </div>
                  <Badge className="bg-secondary border border-border/60 text-foreground text-[8px] uppercase tracking-wider font-black font-mono">Standard Package</Badge>
                </div>
                
                <div className="pt-4 border-t border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block">Flat Rate Investment</span>
                  <div className="text-5xl font-black text-foreground tracking-tight flex items-baseline gap-1">
                    {srv.pricing}
                    <span className="text-xs text-muted-foreground font-bold font-mono">USD</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Start your service pipeline directly. Our flat rates secure specialized developers, full assets drafting, responsive grids, and technical QA with zero hidden costs.
                </p>
              </div>

              <div className="pt-6 border-t border-border/40 space-y-3">
                <Link href={`/client/login?redirect=/dashboard&tab=order`}>
                  <Button className="w-full bg-gradient-to-r from-[#EA580C] to-[#8B5CF6] hover:opacity-95 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-[0_4px_25px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2 group cursor-pointer border-none">
                    Deploy Solution Order
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="flex justify-center items-center gap-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  Secure Client Gateway verified
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Progressive Timeline */}
        <section className="glass-card rounded-[2.5rem] p-8 sm:p-10 space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] text-[#EA580C] uppercase font-black tracking-[0.2em] font-mono">Operations Timetable</span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">How We Build It Step-by-Step</h3>
            <p className="text-muted-foreground text-xs sm:text-sm font-semibold max-w-xl">
              We execute in clean, hyper-focused stages to prevent scope drift and maintain full alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {srv.timeline.map((time, idx) => (
              <div key={time.step} className="bg-card/45 border border-border/60 rounded-2xl p-6 text-left space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-secondary border border-border/50 flex items-center justify-center font-mono font-black text-xs text-foreground">
                    {time.step}
                  </span>
                  {idx < 2 && <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-px bg-border/40 z-10" />}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-foreground text-base tracking-tight">{time.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{time.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: FAQ Accordions */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-[#8B5CF6] uppercase font-black tracking-[0.2em] font-mono">Faq Station</span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Solving Key Concerns</h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {srv.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden transition-all"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex justify-between items-center text-left cursor-pointer hover:bg-secondary/40 transition-colors"
                  >
                    <span className="text-sm font-black text-foreground tracking-tight">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground/60 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed font-semibold border-t border-border/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
