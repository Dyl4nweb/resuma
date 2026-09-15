import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

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

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this resume" }, { status: 403 });
    }

    let isPublished = !resume.isPublished;
    try {
      const body = await req.json();
      if (typeof body.isPublished === "boolean") {
        isPublished = body.isPublished;
      }
    } catch {
      // Toggle default
    }

    let slug = resume.slug;
    if (isPublished && !slug) {
      // Generate a unique slug
      slug = generateSlug(resume.title);
      // Double check uniqueness
      const existing = await prisma.resume.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        isPublished,
        slug,
      },
      select: {
        id: true,
        isPublished: true,
        slug: true,
        title: true,
        viewsCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      resume: updated,
      publicUrl: updated.slug ? `/r/${updated.slug}` : null,
    });
  } catch (error) {
    console.error("Error publishing resume:", error);
    return NextResponse.json({ error: "Failed to update publication status" }, { status: 500 });
  }
}
