"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FileText, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { validateStrictName } from "@/lib/validations/name";
import { LegalModals, LegalModalType } from "@/components/legal/LegalModals";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // Live validation for redundant name
  const nameValidation = name.trim().length >= 2 ? validateStrictName(name) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side strict name redundancy check
    const validation = validateStrictName(name);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid, non-redundant full name.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register user
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: validation.cleanedName, email, pin }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.error || "Failed to register account");
      }

      setIsRedirecting(true);
      
      // Save to localStorage so login page recognizes them
      try {
        localStorage.setItem(
          "resuma_remembered_profile",
          JSON.stringify({
            email: email.toLowerCase().trim(),
            name: validation.cleanedName,
            hasPin: true,
          })
        );
      } catch {
        // Ignore localStorage errors
      }

      // Small delay to show the loading animation before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (isRedirecting || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden">
        <LoadingSpinner />
        <p className="text-xs text-muted-foreground font-medium z-[10000] mt-32 absolute animate-pulse">
          Account created! Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="mx-auto w-full max-w-md text-center">
        <Link href="/" className="inline-block group">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            Resuma<span className="text-[#dc2626]">.</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Create your free account
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-red-500 hover:text-red-400 underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-foreground mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className={`w-full rounded-lg border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                  name.trim().length >= 3 && nameValidation && !nameValidation.isValid
                    ? "border-amber-500/60 focus:border-amber-500 focus:ring-amber-500"
                    : "border-border focus:border-red-500 focus:ring-red-500"
                }`}
              />
              {name.trim().length >= 3 && nameValidation && !nameValidation.isValid && (
                <p className="mt-1 text-[11px] text-amber-400">
                  {nameValidation.error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block text-xs font-semibold text-foreground mb-1"
              >
                Secure 6-Digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoComplete="new-password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-center tracking-widest text-lg text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border bg-background text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground">
                I agree to the{" "}
                <button type="button" onClick={() => setLegalModal("terms")} className="text-red-500 hover:underline font-medium">
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button type="button" onClick={() => setLegalModal("privacy")} className="text-red-500 hover:underline font-medium">
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            <div className="pt-2 border-t border-border">
              <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>1 Free ATS-ready resume included</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Bank-grade encryption & anti-bot protection</span>
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <LegalModals type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}
