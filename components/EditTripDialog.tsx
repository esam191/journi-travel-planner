"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { updateTrip } from "@/lib/actions/trip-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePickerField from "@/components/ui/date-picker";

export default function EditTripDialog({ trip }: { trip: any }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(
    trip.startDate ? new Date(trip.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    trip.endDate ? new Date(trip.endDate) : undefined
  );
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      const formData = new FormData(event.currentTarget);
      formData.set("startDate", startDate.toISOString());
      formData.set("endDate", endDate.toISOString());

      await updateTrip(trip.id, formData);

      setMessage("Trip updated successfully.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : "Error updating trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setMessage(null);
          setStartDate(trip.startDate ? new Date(trip.startDate) : undefined);
          setEndDate(trip.endDate ? new Date(trip.endDate) : undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="bg-teal-100 text-teal-600 hover:bg-teal-200 cursor-pointer font-medium"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Trip</DialogTitle>{" "}
            <DialogDescription>
              Update details about your trip below.
            </DialogDescription>
          </DialogHeader>

          {message && (
            <p
              className={`mb-4 text-sm ${
                error ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}

          <div className="grid gap-6 py-4">
            <div>
              <label className="text-base font-medium">Title</label>
              <Input name="title" defaultValue={trip.title} required />
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium">Description</label>
              <Textarea
                name="description"
                defaultValue={trip.description}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
