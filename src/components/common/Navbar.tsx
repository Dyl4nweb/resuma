"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  FileText,
  LayoutDashboard,
  CreditCard,
  LogOut,
  ArrowRight,
  Shield,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    subscriptionTier?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Mobile menu open/close state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("Client signOut error:", err);
    }

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Server logout fetch error:", err);
    }

    // Force hard browser navigation to /login to completely bust all caches
    window.location.href = "/login";
  };

  // Automatically close mobile menu when navigating to a new route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Navbar background transitions on scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setScrolled(window.scrollY > (window.innerHeight * 1.2));
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const isAdmin =
    user?.role === "ADMIN" ||
    (user?.email &&
      ["kurtdylanviray@gmail.com", "viraykurt09@gmail.com", "demo@resuma.dev"].includes(
        user.email.toLowerCase()
      ));

  return (
    <header
      className={`${
        isHomePage ? "fixed" : "sticky"
      } top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out ${
        !isHomePage
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm opacity-100 translate-y-0"
          : scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Resuma Logo" width={36} height={36} className="h-9 w-9 object-contain shadow-sm transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation / Actions */}
        <nav className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-accent-foreground hover:bg-muted"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/billing"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/billing"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-accent-foreground hover:bg-muted"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
                {user.subscriptionTier === "PRO" ? (
                  <span className="ml-1 inline-flex items-center rounded-full bg-red-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-red-400 border border-red-500/20">
                    PRO
                  </span>
                ) : (
                  <span className="ml-1 inline-flex items-center rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground border border-border">
                    FREE
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/dashboard/settings"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-accent-foreground hover:bg-muted"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    pathname === "/admin"
                      ? "bg-red-950/60 text-red-400 border border-red-500/30"
                      : "text-muted-foreground hover:text-red-400 hover:bg-muted"
                  }`}
                >
                  <Shield className="h-4 w-4 text-red-500" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Sign out"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-accent-foreground hover:bg-muted rounded-md transition-colors cursor-pointer border border-transparent hover:border-border disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </>
          ) : isAuthPage ? (
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-accent-foreground transition-colors"
            >
              Back to Home
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-foreground hover:text-accent-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-1.5 text-sm font-medium text-zinc-900 transition-all hover:bg-white hover:shadow-md active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <div className="pl-2 border-l border-border ml-1">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {/* Quick status badge if user logged in */}
          {user && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
              {user.subscriptionTier === "PRO" ? "PRO" : "FREE"}
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:text-accent-foreground hover:border-border transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {user ? (
            <div className="space-y-3">
              {/* User Profile Card */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 font-bold text-xs">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user.name || "Resuma User"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 pl-2">
                  {user.subscriptionTier === "PRO" ? (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                      PRO
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                      FREE
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-0.5 pt-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-muted text-foreground font-semibold"
                      : "text-foreground hover:text-accent-foreground hover:bg-muted"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    pathname === "/dashboard/billing"
                      ? "bg-muted text-foreground font-semibold"
                      : "text-foreground hover:text-accent-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>Billing</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {user.subscriptionTier === "PRO" ? "Pro Plan" : "Free Plan"}
                  </span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    pathname === "/dashboard/settings"
                      ? "bg-muted text-foreground font-semibold"
                      : "text-foreground hover:text-accent-foreground hover:bg-muted"
                  }`}
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      pathname === "/admin"
                        ? "bg-red-950/60 text-red-400 border border-red-500/30"
                        : "text-foreground hover:text-red-400 hover:bg-muted"
                    }`}
                  >
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Sign out */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Account Session</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          ) : isAuthPage ? (
            <div className="py-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:text-accent-foreground"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 max-w-xs mx-auto">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:text-accent-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500 shadow-sm transition-colors"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
