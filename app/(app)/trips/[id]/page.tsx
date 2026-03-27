import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AiItinerarySection from "@/components/AIItinerarySection";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  Route,
} from "lucide-react";
import TripDetailsTabs from "@/components/TripDetailsTabs";
import {
  formatDateRange,
  getDurationInDays,
  getTripLocationLabel,
} from "@/lib/utils";
import DeleteTripButton from "@/components/DeleteTripButton";
import EditTripDialog from "@/components/EditTripDialog";

type TripDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailsPage({
  params,
}: TripDetailsPageProps) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
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
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const host = requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (host ? `${protocol}://${host}` : "http://localhost:3000");

  let fallbackImageUrl: string | null = null;

  try {
    const res = await fetch(
      `${baseUrl}/api/image?query=${encodeURIComponent(trip.title)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = (await res.json()) as { imageUrl?: string };
      fallbackImageUrl = data.imageUrl ?? null;
    }
  } catch {
    fallbackImageUrl = null;
  }

  const heroImage = fallbackImageUrl || "/placeholder.jpg";

  return (
    <main className="app-shell pt-8">
      <div className="app-frame space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <EditTripDialog trip={trip} />
            <DeleteTripButton tripId={trip.id} tripTitle={trip.title} />
          </div>
        </div>

        <section className="hero-panel grid overflow-hidden lg:grid-cols-[1.3fr_0.9fr]">
          <div className="relative min-h-[360px] border-b border-border/70 lg:border-r lg:border-b-0">
            <Image
              src={heroImage}
              alt={trip.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 62vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,26,33,0.82)] via-[rgba(15,26,33,0.18)] to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="max-w-2xl space-y-4 text-white">
                <h1 className="font-display text-4xl tracking-[-0.05em] md:text-6xl">
                  {trip.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/16 text-white backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5" />
                    {getTripLocationLabel(trip.itineraryitems)}
                  </Badge>
                  <Badge variant="outline" className="bg-white/16 text-white backdrop-blur-md">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="space-y-3">
              <p className="atlas-kicker">Trip Summary</p>
              <p className="section-copy max-w-none">{trip.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
                <div className="flex items-center justify-between">
                  <p className="atlas-kicker">Duration</p>
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-3 font-display text-4xl tracking-[-0.05em]">
                  {durationDays}
                </div>
                <p className="text-sm text-muted-foreground">days</p>
              </div>

              <div className="rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
                <div className="flex items-center justify-between">
                  <p className="atlas-kicker">Itinerary</p>
                  <Route className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-3 font-display text-4xl tracking-[-0.05em]">
                  {trip.itineraryitems.length}
                </div>
                <p className="text-sm text-muted-foreground">planned stops</p>
              </div>

              <div className="rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
                <div className="flex items-center justify-between">
                  <p className="atlas-kicker">Documents</p>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-3 font-display text-4xl tracking-[-0.05em]">
                  {trip.documents.length}
                </div>
                <p className="text-sm text-muted-foreground">files stored</p>
              </div>
            </div>
          </div>
        </section>

        <TripDetailsTabs
          mapsApiKey={mapsApiKey}
          tripId={trip.id}
          itineraryitems={trip.itineraryitems}
          documents={trip.documents}
        />
        <AiItinerarySection trip={trip} days={durationDays} />
      </div>
      
    </main>
  );
}
