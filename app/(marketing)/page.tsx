"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { signOut } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, FileText, MapPin, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <main className="app-shell pt-12">
      <div className="app-frame grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex max-w-2xl flex-col space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary">Travel planner</Badge>
            <h1 className="font-display text-6xl tracking-[-0.05em] text-balance lg:text-7xl">
              Plan the whole trip like a polished travel folio.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Organize routes, keep your travel documents together, and move
              from itinerary to map without losing the thread of the journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Start planning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {session ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  void handleSignOut();
                }}
              >
                Log out
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">Log in</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-panel p-4">
              <Route className="h-4 w-4 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Build routes stop by stop.
              </p>
            </div>
            <div className="surface-panel p-4">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Keep each place grounded on the map.
              </p>
            </div>
            <div className="surface-panel p-4">
              <FileText className="h-4 w-4 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Store documents beside the itinerary.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-panel max-w-xl overflow-hidden justify-self-end">
          <div className="border-b border-border/70 bg-[linear-gradient(160deg,rgba(35,79,92,0.95),rgba(18,34,42,0.95))] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="atlas-kicker text-white/65">Sample trip</p>
                <h3 className="mt-3 font-display text-4xl tracking-[-0.04em]">
                  Summer Europe
                </h3>
                <p className="mt-2 text-sm text-white/72">
                  Paris • Rome • Barcelona
                </p>
              </div>
              <Badge variant="outline" className="bg-white/16 text-white backdrop-blur-md">
                6 stops
              </Badge>
            </div>
          </div>

          <div className="space-y-2 p-4 md:p-5">
            <div className="flex items-start gap-4 rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-2xl tracking-[-0.03em]">
                  Arrival in Paris
                </p>
                <p className="text-sm text-muted-foreground">
                  Check-in at Hotel Lumiere • 2:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-2xl tracking-[-0.03em]">
                  Louvre Museum Tour
                </p>
                <p className="text-sm text-muted-foreground">
                  Main Entrance • 10:30 AM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[calc(var(--radius)*1.1)] border border-border/70 bg-background/72 p-4">
              <FileText className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-2xl tracking-[-0.03em]">
                  Flight to Rome
                </p>
                <p className="text-sm text-muted-foreground">
                  Terminal 2E • 10:45 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
