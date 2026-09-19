"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
  UserCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface RememberedProfile {
  email: string;
  name: string;
  hasPin: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"pin" | "password">("pin");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account Recognition State
  const [rememberedProfile, setRememberedProfile] = useState<RememberedProfile | null>(null);
  const [isUsingRemembered, setIsUsingRemembered] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("resuma_remembered_profile");
      if (stored) {
        const parsed: RememberedProfile = JSON.parse(stored);
        if (parsed && parsed.email) {
          setRememberedProfile(parsed);
          setEmail(parsed.email);
          setIsUsingRemembered(true);
          setAuthMode(parsed.hasPin !== false ? "pin" : "password");
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSwitchAccount = () => {
    setIsUsingRemembered(false);
    setEmail("");
    setPin("");
    setPassword("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetEmail = isUsingRemembered && rememberedProfile ? rememberedProfile.email : email.trim().toLowerCase();

    try {
      const res = await signIn("credentials", {
        email: targetEmail,
        pin: authMode === "pin" ? pin : "",
        password: authMode === "password" ? password : "",
        authMode,
        redirect: false,
      });

      if (res?.error) {
        setError(
          authMode === "pin"
            ? "Invalid 6-digit PIN. Please try again or sign in with your password."
            : "Invalid email or password. Please verify your credentials."
        );
      } else {
        // Save remembered profile on success if rememberMe is true or already remembered
        if (rememberMe || isUsingRemembered) {
          try {
            const profileToSave: RememberedProfile = {
              email: targetEmail,
              name: rememberedProfile?.name || targetEmail.split("@")[0],
              hasPin: authMode === "pin" ? true : (rememberedProfile?.hasPin ?? false),
            };
            localStorage.setItem("resuma_remembered_profile", JSON.stringify(profileToSave));
          } catch {
            // Ignore localStorage errors
          }
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-red-500 hover:text-red-400 underline"
          >
            create a new account for free
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Account Recognition Screen */}
          {isUsingRemembered && rememberedProfile ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-sm font-bold text-red-400 shrink-0">
                    {(rememberedProfile.name || rememberedProfile.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground">
                        {rememberedProfile.name}
                      </p>
                      <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {rememberedProfile.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  title="Switch to another account"
                  className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:border-border bg-card transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Switch</span>
                </button>
              </div>

              {/* Login Mode Toggle on Recognized Card */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted-foreground">
                  {authMode === "pin" ? "Enter Quick PIN to unlock" : "Enter account password"}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "pin" ? "password" : "pin")}
                  className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                >
                  {authMode === "pin" ? "Use Password instead" : "Use Quick PIN instead"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "pin" ? (
                  <div>
                    <label
                      htmlFor="recognized-pin"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      6-Digit Quick PIN
                    </label>
                    <input
                      id="recognized-pin"
                      type="password"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      autoFocus
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-center tracking-widest text-xl text-foreground placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="recognized-password"
                        className="block text-xs font-semibold text-foreground"
                      >
                        Account Password
                      </label>
                      <Link 
                        href="/forgot-password" 
                        className="text-[11px] text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      id="recognized-password"
                      type="password"
                      autoFocus
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (authMode === "pin" ? pin.length !== 6 : !password)}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Unlock Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Standard Full Login Form with Tabs */
            <div className="space-y-4">
              {/* Tab Selector: PIN vs Password */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-background border border-border">
                <button
                  type="button"
                  onClick={() => setAuthMode("pin")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    authMode === "pin"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-accent-foreground"
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Quick PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    authMode === "password"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-accent-foreground"
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Password</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {authMode === "pin" ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="pin"
                        className="block text-xs font-semibold text-foreground"
                      >
                        6-Digit PIN
                      </label>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-red-500" />
                        Fast unlock
                      </span>
                    </div>
                    <input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      autoComplete="current-password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-center tracking-widest text-lg text-foreground placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-foreground"
                      >
                        Account Password
                      </label>
                      <Link 
                        href="/forgot-password" 
                        className="text-[11px] text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border bg-background text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-muted-foreground select-none">
                    Remember my account on this device
                  </label>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-1.5 justify-center text-[11px] text-muted-foreground bg-background py-1.5 rounded-md border border-border">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>Protected by Bank-Grade Anti-Bot Security</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (authMode === "pin" ? pin.length !== 6 : !password)}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>{authMode === "pin" ? "Sign In with PIN" : "Sign In with Password"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
