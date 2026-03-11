import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItineraryItemData } from "@/types/trip";
import { GripVertical, MapPin, Plus } from "lucide-react";

type ItineraryTabProps = {
  items: ItineraryItemData[];
};

export default function ItineraryTab({ items }: ItineraryTabProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
        <CardTitle>Itinerary</CardTitle>

        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
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

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Coordinates: {item.lat}, {item.lng}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}