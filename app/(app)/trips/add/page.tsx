"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTrip } from "@/lib/actions/trip-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePickerField from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";

export default function AddTripPage() {
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setMessage(null);

    if (!startDate || !endDate) {
      setError(true);
      setMessage("Please select both a start date and an end date.");
      setLoading(false);
      return;
    }

    if (endDate < startDate) {
      setError(true);
      setMessage("End date cannot be before start date.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("startDate", startDate.toISOString());
      formData.set("endDate", endDate.toISOString());

      await createTrip(formData);
      setMessage("Trip created successfully.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : "Error creating trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell pt-8">
      <div className="app-frame space-y-6">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="justify-between bg-[linear-gradient(160deg,rgba(35,79,92,0.95),rgba(18,34,42,0.95))] py-0 text-white ring-white/10">
            <CardContent className="flex h-full flex-col justify-between gap-10 p-8">
              <div className="space-y-4">
                <p className="atlas-kicker text-white/65">Plan a new journey</p>
                <h1 className="font-display text-5xl tracking-[-0.05em] text-balance">
                  Start the next trip.
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-white/72">
                  Set the destination, define the dates, and create the place
                  where itinerary stops, maps, and travel documents will live.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-[calc(var(--radius)*1.1)] border border-white/10 bg-white/6 p-4">
                  <Sparkles className="h-5 w-5 text-[color:var(--accent)]" />
                  <p className="text-sm text-white/78">
                    Create the trip first, then layer in stops and documents.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[calc(var(--radius)*1.1)] border border-white/10 bg-white/6 p-4">
                    <MapPin className="h-4 w-4 text-[color:var(--accent)]" />
                    <p className="mt-3 text-sm text-white/72">
                      Organize places into a clean route.
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)*1.1)] border border-white/10 bg-white/6 p-4">
                    <CalendarDays className="h-4 w-4 text-[color:var(--accent)]" />
                    <p className="mt-3 text-sm text-white/72">
                      Lock the time window for the journey.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full py-0">
            <CardHeader className="border-b">
              <CardTitle>Add a new trip</CardTitle>
              <CardDescription>
                Create the trip first, then add itinerary items and documents.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {message && (
                <p className={`mb-4 text-sm ${error ? "text-red-400" : "text-green-400"}`}>
                  {message}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Trip title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Turkey Getaway"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="A short summary of the trip..."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <DatePickerField
                    label="Start date"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Pick a start date"
                    timeZone={timeZone}
                  />
                  <DatePickerField
                    label="End date"
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Pick an end date"
                    timeZone={timeZone}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button asChild variant="outline" type="button">
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Create Trip"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
