"use client";

import { useState, useEffect } from "react";
import { KeyRound, CheckCircle2, ArrowRight, X, Loader2, Sparkles } from "lucide-react";

interface QuickPinPromptProps {
  userEmail: string;
  userName: string;
  hasPin: boolean;
}

export function QuickPinPrompt({ userEmail, userName, hasPin }: QuickPinPromptProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Only show if user does not have a PIN and hasn't dismissed it this session
    if (!hasPin) {
      const dismissed = sessionStorage.getItem("resuma_pin_prompt_dismissed");
      if (!dismissed) {
        setVisible(true);
      }
    }
  }, [hasPin]);

  if (!visible || hasPin) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("resuma_pin_prompt_dismissed", "true");
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError("PIN must be exactly 6 numeric digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set PIN");

      // Update remembered user in localStorage
      try {
        const stored = localStorage.getItem("resuma_remembered_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.hasPin = true;
          localStorage.setItem("resuma_remembered_profile", JSON.stringify(parsed));
        } else {
          localStorage.setItem(
            "resuma_remembered_profile",
            JSON.stringify({ email: userEmail, name: userName, hasPin: true })
          );
        }
      } catch {
        // Ignore localStorage error
      }

      setSuccess(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-red-500/20 bg-card text-card-foreground p-4 sm:p-5 relative overflow-hidden backdrop-blur-md shadow-sm">
      <button
        onClick={handleDismiss}
        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
        title="Dismiss for now"
      >
        <X className="h-4 w-4" />
      </button>

      {success ? (
        <div className="flex items-center gap-3 py-2 text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Quick PIN activated!</p>
            <p className="text-xs text-emerald-400/80">
              Next time you sign in, you can unlock your account with just your 6-digit PIN.
            </p>
          </div>
        </div>
      ) : !isOpen ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>Set up Quick PIN for Faster Logins</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  <Sparkles className="h-2.5 w-2.5" />
                  Recommended
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tired of typing your email and long password? Set up a 6-digit PIN to instantly unlock your account next time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
            >
              Maybe Later
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-all shadow-sm active:scale-95"
            >
              <span>Create 6-Digit PIN</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span>Choose your 6-Digit Quick PIN</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter numbers only (0-9). You can still log in with your password anytime.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <div>
              <label className="block text-[11px] font-medium text-foreground mb-1">
                6-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-center tracking-widest text-base text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-center tracking-widest text-base text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={loading || pin.length !== 6 || confirmPin.length !== 6}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              <span>Save Quick PIN</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
