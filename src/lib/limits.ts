import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class LimitExceededError extends Error {
  constructor(message: string = "Free plan allows only 1 resume. Upgrade to PRO for unlimited resumes.") {
    super(message);
    this.name = "LimitExceededError";
  }
}

/**
 * Checks whether a user currently has an active PRO subscription.
 */
export async function isProUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) return false;

  if (user.subscriptionTier === "PRO") {
    // If stripe period end is present, verify it has not expired
    if (user.stripeCurrentPeriodEnd) {
      return new Date(user.stripeCurrentPeriodEnd) > new Date();
    }
    return true;
  }

  return false;
}

/**
 * Atomic check and create for resume creation or duplication.
 * Executes within a Prisma interactive transaction with PostgreSQL row locking
 * on the User row to guarantee that two concurrent requests cannot bypass the 1-resume FREE limit.
 */
export async function createResumeSafely(
  userId: string,
  resumeData: {
    title: string;
    template?: string;
    themeColor?: string;
    fontFamily?: string;
    sectionOrder?: Prisma.InputJsonValue;
    personalInfo?: Prisma.InputJsonValue;
    summary?: string;
    experience?: Prisma.InputJsonValue;
    education?: Prisma.InputJsonValue;
    skills?: Prisma.InputJsonValue;
    projects?: Prisma.InputJsonValue;
    certifications?: Prisma.InputJsonValue;
  }
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock the user row for update to serialize concurrent creation requests for the same user
    const users = await tx.$queryRaw<Array<{ id: string; subscriptionTier: string; stripeCurrentPeriodEnd: Date | null }>>`
      SELECT id, "subscriptionTier", "stripeCurrentPeriodEnd"
      FROM "User"
      WHERE id = ${userId}
      FOR UPDATE
    `;

    if (!users || users.length === 0) {
      throw new Error("User not found");
    }

    const lockedUser = users[0];
    const isPro =
      lockedUser.subscriptionTier === "PRO" &&
      (!lockedUser.stripeCurrentPeriodEnd || new Date(lockedUser.stripeCurrentPeriodEnd) > new Date());

    // 2. Count existing resumes
    const currentCount = await tx.resume.count({
      where: { userId },
    });

    // 3. Enforce the limit
    if (!isPro && currentCount >= 1) {
      throw new LimitExceededError(
        "Free plan allows only 1 resume. Upgrade to PRO for unlimited resumes."
      );
    }

    // 4. Create the new resume
    const newResume = await tx.resume.create({
      data: {
        userId,
        title: resumeData.title || "Untitled Resume",
        template: resumeData.template ?? "modern",
        themeColor: resumeData.themeColor ?? "#dc2626",
        fontFamily: resumeData.fontFamily ?? "sans",
        sectionOrder: resumeData.sectionOrder ?? [
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
        ],
        personalInfo: resumeData.personalInfo ?? {},
        summary: resumeData.summary ?? "",
        experience: resumeData.experience ?? [],
        education: resumeData.education ?? [],
        skills: resumeData.skills ?? [],
        projects: resumeData.projects ?? [],
        certifications: resumeData.certifications ?? [],
      },
    });

    return {
      resume: newResume,
      isPro,
      count: currentCount + 1,
    };
  });
}

/**
 * Informational helper to get user's resume count and limits for UI display.
 */
export async function getUserResumeUsage(userId: string) {
  const [proStatus, count] = await Promise.all([
    isProUser(userId),
    prisma.resume.count({ where: { userId } }),
  ]);

  return {
    isPro: proStatus,
    count,
    limit: proStatus ? Infinity : 1,
    canCreateMore: proStatus || count < 1,
  };
}
