"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ItineraryTab from "./ItineraryTab";
import DocumentsTab from "./DocumentsTab";
import MapTab from "./MapTab";
import { type DocumentData, ItineraryItemData } from "../types/trip";

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
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="itinerary">
        <ItineraryTab items={itineraryitems} tripId={tripId} />
      </TabsContent>

      <TabsContent value="map">
        <MapTab apiKey={mapsApiKey} items={itineraryitems} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab documents={documents} />
      </TabsContent>
    </Tabs>
  );
}
