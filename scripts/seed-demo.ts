import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { DEFAULT_RESUME_DATA } from "../src/types/resume";
import { Prisma } from "@prisma/client";

async function main() {
  const email = "demo@resuma.dev";
  const password = "Password123!";
  const passwordHash = await bcrypt.hash(password, 12);

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      subscriptionTier: "FREE",
    },
    create: {
      name: "Alex Morgan",
      email,
      passwordHash,
      subscriptionTier: "FREE",
    },
  });

  console.log(`Demo user ready: ${user.email} (ID: ${user.id})`);

  // Check if user already has a resume
  const existingResume = await prisma.resume.findFirst({
    where: { userId: user.id },
  });

  if (!existingResume) {
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: "Senior Full-Stack Engineer Resume",
        template: "modern",
        themeColor: "#dc2626",
        fontFamily: "sans",
        sectionOrder: DEFAULT_RESUME_DATA.sectionOrder,
        personalInfo: DEFAULT_RESUME_DATA.personalInfo as unknown as Prisma.InputJsonValue,
        summary: DEFAULT_RESUME_DATA.summary,
        experience: DEFAULT_RESUME_DATA.experience as unknown as Prisma.InputJsonValue,
        education: DEFAULT_RESUME_DATA.education as unknown as Prisma.InputJsonValue,
        skills: DEFAULT_RESUME_DATA.skills as unknown as Prisma.InputJsonValue,
        projects: DEFAULT_RESUME_DATA.projects as unknown as Prisma.InputJsonValue,
        certifications: DEFAULT_RESUME_DATA.certifications as unknown as Prisma.InputJsonValue,
        isPublished: true,
        slug: "alex-morgan-lead-engineer",
      },
    });
    console.log(`Created starter resume for demo user: ${resume.title} (/resumes/${resume.id})`);
    console.log(`Public slug: /r/${resume.slug}`);
  } else {
    console.log(`Starter resume already exists: ${existingResume.title}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
