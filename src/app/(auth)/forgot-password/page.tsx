"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to send reset email");
    }
  };

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
          Forgot Password
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {status === "error" && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === "success" ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-emerald-100 mb-2">Check your email</h3>
              <p className="text-sm text-emerald-200/80 mb-4">
                We have sent a password reset link to <strong className="text-emerald-100">{email}</strong>.
              </p>
              <p className="text-[11px] text-muted-foreground bg-background p-2 rounded border border-border">
                (For development, check the terminal console for the mock link)
              </p>
              <div className="mt-6 w-full">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-muted py-2 text-sm font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}

          {status !== "success" && (
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
