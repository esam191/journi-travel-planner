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

export default function AddTripPage() {
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);
  const [selectedImageName, setSelectedImageName] = useState("");

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
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Card className="border-neutral-800 bg-neutral-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Add a new trip</CardTitle>
            <CardDescription className="text-neutral-400">
              Create the trip first, then add itinerary items and documents.
            </CardDescription>
          </CardHeader>

          <CardContent>
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

              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedImageName(file?.name ?? "");
                  }}
                />
                <div className="flex items-center gap-3">
                  <Button asChild type="button" variant="outline">
                    <label htmlFor="image" className="cursor-pointer text-black">
                      Upload image
                    </label>
                  </Button>
                  {selectedImageName ? (
                    <span className="text-sm text-muted-foreground">{selectedImageName}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No file selected</span>
                  )}
                </div>
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

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end text-black">
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
    </main>
  )
}