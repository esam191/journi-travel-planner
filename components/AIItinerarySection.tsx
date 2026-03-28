"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GeneratedItinerary } from "@/app/api/itineraryGenerator/route";

interface Trip {
  id: string;
  title: string;
  description: string | null;
}

interface AiItinerarySectionProps {
  trip: Trip;
  days: number;
}

export default function AiItinerarySection({
  trip,
  days,
}: AiItinerarySectionProps) {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const country = trip.title;

  const generate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/itineraryGenerator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripTitle: trip.title,
          description: trip.description ?? "",
          days,
          country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate itinerary.");
      }

      setItinerary(data as GeneratedItinerary);
      setExpandedDay(0);
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="atlas-kicker">AI Planner</p>
          <h2 className="font-display text-2xl tracking-[-0.04em]">
            Suggested Itinerary
          </h2>
        </div>

        <Button
          onClick={generate}
          disabled={isLoading}
          variant={itinerary ? "outline" : "default"}
          className="w-fit gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {itinerary ? "Regenerate" : "Generate with AI"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!itinerary && !isLoading && !error && (
        <div className="hero-panel flex min-h-[180px] flex-col items-center justify-center gap-3 p-8 text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Generate a day-by-day AI itinerary for this trip based on your
            destination and duration.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="hero-panel space-y-3 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {itinerary && !isLoading && (
        <div className="space-y-4">
          <div className="hero-panel p-6 space-y-2">
            <p className="section-copy max-w-none">{itinerary.overview}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary">
                {days} day{days !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary">{itinerary.estimatedTotalCost}</Badge>
            </div>
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden">
            {itinerary.days.map((day, i) => (
              <div key={day.dayNumber} className="bg-background/72">
                <button
                  onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="atlas-kicker shrink-0">
                      Day {day.dayNumber}
                    </span>
                    <span className="truncate font-medium">{day.theme}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {day.estimatedCost}
                    </span>
                    {expandedDay === i ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedDay === i && (
                  <div className="grid gap-px bg-border/40 border-t border-border/40 sm:grid-cols-3">
                    {(
                      [
                        { label: "Morning", value: day.morning },
                        { label: "Afternoon", value: day.afternoon },
                        { label: "Evening", value: day.evening },
                      ] as const
                    ).map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-background/72 px-5 py-4 space-y-1"
                      >
                        <p className="atlas-kicker">{label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {itinerary.tips.length > 0 && (
            <div className="space-y-3">
              <p className="atlas-kicker">Travel Tips</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {itinerary.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/70 bg-background/72 p-4 space-y-1"
                  >
                    <p className="text-xs font-semibold text-primary">
                      {tip.category}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}