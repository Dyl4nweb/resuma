"use client";

import { ExperienceItem } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExperienceFormProps {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export function ExperienceForm({ items, onChange }: ExperienceFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      highlights: [""],
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, patch: Partial<ExperienceItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const addHighlight = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const currentHighlights = item.highlights || [];
    updateItem(id, { highlights: [...currentHighlights, ""] });
  };

  const updateHighlight = (id: string, index: number, value: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || !item.highlights) return;
    const nextHighlights = [...item.highlights];
    nextHighlights[index] = value;
    updateItem(id, { highlights: nextHighlights });
  };

  const removeHighlight = (id: string, index: number) => {
    const item = items.find((i) => i.id === id);
    if (!item || !item.highlights) return;
    const nextHighlights = item.highlights.filter((_, i) => i !== index);
    updateItem(id, { highlights: nextHighlights });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-foreground">
          Work Experience ({items.length})
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No work experience added yet. Click &quot;Add Position&quot; to begin.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-md border border-border bg-card overflow-hidden"
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer select-none hover:bg-muted transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span>{item.position || "Untitled Position"}</span>
                    {item.company && (
                      <span className="text-xs text-muted-foreground font-normal">
                        at {item.company}
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
                      className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-3.5 pt-1 space-y-3 border-t border-border bg-background">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={item.position}
                          onChange={(e) =>
                            updateItem(item.id, { position: e.target.value })
                          }
                          placeholder="e.g. Lead Software Architect"
                          className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) =>
                            updateItem(item.id, { company: e.target.value })
                          }
                          placeholder="e.g. Stripe, Acme Corp"
                          className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) =>
                            updateItem(item.id, { location: e.target.value })
                          }
                          placeholder="e.g. Remote / New York"
                          className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={item.startDate}
                          onChange={(e) =>
                            updateItem(item.id, { startDate: e.target.value })
                          }
                          placeholder="e.g. 2021-03"
                          className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs text-muted-foreground">
                            End Date
                          </label>
                          <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isCurrent}
                              onChange={(e) =>
                                updateItem(item.id, {
                                  isCurrent: e.target.checked,
                                  endDate: e.target.checked ? "Present" : "",
                                })
                              }
                              className="rounded border-border text-red-600 focus:ring-0"
                            />
                            Current
                          </label>
                        </div>
                        <input
                          type="text"
                          disabled={item.isCurrent}
                          value={item.isCurrent ? "Present" : item.endDate}
                          onChange={(e) =>
                            updateItem(item.id, { endDate: e.target.value })
                          }
                          placeholder="e.g. 2024-05"
                          className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        High-Level Overview / Role Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        placeholder="Core responsibilities and scope of this role..."
                        className="w-full rounded border border-border bg-card p-2 text-xs text-foreground focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-muted-foreground">
                          Key Achievements & Metrics (Bullet Points)
                        </label>
                        <button
                          type="button"
                          onClick={() => addHighlight(item.id)}
                          className="text-[11px] text-red-400 hover:text-red-300"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(item.highlights || []).map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-600">•</span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) =>
                              updateHighlight(item.id, hIdx, e.target.value)
                            }
                            placeholder="e.g. Scaled database queries reducing p99 latency by 35%..."
                            className="flex-1 rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeHighlight(item.id, hIdx)}
                            className="p-1 text-zinc-600 hover:text-muted-foreground"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
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
