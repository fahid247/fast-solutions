"use client";

import { useState, useEffect } from "react";
import { LandingLoader } from "@/components/landing/LandingLoader";
import { StarryBackground } from "@/components/landing/StarryBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingMarquee } from "@/components/landing/LandingMarquee";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingProcess } from "@/components/landing/LandingProcess";
import { LandingPortfolio } from "@/components/landing/LandingPortfolio";
import { LandingContact } from "@/components/landing/LandingContact";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LandingLoader isLoading={isLoading} loadingProgress={loadingProgress} />

      <div className="mesh-bg min-h-screen overflow-x-hidden relative font-sans transition-colors duration-300 text-foreground">
        <StarryBackground />
        <LandingNav />
        <LandingHero />
        <LandingMarquee />
        <LandingServices />
        <LandingProcess />
        <LandingPortfolio />
        <LandingContact />
        <LandingFooter />
      </div>
    </>
  );
}
