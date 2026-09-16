"use client";

import { Printer, Download } from "lucide-react";

export function PublicPrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
        title="Save as PDF (via Print dialog)"
      >
        <Download className="h-3.5 w-3.5 text-blue-400" />
        <span className="hidden sm:inline">Download PDF</span>
        <span className="sm:hidden">PDF</span>
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
        title="Print Document"
      >
        <Printer className="h-3.5 w-3.5 text-red-400" />
        <span className="hidden sm:inline">Print</span>
      </button>
    </div>
  );
}
