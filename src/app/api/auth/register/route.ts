import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { registerRateLimiter } from "@/lib/rate-limit";
import { validateStrictName } from "@/lib/validations/name";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = registerRateLimiter.check(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many registrations from this IP. Please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString() } }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, pin } = parsed.data;

    // Strict validation for redundant words, spam characters, and placeholders
    const nameValidation = validateStrictName(name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      );
    }

    const cleanName = nameValidation.cleanedName;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for redundant duplicate names already registered in database
    const existingName = await prisma.user.findFirst({
      where: {
        name: {
          equals: cleanName,
          mode: "insensitive",
        },
      },
    });

    if (existingName) {
      return NextResponse.json(
        {
          error: "This name is already registered. To prevent duplicate profiles, please include your middle initial, middle name, or suffix (e.g. 'Dylan J. Ramos' or 'Dylan Ramos Jr.').",
        },
        { status: 409 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(pin, 12);

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: normalizedEmail,
        passwordHash,
        subscriptionTier: "FREE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while creating your account" },
      { status: 500 }
    );
  }
}
