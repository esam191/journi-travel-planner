"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ItineraryTab from "./ItineraryTab";
import DocumentsTab from "./DocumentsTab";
import { type DocumentData, ItineraryItemData } from "../types/trip";

type TripDetailsTabsProps = {
  tripId: string;
  itineraryitems: ItineraryItemData[];
  documents: DocumentData[];
};

export default function TripDetailsTabs({ tripId, itineraryitems, documents }: TripDetailsTabsProps) {
  return (
    <Tabs defaultValue="itinerary" className="space-y-6">
      <TabsList className="grid w-full max-w-sm grid-cols-2">
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="itinerary">
        <ItineraryTab items={itineraryitems} tripId={tripId} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab documents={documents} />
      </TabsContent>
    </Tabs>
  );
}