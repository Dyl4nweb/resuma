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

  const [rawUsers, totalUsers, proUsers, freeUsers, totalResumes, resumeViewsSum] = await Promise.all([
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
  ]);

  const initialUsers: AdminUser[] = rawUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  const initialStats: AdminStats = {
    totalUsers,
    proUsers,
    freeUsers,
    totalResumes,
    totalViews: resumeViewsSum._sum.viewsCount || 0,
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
