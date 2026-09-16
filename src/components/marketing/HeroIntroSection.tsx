"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";

interface HeroIntroSectionProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function HeroIntroSection({ user }: HeroIntroSectionProps) {
  return (
    <section
      id="hero-tagline-section"
      className="py-20 sm:py-28 relative bg-gradient-to-b from-[#09090b] via-zinc-950 to-[#09090b] overflow-hidden"
    >
      {/* Soft ambient center accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-red-400 mb-5 sm:mb-6 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-red-400" />
          <span>Engineered for 2026 Hiring & ATS Parsers</span>
        </div>

        {/* Tagline */}
        <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.2] sm:leading-[1.15]">
          <span>Craft Resumes That Actually Land Interviews</span>
          <span className="text-[#dc2626]">.</span>
        </h1>

        {/* Short Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Engineered for ATS parsers and modern hiring teams. Drag-and-drop section reordering, vector PDF prints, and live view tracking.
        </p>

        {/* Action Buttons - Compact & Balanced on Mobile */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href={user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto min-w-[200px] max-w-xs sm:max-w-sm flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-base font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/25 active:scale-95 text-center"
          >
            <span className="whitespace-nowrap">{user ? "Go to Dashboard" : "Build Your Resume for Free"}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>

          {!user && (
            <Link
              href="/login"
              className="w-auto min-w-[140px] max-w-[200px] flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-base font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-center"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Feature Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-red-500" />
            4 Tested ATS Templates
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-red-500" />
            Instant Vector PDF Print
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-red-500" />
            No Watermark, Ever
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-red-500" />
            100% Free Forever Tier
          </span>
        </div>

        {/* Down to Templates CTA */}
        <div
          className="mt-12 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
          onClick={() => {
            const el = document.getElementById("templates-showcase");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>Preview ATS templates below</span>
          <ChevronDown className="h-3.5 w-3.5 text-red-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
