import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "Account Settings & Password — Resuma",
};

export default async function SettingsPage() {
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
      passwordHash: true,
      pinHash: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const clientUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    hasPassword: Boolean(user.passwordHash),
    hasPin: Boolean(user.pinHash),
    createdAt: user.createdAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <SettingsClient user={clientUser} />
      </main>
      <Footer />
    </div>
  );
}
