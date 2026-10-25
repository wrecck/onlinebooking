"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Waves, 
  TreePine, 
  UtensilsCrossed, 
  Car,
  Users,
  Bed,
  Bath
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/currency-context";

export type AccommodationStatus = "available" | "booked" | "selected" | "maintenance";

export interface MapAccommodation {
  id: string;
  code: string;
  name: string;
  type: "COTTAGE" | "ROOM" | "VILLA" | "SUITE" | "BUNGALOW" | "CABIN";
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  status: AccommodationStatus;
  position: { row: number; col: number };
  zone: "beachfront" | "garden" | "hillside" | "poolside";
  image?: string;
}

interface ResortMapProps {
  accommodations: MapAccommodation[];
  selectedId?: string | null;
  onSelect?: (accommodation: MapAccommodation) => void;
  checkIn?: string;
  checkOut?: string;
  showLegend?: boolean;
}

const statusColors: Record<AccommodationStatus, string> = {
  available: "bg-emerald-500 hover:bg-emerald-400 cursor-pointer shadow-md hover:shadow-lg",
  booked: "bg-slate-600 cursor-not-allowed opacity-60",
  selected: "bg-orange-500 ring-4 ring-orange-300 cursor-pointer shadow-lg",
  maintenance: "bg-red-400 cursor-not-allowed opacity-50",
};

const statusLabels: Record<AccommodationStatus, string> = {
  available: "Available",
  booked: "Booked",
  selected: "Selected",
  maintenance: "Maintenance",
};

const typeIcons: Record<string, string> = {
  COTTAGE: "🏠",
  ROOM: "🚪",
  VILLA: "🏡",
  SUITE: "🏨",
  BUNGALOW: "🛖",
  CABIN: "🏕️",
};

