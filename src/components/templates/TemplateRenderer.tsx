import React from "react";
import { ResumeData } from "@/types/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";
import { CompactTemplate } from "./CompactTemplate";

interface TemplateRendererProps {
  data: ResumeData;
  scale?: number;
}

export function TemplateRenderer({ data, scale = 1 }: TemplateRendererProps) {
  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const renderTemplateComponent = () => {
    switch (data.template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimalist":
        return <MinimalistTemplate data={data} />;
      case "compact":
        return <CompactTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div
      className={`resume-paper-container ${getFontFamilyClass(data.fontFamily)}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
      }}
    >
      {renderTemplateComponent()}
    </div>
  );
}
