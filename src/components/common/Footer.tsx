import Link from "next/link";
import { FileText, Shield, Zap, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090b] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#fafafa]">
              Resuma<span className="text-[#dc2626]">.</span>
            </span>
            <span className="text-xs text-zinc-500 ml-2">
              Lightweight Production Resume Builder
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-zinc-400">
              <Zap className="h-3.5 w-3.5 text-red-500" /> ATS-Friendly
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-zinc-400" /> Encrypted & Private
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Fast PDF Export
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Resuma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
