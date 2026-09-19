"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  
  // @ts-ignore
  if (session.user.role === "ADMIN") return true;
  if (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(',').includes(session.user.email as string)) return true;
  
  return false;
}

export async function approveManualPayment(paymentId: string, userId: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    // 1. Update user to PRO
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: "PRO" },
    });

    // Send email using Resend if configured
    if (process.env.RESEND_API_KEY && updatedUser.email) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: "Resuma <onboarding@resend.dev>",
          to: updatedUser.email,
          subject: "Your Resuma PRO Payment is Approved! 🎉",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #10B981;">Payment Approved!</h2>
              <p>Hi ${updatedUser.name || 'there'},</p>
              <p>Great news! We have successfully verified your manual payment.</p>
              <p>Your account has been upgraded to <strong>PRO</strong>. You can now enjoy all premium features and create unlimited, high-quality resumes.</p>
              <div style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resuma-app.vercel.app'}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to your Dashboard</a>
              </div>
              <p style="color: #666; font-size: 14px;">Thank you for upgrading to Resuma PRO!</p>
            </div>
          `,
        });
        console.log(`[Resend] Approval email sent to: ${updatedUser.email}`);
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
      }
    }

    // 2. Delete the manual payment record
    await prisma.manualPayment.delete({
      where: { id: paymentId },
    });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve payment", error);
    return { error: "Failed to approve payment" };
  }
}

export async function rejectManualPayment(paymentId: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    // We can also fetch the user to notify them of rejection
    const payment = await prisma.manualPayment.findUnique({
      where: { id: paymentId },
      include: { user: true }
    });

    // Just delete the record so they can try again
    await prisma.manualPayment.delete({
      where: { id: paymentId },
    });

    if (payment?.user?.email && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: "Resuma <onboarding@resend.dev>",
          to: payment.user.email,
          subject: "Issue with your Resuma PRO Payment",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #EF4444;">Payment Verification Failed</h2>
              <p>Hi ${payment.user.name || 'there'},</p>
              <p>We couldn't verify the manual payment you submitted (Reference Number: ${payment.referenceNumber}).</p>
              <p>Please double-check your reference number and submit it again on the billing page.</p>
              <div style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://resuma-app.vercel.app'}/dashboard/billing" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Submit Payment Again</a>
              </div>
              <p style="color: #666; font-size: 14px;">If you think this is a mistake, please contact support.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send rejection email via Resend:", emailError);
      }
    }

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject payment", error);
    return { error: "Failed to reject payment" };
  }
}
