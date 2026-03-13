import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { GooglePlacesAutocompleteResponse } from "@/types/trip";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input")?.trim() ?? "";

  if (!input) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

  const googleResponse = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input,
      }),
      cache: "no-store",
    }
  );

  if (!googleResponse.ok) {
    return NextResponse.json(
      { error: "Google Places autocomplete failed." },
      { status: googleResponse.status }
    );
  }

  const data = (await googleResponse.json()) as GooglePlacesAutocompleteResponse;

  const suggestions = (data.suggestions ?? [])
    .map((item) => {
      const prediction = item.placePrediction;
      const placeId = prediction?.placeId;
      const description = prediction?.text?.text;

      if (!placeId || !description) {
        return null;
      }

      return {
        placeId,
        description,
        mainText: prediction?.structuredFormat?.mainText?.text ?? description,
        secondaryText: prediction?.structuredFormat?.secondaryText?.text ?? "",
      };
    })
    .filter(Boolean);

  return NextResponse.json({ suggestions });
}
