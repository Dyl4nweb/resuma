"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  CreditCard,
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  AlertCircle,
} from "lucide-react";

interface BillingClientProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    subscriptionTier: string;
    stripeCurrentPeriodEnd?: Date | null;
  };
}

export function BillingClient({ user }: BillingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [loading, setLoading] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"card" | "qr">("qr");

  // InstaPay Manual verification states
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submittingRef, setSubmittingRef] = useState(false);
  const [refMessage, setRefMessage] = useState<string | null>(null);
  const [refError, setRefError] = useState<string | null>(null);

  const isPro = user.subscriptionTier === "PRO";

  const handleStripeUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleManagePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal");
      }
    } catch (err) {
      console.error(err);
      alert("Error opening portal");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    setSubmittingRef(true);
    setRefError(null);
    setRefMessage(null);

    try {
      const res = await fetch("/api/billing/manual-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber: referenceNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit reference number");
      }

      setRefMessage(data.message);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      setRefError(err instanceof Error ? err.message : "Error submitting reference");
    } finally {
      setSubmittingRef(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Plans & Billing
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your Resuma subscription, upgrade to unlimited resumes, and manage invoices.
        </p>
      </div>

      {/* Success Notification */}
      {(success || refMessage) && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-sm text-emerald-200">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold">PRO Plan Active!</p>
            <p className="text-xs text-emerald-300/90 mt-0.5">
              {refMessage || "You have successfully upgraded to Resuma PRO. Unlimited resumes are now unlocked."}
            </p>
          </div>
        </div>
      )}

      {/* Canceled Notification */}
      {canceled && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-xs text-zinc-400">
          Checkout was canceled. No charges were made.
        </div>
      )}

      {/* Current Plan Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Current Plan
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                  isPro
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}
              >
                {isPro ? "PRO UNLIMITED" : "FREE PLAN"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              {isPro ? "$1.00 / mo (₱62.78)" : "$0 / forever"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {isPro
                ? "You have full access to unlimited resumes, duplicate features, and public sharing."
                : "You can create and maintain 1 resume on the Free plan."}
            </p>
          </div>

          <div>
            {isPro ? (
              <button
                type="button"
                onClick={handleManagePortal}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                <span>Manage Subscription</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Upgrade / Payment Options Area (Shown if on Free plan) */}
        {!isPro && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Upgrade to Resuma PRO</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose your preferred payment method below to unlock unlimited resumes:
              </p>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="flex items-center gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 max-w-md">
              <button
                type="button"
                onClick={() => setActivePaymentMethod("qr")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activePaymentMethod === "qr"
                    ? "bg-red-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>InstaPay / GCash / Maya</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentMethod("card")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activePaymentMethod === "card"
                    ? "bg-red-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {/* Option 1: InstaPay QR Code Payment */}
            {activePaymentMethod === "qr" && (
              <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* QR Code Container */}
                  <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-4 border-zinc-800 shrink-0 text-center">
                    <img
                      src="/images/instapay-qr.jpg"
                      alt="InstaPay QR Code"
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                    <span className="text-[10px] font-bold text-zinc-800 tracking-wider uppercase block mt-1.5 font-mono">
                      QR Ph · InstaPay
                    </span>
                  </div>

                  {/* Payment Instructions & Submission Form */}
                  <div className="flex-1 space-y-4 text-left">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20 mb-1.5">
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Instant Philippine Mobile Payment</span>
                      </span>
                      <h4 className="text-xl font-bold text-white">
                        Scan QR &bull; ₱62.78 / month
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Open <strong>GCash</strong>, <strong>Maya</strong>, <strong>BDO</strong>, <strong>BPI</strong>, <strong>UnionBank</strong>, or any mobile banking app supporting <strong>QR Ph / InstaPay</strong>.
                      </p>
                    </div>

                    <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                      <li>Scan the QR code with your phone camera or banking app.</li>
                      <li>Send payment of <strong>₱62.78</strong>.</li>
                      <li>Copy the <strong>Reference Number / Transaction ID</strong> from your receipt.</li>
                      <li>Enter it below to activate your PRO account immediately.</li>
                    </ol>

                    {/* Reference Submission Form */}
                    <form onSubmit={handleSubmitReference} className="pt-2 space-y-3">
                      {refError && (
                        <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                          <span>{refError}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          required
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="Enter InstaPay / GCash Reference No."
                          className="w-full sm:flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={submittingRef}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95 shrink-0"
                        >
                          {submittingRef ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          <span>Activate PRO</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Option 2: Credit / Debit Card (Stripe) */}
            {activePaymentMethod === "card" && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-red-400" />
                    <span>Credit / Debit Card Checkout</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    International card processing via Stripe ($1.00 / month). Auto-renews monthly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStripeUpgrade}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95 shrink-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>Pay with Card ($1.00/mo)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feature Comparison Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Free Plan</h3>
                <span className="text-xs text-zinc-500 font-mono">$0</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Essential tools for job seekers building their primary resume.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-zinc-400" />
                  <span><strong>1 Resume Maximum</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-zinc-400" />
                  <span>All 4 ATS Templates (Modern, Classic, Minimal, Compact)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-zinc-400" />
                  <span>Drag-and-Drop Section Reordering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-zinc-400" />
                  <span>High-Fidelity PDF & Print Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-zinc-400" />
                  <span>Public Shareable URL Link</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                {!isPro ? "Current Plan" : "Included"}
              </span>
            </div>
          </div>

          {/* Pro Tier Card */}
          <div className="relative rounded-xl border border-red-500/40 bg-gradient-to-b from-red-950/20 to-zinc-950/80 p-6 flex flex-col justify-between shadow-lg shadow-red-950/20">
            <div className="absolute -top-3 right-4 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase">
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Pro Plan</span>
                  <Sparkles className="h-4 w-4 text-red-400" />
                </h3>
                <span className="text-base font-bold text-white">$1.00 / mo (₱62.78)</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                For active job seekers who need customized resumes tailored to every role.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-zinc-200">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-400" />
                  <span><strong className="text-white">Unlimited Resumes</strong> (Tailor to every job application)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-400" />
                  <span><strong>One-Click Resume Duplication</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-400" />
                  <span>Full Custom Hex Theme Colors & Typography</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-400" />
                  <span>Recruiter View Tracking & Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-400" />
                  <span>Priority ATS Parsing & Export</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
              {isPro ? (
                <button
                  type="button"
                  onClick={handleManagePortal}
                  className="w-full text-center py-2 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  Manage Billing Details &rarr;
                </button>
              ) : (
                <span className="text-xs text-zinc-400 block text-center">
                  Use QR Code or Card above to activate
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
