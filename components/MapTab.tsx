"use client";

import { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  PolylineF,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItineraryItemData } from "@/types/trip";

type MapTabProps = {
  apiKey: string;
  items: ItineraryItemData[];
};

const DEFAULT_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

export default function MapTab({ apiKey, items }: MapTabProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "trip-details-map",
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (!map || !isLoaded || items.length === 0) {
      return;
    }

    if (items.length === 1) {
      map.setCenter({
        lat: items[0].lat,
        lng: items[0].lng,
      });
      map.setZoom(13);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    items.forEach((item) => {
      bounds.extend({
        lat: item.lat,
        lng: item.lng,
      });
    });

    map.fitBounds(bounds, 80);
  }, [isLoaded, items, map]);

  const selectedItem =
    items.find((item) => item.id === selectedItemId) ?? null;
  const routePath = items.map((item) => ({
    lat: item.lat,
    lng: item.lng,
  }));

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>
            Add itinerary items to see them pinned on the map.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>
            Google Maps failed to load. Check the browser API key and its
            referrer restrictions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="border-b px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Trip Map</CardTitle>
            <CardDescription>
              View each itinerary stop plotted on a shared Google Map.
            </CardDescription>
          </div>
          <Badge variant="secondary">{items.length} stops</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!isLoaded ? (
          <div className="flex h-[420px] items-center justify-center bg-muted text-sm text-muted-foreground">
            Loading map...
          </div>
        ) : (
          <GoogleMap
            center={
              items[0]
                ? {
                  lat: items[0].lat,
                  lng: items[0].lng,
                }
                : DEFAULT_CENTER
            }
            zoom={items.length === 1 ? 13 : 4}
            mapContainerClassName="h-[420px] w-full"
            onLoad={(instance) => {
              setMap(instance);
            }}
            onUnmount={() => {
              setMap(null);
            }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              fullscreenControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {routePath.length > 1 ? (
              <PolylineF
                path={routePath}
                options={{
                  strokeColor: "#0f766e",
                  strokeOpacity: 0.85,
                  strokeWeight: 3,
                }}
              />
            ) : null}

            {items.map((item, index) => (
              <MarkerF
                key={item.id}
                position={{
                  lat: item.lat,
                  lng: item.lng,
                }}
                title={item.itemTitle}
                label={{
                  text: String(index + 1),
                  color: "#ffffff",
                  fontWeight: "700",
                }}
                onClick={() => {
                  setSelectedItemId(item.id);
                }}
              />
            ))}

            {selectedItem ? (
              <InfoWindowF
                position={{
                  lat: selectedItem.lat,
                  lng: selectedItem.lng,
                }}
                onCloseClick={() => {
                  setSelectedItemId(null);
                }}
              >
                <div className="space-y-1">
                  <p className="font-semibold">{selectedItem.itemTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    Stop {selectedItem.order + 1}
                  </p>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        )}
      </CardContent>
    </Card>
  );
}
