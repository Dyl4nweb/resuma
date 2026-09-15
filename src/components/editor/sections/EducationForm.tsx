"use client";

import { EducationItem } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EducationFormProps {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export function EducationForm({ items, onChange }: EducationFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  const addItem = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, patch: Partial<EducationItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-zinc-300">
          Education ({items.length})
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700/80 p-6 text-center text-xs text-zinc-500">
          No education items added yet. Click &quot;Add Education&quot; to begin.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-md border border-zinc-800 bg-zinc-900/70 overflow-hidden"
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer select-none hover:bg-zinc-800/40 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                    <span>
                      {item.degree || "Degree"}
                      {item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ""}
                    </span>
                    {item.institution && (
                      <span className="text-xs text-zinc-500 font-normal">
                        — {item.institution}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-3.5 pt-1 space-y-3 border-t border-zinc-800/60 bg-zinc-950/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Degree *
                        </label>
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) =>
                            updateItem(item.id, { degree: e.target.value })
                          }
                          placeholder="e.g. B.S., M.S., Ph.D."
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={item.fieldOfStudy}
                          onChange={(e) =>
                            updateItem(item.id, { fieldOfStudy: e.target.value })
                          }
                          placeholder="e.g. Computer Science"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Institution / University *
                        </label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) =>
                            updateItem(item.id, { institution: e.target.value })
                          }
                          placeholder="e.g. Stanford University"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) =>
                            updateItem(item.id, { location: e.target.value })
                          }
                          placeholder="e.g. Stanford, CA"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={item.startDate}
                          onChange={(e) =>
                            updateItem(item.id, { startDate: e.target.value })
                          }
                          placeholder="e.g. 2016-09"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          End Date / Graduation
                        </label>
                        <input
                          type="text"
                          value={item.endDate}
                          onChange={(e) =>
                            updateItem(item.id, { endDate: e.target.value })
                          }
                          placeholder="e.g. 2020-05"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          GPA / Honors (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.gpa || ""}
                          onChange={(e) =>
                            updateItem(item.id, { gpa: e.target.value })
                          }
                          placeholder="e.g. 3.9 / 4.0"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        Relevant Coursework & Achievements
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        placeholder="Dean's List, honors, specialized coursework..."
                        className="w-full rounded border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
