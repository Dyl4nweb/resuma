import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { PendingPaymentsClient } from "@/components/admin/PendingPaymentsClient";

export const metadata = {
  title: "Pending Payments — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const authCheck = await requireAdminSession();

  if (!authCheck.authorized) {
    if (authCheck.status === 401) {
      redirect("/login");
    } else {
      redirect("/dashboard");
    }
  }

  const pendingPayments = await prisma.manualPayment.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar user={authCheck.user} />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <PendingPaymentsClient initialPayments={pendingPayments} />
      </main>
    </div>
  );
}
