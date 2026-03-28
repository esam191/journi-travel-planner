import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TripsList from "@/components/TripsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Plane,
  Sparkles,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
    include: {
      itineraryitems: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const today = new Date();
  const upcomingTrips = trips.filter((trip) => trip.endDate >= today);
  const totalTrips = trips.length;
  const totalUpcoming = upcomingTrips.length;
  const totalActivities = trips.reduce(
    (sum, trip) => sum + trip.itineraryitems.length,
    0
  );

  return (
    <main className="app-shell pt-8">
      <div className="app-frame space-y-8">
        <section className="hero-panel px-6 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h1 className="page-title text-balance">
                    Welcome back, {session.user.name || "Traveler"}.
                  </h1>
                  <p className="section-copy">
                    Review what is booked, what is upcoming, and what still
                    needs attention before your next departure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card size="sm" className="bg-background/72 py-0">
              <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
                <div>
                  <p className="atlas-kicker">Total Trips</p>
                  <CardTitle className="mt-2 text-base">Journeys logged</CardTitle>
                </div>
                <Plane className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="font-display text-4xl tracking-[-0.04em]">
                  {totalTrips}
                </div>
                <CardDescription>All planned departures</CardDescription>
              </CardContent>
            </Card>

            <Card size="sm" className="bg-background/72 py-0">
              <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
                <div>
                  <p className="atlas-kicker">Upcoming</p>
                  <CardTitle className="mt-2 text-base">Trips ahead</CardTitle>
                </div>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="font-display text-4xl tracking-[-0.04em]">
                  {totalUpcoming}
                </div>
                <CardDescription>Adventures on the horizon</CardDescription>
              </CardContent>
            </Card>

            <Card size="sm" className="bg-background/72 py-0">
              <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
                <div>
                  <p className="atlas-kicker">Itinerary</p>
                  <CardTitle className="mt-2 text-base">Stops mapped</CardTitle>
                </div>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="font-display text-4xl tracking-[-0.04em]">
                  {totalActivities}
                </div>
                <CardDescription>Planned places and activities</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <TripsList trips={trips} />
      </div>
    </main>
  );
}