export function ResortMap({ 
  accommodations, 
  selectedId, 
  onSelect, 
  checkIn, 
  checkOut,
  showLegend = true 
}: ResortMapProps) {
  const [hoveredAccommodation, setHoveredAccommodation] = useState<MapAccommodation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { formatPrice } = useCurrency();

  const zones = {
    beachfront: accommodations.filter(a => a.zone === "beachfront"),
    garden: accommodations.filter(a => a.zone === "garden"),
    hillside: accommodations.filter(a => a.zone === "hillside"),
    poolside: accommodations.filter(a => a.zone === "poolside"),
  };

  const handleMouseEnter = (accommodation: MapAccommodation, e: React.MouseEvent) => {
    setHoveredAccommodation(accommodation);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleClick = (accommodation: MapAccommodation) => {
    if (accommodation.status === "available" || accommodation.status === "selected") {
      onSelect?.(accommodation);
    }
  };

  const renderAccommodationUnit = (accommodation: MapAccommodation) => {
    const isSelected = selectedId === accommodation.id;
    const status = isSelected ? "selected" : accommodation.status;

    return (
      <button
        key={accommodation.id}
        className={cn(
          "relative w-14 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform",
          statusColors[status],
          status === "available" && "hover:scale-110",
          status === "selected" && "scale-110"
        )}
        onMouseEnter={(e) => handleMouseEnter(accommodation, e)}
        onMouseLeave={() => setHoveredAccommodation(null)}
        onClick={() => handleClick(accommodation)}
        disabled={status === "booked" || status === "maintenance"}
        title={`${accommodation.name} - ${statusLabels[status]}`}
      >
        <span className="text-lg">{typeIcons[accommodation.type]}</span>
        <span className="text-[10px] font-bold text-white drop-shadow-sm">
          {accommodation.code}
        </span>
      </button>
    );
  };

  return (
    <div className="relative">
      {/* Resort Map Container */}
      <div className="bg-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Beach/Water Area */}
        <div className="relative mb-4">
          <div className="h-16 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-t-3xl flex items-center justify-center">
            <Waves className="w-8 h-8 text-white/80 mr-2" />
            <span className="text-white font-semibold text-lg">Beach / Lakefront</span>
            <Waves className="w-8 h-8 text-white/80 ml-2" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-600/50 to-transparent" />
        </div>

        {/* Beachfront Zone */}
        {zones.beachfront.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                Beachfront Premium
              </span>
              <Badge variant="info" className="text-xs">Ocean View</Badge>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {zones.beachfront.map(renderAccommodationUnit)}
            </div>
          </div>
        )}

        {/* Garden Zone */}
        {zones.garden.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center">
                <TreePine className="w-4 h-4 mr-1" />
                Garden Area
              </span>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {zones.garden.map(renderAccommodationUnit)}
            </div>
          </div>
        )}

        {/* Pool & Restaurant Area */}
        <div className="flex justify-center gap-8 my-6">
          <div className="bg-cyan-500/30 rounded-xl px-6 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-cyan-300 text-sm font-medium">Pool</span>
          </div>
          <div className="bg-amber-500/30 rounded-xl px-6 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-amber-300 text-sm font-medium">Restaurant</span>
          </div>
        </div>

        {/* Poolside Zone */}
        {zones.poolside.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Poolside
              </span>
              <Badge variant="info" className="text-xs">Pool Access</Badge>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {zones.poolside.map(renderAccommodationUnit)}
            </div>
          </div>
        )}

        {/* Hillside Zone */}
        {zones.hillside.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider flex items-center">
                <TreePine className="w-4 h-4 mr-1" />
                Hillside Villas
              </span>
              <Badge variant="default" className="text-xs">Mountain View</Badge>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {zones.hillside.map(renderAccommodationUnit)}
            </div>
          </div>
        )}

        {/* Parking Area */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-center">
            <div className="bg-slate-700/50 rounded-lg px-8 py-2 flex items-center gap-2">
              <Car className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400 text-sm">Parking Area</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span className="text-sm text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-600 opacity-60" />
            <span className="text-sm text-slate-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500 ring-2 ring-orange-300" />
            <span className="text-sm text-slate-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400 opacity-50" />
            <span className="text-sm text-slate-600">Maintenance</span>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredAccommodation && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-3 min-w-[200px]">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-slate-900">
                  {hoveredAccommodation.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {hoveredAccommodation.code} • {hoveredAccommodation.type}
                </p>
              </div>
              <Badge 
                variant={
                  hoveredAccommodation.status === "available" ? "success" :
                  hoveredAccommodation.status === "selected" ? "warning" :
                  "default"
                }
                className="text-xs"
              >
                {statusLabels[hoveredAccommodation.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {hoveredAccommodation.maxGuests}
              </span>
              <span className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                {hoveredAccommodation.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3 h-3" />
                {hoveredAccommodation.bathrooms}
              </span>
            </div>
            <div className="text-emerald-600 font-bold">
              {formatPrice(hoveredAccommodation.price)}
              <span className="text-slate-500 font-normal text-xs">/night</span>
            </div>
            {hoveredAccommodation.status === "available" && (
              <p className="text-xs text-emerald-600 mt-1">Click to select</p>
            )}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full">
              <div className="border-8 border-transparent border-t-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact grid view for smaller screens
export function ResortMapGrid({ 
  accommodations, 
  selectedId, 
  onSelect,
}: Omit<ResortMapProps, "showLegend">) {
  const handleClick = (accommodation: MapAccommodation) => {
    if (accommodation.status === "available" || accommodation.status === "selected") {
      onSelect?.(accommodation);
    }
  };

  return (
    <div className="bg-slate-100 rounded-xl p-4">
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {accommodations.map((accommodation) => {
          const isSelected = selectedId === accommodation.id;
          const status = isSelected ? "selected" : accommodation.status;

          return (
            <button
              key={accommodation.id}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center transition-all text-white",
                statusColors[status],
                status === "available" && "hover:scale-105"
              )}
              onClick={() => handleClick(accommodation)}
              disabled={status === "booked" || status === "maintenance"}
              title={`${accommodation.name} - ${statusLabels[status]}`}
            >
              <span className="text-sm">{typeIcons[accommodation.type]}</span>
              <span className="text-[9px] font-bold">{accommodation.code}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-600 opacity-60" />
          <span className="text-slate-600">Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="text-slate-600">Selected</span>
        </div>
      </div>
    </div>
  );
}
