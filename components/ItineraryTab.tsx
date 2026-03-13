"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createItineraryItem,
  deleteItineraryItem,
} from "@/lib/actions/itinerary-actions";
import { ItineraryItemData } from "@/types/trip";
import { GripVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AddItemDialog from "./AddItemDialog";

type ItineraryTabProps = {
  tripId: string;
  items: ItineraryItemData[];
};

export default function ItineraryTab({ tripId, items }: ItineraryTabProps) {
  const router = useRouter();

  const handleAddItem = async (placeId: string) => {
    await createItineraryItem({
      tripId, placeId,
    });
    router.refresh();
  };

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = window.confirm(
      "Delete this itinerary item?"
    );
    if (!confirmed) return;
    await deleteItineraryItem(itemId);
    router.refresh();
  };

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
        <CardTitle>Itinerary</CardTitle>
        <AddItemDialog onSubmit={handleAddItem} />
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No itinerary items yet.
          </p>
        ) : (
          items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="pt-1 text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
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
                  onClick={() => { handleDeleteItem(item.id) }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
