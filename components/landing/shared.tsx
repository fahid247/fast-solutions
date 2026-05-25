"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   Animation Variants
────────────────────────────────────────────────────────────────── */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: EASE_OUT },
  }),
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const cardFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 18 },
  },
};

/* ─────────────────────────────────────────────────────────────────
   3D Tilt Card Hook
────────────────────────────────────────────────────────────────── */
export function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(4px)`;
  };
  const handleLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };
  return { ref, handleMove, handleLeave };
}

/* ─────────────────────────────────────────────────────────────────
   Shared Sub-components
────────────────────────────────────────────────────────────────── */
export function TiltCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, handleMove, handleLeave } = useTilt(8);
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform 350ms cubic-bezier(0.34,1.56,0.64,1)", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}

export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.22em] uppercase border"
      style={{ background: "rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.25)", color: "#f97316" }}>
      <Sparkles className="w-3 h-3" />
      {children}
    </span>
  );
}
