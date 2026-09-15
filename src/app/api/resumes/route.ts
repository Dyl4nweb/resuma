import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createResumeSafely, LimitExceededError, getUserResumeUsage } from "@/lib/limits";
import { DEFAULT_RESUME_DATA } from "@/types/resume";
import { resumeRateLimiter } from "@/lib/rate-limit";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [resumes, usage] = await Promise.all([
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
    ]);

    return NextResponse.json({ resumes, usage });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = resumeRateLimiter.check(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many resumes created. Please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString() } }
      );
    }
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const title = (body.title || "Untitled Resume").trim();

    // Prepare initial data (either default starter template or custom provided)
    const initialData = {
      title,
      template: body.template || DEFAULT_RESUME_DATA.template,
      themeColor: body.themeColor || DEFAULT_RESUME_DATA.themeColor,
      fontFamily: body.fontFamily || DEFAULT_RESUME_DATA.fontFamily,
      sectionOrder: body.sectionOrder || DEFAULT_RESUME_DATA.sectionOrder,
      personalInfo: body.personalInfo || DEFAULT_RESUME_DATA.personalInfo,
      summary: body.summary || DEFAULT_RESUME_DATA.summary,
      experience: body.experience || DEFAULT_RESUME_DATA.experience,
      education: body.education || DEFAULT_RESUME_DATA.education,
      skills: body.skills || DEFAULT_RESUME_DATA.skills,
      projects: body.projects || DEFAULT_RESUME_DATA.projects,
      certifications: body.certifications || DEFAULT_RESUME_DATA.certifications,
    };

    // Atomic creation with concurrent-safe FREE limit check
    const result = await createResumeSafely(userId, initialData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof LimitExceededError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "LIMIT_EXCEEDED",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
