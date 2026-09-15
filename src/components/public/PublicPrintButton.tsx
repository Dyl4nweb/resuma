"use client";

import { Printer } from "lucide-react";

export function PublicPrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5 text-red-400" />
      <span>Print / Save PDF</span>
    </button>
  );
}
