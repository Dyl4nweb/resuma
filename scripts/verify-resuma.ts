import { prisma } from "../src/lib/prisma";
import { createResumeSafely, isProUser, LimitExceededError, getUserResumeUsage } from "../src/lib/limits";
import { resumeSchema } from "../src/lib/validations/resume";
import bcrypt from "bcryptjs";

async function main() {
  console.log("==========================================");
  console.log("  RESUMA AUTOMATED VERIFICATION SUITE    ");
  console.log("==========================================\n");

  const testEmail = `test_user_${Date.now()}@example.com`;
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Test User
  console.log(`[TEST 1] Creating test user: ${testEmail}`);
  const user = await prisma.user.create({
    data: {
      name: "Verification User",
      email: testEmail,
      passwordHash,
      subscriptionTier: "FREE",
    },
  });
  console.log(`  ✓ User created with ID: ${user.id}, Tier: ${user.subscriptionTier}`);

  // 2. Check initial limit status
  console.log("\n[TEST 2] Checking initial FREE limit status");
  const usageBefore = await getUserResumeUsage(user.id);
  console.log(`  ✓ Count: ${usageBefore.count}, Limit: ${usageBefore.limit}, Can create: ${usageBefore.canCreateMore}`);
  if (usageBefore.count !== 0 || !usageBefore.canCreateMore) {
    throw new Error("Initial usage check failed");
  }

  // 3. Create 1st Resume on FREE tier
  console.log("\n[TEST 3] Creating Resume #1 on FREE tier");
  const resume1 = await createResumeSafely(user.id, {
    title: "Software Engineer Resume #1",
    template: "modern",
  });
  console.log(`  ✓ Resume #1 created successfully with ID: ${resume1.resume.id}`);

  // 4. Attempt to create 2nd Resume on FREE tier (Must be rejected)
  console.log("\n[TEST 4] Attempting to create Resume #2 on FREE tier (Must fail)");
  let failedAsExpected = false;
  try {
    await createResumeSafely(user.id, {
      title: "Software Engineer Resume #2 (Should fail)",
    });
  } catch (err: unknown) {
    if (err instanceof LimitExceededError) {
      failedAsExpected = true;
      console.log(`  ✓ Correctly rejected with LimitExceededError: "${err.message}"`);
    } else {
      throw err;
    }
  }

  if (!failedAsExpected) {
    throw new Error("CRITICAL SECURITY VULNERABILITY: 2nd resume was created on FREE tier!");
  }

  // 5. Concurrent Race Condition Test
  console.log("\n[TEST 5] Concurrent Request Simulation on a fresh user");
  const raceUser = await prisma.user.create({
    data: {
      name: "Race Test User",
      email: `race_${Date.now()}@example.com`,
      subscriptionTier: "FREE",
    },
  });

  const results = await Promise.allSettled([
    createResumeSafely(raceUser.id, { title: "Concurrent 1" }),
    createResumeSafely(raceUser.id, { title: "Concurrent 2" }),
  ]);

  const fulfilled = results.filter((r) => r.status === "fulfilled");
  const rejected = results.filter((r) => r.status === "rejected");

  console.log(`  Fulfilled: ${fulfilled.length}, Rejected: ${rejected.length}`);
  if (fulfilled.length !== 1 || rejected.length !== 1) {
    throw new Error(`CRITICAL CONCURRENCY VULNERABILITY: Expected 1 fulfilled and 1 rejected, got ${fulfilled.length} fulfilled.`);
  }
  console.log("  ✓ Concurrency lock verified! Only 1 concurrent request succeeded.");

  // 6. Upgrade to PRO
  console.log("\n[TEST 6] Upgrading user to PRO tier");
  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionTier: "PRO" },
  });

  const isPro = await isProUser(user.id);
  console.log(`  ✓ User upgraded. isProUser() = ${isPro}`);
  if (!isPro) throw new Error("Upgrade to PRO check failed");

  // 7. Create Resume #2 on PRO tier
  console.log("\n[TEST 7] Creating Resume #2 on PRO tier (Must succeed)");
  const resume2 = await createResumeSafely(user.id, {
    title: "Executive Technical Lead Resume #2",
    template: "classic",
  });
  console.log(`  ✓ Resume #2 created successfully on PRO tier! ID: ${resume2.resume.id}`);

  // 8. Test Zod Validation Schema
  console.log("\n[TEST 8] Testing Zod Validation Schema");
  const validData = {
    title: "Frontend Architect",
    template: "modern",
    themeColor: "#dc2626",
    fontFamily: "sans",
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
    personalInfo: {
      fullName: "Dylan Viray",
      jobTitle: "Senior Architect",
      email: "dylan@example.com",
      phone: "+1 555-0199",
      location: "San Francisco",
      website: "https://example.com",
      linkedin: "linkedin.com/in/dylan",
      github: "github.com/dylan",
    },
    summary: "Senior Architect with deep TypeScript and Next.js expertise.",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  const parsedValid = resumeSchema.safeParse(validData);
  console.log(`  ✓ Valid payload parsed successfully: ${parsedValid.success}`);
  if (!parsedValid.success) throw new Error("Validation failed for valid data");

  const invalidColor = { ...validData, themeColor: "not-a-color" };
  const parsedInvalid = resumeSchema.safeParse(invalidColor);
  console.log(`  ✓ Invalid color correctly rejected: ${!parsedInvalid.success}`);
  if (parsedInvalid.success) throw new Error("Validation should have rejected invalid hex color");

  // 9. Clean up test users
  console.log("\n[TEST 9] Cleaning up test records");
  await prisma.user.deleteMany({
    where: { id: { in: [user.id, raceUser.id] } },
  });
  console.log("  ✓ Test users and cascade-related resumes deleted cleanly.");

  console.log("\n==========================================");
  console.log("  ALL TESTS PASSED WITH 100% SUCCESS!     ");
  console.log("==========================================");
}

main()
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
