import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid token or password too short (min 8 characters)" },
        { status: 400 }
      );
    }

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check if the token has expired
    if (new Date() > new Date(verificationToken.expires)) {
      // Delete the expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: {
        passwordHash: hashedPassword,
      },
    });

    // Delete the token as it has been used
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
