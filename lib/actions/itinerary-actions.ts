"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { GooglePlaceDetailsResponse } from "@/types/trip";
import prisma from "../prisma";

type CreateItineraryItemInput = {
  tripId: string;
  placeId: string;
};

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

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY.");
  }

  const googleResponse = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,location",
      },
      cache: "no-store",
    }
  );

  if (!googleResponse.ok) {
    throw new Error("Failed to fetch place details.");
  }

  const place = (await googleResponse.json()) as GooglePlaceDetailsResponse;
  const itemTitle = place.displayName?.text;
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;

  if (typeof lat !== "number" || typeof lng !== "number" || !itemTitle) {
    throw new Error("Incomplete place details returned by Google.");
  }

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

  await prisma.itineraryItem.create({
    data: {
      tripId,
      itemTitle,
      lat,
      lng,
      order: nextOrder,
    },
  });
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
