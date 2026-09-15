import React from "react";
import { ResumeData, SectionKey } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function MinimalistTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    sectionOrder,
    themeColor,
  } = data;

  const renderSection = (sectionKey: SectionKey) => {
    switch (sectionKey) {
      case "summary":
        if (!summary) return null;
        return (
          <section key="summary" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              About
            </h2>
            <p className="text-zinc-700 text-sm leading-relaxed">{summary}</p>
          </section>
        );

      case "experience":
        if (!experience || experience.length === 0) return null;
        return (
          <section key="experience" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2 border-zinc-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-zinc-900 text-sm">{exp.position}</h3>
                    <span className="text-xs text-zinc-400">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-600 mb-1.5">{exp.company}</div>
                  {exp.description && (
                    <p className="text-zinc-600 text-xs leading-relaxed mb-1">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3 space-y-0.5 text-zinc-600 text-xs">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (!education || education.length === 0) return null;
        return (
          <section key="education" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-3 border-l-2 border-zinc-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-zinc-900 text-sm">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <span className="text-xs text-zinc-400">
                      {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-zinc-500 mt-0.5">GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <p className="text-zinc-600 text-xs mt-1 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">
              Skills
            </h2>
            <div className="space-y-1.5 text-xs">
              {skills.map((cat) => (
                <div key={cat.id} className="flex gap-2">
                  <span className="font-medium text-zinc-900 min-w-[140px]">{cat.category}:</span>
                  <span className="text-zinc-600">{cat.items.join(" / ")}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!projects || projects.length === 0) return null;
        return (
          <section key="projects" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Projects
            </h2>
            <div className="space-y-3 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} className="relative pl-3 border-l-2 border-zinc-200">
                  <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                    <span>{proj.title}</span>
                    {proj.technologies && (
                      <span className="font-normal text-zinc-400 text-[11px]">
                        {proj.technologies.join(" · ")}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-600 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "certifications":
        if (!certifications || certifications.length === 0) return null;
        return (
          <section key="certifications" className="resume-section mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-zinc-700">
                  <span>
                    <strong className="font-semibold text-zinc-900">{cert.name}</strong> ({cert.issuer})
                  </span>
                  <span className="text-zinc-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-14 shadow-md rounded-sm border border-zinc-200 min-h-[1050px] w-full max-w-[850px] mx-auto resume-paper">
      {/* Minimal Header */}
      <header className="resume-header mb-8">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: themeColor }}>
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>}
          {personalInfo.github && <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>}
        </div>
      </header>

      {/* Main Content */}
      <main>{sectionOrder.map((sectionKey) => renderSection(sectionKey))}</main>
    </div>
  );
}
