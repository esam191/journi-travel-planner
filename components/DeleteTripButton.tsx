"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteTrip } from "@/lib/actions/trip-actions";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

export default function DeleteTripButton({
  tripId,
  tripTitle,
}: {
  tripId: string;
  tripTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTrip(tripId);
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to delete trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete Trip"
      description={`Delete "${tripTitle}"? This action cannot be undone.`}
      confirmLabel="Delete Trip"
      loading={loading}
      onConfirm={handleDelete}
      trigger={(
        <Button
          variant="destructive"
          size="lg"
          className="cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Trip
        </Button>
      )}
    />
  );
}
