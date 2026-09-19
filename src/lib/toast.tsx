"use client";

import toast, { Toast } from "react-hot-toast";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Info,
  X,
} from "lucide-react";

interface PaymentToastProps {
  t: Toast;
  title: string;
  message: string;
  planName?: string;
  type?: "success" | "error" | "info";
}

interface ConfirmToastProps {
  t: Toast;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function PaymentToastCard({
  t,
  title,
  message,
  planName = "PRO",
  type = "success",
}: PaymentToastProps) {
  return (
    <div
      className={`relative flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 max-w-md w-full shadow-2xl backdrop-blur-md ${
        t.visible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-3 opacity-0 scale-95"
      } ${
        type === "success"
          ? "bg-card/95 border-emerald-500/30 text-foreground ring-1 ring-emerald-500/20"
          : type === "error"
          ? "bg-card/95 border-red-500/30 text-foreground ring-1 ring-red-500/20"
          : "bg-card/95 border-border text-foreground"
      }`}
    >
      {/* Icon Badge */}
      <div className="shrink-0 mt-0.5">
        {type === "success" && (
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-500/10">
            <ShieldCheck className="h-5 w-5" />
          </div>
        )}
        {type === "error" && (
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-sm shadow-red-500/10">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
        {type === "info" && (
          <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-sm">
            <Info className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            <Sparkles className="h-2.5 w-2.5" />
            <span>RESUMA {planName}</span>
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {type === "success" ? "Activated" : type === "error" ? "Notice" : "Update"}
          </span>
        </div>

        <h4 className="text-sm font-bold text-foreground tracking-tight">
          {title}
        </h4>

        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
          {message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ConfirmToastCard({
  t,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmToastProps) {
  return (
    <div
      className={`relative flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-300 max-w-md w-full shadow-2xl backdrop-blur-md ${
        t.visible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-3 opacity-0 scale-95"
      } bg-card/95 border-red-500/30 text-foreground ring-1 ring-red-500/20`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon Badge */}
        <div className="shrink-0 mt-0.5">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-sm shadow-red-500/10">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-bold text-foreground tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
            {message}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            if (onCancel) onCancel();
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
        >
          {confirmText}
        </button>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => {
          toast.dismiss(t.id);
          if (onCancel) onCancel();
        }}
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export const showToast = {
  // Standard methods matching react-hot-toast
  success: (message: string, options?: Parameters<typeof toast.success>[1]) =>
    toast.success(message, options),

  error: (message: string, options?: Parameters<typeof toast.error>[1]) =>
    toast.error(message, options),

  loading: (message: string, options?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(message, options),

  dismiss: (toastId?: string) => toast.dismiss(toastId),

  // Dedicated payment / PRO celebration toasts
  paymentSuccess: ({
    title = "Payment Confirmed!",
    message = "Your account is now upgraded to Resuma PRO. Unlimited resumes are now unlocked.",
    planName = "PRO",
  }: {
    title?: string;
    message?: string;
    planName?: string;
  } = {}) => {
    return toast.custom(
      (t) => (
        <PaymentToastCard
          t={t}
          title={title}
          message={message}
          planName={planName}
          type="success"
        />
      ),
      { duration: 6000 }
    );
  },

  paymentError: ({
    title = "Payment Issue",
    message,
    planName = "PRO",
  }: {
    title?: string;
    message: string;
    planName?: string;
  }) => {
    return toast.custom(
      (t) => (
        <PaymentToastCard
          t={t}
          title={title}
          message={message}
          planName={planName}
          type="error"
        />
      ),
      { duration: 6000 }
    );
  },

  paymentInfo: ({
    title = "Checkout Canceled",
    message = "No charges were made to your account.",
    planName = "PRO",
  }: {
    title?: string;
    message?: string;
    planName?: string;
  } = {}) => {
    return toast.custom(
      (t) => (
        <PaymentToastCard
          t={t}
          title={title}
          message={message}
          planName={planName}
          type="info"
        />
      ),
      { duration: 5000 }
    );
  },

  confirm: ({
    title = "Confirm Action",
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
  }: {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => {
    return toast.custom(
      (t) => (
        <ConfirmToastCard
          t={t}
          title={title}
          message={message}
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmText={confirmText}
          cancelText={cancelText}
        />
      ),
      { duration: Infinity } // Waits for user interaction
    );
  },
};

export default toast;
