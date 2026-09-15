import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().max(100).default(""),
  jobTitle: z.string().max(100).default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().max(40).default(""),
  location: z.string().max(100).default(""),
  website: z.string().url().or(z.literal("")).default(""),
  linkedin: z.string().max(150).default(""),
  github: z.string().max(150).default(""),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().max(100),
  position: z.string().max(100),
  location: z.string().max(100).default(""),
  startDate: z.string().max(30),
  endDate: z.string().max(30),
  isCurrent: z.boolean().default(false),
  description: z.string().max(3000).default(""),
  highlights: z.array(z.string().max(500)).optional(),
});

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().max(120),
  degree: z.string().max(100),
  fieldOfStudy: z.string().max(100).default(""),
  location: z.string().max(100).default(""),
  startDate: z.string().max(30),
  endDate: z.string().max(30),
  isCurrent: z.boolean().optional(),
  gpa: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
});

export const skillCategorySchema = z.object({
  id: z.string(),
  category: z.string().max(80),
  items: z.array(z.string().max(50)),
});

export const projectItemSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  description: z.string().max(2000),
  url: z.string().url().or(z.literal("")).optional(),
  technologies: z.array(z.string().max(40)),
  highlights: z.array(z.string().max(500)).optional(),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().max(120),
  issuer: z.string().max(100),
  date: z.string().max(30),
  url: z.string().url().or(z.literal("")).optional(),
});

export const sectionKeySchema = z.enum([
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
]);

export const resumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  template: z.enum(["modern", "classic", "minimalist", "compact"]).default("modern"),
  themeColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color").default("#dc2626"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
  sectionOrder: z.array(sectionKeySchema).default([
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ]),
  personalInfo: personalInfoSchema,
  summary: z.string().max(5000).default(""),
  experience: z.array(experienceItemSchema).max(50).default([]),
  education: z.array(educationItemSchema).max(50).default([]),
  skills: z.array(skillCategorySchema).max(50).default([]),
  projects: z.array(projectItemSchema).max(50).default([]),
  certifications: z.array(certificationItemSchema).max(50).default([]),
});

export type ResumeSchemaType = z.infer<typeof resumeSchema>;
