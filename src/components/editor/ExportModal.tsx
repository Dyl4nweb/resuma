"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Printer, Download, Upload, Share2, Copy, Check, ExternalLink, X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onImportData: (data: Partial<ResumeData>) => void;
  onTogglePublish: () => Promise<void>;
  isPublishing: boolean;
}

export function ExportModal({
  isOpen,
  onClose,
  data,
  onImportData,
  onTogglePublish,
  isPublishing,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        onImportData(imported);
        alert("Resume data imported successfully!");
        onClose();
      } catch (err) {
        console.error(err);
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const publicUrl = data.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${data.slug}`
    : "";

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 no-print">
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
            <span>Export & Share Resume</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Action 1: Print / PDF */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                <Printer className="h-4 w-4 text-red-500" />
                <span>Save as PDF / Print</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Generates a clean, vector ATS-friendly PDF formatted to standard A4/Letter size.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm"
            >
              Print / PDF
            </button>
          </div>

          {/* Action 2: Public Share Link */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-blue-400" />
                  <span>Public Web Link</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Share a live link to your resume with recruiters or clients.
                </p>
              </div>
              <button
                type="button"
                onClick={onTogglePublish}
                disabled={isPublishing}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  data.isPublished
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {isPublishing
                  ? "Updating..."
                  : data.isPublished
                  ? "Published (Active)"
                  : "Publish Live Link"}
              </button>
            </div>

            {data.isPublished && publicUrl && (
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title="Open live link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Action 3: JSON Backup and Import */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                <Download className="h-4 w-4 text-purple-400" />
                <span>JSON Data Portability</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Export raw backup JSON or restore data from a previous export.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1 rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Backup</span>
              </button>
              <label className="flex items-center gap-1 rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>Restore</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
