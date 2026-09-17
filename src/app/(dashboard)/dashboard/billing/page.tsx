import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/common/Navbar";
import { BillingClient } from "@/components/billing/BillingClient";

export const metadata = {
  title: "Billing & Plans — Resuma",
};

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      subscriptionTier: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <BillingClient user={user} />
      </main>
    </div>
  );
}
