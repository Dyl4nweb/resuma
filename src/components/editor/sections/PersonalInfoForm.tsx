"use client";

import { PersonalInfo } from "@/types/resume";
import { validateStrictName } from "@/lib/validations/name";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const nameValidation =
    data.fullName && data.fullName.trim().length >= 3
      ? validateStrictName(data.fullName)
      : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="e.g. Jane Doe"
            className={`w-full rounded-md border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:outline-none focus:ring-1 ${
              nameValidation && !nameValidation.isValid
                ? "border-amber-500/60 focus:border-amber-500 focus:ring-amber-500"
                : "border-border focus:border-red-500 focus:ring-red-500"
            }`}
          />
          {nameValidation && !nameValidation.isValid && (
            <p className="mt-1 text-[11px] text-amber-400">
              {nameValidation.error}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Job Title / Target Role *
          </label>
          <input
            type="text"
            value={data.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Email *
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Location
          </label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, State / Remote"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Website / Portfolio
          </label>
          <input
            type="text"
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://janedoe.com"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/janedoe"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            GitHub Profile
          </label>
          <input
            type="text"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="github.com/janedoe"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}
