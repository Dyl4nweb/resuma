"use client";

interface SummaryFormProps {
  summary: string;
  onChange: (value: string) => void;
}

export function SummaryForm({ summary, onChange }: SummaryFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="block text-xs font-semibold text-zinc-300">
          Professional Summary
        </label>
        <span className="text-[11px] text-zinc-500">
          {summary.length} characters (aim for 250–500)
        </span>
      </div>
      <textarea
        rows={4}
        value={summary || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Briefly state your core expertise, career highlights, and what value you bring to prospective teams..."
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
      />
    </div>
  );
}
