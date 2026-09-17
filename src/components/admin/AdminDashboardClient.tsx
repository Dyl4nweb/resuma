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
} from "lucide-react";

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
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeResumePopover, setActiveResumePopover] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
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
      alert("You cannot remove your own admin privileges.");
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
      alert("You cannot delete your own admin account.");
      return;
    }
    if (!confirm(`Are you sure you want to delete user "${email}" and all their resumes? This action cannot be undone.`)) {
      return;
    }

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Live Admin Portal
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PostgreSQL Live
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time database monitor for accounts, subscription tiers, and resume analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-zinc-500">Auto-refresh active (15s)</p>
            <p className="text-xs text-zinc-400 flex items-center justify-end gap-1">
              <Clock className="h-3 w-3 text-zinc-500" />
              {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => fetchLiveUsers(false)}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-200 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-red-500" : ""}`} />
            <span>{loading ? "Syncing..." : "Sync Database"}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-60 hover:opacity-100 underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-800/80">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-red-500 text-red-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Analytics Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-red-500 text-red-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          User Management
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Total Users</span>
                <Users className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{stats.totalUsers}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Active registrations</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300">PRO Members</span>
                <Crown className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-200">{stats.proUsers}</p>
              <p className="text-[11px] text-amber-400/70 mt-0.5">
                {stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0}% conversion
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">FREE Users</span>
                <Users className="h-4 w-4 text-zinc-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-zinc-200">{stats.freeUsers}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">1-resume tier</p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Resumes Created</span>
                <FileText className="h-4 w-4 text-red-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{stats.totalResumes}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Across platform</p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Total Views</span>
                <Eye className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-300">{stats.totalViews}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Public resume views</p>
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
            <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6">7-Day Analytics Overview</h2>
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

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6">Traffic Sources</h2>
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Resumes</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
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
                    <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                              <span>{u.name || "No Name"}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.2 rounded font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 select-all font-mono">
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
                              : "bg-zinc-800 text-zinc-400"
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
                              : "bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
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
                            className="inline-flex items-center gap-1 text-zinc-200 hover:text-white font-semibold bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/60 transition-colors"
                          >
                            <FileText className="h-3 w-3 text-red-400" />
                            <span>{u._count.resumes}</span>
                            {u.resumes.length > 0 && <ChevronDown className="h-3 w-3 text-zinc-400" />}
                          </button>

                          {/* Resume Popover */}
                          {activeResumePopover === u.id && u.resumes.length > 0 && (
                            <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl z-20 space-y-2">
                              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1">
                                User Resumes ({u.resumes.length})
                              </p>
                              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {u.resumes.map((r) => (
                                  <div
                                    key={r.id}
                                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]"
                                  >
                                    <div className="font-semibold text-zinc-200 truncate">
                                      {r.title}
                                    </div>
                                    <div className="flex items-center justify-between text-zinc-400 mt-1 text-[10px]">
                                      <span className={r.isPublished ? "text-emerald-400" : "text-zinc-500"}>
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
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        <div>{new Date(u.createdAt).toLocaleDateString()}</div>
                        <div className="text-zinc-500 text-[10px]">
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
                                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
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
                                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <Shield className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={isCurrent}
                            title="Delete User"
                            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
