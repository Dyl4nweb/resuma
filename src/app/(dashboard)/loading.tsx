import { FileText } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Loading Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl shadow-2xl max-w-sm w-full">
        {/* Animated Brand Icon */}
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

        {/* Brand Name */}
        <div className="text-2xl font-extrabold tracking-tight text-white mb-1.5">
          Resuma<span className="text-[#dc2626]">.</span>
        </div>

        <p className="text-xs text-zinc-400 font-medium mb-6">
          Preparing your workspace & loading data...
        </p>

        {/* Laser Progress Bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="h-full w-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full animate-indeterminate" />
        </div>

        {/* Subtitle status indicator */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PostgreSQL Active</span>
        </div>
      </div>
    </div>
  );
}
