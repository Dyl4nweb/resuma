"use client";

import { ProjectItem } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProjectsFormProps {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export function ProjectsForm({ items, onChange }: ProjectsFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  const addItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      url: "",
      technologies: [],
      highlights: [""],
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, patch: Partial<ProjectItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const updateTechString = (id: string, text: string) => {
    const technologies = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateItem(id, { technologies });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-zinc-300">
          Projects ({items.length})
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700/80 p-6 text-center text-xs text-zinc-500">
          No projects added yet. Click &quot;Add Project&quot; to showcase your work.
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
                    <span>{item.title || "Untitled Project"}</span>
                    {item.technologies.length > 0 && (
                      <span className="text-xs text-zinc-500 font-normal">
                        ({item.technologies.slice(0, 3).join(", ")})
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
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            updateItem(item.id, { title: e.target.value })
                          }
                          placeholder="e.g. Resuma — Resume SaaS"
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Project URL / Demo (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) =>
                            updateItem(item.id, { url: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        Technologies Used (comma separated)
                      </label>
                      <input
                        type="text"
                        value={item.technologies.join(", ")}
                        onChange={(e) =>
                          updateTechString(item.id, e.target.value)
                        }
                        placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        Project Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        placeholder="What problem does this project solve? What did you build?"
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
