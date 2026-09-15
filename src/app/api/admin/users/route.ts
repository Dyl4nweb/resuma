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

    const [users, totalUsers, proUsers, freeUsers, totalResumes, resumeViewsSum] = await Promise.all([
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

    const stats = {
      totalUsers,
      proUsers,
      freeUsers,
      totalResumes,
      totalViews: resumeViewsSum._sum.viewsCount || 0,
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
