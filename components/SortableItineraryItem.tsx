"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ItineraryItemData } from "@/types/trip";
import { GripVertical, Trash2 } from "lucide-react";

type SortableItineraryItemProps = {
  item: ItineraryItemData;
  index: number;
  onDelete: (item: ItineraryItemData) => void;
  disabled?: boolean;
};

const stopBadgeStyles = [
  "border-teal-200 bg-teal-100 text-teal-900",
  "border-sky-200 bg-sky-100 text-sky-900",
  "border-amber-200 bg-amber-100 text-amber-900",
  "border-rose-200 bg-rose-100 text-rose-900",
  "border-violet-200 bg-violet-100 text-violet-900",
  "border-cyan-200 bg-cyan-100 text-cyan-900",
];

export default function SortableItineraryItem({ item, index, onDelete, disabled = false }: SortableItineraryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const stopBadgeClassName = stopBadgeStyles[index % stopBadgeStyles.length];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden border-border/70 bg-background/78 py-0 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--card-shadow-strong)]",
        isDragging && "shadow-[var(--card-shadow-strong)] opacity-90"
      )}
    >
      <CardContent className="relative flex items-start gap-4 p-5 md:p-6">
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            stopBadgeClassName
          )}
        />
        <button
          type="button"
          className="flex size-10 touch-none cursor-grab items-center justify-center rounded-2xl border border-border/70 bg-secondary text-muted-foreground transition-colors active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Reorder ${item.itemTitle}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={stopBadgeClassName}>Stop {index + 1}</Badge>
                <Badge variant="outline">Route point</Badge>
              </div>
              <h3 className="font-display text-2xl tracking-[-0.03em]">
                {item.itemTitle}
              </h3>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/8 hover:text-destructive"
          aria-label={`Delete ${item.itemTitle}`}
          onClick={() => {
            onDelete(item);
          }}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
