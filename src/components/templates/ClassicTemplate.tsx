import React from "react";
import { ResumeData, SectionKey } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
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
          <section key="summary" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-zinc-800 leading-normal text-justify">{summary}</p>
          </section>
        );

      case "experience":
        if (!experience || experience.length === 0) return null;
        return (
          <section key="experience" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{exp.company}</span>
                    <span className="font-normal text-zinc-600">
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between italic text-zinc-700 mb-1">
                    <span>{exp.position}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && <p className="text-zinc-800 leading-normal mb-1">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-zinc-800">
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
          <section key="education" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{edu.institution}</span>
                    <span className="font-normal text-zinc-600">
                      {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between italic text-zinc-700">
                    <span>
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </span>
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.gpa && <div className="text-zinc-600">GPA: {edu.gpa}</div>}
                  {edu.description && <p className="text-zinc-700 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-1.5">
              Technical & Professional Skills
            </h2>
            <div className="space-y-1 text-xs">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <span className="font-bold text-zinc-900">{cat.category}: </span>
                  <span className="text-zinc-800">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!projects || projects.length === 0) return null;
        return (
          <section key="projects" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-2">
              Projects
            </h2>
            <div className="space-y-2 text-xs">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>
                      {proj.title}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-normal text-zinc-600 italic"> — {proj.technologies.join(", ")}</span>
                      )}
                    </span>
                    {proj.url && <span className="font-normal text-zinc-500">{proj.url}</span>}
                  </div>
                  <p className="text-zinc-800 mt-0.5">{proj.description}</p>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-zinc-800">
                      {proj.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "certifications":
        if (!certifications || certifications.length === 0) return null;
        return (
          <section key="certifications" className="resume-section mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-400 pb-0.5 mb-1.5">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <span>
                    <strong className="text-zinc-900">{cert.name}</strong> — {cert.issuer}
                  </span>
                  <span className="text-zinc-600">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website?.replace(/^https?:\/\//, ""),
    personalInfo.linkedin?.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ""),
    personalInfo.github?.replace(/^https?:\/\/(www\.)?github\.com\//, ""),
  ].filter(Boolean);

  return (
    <div className="bg-white text-zinc-900 p-8 sm:p-12 shadow-md rounded-sm border border-zinc-200 min-h-[1050px] w-full max-w-[850px] mx-auto resume-paper font-serif">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase mb-1">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-semibold tracking-wide italic text-zinc-700 mb-2">
            {personalInfo.jobTitle}
          </p>
        )}
        <p className="text-xs text-zinc-600 font-sans tracking-tight">
          {contactItems.join(" | ")}
        </p>
      </header>

      {/* Main Content */}
      <main className="font-sans">{sectionOrder.map((sectionKey) => renderSection(sectionKey))}</main>
    </div>
  );
}
