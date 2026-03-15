"use client";

import { useState } from "react";
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

export default function EditTripDialog({ trip }: { trip: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      await updateTrip(trip.id, formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      alert("Failed to update trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Trip</DialogTitle>{" "}
            <DialogDescription>
              Update details about your trip below.
            </DialogDescription>
          </DialogHeader>

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
              <div className="space-y-2">
                <label className="text-base font-medium">Start Date</label>
                <Input
                  name="startDate"
                  type="date"
                  defaultValue={
                    new Date(trip.startDate).toISOString().split("T")[0]
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-base font-medium">End Date</label>
                <Input
                  name="endDate"
                  type="date"
                  defaultValue={
                    new Date(trip.endDate).toISOString().split("T")[0]
                  }
                  required
                />
              </div>
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
