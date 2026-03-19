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
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {session.user.name || "Traveler"}!
              </h1>
              <p className="text-muted-foreground">
                Ready to plan your next adventure?
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Total Trips
              </CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalTrips}</div>
              <CardDescription>All planned journeys</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalUpcoming}</div>
              <CardDescription>Adventures ahead</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Activities
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold">{totalActivities}</div>
              <CardDescription>Planned activities</CardDescription>
            </CardContent>
          </Card>
        </section>

        <TripsList trips={trips}/>
      </div>
    </main>
  );
}