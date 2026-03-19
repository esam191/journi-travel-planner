"use client";

import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createItineraryItem,
  deleteItineraryItem,
  reorderItineraryItems,
} from "@/lib/actions/itinerary-actions";
import { ItineraryItemData } from "@/types/trip";
import { useRouter } from "next/navigation";
import AddItemDialog from "./AddItemDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import SortableItineraryItem from "./SortableItineraryItem";
import { Compass } from "lucide-react";

type ItineraryTabProps = {
  tripId: string;
  items: ItineraryItemData[];
};

export default function ItineraryTab({ tripId, items }: ItineraryTabProps) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [orderedItems, setOrderedItems] = useState(items);
  const [itemToDelete, setItemToDelete] = useState<ItineraryItemData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleAddItem = async (placeId: string) => {
    await createItineraryItem({
      tripId, placeId,
    });
    router.refresh();
  };

  const handleDeleteItem = (item: ItineraryItemData) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteItineraryItem(itemToDelete.id);
      setItemToDelete(null);
      router.refresh();
    } catch {
      alert("Failed to delete itinerary item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedItems.findIndex((item) => item.id === active.id);
    const newIndex = orderedItems.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousItems = orderedItems;
    const nextItems = arrayMove(orderedItems, oldIndex, newIndex);

    setOrderedItems(nextItems);

    try {
      setReorderLoading(true);
      await reorderItineraryItems({
        tripId,
        orderedItemIds: nextItems.map((item) => item.id),
      });
      router.refresh();
    } catch {
      setOrderedItems(previousItems);
      alert("Failed to reorder itinerary items.");
    } finally {
      setReorderLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden py-0">
        <CardHeader className="flex flex-col gap-4 border-b px-6 py-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{orderedItems.length} stops</Badge>
            </div>
            <CardTitle>Itinerary</CardTitle>
            <CardDescription>
              Review each stop in your trip and drag to reorder the plan.
            </CardDescription>
          </div>
          <AddItemDialog onSubmit={handleAddItem} />
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {orderedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[calc(var(--radius)*1.1)] border border-dashed border-border/80 bg-background/72 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-primary">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl tracking-[-0.03em]">
                  No stops on the route yet
                </h3>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Add places to build the trip route, then drag them into the
                  order you want to travel.
                </p>
              </div>
            </div>
          ) : (
            <DndContext
              id={`trip-itinerary-${tripId}`}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                void handleDragEnd(event);
              }}
            >
              <SortableContext
                items={orderedItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {orderedItems.map((item, index) => (
                    <SortableItineraryItem
                      key={item.id}
                      item={item}
                      index={index}
                      onDelete={handleDeleteItem}
                      disabled={deleteLoading || reorderLoading}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setItemToDelete(null);
          }
        }}
        title="Delete Itinerary Item"
        description={
          itemToDelete
            ? `Delete "${itemToDelete.itemTitle}" from this itinerary? This action cannot be undone.`
            : "Are you sure? This action cannot be undone."
        }
        confirmLabel="Delete Item"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
