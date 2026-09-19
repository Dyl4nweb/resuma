"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 24,
      }}
      toastOptions={{
        duration: 4500,
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          padding: "12px 18px",
          borderRadius: "14px",
          fontSize: "13.5px",
          fontWeight: 500,
          boxShadow:
            "0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)",
          maxWidth: "480px",
          letterSpacing: "-0.01em",
        },
        success: {
          duration: 5000,
          iconTheme: {
            primary: "#10b981", // Emerald 500
            secondary: "#ffffff",
          },
          style: {
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444", // Red 500 (Resuma accent)
            secondary: "#ffffff",
          },
          style: {
            border: "1px solid rgba(239, 68, 68, 0.3)",
          },
        },
        loading: {
          style: {
            border: "1px solid var(--border)",
          },
        },
      }}
    />
  );
}
