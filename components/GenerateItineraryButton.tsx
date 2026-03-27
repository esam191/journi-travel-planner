"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GenerateItineraryButton({
  tripId,
  title,
  days,
  onGenerated,
}: {
  tripId: string;
  title: string;
  days: number;
  onGenerated: (data: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/itineraryGenerator", {
        method: "POST",
        body: JSON.stringify({
          country: title,
          days,
          budget: "medium",
        }),
      });

      const data = await res.json();
      onGenerated(data); 
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleGenerate} disabled={loading} className="w-full mt-4">
      {loading ? "Generating..." : "✨ Generate Itinerary"}
    </Button>
  );
}