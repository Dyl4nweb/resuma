import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch recent 4 and 5 star feedback
    const feedbacks = await prisma.feedback.findMany({
      where: {
        rating: {
          gte: 4,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    // Map to a cleaner format suitable for LiveTestimonials
    const formattedFeedbacks = feedbacks.map((fb) => ({
      id: fb.id,
      name: fb.user.name || fb.user.email.split('@')[0] || "User",
      role: "User",
      location: "Verified User",
      text: fb.text,
      rating: fb.rating,
    }));

    return NextResponse.json(formattedFeedbacks);
  } catch (error) {
    console.error("Error fetching public feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
