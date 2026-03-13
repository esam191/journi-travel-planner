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
