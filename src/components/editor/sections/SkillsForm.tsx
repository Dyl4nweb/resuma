"use client";

import { SkillCategory } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface SkillsFormProps {
  categories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

export function SkillsForm({ categories, onChange }: SkillsFormProps) {
  const addCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: "",
      items: [],
    };
    onChange([...categories, newCat]);
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter((cat) => cat.id !== id));
  };

  const updateCategoryName = (id: string, name: string) => {
    onChange(
      categories.map((cat) => (cat.id === id ? { ...cat, category: name } : cat))
    );
  };

  const updateCategoryItemsString = (id: string, text: string) => {
    const items = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onChange(
      categories.map((cat) => (cat.id === id ? { ...cat, items } : cat))
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-zinc-300">
          Skills & Proficiencies ({categories.length})
        </label>
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Skill Group</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700/80 p-6 text-center text-xs text-zinc-500">
          No skills configured. Click &quot;Add Skill Group&quot; to categorize your skills.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-md border border-zinc-800 bg-zinc-900/80 p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  placeholder="Category Name (e.g. Languages, Cloud, Frameworks)"
                  className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-100 focus:border-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Remove group"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Skills (separated by commas)
                </label>
                <input
                  type="text"
                  value={cat.items.join(", ")}
                  onChange={(e) =>
                    updateCategoryItemsString(cat.id, e.target.value)
                  }
                  placeholder="TypeScript, React, Node.js, PostgreSQL, Docker..."
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              {cat.items.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-zinc-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
