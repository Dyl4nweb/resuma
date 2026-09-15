import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateStrictName } from "@/lib/validations/name";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    const validation = validateStrictName(name);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Invalid name provided." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validation.cleanedName },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionTier: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile name updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
