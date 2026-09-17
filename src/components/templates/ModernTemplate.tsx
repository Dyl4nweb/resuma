import React from "react";
import { ResumeData, SectionKey } from "@/types/resume";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
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
          <section key="summary" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-2 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Professional Summary
            </h2>
            <p className="text-zinc-700 text-sm leading-relaxed text-justify">{summary}</p>
          </section>
        );

      case "experience":
        if (!experience || experience.length === 0) return null;
        return (
          <section key="experience" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="text-sm">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-zinc-900">{exp.position}</h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-zinc-600 mb-1">
                    <span className="font-semibold text-zinc-800">{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-zinc-700 leading-relaxed mb-1.5">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-zinc-700 text-xs leading-relaxed">
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
          <section key="education" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-zinc-900">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-zinc-600">
                    <span className="font-semibold text-zinc-800">{edu.institution}</span>
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.gpa && <div className="text-xs text-zinc-600 mt-0.5">GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <p className="text-zinc-700 text-xs mt-1 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-2.5 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Skills & Proficiencies
            </h2>
            <div className="space-y-2">
              {skills.map((cat) => (
                <div key={cat.id} className="text-xs">
                  <span className="font-bold text-zinc-800 mr-2">{cat.category}:</span>
                  <span className="text-zinc-700">{cat.items.join(" • ")}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!projects || projects.length === 0) return null;
        return (
          <section key="projects" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-3 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <span>{proj.title}</span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-zinc-800 inline-flex items-center"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs font-normal text-muted-foreground ml-auto">
                        [{proj.technologies.join(", ")}]
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-700 text-xs mt-0.5 leading-relaxed">{proj.description}</p>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-zinc-700 text-xs">
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
          <section key="certifications" className="resume-section mb-5">
            <h2
              className="text-xs font-bold tracking-wider uppercase pb-1 mb-2 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}40` }}
            >
              Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-zinc-800">{cert.name}</span>
                    <span className="text-zinc-600"> — {cert.issuer}</span>
                  </div>
                  <span className="text-muted-foreground">{cert.date}</span>
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
    <div className="bg-white text-zinc-900 p-8 sm:p-12 shadow-md rounded-sm border border-zinc-200 min-h-[1050px] w-full max-w-[850px] mx-auto resume-paper print:!min-h-0 print:!h-auto print:!shadow-none print:!border-none print:!rounded-none print:!max-w-none print:!w-full print:!m-0">
      {/* Header */}
      <header className="resume-header border-b-2 pb-5 mb-5" style={{ borderColor: themeColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-base font-semibold mt-0.5" style={{ color: themeColor }}>
              {personalInfo.jobTitle || "Job Title / Specialization"}
            </p>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-600 mt-3 pt-2">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-muted-foreground" />
              {personalInfo.website.replace(/^https?:\/\//, "")}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3 text-muted-foreground" />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3 text-muted-foreground" />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
            </span>
          )}
        </div>
      </header>

      {/* Main Content Sections sorted by sectionOrder */}
      <main>{sectionOrder.map((sectionKey) => renderSection(sectionKey))}</main>
    </div>
  );
}
