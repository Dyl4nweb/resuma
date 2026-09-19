"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  Crown,
  FileText,
  Eye,
  Search,
  RefreshCw,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Database,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { showToast } from "@/lib/toast";

export interface AdminUserResume {
  id: string;
  title: string;
  isPublished: boolean;
  viewsCount: number;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  subscriptionTier: "FREE" | "PRO";
  createdAt: string;
  updatedAt: string;
  _count: {
    resumes: number;
  };
  resumes: AdminUserResume[];
}

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  stripeProUsers: number;
  manualProUsers: number;
  totalResumes: number;
  totalViews: number;
  databaseSize: string;
  signupsLast7Days: number;
  resumesLast7Days: number;
  chartData: { date: string; signups: number; resumes: number; views: number }[];
  viewSources: { name: string; value: number }[];
}

interface AdminDashboardClientProps {
  initialUsers: AdminUser[];
  initialStats: AdminStats;
  currentAdminEmail: string;
}

export function AdminDashboardClient({
  initialUsers,
  initialStats,
  currentAdminEmail,
}: AdminDashboardClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<"ALL" | "PRO" | "FREE" | "ADMIN">("ALL");
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeResumePopover, setActiveResumePopover] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    if (type === "success") {
      showToast.success(message);
    } else {
      showToast.error(message);
    }
  };

  const fetchLiveUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch live users");
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      if (!isSilent) {
        showNotification("error", err instanceof Error ? err.message : "Error refreshing users");
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Poll live every 15 seconds so admin sees new signups automatically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveUsers(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveUsers]);

  const handleToggleTier = async (userId: string, currentTier: "FREE" | "PRO") => {
    const newTier = currentTier === "FREE" ? "PRO" : "FREE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscriptionTier: newTier }),
      });
      if (!res.ok) throw new Error("Failed to update user tier");
      showNotification("success", `User subscription updated to ${newTier}`);
      fetchLiveUsers(true);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleToggleRole = async (userId: string, currentRole: "USER" | "ADMIN", email: string) => {
    if (email === currentAdminEmail && currentRole === "ADMIN") {
      showToast.error("You cannot remove your own admin privileges.");
      return;
    }
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      showNotification("success", `User role updated to ${newRole}`);
      fetchLiveUsers(true);
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === currentAdminEmail) {
      showToast.error("You cannot delete your own admin account.");
      return;
    }
    
    showToast.confirm({
      title: "Delete User",
      message: `Are you sure you want to delete user "${email}" and all their resumes? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete user");
          showNotification("success", `User ${email} deleted successfully`);
          fetchLiveUsers(true);
        } catch (err: unknown) {
          showNotification("error", err instanceof Error ? err.message : "Deletion failed");
        }
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterTier === "PRO") return u.subscriptionTier === "PRO";
      if (filterTier === "FREE") return u.subscriptionTier === "FREE";
      if (filterTier === "ADMIN") return u.role === "ADMIN";
      return true;
    });
  }, [users, search, filterTier]);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Live Admin Portal
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PostgreSQL Live
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time database monitor for accounts, subscription tiers, and resume analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-muted-foreground">Auto-refresh active (15s)</p>
            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/admin/payments"}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-xs font-semibold text-emerald-500 transition-all shadow-sm"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Payments</span>
          </button>
          <button
            onClick={() => fetchLiveUsers(false)}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border hover:border-zinc-600 text-xs font-semibold text-foreground hover:text-accent-foreground transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-red-500" : ""}`} />
            <span>{loading ? "Syncing..." : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-red-500 text-red-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Analytics Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-red-500 text-red-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          User Management
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Users</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.totalUsers}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active registrations</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300">PRO Members</span>
                <Crown className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-200">{stats.proUsers}</p>
              <div className="text-[10px] text-amber-400/80 mt-1.5 space-y-0.5 font-mono">
                <div className="flex justify-between"><span>Stripe:</span> <span>{stats.stripeProUsers}</span></div>
                <div className="flex justify-between"><span>InstaPay:</span> <span>{stats.manualProUsers}</span></div>
                <div className="flex justify-between opacity-70"><span>Gifted:</span> <span>{stats.proUsers - stats.stripeProUsers - stats.manualProUsers}</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">FREE Users</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.freeUsers}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">1-resume tier</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Resumes Created</span>
                <FileText className="h-4 w-4 text-red-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.totalResumes}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across platform</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Views</span>
                <Eye className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-300">{stats.totalViews}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Public resume views</p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-900/10 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400">Storage Size</span>
                <Database className="h-4 w-4 text-blue-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-blue-300">{stats.databaseSize}</p>
              <p className="text-[11px] text-blue-400/70 mt-0.5">PostgreSQL Database</p>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-xl">
              <h2 className="text-lg font-bold text-foreground mb-6">7-Day Analytics Overview</h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResumes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '13px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" name="Signups" dataKey="signups" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSignups)" />
                    <Area type="monotone" name="Resumes Created" dataKey="resumes" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorResumes)" />
                    <Area type="monotone" name="Resume Views" dataKey="views" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xl flex flex-col">
              <h2 className="text-lg font-bold text-foreground mb-6">Traffic Sources</h2>
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.viewSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.viewSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f59e0b'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '13px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PRO", "FREE", "ADMIN"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                filterTier === t
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {t === "ALL" && `All (${users.length})`}
              {t === "PRO" && `PRO (${stats.proUsers})`}
              {t === "FREE" && `FREE (${stats.freeUsers})`}
              {t === "ADMIN" && `Admins (${users.filter((u) => u.role === "ADMIN").length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Live Table */}
      <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Resumes</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-foreground">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initials = (u.name || u.email)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const isCurrent = u.email === currentAdminEmail;

                  return (
                    <tr key={u.id} className="hover:bg-muted transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted border border-border text-foreground font-bold flex items-center justify-center text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <span>{u.name || "No Name"}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.2 rounded font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground select-all font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {u.role === "ADMIN" && <Shield className="h-3 w-3" />}
                          {u.role}
                        </span>
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            u.subscriptionTier === "PRO"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : "bg-muted text-foreground border border-border"
                          }`}
                        >
                          {u.subscriptionTier === "PRO" && <Crown className="h-3 w-3 text-amber-400" />}
                          {u.subscriptionTier}
                        </span>
                      </td>

                      {/* Resumes */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveResumePopover(activeResumePopover === u.id ? null : u.id)
                            }
                            className="inline-flex items-center gap-1 text-foreground hover:text-accent-foreground font-semibold bg-muted px-2 py-1 rounded border border-border transition-colors"
                          >
                            <FileText className="h-3 w-3 text-red-400" />
                            <span>{u._count.resumes}</span>
                            {u.resumes.length > 0 && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                          </button>

                          {/* Resume Popover */}
                          {activeResumePopover === u.id && u.resumes.length > 0 && (
                            <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-border bg-background p-3 shadow-2xl z-20 space-y-2">
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                                User Resumes ({u.resumes.length})
                              </p>
                              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {u.resumes.map((r) => (
                                  <div
                                    key={r.id}
                                    className="p-2 rounded-lg bg-card border border-border text-[11px]"
                                  >
                                    <div className="font-semibold text-foreground truncate">
                                      {r.title}
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground mt-1 text-[10px]">
                                      <span className={r.isPublished ? "text-emerald-400" : "text-muted-foreground"}>
                                        {r.isPublished ? "Published" : "Draft"}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {r.viewsCount} views
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3 px-4 text-muted-foreground text-[11px]">
                        <div>{new Date(u.createdAt).toLocaleDateString()}</div>
                        <div className="text-muted-foreground text-[10px]">
                          {new Date(u.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Tier Button */}
                          <button
                            onClick={() => handleToggleTier(u.id, u.subscriptionTier)}
                            title={`Click to switch to ${u.subscriptionTier === "FREE" ? "PRO" : "FREE"}`}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                              u.subscriptionTier === "FREE"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                                : "bg-muted border-border text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {u.subscriptionTier === "FREE" ? "Set PRO" : "Set FREE"}
                          </button>

                          {/* Toggle Role Button */}
                          <button
                            onClick={() => handleToggleRole(u.id, u.role, u.email)}
                            disabled={isCurrent}
                            title={`Toggle Admin Role`}
                            className={`p-1.5 rounded border transition-all ${
                              u.role === "ADMIN"
                                ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                : "bg-muted border-border text-muted-foreground hover:text-foreground"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <Shield className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={isCurrent}
                            title="Delete User"
                            className="p-1.5 rounded border border-border bg-card text-muted-foreground hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
