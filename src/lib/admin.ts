import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  const parsed = envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const fallbackAdmins = [
    "kurtdylanviray@gmail.com",
    "viraykurt09@gmail.com",
    "demo@resuma.dev",
  ];

  return Array.from(new Set([...parsed, ...fallbackAdmins]));
}

export function isAdminUser(user?: { email?: string | null; role?: string | null } | null): boolean {
  if (!user || !user.email) return false;

  if (user.role === "ADMIN") return true;

  const adminEmails = getAdminEmails();
  return adminEmails.includes(user.email.toLowerCase().trim());
}

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { authorized: false as const, user: null, status: 401, message: "Authentication required" };
  }

  // Look up user role directly from database for zero-trust authorization
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, subscriptionTier: true },
  });

  if (!dbUser || !isAdminUser(dbUser)) {
    return { authorized: false as const, user: null, status: 403, message: "Forbidden: Admin privileges required" };
  }

  return { authorized: true as const, user: dbUser, status: 200, message: "Authorized" };
}
