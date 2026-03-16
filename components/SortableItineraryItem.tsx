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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-shadow",
        isDragging && "shadow-lg opacity-90"
      )}
    >
      <CardContent className="flex items-start gap-4 p-5">
        <button
          type="button"
          className="pt-1 text-muted-foreground touch-none cursor-grab active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Reorder ${item.itemTitle}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold">{item.itemTitle}</h3>
            <Badge variant="secondary">Stop {index + 1}</Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
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
