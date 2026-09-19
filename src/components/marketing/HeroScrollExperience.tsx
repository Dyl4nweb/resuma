"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Signature 3D Staggered Offsets with dynamic focus/blur hook
const LETTER_CONFIG = [
  { char: "R", x: -95, y: -42, z: 45, rot: -12, blur: 8 },
  { char: "e", x: -48, y: 46, z: -35, rot: 9, blur: 6 },
  { char: "s", x: -16, y: -48, z: 40, rot: -8, blur: 7 },
  { char: "u", x: 16, y: 48, z: -30, rot: 8, blur: 6 },
  { char: "m", x: 48, y: -42, z: 35, rot: -9, blur: 7 },
  { char: "a", x: 95, y: 42, z: -25, rot: 10, blur: 8 },
];

export function HeroScrollExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  // Responsive ease-out cubic snap
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
      // Force an immediate update on resize to fix styles
      handleScroll();
    };
    
    // Bulletproof scroll calculation with rAF throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!wrapperRef.current) {
            ticking = false;
            return;
          }
          const scrollY =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            window.scrollY ||
            0;

          const totalDistance =
            wrapperRef.current.offsetHeight - window.innerHeight;
          const distance = totalDistance > 0 ? totalDistance : 600;
          const progress = Math.max(0, Math.min(scrollY / distance, 1));
          
          const rawLetterT = Math.min(progress / 0.7, 1);
          const letterT = easeOut(rawLetterT);
          
          const rawDotT = Math.max(0, Math.min((progress - 0.3) / 0.45, 1));
          const dotT = easeOut(rawDotT);
          
          const factor = isMobileRef.current ? 0.42 : 1.0;

          // Update letters directly
          LETTER_CONFIG.forEach((item, idx) => {
            const span = lettersRef.current[idx];
            if (!span) return;
            
            const curX = item.x * factor * (1 - letterT);
            const curY = item.y * factor * (1 - letterT);
            const curZ = item.z * (1 - letterT);
            const curRot = item.rot * (1 - letterT);
            const curBlur = item.blur * (1 - letterT);
            const curOp = 0.45 + letterT * 0.55;

            span.style.transform = `translate3d(${curX}px, ${curY}px, ${curZ}px) rotate(${curRot}deg)`;
            span.style.opacity = curOp.toString();
            if (!isMobileRef.current) {
              span.style.filter = `blur(${curBlur.toFixed(2)}px)`;
            } else {
              span.style.filter = "none";
            }
          });

          // Update dot directly
          if (dotRef.current) {
            dotRef.current.style.transform = `translate3d(0, ${-55 * (1 - dotT)}px, 0) scale(${dotT > 0 ? 0.5 + dotT * 0.5 : 0})`;
            dotRef.current.style.opacity = dotT.toString();
            if (!isMobileRef.current) {
              dotRef.current.style.filter = `blur(${Math.max(0, 5 * (1 - dotT)).toFixed(2)}px)`;
            } else {
              dotRef.current.style.filter = "none";
            }
          }

          // Update scroll indicator directly
          if (indicatorRef.current) {
            indicatorRef.current.style.opacity = Math.max(0, 1 - progress * 2.2).toString();
            indicatorRef.current.style.transform = `translate3d(0, ${progress * 25}px, 0)`;
            indicatorRef.current.style.pointerEvents = progress < 0.2 ? "auto" : "none";
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial call to set initial styles
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[200vh]">
      {/* Sticky Fullscreen Stage */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background select-none"
        style={{ perspective: "1200px" }}
      >
        {/* Ambient Crimson Glow - Soft, deep, elegant backdrop */}
        <div
          className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[720px] sm:h-[380px] bg-red-600/[0.08] blur-[80px] sm:blur-[130px] rounded-full pointer-events-none -z-10"
        />

        {/* Central Assembling Stage: Monumental Resuma with Focus Hook */}
        <div
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-black tracking-tighter select-none inline-flex items-baseline justify-center cursor-default">
            {LETTER_CONFIG.map((item, idx) => (
              <span
                key={idx}
                ref={(el) => { lettersRef.current[idx] = el; }}
                style={{
                  willChange: isMobile ? "transform, opacity" : "transform, filter, opacity",
                  transformStyle: "preserve-3d",
                }}
                className="resuma-text-effect inline-block sm:drop-shadow-[0_4px_30px_rgba(255,255,255,0.22)]"
              >
                {item.char}
              </span>
            ))}

            {/* Enlarged Red Square Box Dot - Focuses and snaps in cleanly on baseline */}
            <span
              ref={dotRef}
              style={{
                willChange: isMobile ? "transform, opacity" : "transform, filter, opacity",
              }}
              className="inline-block w-3.5 h-3.5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-[#dc2626] ml-1.5 sm:ml-3 lg:ml-4 rounded-none shadow-[0_0_18px_rgba(220,38,38,0.85)] align-baseline self-end mb-1 sm:mb-2.5 lg:mb-4 transition-[filter] duration-75"
            />
          </h1>
        </div>

        {/* Subtle Scroll Down Indicator */}
        <div
          ref={indicatorRef}
          onClick={() => {
            const el = document.getElementById("hero-tagline-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200"
        >
          <span className="tracking-widest uppercase text-[10px] font-medium text-muted-foreground">
            Scroll to assemble
          </span>
          <ChevronDown className="h-4 w-4 text-red-500/80 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
