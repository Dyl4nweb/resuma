import { FileText } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Loading Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-2xl max-w-sm w-full">


        {/* Brand Name */}
        <div className="text-2xl font-extrabold tracking-tight text-foreground mb-1.5">
          Resuma<span className="text-[#dc2626]">.</span>
        </div>

        <p className="text-xs text-muted-foreground font-medium mb-6">
          Preparing your workspace & loading data...
        </p>

        {/* Laser Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden relative">
          <div className="h-full w-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full animate-indeterminate" />
        </div>

        {/* Subtitle status indicator */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Active</span>
        </div>
      </div>
    </div>
  );
}
