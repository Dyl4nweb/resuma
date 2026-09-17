"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Shield, Zap, Sparkles } from "lucide-react";
import { LegalModals, LegalModalType } from "@/components/legal/LegalModals";

export function Footer() {
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Resuma<span className="text-[#dc2626]">.</span>
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              Lightweight Production Resume Builder
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-red-500" /> ATS-Friendly
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" /> Encrypted & Private
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Fast PDF Export
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <p>&copy; {new Date().getFullYear()} Resuma. All rights reserved.</p>
              <span className="hidden sm:inline">&bull;</span>
              <button onClick={() => setLegalModal("terms")} className="hover:text-foreground transition-colors">
                Terms
              </button>
              <span className="hidden sm:inline">&bull;</span>
              <button onClick={() => setLegalModal("privacy")} className="hover:text-foreground transition-colors">
                Privacy
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <LegalModals type={legalModal} onClose={() => setLegalModal(null)} />
    </footer>
  );
}
