import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { SubscriptionTier, Role } from "@prisma/client";

export async function GET() {
  try {
    const authCheck = await requireAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      users,
      totalUsers,
      proUsers,
      freeUsers,
      stripeProUsers,
      manualProUsers,
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
      prisma.user.count({ where: { subscriptionTier: "PRO", stripeSubscriptionId: { startsWith: "sub_" } } }),
      prisma.user.count({ where: { subscriptionTier: "PRO", stripeSubscriptionId: { startsWith: "instapay_" } } }),
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

    const stats = {
      totalUsers,
      proUsers,
      freeUsers,
      stripeProUsers,
      manualProUsers,
      totalResumes,
      totalViews: resumeViewsSum._sum.viewsCount || 0,
      databaseSize: dbSizeResult[0]?.size || "Unknown",
      signupsLast7Days: recentSignups.length,
      resumesLast7Days: recentResumes.length,
      chartData,
      viewSources,
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = await requireAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const body = await req.json();
    const { userId, subscriptionTier, role } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const dataToUpdate: { subscriptionTier?: SubscriptionTier; role?: Role } = {};

    if (subscriptionTier && ["FREE", "PRO"].includes(subscriptionTier)) {
      dataToUpdate.subscriptionTier = subscriptionTier as SubscriptionTier;
    }

    if (role && ["USER", "ADMIN"].includes(role)) {
      dataToUpdate.role = role as Role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionTier: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin user PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await requireAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Prevent admin from deleting their own account
    if (authCheck.user?.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own active admin account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
