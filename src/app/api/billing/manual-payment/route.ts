import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

const manualPaymentSchema = z.object({
  referenceNumber: z
    .string()
    .min(10, "Reference number must be at least 10 digits")
    .max(20, "Reference number cannot exceed 20 digits")
    .regex(/^\d+$/, "Reference number must contain only numbers"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = manualPaymentSchema.parse(body);

    const userId = session.user.id;

    // Check if there's already a pending manual payment
    const existingPayment = await prisma.manualPayment.findFirst({
      where: { userId: userId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "You already have a pending verification request. Please wait for the admin." },
        { status: 400 }
      );
    }

    // Save the manual payment record
    await prisma.manualPayment.create({
      data: {
        userId: userId,
        referenceNumber: validatedData.referenceNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment reference submitted! An admin will review and activate your PRO plan within 24 hours.",
    });
  } catch (error) {
    console.error("MANUAL_PAYMENT_ERROR", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
