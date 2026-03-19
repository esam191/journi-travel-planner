"use client";
import type { TripWithItineraryItems } from "@/types/trip";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Route } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateRange, getTripLocationLabel } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";


type TripCardProps = {
  trip: TripWithItineraryItems;
}



export default function TripCard({ trip }: TripCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const res = await fetch(`/api/image?query=${trip.title}`);
      const data = await res.json();
      setImageUrl(data.imageUrl);
    }

    fetchImage();
  }, [trip.title]);

  return (
    <Link href={`/trips/${trip.id}`} className="block">
      <Card className="overflow-hidden gap-0 py-0">
        <div className="aspect-[16/7] w-full overflow-hidden bg-muted relative">
          <Image
            src={imageUrl || "/placeholder.jpg"}
            alt={trip.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-opacity duration-500 hover:scale-105"
          />
          )
        </div>

        <CardContent className="space-y-5 p-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="atlas-kicker">Trip overview</p>
              <h3 className="font-display text-3xl tracking-[-0.03em]">
                {trip.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{getTripLocationLabel(trip.itineraryitems)}</span>
            </div>
          </div>

          <div className="grid gap-3 rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              <span>{trip.itineraryitems.length} planned stops</span>
            </div>
          </div>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {trip.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
