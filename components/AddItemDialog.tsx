"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlaceSuggestion } from "@/types/trip";

type AddItemDialogProps = {
  onSubmit?: (placeId: string) => Promise<void> | void;
};

export default function AddItemDialog({ onSubmit }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PlaceSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const query = searchValue.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setErrorMessage(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setErrorMessage(null);

        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch place suggestions.");
        }

        const data = (await response.json()) as {
          suggestions?: PlaceSuggestion[];
        };

        setSuggestions(data.suggestions ?? []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setSuggestions([]);
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch place suggestions.");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchValue, open]);

  const handleSelectSuggestion = (suggestion: PlaceSuggestion) => {
    setSelectedSuggestion(suggestion);
    setSearchValue(suggestion.description);
    setSuggestions([]);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    if (!selectedSuggestion) return;

    try {
      setLoading(true);
      await onSubmit?.(selectedSuggestion.placeId);
      setOpen(false);
      setSearchValue("");
      setSuggestions([]);
      setSelectedSuggestion(null);
      setErrorMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Itinerary Item</DialogTitle>
          <DialogDescription>
            Search for a location and add it to this trip.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Command shouldFilter={false} className="rounded-md border">
              <CommandInput
                placeholder="Search for a place..."
                value={searchValue}
                onValueChange={(value) => {
                  setSearchValue(value);
                  if (selectedSuggestion &&
                    value !== selectedSuggestion.description) {
                    setSelectedSuggestion(null);
                  }
                }}
              />
              <CommandList>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.placeId}
                      value={suggestion.description}
                      onSelect={() => {
                        handleSelectSuggestion(suggestion);
                      }}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate">{suggestion.mainText}</span>
                        {suggestion.secondaryText ? (
                          <span className="truncate text-xs text-muted-foreground">
                            {suggestion.secondaryText}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </div>

          {selectedSuggestion && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" />
                <span>{selectedSuggestion.mainText}</span>
              </div>
              {selectedSuggestion.secondaryText ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedSuggestion.secondaryText}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedSuggestion || loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
