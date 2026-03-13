import "server-only";

import { GooglePlaceDetailsResponse } from "@/types/trip";

export async function fetchPlaceDetails(placeId: string) {
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

  return {
    itemTitle,
    lat,
    lng,
  };
}
