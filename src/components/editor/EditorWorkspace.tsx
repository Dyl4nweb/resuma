"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ResumeData, SectionKey, TemplateType, FontFamilyType } from "@/types/resume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { SummaryForm } from "./sections/SummaryForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { EducationForm } from "./sections/EducationForm";
import { SkillsForm } from "./sections/SkillsForm";
import { ProjectsForm } from "./sections/ProjectsForm";
import { CertificationsForm } from "./sections/CertificationsForm";
import { SectionReorder } from "./SectionReorder";
import { ThemePicker } from "./ThemePicker";
import { ExportModal } from "./ExportModal";
import {
  ArrowLeft,
  Check,
  Loader2,
  Share2,
  Sliders,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  FileEdit,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface EditorWorkspaceProps {
  initialResume: ResumeData;
  resumeId: string;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function EditorWorkspace({ initialResume, resumeId }: EditorWorkspaceProps) {
  const [data, setData] = useState<ResumeData>(initialResume);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active editor tab on mobile
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  // Drawer / Sub-panel states
  const [activePanel, setActivePanel] = useState<"content" | "design" | "reorder">("content");

  // Preview zoom scale (0.5 to 1.2)
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  // Export & Share modal
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Debounced auto-save logic
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveResume = useCallback(
    async (resumeData: ResumeData) => {
      setSaveStatus("saving");
      setErrorMessage(null);

      try {
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: resumeData.title,
            template: resumeData.template,
            themeColor: resumeData.themeColor,
            fontFamily: resumeData.fontFamily,
            sectionOrder: resumeData.sectionOrder,
            personalInfo: resumeData.personalInfo,
            summary: resumeData.summary,
            experience: resumeData.experience,
            education: resumeData.education,
            skills: resumeData.skills,
            projects: resumeData.projects,
            certifications: resumeData.certifications,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save resume");
        }

        setSaveStatus("saved");
      } catch (err: unknown) {
        console.error("Autosave error:", err);
        setSaveStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Save failed");
      }
    },
    [resumeId]
  );

  const updateData = (patch: Partial<ResumeData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      setSaveStatus("unsaved");

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveResume(next);
      }, 1200);

      return next;
    });
  };

  // Toggle Public Publish
  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !data.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to update public status");
      }

      const result = await res.json();
      setData((prev) => ({
        ...prev,
        isPublished: result.resume.isPublished,
        slug: result.resume.slug,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle public status");
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#09090b] text-[#fafafa]">
      {/* Top Action Toolbar */}
      <nav className="h-14 border-b border-zinc-800 bg-[#09090b] px-4 flex items-center justify-between no-print z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors py-1.5 px-2 rounded-md hover:bg-zinc-800/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Editable Title */}
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="bg-transparent text-sm font-bold text-white border border-transparent hover:border-zinc-700 focus:border-red-500 focus:bg-zinc-900 rounded px-2 py-1 max-w-[200px] sm:max-w-[320px] transition-colors focus:outline-none"
            title="Click to rename resume"
          />

          {/* Auto-save Status Indicator */}
          <div className="flex items-center gap-1 text-xs">
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-500/20">
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
            {saveStatus === "saving" && (
              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full text-[11px] font-medium border border-amber-500/20">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="text-[11px] text-amber-400 hidden md:inline">
                Unsaved changes
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1 text-[11px] text-red-400" title={errorMessage || "Error saving"}>
                <AlertCircle className="h-3 w-3" />
                <span className="hidden md:inline">Save error</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab Switcher */}
          <div className="flex sm:hidden rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mobileTab === "editor" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              <FileEdit className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mobileTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Desktop Drawer Selector Buttons */}
          <div className="hidden sm:flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => setActivePanel("content")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activePanel === "content" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileEdit className="h-3 w-3 text-red-400" />
              <span>Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("design")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activePanel === "design" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="h-3 w-3 text-amber-400" />
              <span>Design</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("reorder")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activePanel === "reorder" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ListOrdered className="h-3 w-3 text-blue-400" />
              <span>Layout</span>
            </button>
          </div>

          {/* Export / Share Button */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Export & Share</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Split View */}
      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible print:h-auto">
        {/* Left Side: Form Editor */}
        <div
          className={`w-full sm:w-[500px] lg:w-[560px] border-r border-zinc-800 flex flex-col bg-[#0b0b0e] shrink-0 no-print ${
            mobileTab === "preview" ? "hidden sm:flex" : "flex"
          }`}
        >
          {/* Panel Selector on Mobile */}
          <div className="flex sm:hidden border-b border-zinc-800 p-2 gap-1 bg-zinc-950">
            <button
              onClick={() => setActivePanel("content")}
              className={`flex-1 py-1 text-xs font-medium rounded ${
                activePanel === "content" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActivePanel("design")}
              className={`flex-1 py-1 text-xs font-medium rounded ${
                activePanel === "design" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setActivePanel("reorder")}
              className={`flex-1 py-1 text-xs font-medium rounded ${
                activePanel === "reorder" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              Layout
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activePanel === "design" && (
              <ThemePicker
                currentTemplate={data.template}
                onTemplateChange={(template: TemplateType) => updateData({ template })}
                currentColor={data.themeColor}
                onColorChange={(themeColor: string) => updateData({ themeColor })}
                currentFont={data.fontFamily}
                onFontChange={(fontFamily: FontFamilyType) => updateData({ fontFamily })}
              />
            )}

            {activePanel === "reorder" && (
              <SectionReorder
                sectionOrder={data.sectionOrder}
                onChange={(sectionOrder: SectionKey[]) => updateData({ sectionOrder })}
              />
            )}

            {activePanel === "content" && (
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>1. Personal & Contact Details</span>
                    <span className="text-[10px] text-red-400 font-mono">Header</span>
                  </h3>
                  <PersonalInfoForm
                    data={data.personalInfo}
                    onChange={(personalInfo) => updateData({ personalInfo })}
                  />
                </div>

                {/* Professional Summary */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>2. Professional Summary</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Profile</span>
                  </h3>
                  <SummaryForm
                    summary={data.summary}
                    onChange={(summary) => updateData({ summary })}
                  />
                </div>

                {/* Experience */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>3. Work Experience</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Career</span>
                  </h3>
                  <ExperienceForm
                    items={data.experience}
                    onChange={(experience) => updateData({ experience })}
                  />
                </div>

                {/* Education */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>4. Education</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Academic</span>
                  </h3>
                  <EducationForm
                    items={data.education}
                    onChange={(education) => updateData({ education })}
                  />
                </div>

                {/* Skills */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>5. Skills & Proficiencies</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Keywords</span>
                  </h3>
                  <SkillsForm
                    categories={data.skills}
                    onChange={(skills) => updateData({ skills })}
                  />
                </div>

                {/* Projects */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>6. Projects</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Portfolio</span>
                  </h3>
                  <ProjectsForm
                    items={data.projects}
                    onChange={(projects) => updateData({ projects })}
                  />
                </div>

                {/* Certifications */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                    <span>7. Certifications & Honors</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Credentials</span>
                  </h3>
                  <CertificationsForm
                    items={data.certifications}
                    onChange={(certifications) => updateData({ certifications })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Resume Preview */}
        <div
          className={`flex-1 bg-zinc-950/90 relative overflow-auto flex flex-col items-center p-4 sm:p-8 print:p-0 print:m-0 print:bg-white print:overflow-visible print:w-full print:block ${
            mobileTab === "editor" ? "hidden sm:flex" : "flex"
          }`}
        >
          {/* Zoom Controls floating at top right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-lg bg-zinc-900/90 border border-zinc-800 p-1 shadow-lg backdrop-blur-xs no-print">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-mono text-zinc-400 px-1.5">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(0.85)}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Render Paper Canvas */}
          <div className="w-full flex justify-center py-4 print:py-0 print:m-0 print:w-full print:block">
            <TemplateRenderer data={data} scale={zoomScale} />
          </div>
        </div>
      </div>

      {/* Export & Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={data}
        onImportData={(imported) => updateData(imported)}
        onTogglePublish={handleTogglePublish}
        isPublishing={isPublishing}
      />
    </div>
  );
}
