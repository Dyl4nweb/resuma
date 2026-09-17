import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserResumeUsage } from "@/lib/limits";
import { Navbar } from "@/components/common/Navbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { QuickPinPrompt } from "@/components/dashboard/QuickPinPrompt";

export const metadata = {
  title: "Dashboard — Resuma",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [resumes, usage, user] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        template: true,
        themeColor: true,
        viewsCount: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    getUserResumeUsage(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, subscriptionTier: true, pinHash: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <QuickPinPrompt
          userEmail={user?.email || ""}
          userName={user?.name || "Professional"}
          hasPin={Boolean(user?.pinHash)}
        />
        <DashboardClient
          initialResumes={resumes}
          initialUsage={usage}
          userName={user?.name || "Professional"}
        />
      </main>
    </div>
  );
}
