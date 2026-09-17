"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { SectionKey } from "@/types/resume";

interface SectionReorderProps {
  sectionOrder: SectionKey[];
  onChange: (newOrder: SectionKey[]) => void;
}

const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills & Proficiencies",
  projects: "Projects",
  certifications: "Certifications",
};

interface SortableItemProps {
  id: SectionKey;
}

function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-3 py-2 rounded-md border text-xs font-medium transition-colors ${
        isDragging
          ? "bg-muted border-red-500 shadow-lg z-20 opacity-90 text-foreground"
          : "bg-card border-border text-foreground hover:border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span>{SECTION_LABELS[id]}</span>
      </div>
      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        Section
      </span>
    </div>
  );
}

export function SectionReorder({ sectionOrder, onChange }: SectionReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionKey);
      const newIndex = sectionOrder.indexOf(over.id as SectionKey);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-2 p-3 bg-background rounded-lg border border-border">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-foreground">
          Section Layout & Hierarchy
        </span>
        <span className="text-[11px] text-muted-foreground">
          Drag handles to reorder
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1.5">
            {sectionOrder.map((sectionKey) => (
              <SortableItem key={sectionKey} id={sectionKey} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
