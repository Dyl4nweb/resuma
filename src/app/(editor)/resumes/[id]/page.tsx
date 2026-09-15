import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditorWorkspace } from "@/components/editor/EditorWorkspace";
import { ResumeData, TemplateType, FontFamilyType, SectionKey } from "@/types/resume";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeEditorPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume || resume.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Format data for client component
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
    viewsCount: resume.viewsCount,
  };

  return <EditorWorkspace initialResume={resumeData} resumeId={resume.id} />;
}
