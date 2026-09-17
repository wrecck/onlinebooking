"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AccommodationSelector } from "@/components/booking/accommodation-selector";
import { MapAccommodation } from "@/components/booking/resort-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Calendar, Users } from "lucide-react";

function SelectAccommodationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = searchParams.get("guests") || "2";

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(parseInt(initialGuests));
  const [selectedAccommodation, setSelectedAccommodation] = useState<MapAccommodation | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(!initialCheckIn || !initialCheckOut);

  const handleSelect = (accommodation: MapAccommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const handleContinue = () => {
    if (!selectedAccommodation) return;
    
    router.push(
      `/booking?accommodation=${selectedAccommodation.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&code=${selectedAccommodation.code}`
    );
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      setShowDatePicker(false);
    }
  };

  // Show date picker if dates not selected
  if (showDatePicker) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                Select Your Dates
              </h1>
              <p className="text-slate-600 text-center mb-6">
                Choose your check-in and check-out dates to see availability
              </p>
              
              <form onSubmit={handleDateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Check Availability
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/accommodations"
              className="inline-flex items-center text-slate-600 hover:text-emerald-600"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Accommodations
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDatePicker(true)}
            >
              Change Dates
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AccommodationSelector
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onSelect={handleSelect}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
}

export default function SelectAccommodationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SelectAccommodationContent />
    </Suspense>
  );
}
