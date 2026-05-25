"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    
    // Mouse interaction states
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
      normalizedX: 0,
      normalizedY: 0,
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      initStars();
    };

    const initStars = () => {
      const density = 0.00012; // Star density per sq pixel
      const area = window.innerWidth * window.innerHeight;
      const count = Math.min(Math.floor(area * density), 180);
      
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          baseAlpha: Math.random() * 0.55 + 0.25,
          twinkleSpeed: Math.random() * 0.015 + 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Smoothly ease cursor positions for lagless fluidity
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 3D Parallax offset based on cursor distance from center
      const pxOffsetX = mouse.normalizedX * 18;
      const pxOffsetY = mouse.normalizedY * 18;

      // 1. Draw subtle geometric constellation connections between stars
      ctx.strokeStyle = "rgba(167, 139, 250, 0.06)"; // Faint violet links (increased visibility)
      ctx.lineWidth = 0.6;
      
      for (let i = 0; i < stars.length; i++) {
        // Calculate rendering coordinates including parallax drift
        const starParallaxX = pxOffsetX * (stars[i].radius / 1.4);
        const starParallaxY = pxOffsetY * (stars[i].radius / 1.4);
        const x1 = stars[i].x + starParallaxX;
        const y1 = stars[i].y + starParallaxY;

        for (let j = i + 1; j < stars.length; j++) {
          const otherParallaxX = pxOffsetX * (stars[j].radius / 1.4);
          const otherParallaxY = pxOffsetY * (stars[j].radius / 1.4);
          const x2 = stars[j].x + otherParallaxX;
          const y2 = stars[j].y + otherParallaxY;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) { // Increased distance threshold from 100 to 120
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // 2. Draw magnetic connections from cursor to nearby stars
      if (mouse.active) {
        stars.forEach((star) => {
          const starParallaxX = pxOffsetX * (star.radius / 1.4);
          const starParallaxY = pxOffsetY * (star.radius / 1.4);
          const sX = star.x + starParallaxX;
          const sY = star.y + starParallaxY;

          const dx = mouse.x - sX;
          const dy = mouse.y - sY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) { // Increased connection radius from 125 to 160
            const opacity = (1 - dist / 160) * 0.42; // Increased opacity multiplier from 0.12 to 0.42
            // Draw a beautiful warm gradient link to match brand aesthetic
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 1.2; // Increased stroke width from 0.8 to 1.2
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(sX, sY);
            ctx.stroke();
          }
        });
      }

      // 3. Draw and animate stars
      stars.forEach((star) => {
        // Soft twinkling
        star.phase += star.twinkleSpeed;
        const alpha = Math.max(0.1, star.baseAlpha + Math.sin(star.phase) * 0.25);

        // Responsive kinetic repel bubble pushing stars away from cursor
        if (mouse.active) {
          const dx = star.x - mouse.x;
          const dy = star.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const force = (130 - dist) / 130;
            const angle = Math.atan2(dy, dx);
            // Gently shift target coordinates slightly away from mouse
            star.x += Math.cos(angle) * force * 1.6;
            star.y += Math.sin(angle) * force * 1.6;
          }
        }

        // Apply 3D Parallax offset based on star radius (closer stars drift more)
        const starParallaxX = pxOffsetX * (star.radius / 1.4);
        const starParallaxY = pxOffsetY * (star.radius / 1.4);
        const renderX = star.x + starParallaxX;
        const renderY = star.y + starParallaxY;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle warm glow halo for larger stars
        if (star.radius > 1.1) {
          ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.28})`;
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drift slowly in their original path
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.x < 0) {
          star.x = window.innerWidth;
        } else if (star.x > window.innerWidth) {
          star.x = 0;
        }

        if (star.y < 0) {
          star.y = window.innerHeight;
        } else if (star.y > window.innerHeight) {
          star.y = 0;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Calculate normalized vectors from center [-1, 1]
      mouse.normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.normalizedX = 0;
      mouse.normalizedY = 0;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
