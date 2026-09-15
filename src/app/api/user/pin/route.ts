import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const pinSchema = z.object({
  pin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = pinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pin } = parsed.data;
    const pinHash = await bcrypt.hash(pin, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pinHash },
    });

    return NextResponse.json({
      success: true,
      message: "Quick PIN configured successfully!",
    });
  } catch (error) {
    console.error("Error setting user PIN:", error);
    return NextResponse.json(
      { error: "Failed to set PIN. Please try again." },
      { status: 500 }
    );
  }
}
