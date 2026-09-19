"use client";

import { useState } from "react";
import { Check, X, Clock, CreditCard, ArrowLeft, ShieldAlert } from "lucide-react";
import { approveManualPayment, rejectManualPayment } from "@/app/actions/admin";
import { showToast } from "@/lib/toast";
import Link from "next/link";

interface PendingPayment {
  id: string;
  referenceNumber: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function PendingPaymentsClient({
  initialPayments,
}: {
  initialPayments: PendingPayment[];
}) {
  const [payments, setPayments] = useState(initialPayments);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (paymentId: string, userId: string, email: string, ref: string) => {
    showToast.confirm({
      title: "Approve Payment?",
      message: `Are you sure you want to approve this payment from ${email}?\nReference: ${ref}\n\nThis will instantly upgrade their account to PRO.`,
      confirmText: "Approve Payment",
      onConfirm: async () => {
        setLoadingIds((prev) => new Set(prev).add(paymentId));
        try {
          const res = await approveManualPayment(paymentId, userId);
          if (res.error) throw new Error(res.error);
          showToast.success("Payment approved! User upgraded to PRO.");
          setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        } catch (error: any) {
          showToast.error(error.message || "Failed to approve payment");
        } finally {
          setLoadingIds((prev) => {
            const next = new Set(prev);
            next.delete(paymentId);
            return next;
          });
        }
      },
    });
  };

  const handleReject = async (paymentId: string, email: string, ref: string) => {
    showToast.confirm({
      title: "Reject Payment?",
      message: `Are you sure you want to REJECT this payment from ${email}?\nReference: ${ref}\n\nThe record will be deleted and they will need to submit again.`,
      confirmText: "Yes, Reject",
      onConfirm: async () => {
        setLoadingIds((prev) => new Set(prev).add(paymentId));
        try {
          const res = await rejectManualPayment(paymentId);
          if (res.error) throw new Error(res.error);
          showToast.success("Payment rejected and removed.");
          setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        } catch (error: any) {
          showToast.error(error.message || "Failed to reject payment");
        } finally {
          setLoadingIds((prev) => {
            const next = new Set(prev);
            next.delete(paymentId);
            return next;
          });
        }
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/admin"
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Pending Payments
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Review manual MariBank/QR payments below. Always verify in your banking app before approving.
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">All caught up!</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            There are no pending manual payment requests. When users submit a reference number, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90 leading-relaxed">
              <strong className="font-semibold text-amber-400">Security Notice:</strong> Approving a payment will instantly grant the user a PRO subscription forever. Make sure the reference number exactly matches a successful deposit in your bank app.
            </p>
          </div>

          <div className="grid gap-4">
            {payments.map((payment) => {
              const isLoading = loadingIds.has(payment.id);
              
              return (
                <div 
                  key={payment.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border bg-card shadow-sm transition-all ${
                    isLoading ? "opacity-50 pointer-events-none" : "hover:border-zinc-700"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                    {/* User Info */}
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">User</p>
                      <p className="font-bold text-foreground">{payment.user.name || "Unknown Name"}</p>
                      <p className="text-xs text-muted-foreground">{payment.user.email}</p>
                    </div>

                    {/* Reference */}
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reference No.</p>
                      <code className="px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded text-sm text-emerald-400 font-mono inline-block">
                        {payment.referenceNumber}
                      </code>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Submitted On</p>
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border justify-end">
                    <button
                      onClick={() => handleReject(payment.id, payment.user.email, payment.referenceNumber)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 text-red-400 font-semibold text-sm transition-colors"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(payment.id, payment.user.id, payment.user.email, payment.referenceNumber)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-sm"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
