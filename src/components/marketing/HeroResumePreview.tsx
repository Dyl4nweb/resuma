"use client";

import { useState } from "react";
import Link from "next/link";
import { TemplateType, DEFAULT_RESUME_DATA, ResumeData } from "@/types/resume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import {
  Sparkles,
  ShieldCheck,
  Printer,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";

export function HeroResumePreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  const [selectedColor, setSelectedColor] = useState<string>("#dc2626");

  const previewData: ResumeData = {
    ...DEFAULT_RESUME_DATA,
    template: selectedTemplate,
    themeColor: selectedColor,
  };

  const templates: Array<{ id: TemplateType; label: string; tag: string }> = [
    { id: "modern", label: "Modern ATS", tag: "Most Popular" },
    { id: "classic", label: "Classic Executive", tag: "Corporate" },
    { id: "minimalist", label: "Minimalist", tag: "Clean" },
    { id: "compact", label: "Compact Tech", tag: "Developers" },
  ];

  const colors = [
    { hex: "#dc2626", label: "Brand Red" },
    { hex: "#2563eb", label: "Royal Blue" },
    { hex: "#059669", label: "Emerald" },
    { hex: "#7c3aed", label: "Purple" },
    { hex: "#334155", label: "Slate" },
  ];

  return (
    <div className="relative mx-auto max-w-5xl mt-6 sm:mt-8 text-left">
      {/* Ambient background accent glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[700px] sm:h-[400px] bg-red-600/10 blur-[80px] sm:blur-[140px] rounded-full pointer-events-none -z-10 hidden sm:block" />

      {/* Floating Showcase Frame */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        {/* Showcase Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
          {/* Template Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1 hidden lg:inline">
              Template:
            </span>
            {templates.map((t) => {
              const active = selectedTemplate === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 ${
                    active
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "bg-muted text-foreground hover:bg-muted hover:text-accent-foreground"
                  }`}
                >
                  <span>{t.label}</span>
                  {active && (
                    <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono uppercase">
                      {t.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Switcher & Badges */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Color circles */}
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  title={c.label}
                  style={{ backgroundColor: c.hex }}
                  className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-transform hover:scale-110 ${
                    selectedColor === c.hex
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                      : "opacity-75 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-muted hidden sm:block" />

            <div className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>ATS Score 98%</span>
            </div>
          </div>
        </div>

        {/* Live Resume Canvas Container */}
        <div className="relative mt-3 sm:mt-5 bg-background rounded-xl p-2 sm:p-8 flex justify-center items-start border border-border overflow-hidden min-h-[460px] sm:min-h-[540px] max-h-[460px] xs:max-h-[540px] sm:max-h-[660px]">
          {/* Subtle gradient overlay at bottom to encourage scrolling/editing */}
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-transparent z-10 pointer-events-none flex items-end justify-center pb-4 sm:pb-5 px-3">
            <Link
              href="/register"
              className="pointer-events-auto flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white shadow-xl shadow-red-600/30 hover:bg-red-500 transition-transform active:scale-95 max-w-[260px] text-center"
            >
              <span className="truncate">Customize in Builder</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </Link>
          </div>

          {/* Scaled Live Resume Document */}
          <div className="flex justify-center transform origin-top scale-[0.40] xs:scale-[0.48] sm:scale-[0.65] md:scale-[0.70] lg:scale-[0.80] transition-transform w-[794px] shrink-0">
            <TemplateRenderer data={previewData} />
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="mt-3 px-1 sm:px-2 flex flex-col xs:flex-row items-start xs:items-center justify-between text-[11px] sm:text-xs text-muted-foreground gap-1.5 sm:gap-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            Real-time ATS preview updating live
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Printer className="h-3.5 w-3.5 shrink-0" />
            Vector PDF print output matches 1:1
          </span>
        </div>
      </div>
    </div>
  );
}
