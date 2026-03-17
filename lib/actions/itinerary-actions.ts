"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { fetchPlaceDetails } from "@/lib/google-places";
import { Prisma } from "@/lib/generated/prisma/client";
import prisma from "../prisma";

type CreateItineraryItemInput = {
  tripId: string;
  placeId: string;
};

type ReorderItineraryItemsInput = {
  tripId: string;
  orderedItemIds: string[];
};

const MAX_ORDER_RETRY_ATTEMPTS = 3;

export async function createItineraryItem(input: CreateItineraryItemInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to add itinerary items.");
  }

  const { tripId, placeId } = input;

  if (!tripId || !placeId) {
    throw new Error("Missing required itinerary item fields.");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!trip) {
    throw new Error("Trip not found.");
  }

  const { itemTitle, lat, lng } = await fetchPlaceDetails(placeId);

  for (let attempt = 1; attempt <= MAX_ORDER_RETRY_ATTEMPTS; attempt += 1) {
    const lastItem = await prisma.itineraryItem.findFirst({
      where: {
        tripId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const nextOrder = (lastItem?.order ?? -1) + 1;

    try {
      await prisma.itineraryItem.create({
        data: {
          tripId,
          itemTitle,
          lat,
          lng,
          order: nextOrder,
        },
      });
      return;
    } catch (error) {
      const isUniqueConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";

      if (!isUniqueConflict || attempt === MAX_ORDER_RETRY_ATTEMPTS) {
        throw error;
      }
    }
  }
}

export async function deleteItineraryItem(itemId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to delete itinerary items.");
  }

  if (!itemId) {
    throw new Error("Missing itinerary item ID.");
  }

  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      trip: {
        is: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!item) {
    throw new Error("Itinerary item not found.");
  }

  await prisma.itineraryItem.delete({
    where: {
      id: item.id,
    },
  });
}

export async function reorderItineraryItems(input: ReorderItineraryItemsInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to reorder itinerary items.");
  }

  const { tripId, orderedItemIds } = input;

  if (!tripId || orderedItemIds.length === 0) {
    throw new Error("Missing itinerary reorder data.");
  }

  const uniqueOrderedItemIds = new Set(orderedItemIds);

  if (uniqueOrderedItemIds.size !== orderedItemIds.length) {
    throw new Error("Duplicate itinerary item IDs were provided.");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId: session.user.id,
    },
    select: {
      id: true,
      itineraryitems: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!trip) {
    throw new Error("Trip not found.");
  }

  if (trip.itineraryitems.length !== orderedItemIds.length) {
    throw new Error("Invalid itinerary order provided.");
  }

  const tripItemIds = new Set(trip.itineraryitems.map((item) => item.id));

  const hasInvalidItem = orderedItemIds.some((itemId) => !tripItemIds.has(itemId));

  if (hasInvalidItem) {
    throw new Error("Invalid itinerary order provided.");
  }

  await prisma.$transaction(async (tx) => {
    for (const [index, itemId] of orderedItemIds.entries()) {
      await tx.itineraryItem.update({
        where: {
          id: itemId,
        },
        data: {
          order: -(index + 1),
        },
      });
    }

    for (const [index, itemId] of orderedItemIds.entries()) {
      await tx.itineraryItem.update({
        where: {
          id: itemId,
        },
        data: {
          order: index,
        },
      });
    }
  });
}
