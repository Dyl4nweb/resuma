"use client";

import { TemplateType, FontFamilyType } from "@/types/resume";
import { Check } from "lucide-react";

interface ThemePickerProps {
  currentTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  currentFont: FontFamilyType;
  onFontChange: (font: FontFamilyType) => void;
}

const TEMPLATES: Array<{ id: TemplateType; name: string; desc: string }> = [
  { id: "modern", name: "Modern", desc: "Accent header, timeline bullets, balanced ATS design" },
  { id: "classic", name: "Classic Executive", desc: "Traditional serif, clean dividers, corporate standard" },
  { id: "minimalist", name: "Minimalist", desc: "Generous whitespace, understated typography" },
  { id: "compact", name: "Compact Tech", desc: "High density layout, monospace tech highlights" },
];

const PRESET_COLORS = [
  { hex: "#dc2626", name: "Resuma Red" },
  { hex: "#2563eb", name: "Royal Blue" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#7c3aed", name: "Purple" },
  { hex: "#ea580c", name: "Sunset Orange" },
  { hex: "#334155", name: "Slate Charcoal" },
  { hex: "#18181b", name: "Monochrome Dark" },
];

const FONTS: Array<{ id: FontFamilyType; name: string; style: string }> = [
  { id: "sans", name: "Inter Sans", style: "font-sans" },
  { id: "serif", name: "Merriweather Serif", style: "font-serif" },
  { id: "mono", name: "JetBrains Mono", style: "font-mono" },
];

export function ThemePicker({
  currentTemplate,
  onTemplateChange,
  currentColor,
  onColorChange,
  currentFont,
  onFontChange,
}: ThemePickerProps) {
  return (
    <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
      {/* Template Selection */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Resume Template
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onTemplateChange(tpl.id)}
              className={`p-2.5 text-left rounded-md border transition-all ${
                currentTemplate === tpl.id
                  ? "border-red-500 bg-red-500/10 text-red-600 font-semibold"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <div className="text-xs font-semibold">{tpl.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{tpl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Accent Selection */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Accent Color
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((color) => {
            const isSelected = currentColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => onColorChange(color.hex)}
                title={color.name}
                className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 border ${
                  isSelected ? "ring-2 ring-white scale-110" : "border-border"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-foreground drop-shadow" />}
              </button>
            );
          })}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-muted-foreground">Hex:</span>
            <input
              type="text"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-20 rounded border border-border bg-card px-2 py-1 text-xs text-foreground font-mono focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Typography Selection */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Typography Font
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFontChange(f.id)}
              className={`p-2 text-center rounded border text-xs transition-colors ${f.style} ${
                currentFont === f.id
                  ? "border-red-500 bg-red-500/10 text-red-600 font-semibold"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
