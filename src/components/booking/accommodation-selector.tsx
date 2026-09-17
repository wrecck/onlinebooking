"use client";

import { useState, useMemo } from "react";
import { ResortMap, ResortMapGrid, MapAccommodation } from "./resort-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  Grid3X3, 
  Calendar,
  Users,
  Bed,
  Bath,
  Check,
  ChevronRight
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface AccommodationSelectorProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  onSelect: (accommodation: MapAccommodation) => void;
  onContinue: () => void;
}

// Sample accommodation data - in production, this would come from the API
const sampleAccommodations: MapAccommodation[] = [
  // Beachfront Cottages
  { id: "bf1", code: "BF-1", name: "Beachfront Cottage 1", type: "COTTAGE", price: 320, maxGuests: 4, bedrooms: 2, bathrooms: 1, status: "available", position: { row: 1, col: 1 }, zone: "beachfront" },
  { id: "bf2", code: "BF-2", name: "Beachfront Cottage 2", type: "COTTAGE", price: 320, maxGuests: 4, bedrooms: 2, bathrooms: 1, status: "booked", position: { row: 1, col: 2 }, zone: "beachfront" },
  { id: "bf3", code: "BF-3", name: "Beachfront Cottage 3", type: "COTTAGE", price: 350, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", position: { row: 1, col: 3 }, zone: "beachfront" },
  { id: "bf4", code: "BF-4", name: "Beachfront Cottage 4", type: "COTTAGE", price: 350, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", position: { row: 1, col: 4 }, zone: "beachfront" },
  
  // Garden Rooms
  { id: "gr1", code: "GR-1", name: "Garden Room 1", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", position: { row: 2, col: 1 }, zone: "garden" },
  { id: "gr2", code: "GR-2", name: "Garden Room 2", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "booked", position: { row: 2, col: 2 }, zone: "garden" },
  { id: "gr3", code: "GR-3", name: "Garden Room 3", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "booked", position: { row: 2, col: 3 }, zone: "garden" },
  { id: "gr4", code: "GR-4", name: "Garden Room 4", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", position: { row: 2, col: 4 }, zone: "garden" },
  { id: "gr5", code: "GR-5", name: "Garden Room 5", type: "ROOM", price: 140, maxGuests: 3, bedrooms: 1, bathrooms: 1, status: "available", position: { row: 2, col: 5 }, zone: "garden" },
  { id: "gr6", code: "GR-6", name: "Garden Room 6", type: "ROOM", price: 140, maxGuests: 3, bedrooms: 1, bathrooms: 1, status: "maintenance", position: { row: 2, col: 6 }, zone: "garden" },
  
  // Garden Suites
  { id: "gs1", code: "GS-1", name: "Garden Suite 1", type: "SUITE", price: 180, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", position: { row: 3, col: 1 }, zone: "garden" },
  { id: "gs2", code: "GS-2", name: "Garden Suite 2", type: "SUITE", price: 180, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", position: { row: 3, col: 2 }, zone: "garden" },
  
  // Poolside Bungalows
  { id: "pb1", code: "PB-1", name: "Poolside Bungalow 1", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "available", position: { row: 4, col: 1 }, zone: "poolside" },
  { id: "pb2", code: "PB-2", name: "Poolside Bungalow 2", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "booked", position: { row: 4, col: 2 }, zone: "poolside" },
  { id: "pb3", code: "PB-3", name: "Poolside Bungalow 3", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "available", position: { row: 4, col: 3 }, zone: "poolside" },
  { id: "pb4", code: "PB-4", name: "Poolside Bungalow 4", type: "BUNGALOW", price: 280, maxGuests: 5, bedrooms: 2, bathrooms: 2, status: "available", position: { row: 4, col: 4 }, zone: "poolside" },
  
  // Hillside Villas
  { id: "hv1", code: "HV-1", name: "Hillside Villa 1", type: "VILLA", price: 400, maxGuests: 8, bedrooms: 4, bathrooms: 3, status: "available", position: { row: 5, col: 1 }, zone: "hillside" },
  { id: "hv2", code: "HV-2", name: "Hillside Villa 2", type: "VILLA", price: 400, maxGuests: 8, bedrooms: 4, bathrooms: 3, status: "booked", position: { row: 5, col: 2 }, zone: "hillside" },
  { id: "hv3", code: "HV-3", name: "Hillside Villa 3", type: "VILLA", price: 450, maxGuests: 10, bedrooms: 5, bathrooms: 4, status: "available", position: { row: 5, col: 3 }, zone: "hillside" },
  
  // Hillside Cabins
  { id: "hc1", code: "HC-1", name: "Mountain Cabin 1", type: "CABIN", price: 220, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", position: { row: 6, col: 1 }, zone: "hillside" },
  { id: "hc2", code: "HC-2", name: "Mountain Cabin 2", type: "CABIN", price: 220, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", position: { row: 6, col: 2 }, zone: "hillside" },
];

export function AccommodationSelector({
  checkIn,
  checkOut,
  guests,
  onSelect,
  onContinue,
}: AccommodationSelectorProps) {
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [selectedAccommodation, setSelectedAccommodation] = useState<MapAccommodation | null>(null);
  const { formatPrice } = useCurrency();

  // Filter accommodations that can fit the guest count
  const availableAccommodations = useMemo(() => {
    return sampleAccommodations.filter(a => a.maxGuests >= guests);
  }, [guests]);

  const handleSelect = (accommodation: MapAccommodation) => {
    if (accommodation.maxGuests < guests) {
      alert(`This accommodation can only fit ${accommodation.maxGuests} guests. You have ${guests} guests.`);
      return;
    }
    setSelectedAccommodation(accommodation);
    onSelect(accommodation);
  };

  const stats = useMemo(() => {
    const available = sampleAccommodations.filter(a => a.status === "available").length;
    const booked = sampleAccommodations.filter(a => a.status === "booked").length;
    const total = sampleAccommodations.length;
    return { available, booked, total };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Select Your Accommodation</h2>
          <p className="text-slate-600">
            Choose from our available cottages, rooms, and villas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "map" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="w-4 h-4 mr-1" />
            Map View
          </Button>
          <Button
            variant={viewMode === "grid" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4 mr-1" />
            Grid View
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
            <p className="text-sm text-slate-500">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-600">{stats.booked}</p>
            <p className="text-sm text-slate-500">Booked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Units</p>
          </CardContent>
        </Card>
      </div>

      {/* Map or Grid View */}
      {viewMode === "map" ? (
        <ResortMap
          accommodations={availableAccommodations}
          selectedId={selectedAccommodation?.id}
          onSelect={handleSelect}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      ) : (
        <ResortMapGrid
          accommodations={availableAccommodations}
          selectedId={selectedAccommodation?.id}
          onSelect={handleSelect}
        />
      )}

      {/* Selected Accommodation Details */}
      {selectedAccommodation && (
        <Card className="border-2 border-orange-500 bg-orange-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-orange-500" />
                Selected: {selectedAccommodation.name}
              </CardTitle>
              <Badge variant="warning">{selectedAccommodation.code}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Up to {selectedAccommodation.maxGuests} guests
                </span>
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {selectedAccommodation.bedrooms} bedroom{selectedAccommodation.bedrooms > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {selectedAccommodation.bathrooms} bathroom{selectedAccommodation.bathrooms > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(selectedAccommodation.price)}
                  </span>
                  <span className="text-slate-500">/night</span>
                </div>
                <Button onClick={onContinue}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Info */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">
                {new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{guests} guest{guests > 1 ? "s" : ""}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
