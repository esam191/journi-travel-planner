"use client";
import type { TripWithItineraryItems } from "@/types/trip";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateRange, getTripLocationLabel } from "@/lib/utils";
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

        <CardContent className="space-y-4 p-6">
          <div>
            <h3 className="text-2xl font-semibold">{trip.title}</h3>

            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{getTripLocationLabel(trip.itineraryitems)}</span>
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
    </Link>
  );
}