"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function LoadingSpinner({ fullScreen = true }: { fullScreen?: boolean }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Wait 500ms, then fade out "R", leaving ONLY the dot.
    const t1 = setTimeout(() => setStage(1), 500);
    
    // Stage 2: Wait 400ms with just the dot. Then start the line crawl.
    const t2 = setTimeout(() => setStage(2), 900);
    
    // Stage 3: Circle completes and starts spinning infinitely (900 + 700 = 1600)
    const t3 = setTimeout(() => setStage(3), 1600);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className={`${fullScreen ? "fixed inset-0 z-[9999]" : "w-full h-full min-h-[50vh] flex-1"} flex flex-col items-center justify-center bg-background pointer-events-none`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex flex-col items-center justify-center relative">
        <div className="relative flex items-center justify-center h-24 w-24">
          
          {/* The "R" Text with the REAL Square Box */}
          <div className="absolute flex items-baseline justify-center font-black tracking-tighter text-6xl select-none origin-center -translate-x-2">
            <span 
              className={`text-foreground transition-all duration-[500ms] ease-in-out inline-block ${stage > 0 ? "opacity-0 -translate-x-4 scale-50" : "opacity-100 translate-x-0 scale-100"}`}
            >
              R
            </span>
            {/* The square dot that stays alone in stage 1, then fades out when SVG draws in stage 2 */}
            <span 
              className={`inline-block w-[16px] h-[16px] bg-[#dc2626] ml-2 align-baseline self-end mb-1.5 shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-opacity duration-300 ${stage > 1 ? "opacity-0" : "opacity-100"}`} 
            />
          </div>
          
          {/* The Morphing SVG Crawling Line -> Circle */}
          <div 
            className="absolute flex items-center justify-center transition-all duration-[700ms] ease-in-out"
            style={{ 
              width: '64px', 
              height: '64px',
              // Pixel-perfect alignment for text-6xl R dot:
              // SVG is 64x64. Scale to 0.25 = 16x16 (matches w-[16px] h-[16px]).
              // Offset matches the ml-2 and mb-1.5 of the dot relative to the R container center.
              transform: stage < 2 ? "translate(21px, 14px) scale(0.25)" : "translate(0px, 0px) scale(1)",
              opacity: stage < 2 ? 0 : 1 // Hidden in stage 0 & 1, fades in at stage 2
            }}
          >
            <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${stage === 3 ? "animate-spin" : ""}`}>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dc2626"
                strokeWidth={stage < 2 ? 25 : stage === 2 ? 12 : 8}
                strokeLinecap="round"
                className="transition-all duration-[700ms] cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  // Circumference = 2 * PI * 40 ≈ 251.32
                  strokeDasharray: "251.32",
                  // Stage 0/1: fully offset (hidden)
                  // Stage 2: crawling (partially drawn)
                  // Stage 3: a bit more drawn for spinning
                  strokeDashoffset: stage < 2 ? "251.32" : stage === 2 ? "100" : "70",
                  filter: stage < 2 ? "drop-shadow(0px 0px 8px rgba(220,38,38,0.8))" : "drop-shadow(0px 0px 4px rgba(220,38,38,0.4))",
                  // Add a slight rotation during the draw so it looks like it's crawling forward
                  transform: stage < 2 ? "rotate(-90deg)" : stage === 2 ? "rotate(0deg)" : "rotate(90deg)",
                  transformOrigin: "center"
                }}
              />
              {/* Secondary faint background ring that fades in when it becomes a circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth={stage === 3 ? 8 : 12}
                className={`text-muted transition-all duration-[700ms] ${stage === 3 ? "opacity-100" : "opacity-0"}`}
              />
            </svg>
          </div>
        </div>

        {/* Conditionally show Admin tag */}
        {isAdmin && (
          <div className="mt-4 animate-fade-in-up">
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold tracking-widest uppercase border border-red-500/20 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
              Admin
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
