import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createResumeSafely, LimitExceededError } from "@/lib/limits";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find source resume
    const source = await prisma.resume.findUnique({
      where: { id },
    });

    if (!source) {
      return NextResponse.json({ error: "Source resume not found" }, { status: 404 });
    }

    if (source.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this resume" }, { status: 403 });
    }

    // Atomic creation with concurrent-safe FREE limit check
    const duplicateData = {
      title: `${source.title} (Copy)`,
      template: source.template,
      themeColor: source.themeColor,
      fontFamily: source.fontFamily,
      sectionOrder: source.sectionOrder as unknown as Prisma.InputJsonValue,
      personalInfo: source.personalInfo as unknown as Prisma.InputJsonValue,
      summary: source.summary || "",
      experience: source.experience as unknown as Prisma.InputJsonValue,
      education: source.education as unknown as Prisma.InputJsonValue,
      skills: source.skills as unknown as Prisma.InputJsonValue,
      projects: source.projects as unknown as Prisma.InputJsonValue,
      certifications: source.certifications as unknown as Prisma.InputJsonValue,
    };

    const result = await createResumeSafely(userId, duplicateData);

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

    console.error("Error duplicating resume:", error);
    return NextResponse.json(
      { error: "Failed to duplicate resume" },
      { status: 500 }
    );
  }
}
