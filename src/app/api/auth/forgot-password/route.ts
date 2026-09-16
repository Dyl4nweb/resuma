import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate a secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Clean up any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create the new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Construct the reset URL dynamically
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resuma-ph.vercel.app";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
          from: "Resuma <onboarding@resend.dev>", // onboarding@resend.dev is required for unverified domains
          to: email,
          subject: "Reset your Resuma password",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Reset your password</h2>
              <p>You requested a password reset for your Resuma account.</p>
              <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Reset Password
              </a>
              <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        
        if (error) {
          console.error("[Resend API Error]:", error);
          console.log(`FALLBACK RESET URL: ${resetUrl}`);
        } else {
          console.log(`[Resend] Password reset email sent to: ${email}`);
        }
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
        // Fallback to console log
        console.log(`RESET URL: ${resetUrl}`);
      }
    } else {
      // Mock it if no API key is provided
      console.log("==========================================");
      console.log(`PASSWORD RESET REQUESTED FOR: ${email}`);
      console.log(`RESET URL: ${resetUrl}`);
      console.log("==========================================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
