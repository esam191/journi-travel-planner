"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItineraryTab from "./ItineraryTab";
import DocumentsTab from "./DocumentsTab";
import MapTab from "./MapTab";
import { type DocumentData, ItineraryItemData } from "../types/trip";
import { FileText, Map, Route } from "lucide-react";

type TripDetailsTabsProps = {
  mapsApiKey: string;
  tripId: string;
  itineraryitems: ItineraryItemData[];
  documents: DocumentData[];
};

export default function TripDetailsTabs({
  mapsApiKey,
  tripId,
  itineraryitems,
  documents,
}: TripDetailsTabsProps) {
  return (
    <Tabs defaultValue="itinerary" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="atlas-kicker">Trip workspace</p>
          <h2 className="font-display text-3xl tracking-[-0.03em]">
            Itinerary, map, and travel files
          </h2>
          <p className="section-copy">
            Shift between route planning, place context, and the documents that
            keep the trip moving.
          </p>
        </div>

        <TabsList className="grid w-full grid-cols-3 sm:max-w-xl">
          <TabsTrigger value="itinerary">
            <Route className="h-4 w-4" />
            Itinerary
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="itinerary">
        <ItineraryTab items={itineraryitems} tripId={tripId} />
      </TabsContent>

      <TabsContent value="map">
        <MapTab apiKey={mapsApiKey} items={itineraryitems} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab documents={documents} tripId={tripId} />
      </TabsContent>
    </Tabs>
  );
}
