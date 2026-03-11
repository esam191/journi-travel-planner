import type { Prisma } from "@/lib/generated/prisma/client";

export type TripWithItineraryItems = Prisma.TripGetPayload<{
  include: {
    itineraryitems: true;
  };
}>;