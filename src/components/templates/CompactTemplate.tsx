import React from "react";
import { ResumeData, SectionKey } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function CompactTemplate({ data }: TemplateProps) {
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
          <section key="summary" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1">
              Summary
            </h2>
            <p className="text-xs text-zinc-800 leading-snug">{summary}</p>
          </section>
        );

      case "experience":
        if (!experience || experience.length === 0) return null;
        return (
          <section key="experience" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Experience
            </h2>
            <div className="space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>
                      {exp.position} <span className="font-normal text-zinc-600">@ {exp.company}</span>
                    </span>
                    <span className="font-mono text-[11px] text-zinc-600">
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && <p className="text-zinc-700 text-[11.5px] leading-snug my-0.5">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-zinc-700 text-[11px]">
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
          <section key="education" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>
                      {edu.institution}{" "}
                      <span className="font-normal text-zinc-600">
                        — {edu.degree}
                        {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-zinc-600">
                      {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && <div className="text-[11px] text-zinc-500">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1">
              Skills
            </h2>
            <div className="space-y-1 text-xs">
              {skills.map((cat) => (
                <div key={cat.id} className="flex items-baseline gap-1.5">
                  <span className="font-bold text-zinc-900 text-[11px] min-w-[120px]">{cat.category}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-zinc-100 text-zinc-800 px-1 py-0.2 rounded text-[10.5px] font-mono border border-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!projects || projects.length === 0) return null;
        return (
          <section key="projects" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Projects
            </h2>
            <div className="space-y-2 text-xs">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>
                      {proj.title}
                      {proj.url && <span className="font-mono font-normal text-zinc-500 text-[11px] ml-1.5">[{proj.url}]</span>}
                    </span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="font-mono text-[10.5px] text-zinc-500 font-normal">
                        {proj.technologies.join(", ")}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-700 text-[11px] mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "certifications":
        if (!certifications || certifications.length === 0) return null;
        return (
          <section key="certifications" className="resume-section mb-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[11px]">
                  <span>
                    <strong className="font-bold text-zinc-900">{cert.name}</strong> — {cert.issuer}
                  </span>
                  <span className="font-mono text-zinc-500">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const contactList = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.github && `github.com/${personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}`,
    personalInfo.linkedin && `linkedin.com/in/${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}`,
    personalInfo.website?.replace(/^https?:\/\//, ""),
  ].filter(Boolean);

  return (
    <div className="bg-white text-zinc-900 p-6 sm:p-10 shadow-md rounded-sm border border-zinc-200 min-h-[1050px] w-full max-w-[850px] mx-auto resume-paper text-xs">
      {/* Compact Header */}
      <header className="border-b pb-2.5 mb-3" style={{ borderColor: themeColor }}>
        <div className="flex justify-between items-baseline">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <span className="text-xs font-bold" style={{ color: themeColor }}>
            {personalInfo.jobTitle}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-600 mt-1 font-mono">
          {contactList.map((item, idx) => (
            <span key={idx} className="after:content-['•'] after:ml-3 last:after:content-none">
              {item}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <main>{sectionOrder.map((sectionKey) => renderSection(sectionKey))}</main>
    </div>
  );
}
