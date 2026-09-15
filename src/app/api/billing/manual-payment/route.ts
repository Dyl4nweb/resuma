import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { manualPaymentRateLimiter } from "@/lib/rate-limit";

const manualPaymentSchema = z.object({
  referenceNumber: z
    .string()
    .min(6, "Reference number must be at least 6 characters")
    .max(50, "Reference number too long"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = manualPaymentRateLimiter.check(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString() } }
      );
    }
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = manualPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { referenceNumber } = parsed.data;
    const cleanRef = referenceNumber.trim();

    // Check for replay attacks
    const existingPayment = await prisma.manualPayment.findUnique({
      where: { referenceNumber: cleanRef },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "This reference number has already been used." },
        { status: 409 }
      );
    }

    // Set PRO for 30 days from today
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscriptionTier: "PRO",
          stripeSubscriptionId: `instapay_${cleanRef}_${Date.now()}`,
          stripeCurrentPeriodEnd: periodEnd,
        },
        select: {
          id: true,
          email: true,
          subscriptionTier: true,
          stripeCurrentPeriodEnd: true,
        },
      }),
      prisma.manualPayment.create({
        data: {
          referenceNumber: cleanRef,
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "InstaPay payment submitted and PRO plan activated!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error processing manual payment:", error);
    return NextResponse.json(
      { error: "Internal error processing payment verification" },
      { status: 500 }
    );
  }
}
