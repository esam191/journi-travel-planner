import type { TripWithItineraryItems } from "@/types/trip";
import TripCard from "./TripCard";
import { Card, CardContent } from "./ui/card";

type TripListProps = {
  trips: TripWithItineraryItems[];
};

export default function TripsList({ trips }: TripListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Trips</h2>

      {!trips || trips.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground">
              No trips yet. Start by adding your first trip.
            </p>
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