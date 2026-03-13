import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  Route,
  Trash2,
} from "lucide-react";
import TripDetailsTabs from "@/components/TripDetailsTabs";
import { formatDateRange, getDurationInDays, getTripLocationLabel } from "@/lib/utils";

type TripDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailsPage({ params }: TripDetailsPageProps) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const trip = await prisma.trip.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      itineraryitems: {
        orderBy: {
          order: "asc",
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!trip) {
    notFound();
  }

  const durationDays = getDurationInDays(trip.startDate, trip.endDate);

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{getTripLocationLabel(trip.itineraryitems)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="destructive" disabled>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Trip
          </Button>
        </div>

        <Card className="overflow-hidden py-0">
          <div className="relative aspect-[16/4] w-full bg-muted">
            {trip.imageUrl ? (
              <Image
                src={trip.imageUrl}
                alt={trip.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{trip.description}</p>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Duration</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold">{durationDays}</div>
              <p className="text-sm text-muted-foreground">Days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Itinerary</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold">{trip.itineraryitems.length}</div>
              <p className="text-sm text-muted-foreground">Items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold">{trip.documents.length}</div>
              <p className="text-sm text-muted-foreground">Uploaded</p>
            </CardContent>
          </Card>
        </section>

        <TripDetailsTabs
          tripId={trip.id}
          itineraryitems={trip.itineraryitems}
          documents={trip.documents}
        />
      </div>
    </main>
  );
}