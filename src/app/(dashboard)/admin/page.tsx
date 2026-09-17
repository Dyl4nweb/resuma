import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AdminDashboardClient, AdminUser, AdminStats } from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Portal — Resuma",
};

export default async function AdminPage() {
  const authCheck = await requireAdminSession();

  if (!authCheck.authorized) {
    if (authCheck.status === 401) {
      redirect("/login");
    } else {
      redirect("/dashboard");
    }
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    rawUsers,
    totalUsers,
    proUsers,
    freeUsers,
    totalResumes,
    resumeViewsSum,
    dbSizeResult,
    recentSignups,
    recentResumes,
    recentViews,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionTier: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            resumes: true,
          },
        },
        resumes: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            viewsCount: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionTier: "PRO" } }),
    prisma.user.count({ where: { subscriptionTier: "FREE" } }),
    prisma.resume.count(),
    prisma.resume.aggregate({
      _sum: {
        viewsCount: true,
      },
    }),
    prisma.$queryRaw<{ size: string }[]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size`,
    prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.resume.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.resumeView.findMany({ where: { viewedAt: { gte: sevenDaysAgo } }, select: { viewedAt: true, referrer: true } }),
  ]);

  const initialUsers: AdminUser[] = rawUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  const chartData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    const fullDate = d.toISOString().split("T")[0];

    const signups = recentSignups.filter(u => u.createdAt.toISOString().startsWith(fullDate)).length;
    const resumes = recentResumes.filter(r => r.createdAt.toISOString().startsWith(fullDate)).length;
    const views = recentViews.filter(v => v.viewedAt.toISOString().startsWith(fullDate)).length;

    chartData.push({ date: dateStr, signups, resumes, views });
  }

  const sources = {
    Direct: 0,
    LinkedIn: 0,
    Twitter: 0,
    Facebook: 0,
    Other: 0
  };

  recentViews.forEach((v) => {
    if (!v.referrer) sources.Direct++;
    else if (v.referrer.includes("linkedin.com")) sources.LinkedIn++;
    else if (v.referrer.includes("t.co") || v.referrer.includes("twitter.com") || v.referrer.includes("x.com")) sources.Twitter++;
    else if (v.referrer.includes("facebook.com") || v.referrer.includes("fb.com")) sources.Facebook++;
    else sources.Other++;
  });

  const viewSources = Object.entries(sources)
    .map(([name, value]) => ({ name, value }))
    .filter((x) => x.value > 0);

  if (viewSources.length === 0) {
    viewSources.push({ name: "Direct", value: 1 });
  }

  const initialStats: AdminStats = {
    totalUsers,
    proUsers,
    freeUsers,
    totalResumes,
    totalViews: resumeViewsSum._sum.viewsCount || 0,
    databaseSize: dbSizeResult[0]?.size || "Unknown",
    signupsLast7Days: recentSignups.length,
    resumesLast7Days: recentResumes.length,
    chartData,
    viewSources,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      <Navbar user={authCheck.user} />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboardClient
          initialUsers={initialUsers}
          initialStats={initialStats}
          currentAdminEmail={authCheck.user?.email || ""}
        />
      </main>
      <Footer />
    </div>
  );
}
