import type { Prisma } from "@/lib/generated/prisma/client";

export type TripWithItineraryItems = Prisma.TripGetPayload<{
  include: {
    itineraryitems: true;
  };
}>;

export type ItineraryItemData = {
  id: string;
  itemTitle: string;
  lat: number;
  lng: number;
  order: number;
};

export type DocumentData = {
  id: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  url: string;
};
