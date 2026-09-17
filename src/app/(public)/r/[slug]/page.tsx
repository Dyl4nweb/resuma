import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { PublicPrintButton } from "@/components/public/PublicPrintButton";
import { ResumeData, TemplateType, FontFamilyType, SectionKey } from "@/types/resume";
import { FileText, ArrowRight, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resume = await prisma.resume.findUnique({
    where: { slug },
    select: { title: true, personalInfo: true, isPublished: true },
  });

  if (!resume || !resume.isPublished) {
    return { title: "Resume Not Found — Resuma" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = (resume.personalInfo as any)?.fullName || "Professional";
  return {
    title: `${name} — ${resume.title} | Resuma`,
    description: `View the verified ATS-ready resume of ${name}. Created with Resuma.`,
  };
}

export default async function PublicResumePage({ params }: PageProps) {
  const { slug } = await params;

  const resume = await prisma.resume.findUnique({
    where: { slug },
  });

  if (!resume || !resume.isPublished) {
    notFound();
  }

  // Track analytics view asynchronously
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "unknown";
  const referrer = headersList.get("referer") || null;
  const rawIp = headersList.get("x-forwarded-for") || "unknown";
  
  const ipHash = rawIp !== "unknown" ? crypto.createHash('sha256').update(rawIp + process.env.NEXTAUTH_SECRET).digest('hex') : null;

  try {
    await prisma.$transaction([
      prisma.resumeView.create({
        data: {
          resumeId: resume.id,
          referrer,
          userAgent,
          ipHash,
        },
      }),
      prisma.resume.update({
        where: { id: resume.id },
        data: { viewsCount: { increment: 1 } },
      }),
    ]);
  } catch (err) {
    console.error("Error tracking resume view:", err);
  }

  const resumeData: ResumeData = {
    id: resume.id,
    title: resume.title,
    slug: resume.slug,
    isPublished: resume.isPublished,
    template: resume.template as TemplateType,
    themeColor: resume.themeColor,
    fontFamily: resume.fontFamily as FontFamilyType,
    sectionOrder: resume.sectionOrder as SectionKey[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    personalInfo: (resume.personalInfo as any) || {},
    summary: resume.summary || "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experience: (resume.experience as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    education: (resume.education as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skills: (resume.skills as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (resume.projects as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    certifications: (resume.certifications as any) || [],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col print:!h-auto print:!min-h-0 print:!overflow-visible print:!bg-white print:!text-black print:!block">
      {/* Top Banner for Public Viewers */}
      <header className="no-print sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-card border border-border">
            <FileText className="h-3.5 w-3.5 text-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Resuma<span className="text-[#dc2626]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <PublicPrintButton />
          <Link
            href="/register"
            className="hidden sm:flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm"
          >
            <span>Create Your Own</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Main Resume Canvas */}
      <main className="flex-1 flex justify-center py-6 sm:py-12 px-2 sm:px-4 print:!p-0 print:!m-0 print:!bg-white print:!overflow-visible print:!w-full print:!block print:!static">
        <div className="w-full max-w-[850px] print:!max-w-none print:!w-full print:!m-0 print:!p-0 print:!block print:!bg-white">
          <TemplateRenderer data={resumeData} />
        </div>
      </main>

      {/* Public Footer */}
      <footer className="no-print py-6 border-t border-zinc-900 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Verified ATS-formatted document
        </span>
        <span className="hidden sm:inline">•</span>
        <span>
          Powered by{" "}
          <Link href="/" className="font-semibold text-foreground hover:text-accent-foreground">
            Resuma<span className="text-[#dc2626]">.</span>
          </Link>
        </span>
      </footer>
    </div>
  );
}
