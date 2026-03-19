import type { TripWithItineraryItems } from "@/types/trip";
import TripCard from "./TripCard";
import { Card, CardContent } from "./ui/card";
import { Compass, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type TripListProps = {
  trips: TripWithItineraryItems[];
};

export default function TripsList({ trips }: TripListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-[-0.03em] md:text-4xl">
            Your trips
          </h2>
          <p className="section-copy">
            Keep each itinerary, route, and document bundle together in one
            organized ledger.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/trips/add">
            <Plus className="h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      {!trips || trips.length === 0 ? (
        <Card className="border-dashed bg-background/70">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl tracking-[-0.03em]">
                Your trips are empty
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Add your first trip to start organizing places, dates, and
                travel documents in one calm workspace.
              </p>
            </div>
            <Button asChild>
              <Link href="/trips/add">
                <Plus className="h-4 w-4" />
                Add Your First Trip
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  );
}
