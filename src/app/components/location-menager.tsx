"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Loader2,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createLocation } from "../actions";

interface Location {
  id: string;
  city: string;
  state: string;
  slug: string;
}

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export function LocationManager({
  location,
  initLocations,
  businessId,
}: {
  location: string;
  initLocations?: any;
  businessId: string;
}) {
  const [locations, setLocations] = useState<Location[]>(initLocations || []);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(
    "Generate 5 popular cities in the United States"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [referenceLocation, setReferenceLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (location) {
      setPrompt(`Generate 20 popular cities near ${location}`);
    }
  }, [location]);

  const handleAddLocation = () => {
    if (!city.trim() || !state.trim()) {
      toast.error("Please enter both city and state");
      return;
    }

    const citySlug = slugify(city);

    if (editingId) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingId ? { ...loc, city, state, slug: citySlug } : loc
        )
      );
      toast.success(`Updated ${city}, ${state}`);
      setEditingId(null);
    } else {
      const newLocation: Location = {
        id: Date.now().toString(),
        city,
        state,
        slug: citySlug,
      };
      setLocations([...locations, newLocation]);
      toast.success(`Added ${city}, ${state}`);
    }

    setCity("");
    setState("");
  };

  const handleEdit = (location: Location) => {
    setCity(location.city);
    setState(location.state);
    setEditingId(location.id);
  };

  const handleDelete = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
    toast.success("The location has been removed");

    if (editingId === id) {
      setCity("");
      setState("");
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setCity("");
    setState("");
    setEditingId(null);
  };

  const generateLocationsWithAI = async () => {
    setIsGenerating(true);
    setDialogOpen(false);

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          referenceLocation: referenceLocation
            ? {
                city: referenceLocation.city,
                state: referenceLocation.state,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate locations");
      }

      const data = await response.json();

      const newLocations = data.locations.map(
        (loc: { city: string; state: string }) => ({
          id: Date.now() + Math.random().toString(),
          city: loc.city,
          state: loc.state,
          slug: slugify(loc.city),
        })
      );

      setLocations([...locations, ...newLocations]);

      toast.success(
        `Added ${newLocations.length} new locations${
          referenceLocation ? ` near ${referenceLocation.city}` : " using AI"
        }`
      );
    } catch (error) {
      console.error("Error generating locations:", error);
      toast.error("Failed to generate locations with AI");
    } finally {
      setIsGenerating(false);
      setReferenceLocation(null);
    }
  };

  const handleSave = async () => {
    const response = await createLocation({
      id: businessId,
      data: locations,
    });
    if (response.success) {
      toast.success("Locations saved successfully");
    } else {
      toast.error(response.error || "Failed to save locations");
    }
  };

  const openGenerateDialog = (selectedLocation?: Location) => {
    if (selectedLocation) {
      setReferenceLocation(selectedLocation);
      setPrompt(
        `Generate 5 cities near ${selectedLocation.city}, ${selectedLocation.state} within a 100 mile radius`
      );
    } else {
      setReferenceLocation(null);
      setPrompt(`Generate 20 popular cities near ${location}`);
    }
    setDialogOpen(true);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Location" : "Add Location"}</CardTitle>
          <CardDescription>
            Enter the city and state to add a new location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Enter state name"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {editingId ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>Update Location</Button>
            </>
          ) : (
            <div className="w-full space-y-2">
              <Button
                className="w-full"
                onClick={handleAddLocation}
                disabled={!city.trim() || !state.trim()}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Location
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => openGenerateDialog()}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Locations</CardTitle>
          <CardDescription>
            {locations.length === 0
              ? "No locations added yet"
              : `${locations.length} location${
                  locations.length !== 1 ? "s" : ""
                } saved`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                Generating locations with AI...
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              {locations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MapPin className="h-12 w-12 mb-2 opacity-20" />
                  <p>Add your first location</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {locations.map((location) => (
                    <li
                      key={location.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {location.city},{" "}
                            <Badge variant="outline">{location.state}</Badge>
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6 mt-1">
                          Slug: {location.slug}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openGenerateDialog(location)}
                          title={`Generate locations near ${location.city}`}
                        >
                          <Map className="h-4 w-4" />
                          <span className="sr-only">Generate nearby</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSave}
            disabled={locations.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Save Locations
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {referenceLocation
                ? `Generate Locations Near ${referenceLocation.city}, ${referenceLocation.state}`
                : location
                ? `Generate Locations Near ${location}`
                : "Generate Locations with AI"}
            </DialogTitle>
            <DialogDescription>
              {referenceLocation
                ? `Enter a prompt to generate locations near ${referenceLocation.city}`
                : location
                ? `Enter a prompt to generate locations near ${location}`
                : "Enter a prompt to generate locations using AI"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Generate 5 popular cities in the United States"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={generateLocationsWithAI}>
              Generate Locations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
