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
  
  // Use separate refs for the transform wrapper and the opacity crossfade targets
  const letterWrappersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const letterBlurryRef = useRef<(HTMLSpanElement | null)[]>([]);
  const letterSharpRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  const dotWrapperRef = useRef<HTMLSpanElement>(null);
  const dotBlurryRef = useRef<HTMLSpanElement>(null);
  const dotSharpRef = useRef<HTMLSpanElement>(null);
  
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

          // Update letters via CROSSFADE (0 layout thrashing)
          LETTER_CONFIG.forEach((item, idx) => {
            const wrapper = letterWrappersRef.current[idx];
            const blurry = letterBlurryRef.current[idx];
            const sharp = letterSharpRef.current[idx];
            if (!wrapper || !blurry || !sharp) return;
            
            const curX = item.x * factor * (1 - letterT);
            const curY = item.y * factor * (1 - letterT);
            const curZ = item.z * (1 - letterT);
            const curRot = item.rot * (1 - letterT);
            const curOp = 0.45 + letterT * 0.55;

            // Move the wrapper
            wrapper.style.transform = `translate3d(${curX}px, ${curY}px, ${curZ}px) rotate(${curRot}deg)`;
            wrapper.style.opacity = curOp.toString();
            
            // Crossfade the inner spans
            blurry.style.opacity = (1 - letterT).toString();
            sharp.style.opacity = isMobileRef.current ? "1" : letterT.toString();
          });

          // Update dot via CROSSFADE
          if (dotWrapperRef.current && dotBlurryRef.current && dotSharpRef.current) {
            dotWrapperRef.current.style.transform = `translate3d(0, ${-55 * (1 - dotT)}px, 0) scale(${dotT > 0 ? 0.5 + dotT * 0.5 : 0})`;
            dotWrapperRef.current.style.opacity = dotT.toString();
            
            dotBlurryRef.current.style.opacity = (1 - dotT).toString();
            dotSharpRef.current.style.opacity = dotT.toString();
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
        {/* Ambient Crimson Glow - Fast radial gradient instead of heavy CSS blur */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[500px] bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.12)_0%,_transparent_70%)] rounded-full pointer-events-none -z-10"
        />

        {/* Central Assembling Stage: Monumental Resuma with Focus Hook */}
        <div
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-black tracking-tighter select-none flex items-baseline justify-center cursor-default">
            {LETTER_CONFIG.map((item, idx) => (
              <span
                key={idx}
                ref={(el) => { letterWrappersRef.current[idx] = el; }}
                style={{
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                }}
                className="relative inline-flex items-center justify-center"
              >
                {/* BLURRY LAYER - Hidden on mobile for 60fps performance */}
                <span
                  ref={(el) => { letterBlurryRef.current[idx] = el; }}
                  style={{ 
                    filter: `blur(${item.blur}px)`,
                    willChange: "opacity"
                  }}
                  className="hidden sm:inline-block absolute inset-0 resuma-text-effect sm:animate-text-shine"
                >
                  {item.char}
                </span>
                
                {/* SHARP LAYER */}
                <span
                  ref={(el) => { letterSharpRef.current[idx] = el; }}
                  style={{ willChange: "opacity" }}
                  className="relative inline-block resuma-text-effect sm:animate-text-shine"
                >
                  {item.char}
                </span>
              </span>
            ))}

            {/* Enlarged Red Square Box Dot - Focuses and snaps in cleanly on baseline */}
            <span
              ref={dotWrapperRef}
              style={{
                willChange: "transform, opacity",
              }}
              className="relative inline-flex items-center justify-center w-3.5 h-3.5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 ml-1.5 sm:ml-3 lg:ml-4 self-end mb-1 sm:mb-2.5 lg:mb-4"
            >
              <span 
                ref={dotBlurryRef}
                style={{ filter: "blur(5px)", willChange: "opacity" }}
                className="hidden sm:block absolute inset-0 bg-[#dc2626] rounded-none shadow-[0_0_18px_rgba(220,38,38,0.85)]" 
              />
              <span 
                ref={dotSharpRef}
                style={{ willChange: "opacity" }}
                className="relative w-full h-full bg-[#dc2626] rounded-none shadow-[0_0_18px_rgba(220,38,38,0.85)]" 
              />
            </span>
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
