"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-block group">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              Resuma<span className="text-[#dc2626]">.</span>
            </span>
          </Link>
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-xl backdrop-blur-md">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold tracking-tight text-foreground mb-2">Invalid Link</h1>
            <p className="text-sm text-muted-foreground mb-6">
              This password reset link is invalid or missing a token.
            </p>
            <Link
              href="/forgot-password"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-muted py-2.5 text-sm font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block group">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            Resuma<span className="text-[#dc2626]">.</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Set new password
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-emerald-100 mb-2">Password reset</h3>
              <p className="text-sm text-emerald-200/80 mb-4">
                Your password has been successfully reset.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Redirecting to login...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                  required
                  minLength={8}
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                  required
                  minLength={8}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95 mt-2"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  "Reset password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
