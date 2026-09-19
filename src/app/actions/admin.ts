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
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: "PRO" },
    });

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

    // Just delete the record so they can try again
    await prisma.manualPayment.delete({
      where: { id: paymentId },
    });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject payment", error);
    return { error: "Failed to reject payment" };
  }
}
