"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ResumeListItem {
  id: string;
  title: string;
  slug: string | null;
  isPublished: boolean;
  template: string;
  themeColor: string;
  viewsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface UsageInfo {
  isPro: boolean;
  count: number;
  limit: number;
  canCreateMore: boolean;
}

interface DashboardClientProps {
  initialResumes: ResumeListItem[];
  initialUsage: UsageInfo;
  userName: string;
}

export function DashboardClient({
  initialResumes,
  initialUsage,
  userName,
}: DashboardClientProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeListItem[]>(initialResumes);
  const [usage, setUsage] = useState<UsageInfo>(initialUsage);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Create new resume
  const handleCreateResume = async () => {
    if (!usage.canCreateMore) {
      router.push("/dashboard/billing");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My Professional Resume" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "LIMIT_EXCEEDED") {
          setErrorMessage(data.error);
          setUsage((prev) => ({ ...prev, canCreateMore: false }));
          return;
        }
        throw new Error(data.error || "Failed to create resume");
      }

      router.push(`/resumes/${data.resume.id}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error creating resume");
    } finally {
      setIsCreating(false);
    }
  };

  // Duplicate resume
  const handleDuplicate = async (id: string) => {
    if (!usage.canCreateMore) {
      router.push("/dashboard/billing");
      return;
    }

    setActionLoadingId(id);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/resumes/${id}/duplicate`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "LIMIT_EXCEEDED") {
          setErrorMessage(data.error);
          return;
        }
        throw new Error(data.error || "Failed to duplicate resume");
      }

      setResumes([data.resume, ...resumes]);
      setUsage((prev) => ({
        ...prev,
        count: prev.count + 1,
        canCreateMore: prev.isPro || prev.count + 1 < 1,
      }));
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error duplicating resume");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete resume
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setActionLoadingId(id);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete resume");
      }

      setResumes(resumes.filter((r) => r.id !== id));
      setUsage((prev) => ({
        ...prev,
        count: Math.max(0, prev.count - 1),
        canCreateMore: true,
      }));
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error deleting resume");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalViews = resumes.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {userName || "Professional"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your resumes, track views, and tailor documents for applications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateResume}
          disabled={isCreating}
          className="w-fit self-start sm:self-auto sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50 active:scale-95 shrink-0"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Error / Limit Banner */}
      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-200">
            <p className="font-semibold">Plan Restriction</p>
            <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-xs font-semibold text-red-400 hover:text-red-300 underline"
          >
            Upgrade to PRO
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Resume Count & Limit */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Total Resumes</span>
            <FileText className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{resumes.length}</span>
            <span className="text-xs text-zinc-500">
              / {usage.isPro ? "Unlimited" : "1 on Free plan"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {usage.isPro
                ? "PRO Plan Active"
                : `${resumes.length} of 1 resume used`}
            </span>
            {!usage.isPro && (
              <Link
                href="/dashboard/billing"
                className="font-semibold text-red-400 hover:text-red-300"
              >
                Upgrade &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Card 2: Views */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Total Recruiter Views</span>
            <Eye className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalViews}</div>
          <p className="mt-3 text-xs text-zinc-400">
            Across all your public shareable links
          </p>
        </div>

        {/* Card 3: Plan Status */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Current Subscription</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {usage.isPro ? "PRO" : "FREE"}
            </span>
            {usage.isPro ? (
              <span className="inline-flex rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-400 border border-red-500/30">
                Unlimited
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-700">
                1 Resume Max
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {usage.isPro ? "Billed Monthly" : "Limited features"}
            </span>
            <Link
              href="/dashboard/billing"
              className="font-semibold text-zinc-300 hover:text-white underline"
            >
              {usage.isPro ? "Manage Plan" : "Upgrade to Pro"}
            </Link>
          </div>
        </div>
      </div>

      {/* Free Tier Limit Notice when limit reached */}
      {!usage.isPro && resumes.length >= 1 && (
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Free Plan Limit Reached (1/1 Resumes)</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-semibold">
                PRO Upgrade
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              You have reached your Free plan limit. Upgrade to PRO to create unlimited resumes, unlock all custom styling, and remove limitations.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors shrink-0 shadow-sm"
          >
            <span>Upgrade to PRO ($1.58 / ₱99)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Resumes Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Your Resumes</h2>

        {resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No resumes created yet</h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
              Create your first ATS-friendly resume using our interactive builder.
            </p>
            <button
              type="button"
              onClick={handleCreateResume}
              disabled={isCreating}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Resume</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const isLoading = actionLoadingId === resume.id;
              const formattedDate = new Date(resume.updatedAt).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={resume.id}
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Strip: Template & Publish Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-300 capitalize border border-zinc-700/60">
                        {resume.template}
                      </span>

                      {resume.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Draft</span>
                      )}
                    </div>

                    {/* Title */}
                    <Link
                      href={`/resumes/${resume.id}`}
                      className="block group-hover:text-red-400 transition-colors"
                    >
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {resume.title}
                      </h3>
                    </Link>

                    {/* Meta: Views & Date */}
                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {resume.viewsCount} views
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <Link
                      href={`/resumes/${resume.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <span>Edit Resume</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      {resume.isPublished && resume.slug && (
                        <Link
                          href={`/r/${resume.slug}`}
                          target="_blank"
                          title="View Public Link"
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDuplicate(resume.id)}
                        disabled={isLoading || !usage.canCreateMore}
                        title={
                          usage.canCreateMore
                            ? "Duplicate Resume"
                            : "Upgrade to PRO to duplicate resumes"
                        }
                        className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors disabled:opacity-40"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(resume.id, resume.title)}
                        disabled={isLoading}
                        title="Delete Resume"
                        className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
