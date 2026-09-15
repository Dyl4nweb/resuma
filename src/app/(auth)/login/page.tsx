"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
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
        setIsRedirecting(true);
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

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl shadow-2xl max-w-sm w-full">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-red-600/25 blur-xl animate-pulse" />
            <div className="h-16 w-16 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex items-center justify-center relative z-10">
              <FileText className="h-8 w-8 text-zinc-100" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600" />
              </span>
            </div>
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-white mb-1.5">
            Resuma<span className="text-[#dc2626]">.</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-6">
            Authentication verified! Entering dashboard...
          </p>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
            <div className="h-full w-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 transition-colors group-hover:border-zinc-700">
            <FileText className="h-5 w-5 text-zinc-300" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#fafafa]">
            Resuma<span className="text-[#dc2626]">.</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
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
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Account Recognition Screen */}
          {isUsingRemembered && rememberedProfile ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-sm font-bold text-red-400 shrink-0">
                    {(rememberedProfile.name || rememberedProfile.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white">
                        {rememberedProfile.name}
                      </p>
                      <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {rememberedProfile.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  title="Switch to another account"
                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Switch</span>
                </button>
              </div>

              {/* Login Mode Toggle on Recognized Card */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs text-zinc-400">
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
                      className="block text-xs font-semibold text-zinc-300 mb-1"
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
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-center tracking-widest text-xl text-zinc-100 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="recognized-password"
                      className="block text-xs font-semibold text-zinc-300 mb-1"
                    >
                      Account Password
                    </label>
                    <input
                      id="recognized-password"
                      type="password"
                      autoFocus
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
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
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAuthMode("pin")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    authMode === "pin"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
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
                      : "text-zinc-400 hover:text-white"
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
                    className="block text-xs font-semibold text-zinc-300 mb-1"
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
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {authMode === "pin" ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="pin"
                        className="block text-xs font-semibold text-zinc-300"
                      >
                        6-Digit PIN
                      </label>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
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
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-center tracking-widest text-lg text-zinc-100 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-zinc-300"
                      >
                        Account Password
                      </label>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-zinc-400 select-none">
                    Remember my account on this device
                  </label>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-1.5 justify-center text-[11px] text-zinc-500 bg-zinc-950 py-1.5 rounded-md border border-zinc-800/50">
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
