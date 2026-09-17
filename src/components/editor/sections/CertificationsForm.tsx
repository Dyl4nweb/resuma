"use client";

import { CertificationItem } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface CertificationsFormProps {
  items: CertificationItem[];
  onChange: (items: CertificationItem[]) => void;
}

export function CertificationsForm({ items, onChange }: CertificationsFormProps) {
  const addItem = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, patch: Partial<CertificationItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-foreground">
          Certifications & Licenses ({items.length})
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 px-2.5 py-1 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No certifications added yet. Click &quot;Add Certification&quot; to include credentials.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-md border border-border bg-card p-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  placeholder="Certification Name *"
                  className="rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
                  placeholder="Issuing Organization *"
                  className="rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => updateItem(item.id, { date: e.target.value })}
                  placeholder="Year / Date (e.g. 2023)"
                  className="rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-red-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                title="Remove certification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
