import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resumeSchema } from "@/lib/validations/resume";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Ownership check
    if (resume.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this resume" }, { status: 403 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ownership check before any update
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this resume" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = resumeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        title: data.title,
        template: data.template,
        themeColor: data.themeColor,
        fontFamily: data.fontFamily,
        sectionOrder: data.sectionOrder,
        personalInfo: data.personalInfo,
        summary: data.summary,
        experience: data.experience as unknown as Prisma.InputJsonValue,
        education: data.education as unknown as Prisma.InputJsonValue,
        skills: data.skills as unknown as Prisma.InputJsonValue,
        projects: data.projects as unknown as Prisma.InputJsonValue,
        certifications: data.certifications as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ resume: updated });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this resume" }, { status: 403 });
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
