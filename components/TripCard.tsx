
import type { TripWithItineraryItems } from "@/types/trip";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

type TripCardProps = {
  trip: TripWithItineraryItems;
}

function formatDateRange(startDate: Date, endDate: Date) {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const end = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${start} - ${end}`;
}

function getTripLocationLabel(trip: TripWithItineraryItems) {
  if (!trip.itineraryitems.length) {
    return "Location coming soon";
  }
  return trip.itineraryitems[0].itemTitle;
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="overflow-hidden gap-0 py-0">
      <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
        {trip.imageUrl ? (
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            fill
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-2xl font-semibold">{trip.title}</h3>

          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{getTripLocationLabel(trip)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {trip.description}
        </p>
      </CardContent>
    </Card>
  );
}