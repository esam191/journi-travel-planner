import type { ItineraryItem, Trip } from "@/lib/generated/prisma/client";

export type TripWithItineraryItems = Trip & {
  itineraryitems: ItineraryItem[];
};

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

export type PlaceSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type GooglePlacesAutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: {
        text?: string;
      };
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
        secondaryText?: {
          text?: string;
        };
      };
    };
  }>;
};

export type GooglePlaceDetailsResponse = {
  displayName?: {
    text?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
};
