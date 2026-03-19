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
import { Compass, Route } from "lucide-react";

type MapTabProps = {
  apiKey: string;
  items: ItineraryItemData[];
};

const DEFAULT_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const MAP_ROUTE_COLOR = "#2d6c76";
const MAP_MARKER_COLOR = "#2d6c76";

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
      <Card className="border-dashed bg-background/72">
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>
            Add itinerary items to see them pinned on the map.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="flex flex-col items-center justify-center gap-4 rounded-[calc(var(--radius)*1.1)] border border-dashed border-border/80 bg-background/72 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Add your first stop to generate a shared map view for the trip.
            </p>
          </div>
        </CardContent>
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
      <CardHeader className="border-b px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Cartography</Badge>
            </div>
            <CardTitle>Trip Map</CardTitle>
            <CardDescription>
              View each itinerary stop plotted on a Google Map.
            </CardDescription>
          </div>
          <Badge>{items.length} stops</Badge>
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
                  strokeColor: MAP_ROUTE_COLOR,
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
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: MAP_MARKER_COLOR,
                  fillOpacity: 1,
                  strokeColor: "#f5efe0",
                  strokeWeight: 2,
                  scale: 12,
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
                <div className="space-y-2 p-1">
                  <p className="font-display text-lg tracking-[-0.03em]">
                    {selectedItem.itemTitle}
                  </p>
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
