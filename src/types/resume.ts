export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  gpa?: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

export type TemplateType = "modern" | "classic" | "minimalist" | "compact";
export type FontFamilyType = "sans" | "serif" | "mono";

export interface ResumeData {
  id?: string;
  title: string;
  slug?: string | null;
  isPublished: boolean;
  showQrCode?: boolean;
  template: TemplateType;
  themeColor: string;
  fontFamily: FontFamilyType;
  sectionOrder: SectionKey[];
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  viewsCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

export const DEFAULT_RESUME_DATA: Omit<ResumeData, "id" | "viewsCount" | "createdAt" | "updatedAt"> = {
  title: "Software Engineer Resume",
  slug: null,
  isPublished: false,
  showQrCode: true,
  template: "modern",
  themeColor: "#dc2626", // Brand accent
  fontFamily: "sans",
  sectionOrder: DEFAULT_SECTION_ORDER,
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Full-Stack Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
  },
  summary:
    "High-impact Senior Full-Stack Engineer with 6+ years of experience architecting resilient cloud services and high-performance web applications. Specialized in TypeScript, React, Next.js, and Node.js microservices with a track record of scaling platforms to millions of users.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Cloud Systems",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      isCurrent: true,
      description:
        "Led architecture and migration of core monolithic services to decoupled Next.js & Node.js microservices, decreasing p95 latency by 42%.",
      highlights: [
        "Spearheaded distributed caching and database query optimization, saving $65k/year in cloud compute costs.",
        "Mentored team of 6 engineers across front-end performance, testing best practices, and CI/CD pipelines.",
      ],
    },
    {
      id: "exp-2",
      company: "Vanguard Digital",
      position: "Full-Stack Developer",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      isCurrent: false,
      description:
        "Developed end-to-end customer onboarding workflows and analytics dashboards using React, TypeScript, and PostgreSQL.",
      highlights: [
        "Implemented real-time collaboration canvas with WebSockets, driving a 35% boost in user retention.",
        "Engineered automated E2E test suites cutting regression escape bugs by 60%.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-09",
      endDate: "2019-05",
      isCurrent: false,
      gpa: "3.85 / 4.0",
      description: "Dean's Honors List. Coursework in Distributed Systems, Algorithms, and Database Design.",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript", "React 19", "Next.js", "Node.js", "Python", "HTML5/CSS3"],
    },
    {
      id: "skill-2",
      category: "Backend & Databases",
      items: ["PostgreSQL", "Prisma ORM", "Redis", "RESTful APIs", "GraphQL", "Docker"],
    },
    {
      id: "skill-3",
      category: "Tools & DevOps",
      items: ["Git", "GitHub Actions", "AWS", "Vercel", "Tailwind CSS", "Jest", "Playwright"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "PulseFlow Realtime Analytics",
      description:
        "A distributed analytics dashboard processing telemetry events in real time with sub-100ms pipeline latencies.",
      url: "https://pulseflow.dev",
      technologies: ["Next.js", "TypeScript", "ClickHouse", "Tailwind CSS"],
      highlights: ["Handles 2M+ daily ingestion events with 99.98% uptime."],
    },
    {
      id: "proj-2",
      title: "DevDock CLI & Workspace",
      description:
        "Open-source developer environment orchestrator automating containerized local services and secrets synchronization.",
      url: "https://github.com/alexmorgan/devdock",
      technologies: ["Node.js", "TypeScript", "Docker API"],
      highlights: ["Earned 1.4k+ GitHub stars and community contributor adoption."],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification",
    },
  ],
};
