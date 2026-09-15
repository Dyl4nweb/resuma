const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin2003', 12);
  const pinHash = await bcrypt.hash('123456', 12);

  const users = [
    {
      email: 'viraykurt09@gmail.com',
      name: 'Dylan Ramos',
      role: 'ADMIN',
      subscriptionTier: 'FREE',
    },
    {
      email: 'kurtdylanviray@gmail.com',
      name: 'Kurt Dylan Viray',
      role: 'ADMIN',
      subscriptionTier: 'PRO',
    },
    {
      email: 'demo@resuma.dev',
      name: 'Alex Morgan',
      role: 'ADMIN',
      subscriptionTier: 'PRO',
    },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        role: u.role,
        name: u.name,
        passwordHash: passwordHash,
        pinHash: pinHash,
      },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: passwordHash,
        pinHash: pinHash,
        role: u.role,
        subscriptionTier: u.subscriptionTier,
      },
    });
    console.log(`Seeded user: ${user.name} (${user.email}) [${user.role}]`);
  }

  // Also ensure demo user has starter resume
  const demo = await prisma.user.findUnique({ where: { email: 'demo@resuma.dev' } });
  if (demo) {
    const resumeCount = await prisma.resume.count({ where: { userId: demo.id } });
    if (resumeCount === 0) {
      await prisma.resume.create({
        data: {
          userId: demo.id,
          title: 'Senior Full-Stack Engineer Resume',
          template: 'modern',
          themeColor: '#dc2626',
          isPublished: true,
          slug: 'alex-morgan-resume',
          personalInfo: {
            fullName: 'Alex Morgan',
            jobTitle: 'Senior Full-Stack Engineer',
            email: 'demo@resuma.dev',
            phone: '+1 (555) 234-5678',
            location: 'San Francisco, CA',
          },
          summary: 'Experienced Software Engineer specializing in Next.js, TypeScript, and modern web architectures.',
        },
      });
      console.log('Seeded demo resume for Alex Morgan');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
