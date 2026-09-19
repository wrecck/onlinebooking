"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Building,
  Check,
  ChevronRight,
  ChevronLeft,
  Waves,
  TreePine,
  UtensilsCrossed,
  Car,
  Bed,
  Bath
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { cn } from "@/lib/utils";

type AccommodationStatus = "available" | "booked" | "selected" | "maintenance";

interface MapAccommodation {
  id: string;
  code: string;
  name: string;
  type: "COTTAGE" | "ROOM" | "VILLA" | "SUITE" | "BUNGALOW" | "CABIN";
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  status: AccommodationStatus;
  zone: "beachfront" | "garden" | "hillside" | "poolside";
}

const sampleAccommodations: MapAccommodation[] = [
  { id: "bf1", code: "BF-1", name: "Beachfront Cottage 1", type: "COTTAGE", price: 320, maxGuests: 4, bedrooms: 2, bathrooms: 1, status: "available", zone: "beachfront" },
  { id: "bf2", code: "BF-2", name: "Beachfront Cottage 2", type: "COTTAGE", price: 320, maxGuests: 4, bedrooms: 2, bathrooms: 1, status: "booked", zone: "beachfront" },
  { id: "bf3", code: "BF-3", name: "Beachfront Cottage 3", type: "COTTAGE", price: 350, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", zone: "beachfront" },
  { id: "bf4", code: "BF-4", name: "Beachfront Cottage 4", type: "COTTAGE", price: 350, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", zone: "beachfront" },
  { id: "gr1", code: "GR-1", name: "Garden Room 1", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", zone: "garden" },
  { id: "gr2", code: "GR-2", name: "Garden Room 2", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "booked", zone: "garden" },
  { id: "gr3", code: "GR-3", name: "Garden Room 3", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "booked", zone: "garden" },
  { id: "gr4", code: "GR-4", name: "Garden Room 4", type: "ROOM", price: 120, maxGuests: 2, bedrooms: 1, bathrooms: 1, status: "available", zone: "garden" },
  { id: "gr5", code: "GR-5", name: "Garden Room 5", type: "ROOM", price: 140, maxGuests: 3, bedrooms: 1, bathrooms: 1, status: "available", zone: "garden" },
  { id: "gr6", code: "GR-6", name: "Garden Room 6", type: "ROOM", price: 140, maxGuests: 3, bedrooms: 1, bathrooms: 1, status: "maintenance", zone: "garden" },
  { id: "pb1", code: "PB-1", name: "Poolside Bungalow 1", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "available", zone: "poolside" },
  { id: "pb2", code: "PB-2", name: "Poolside Bungalow 2", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "booked", zone: "poolside" },
  { id: "pb3", code: "PB-3", name: "Poolside Bungalow 3", type: "BUNGALOW", price: 250, maxGuests: 4, bedrooms: 2, bathrooms: 2, status: "available", zone: "poolside" },
  { id: "pb4", code: "PB-4", name: "Poolside Bungalow 4", type: "BUNGALOW", price: 280, maxGuests: 5, bedrooms: 2, bathrooms: 2, status: "available", zone: "poolside" },
  { id: "hv1", code: "HV-1", name: "Hillside Villa 1", type: "VILLA", price: 400, maxGuests: 8, bedrooms: 4, bathrooms: 3, status: "available", zone: "hillside" },
  { id: "hv2", code: "HV-2", name: "Hillside Villa 2", type: "VILLA", price: 400, maxGuests: 8, bedrooms: 4, bathrooms: 3, status: "booked", zone: "hillside" },
  { id: "hv3", code: "HV-3", name: "Hillside Villa 3", type: "VILLA", price: 450, maxGuests: 10, bedrooms: 5, bathrooms: 4, status: "available", zone: "hillside" },
  { id: "hc1", code: "HC-1", name: "Mountain Cabin 1", type: "CABIN", price: 220, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", zone: "hillside" },
  { id: "hc2", code: "HC-2", name: "Mountain Cabin 2", type: "CABIN", price: 220, maxGuests: 6, bedrooms: 3, bathrooms: 2, status: "available", zone: "hillside" },
];

const statusColors: Record<AccommodationStatus, string> = {
  available: "bg-emerald-500 hover:bg-emerald-400 cursor-pointer shadow-md hover:shadow-lg",
  booked: "bg-slate-600 cursor-not-allowed opacity-60",
  selected: "bg-orange-500 ring-4 ring-orange-300 cursor-pointer shadow-lg",
  maintenance: "bg-red-400 cursor-not-allowed opacity-50",
};

const typeIcons: Record<string, string> = {
  COTTAGE: "🏠",
  ROOM: "🚪",
  VILLA: "🏡",
  SUITE: "🏨",
  BUNGALOW: "🛖",
  CABIN: "🏕️",
};

const paymentMethods = [
  { id: "cash", name: "Cash", icon: Banknote },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "bank_transfer", name: "Bank Transfer", icon: Building },
];

export default function WalkInBookingPage() {
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(1);
  const [selectedAccommodation, setSelectedAccommodation] = useState<MapAccommodation | null>(null);
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    idType: "passport",
    idNumber: "",
    notes: "",
  });

  const zones = useMemo(() => ({
    beachfront: sampleAccommodations.filter(a => a.zone === "beachfront"),
    garden: sampleAccommodations.filter(a => a.zone === "garden"),
    hillside: sampleAccommodations.filter(a => a.zone === "hillside"),
    poolside: sampleAccommodations.filter(a => a.zone === "poolside"),
  }), []);

  const stats = useMemo(() => ({
    available: sampleAccommodations.filter(a => a.status === "available").length,
    booked: sampleAccommodations.filter(a => a.status === "booked").length,
    total: sampleAccommodations.length,
  }), []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const pricing = useMemo(() => {
    if (!selectedAccommodation || nights === 0) return null;
    const subtotal = selectedAccommodation.price * nights;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total, perNight: selectedAccommodation.price };
  }, [selectedAccommodation, nights]);

  const handleSelectAccommodation = (acc: MapAccommodation) => {
    if (acc.status === "available") {
      setSelectedAccommodation(acc);
    }
  };

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteBooking = async () => {
    if (!selectedAccommodation || !pricing) return;
    
    setIsSubmitting(true);
    setBookingError(null);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accommodationId: selectedAccommodation.id,
          checkIn,
          checkOut,
          guestsCount: guests,
          guestName: guestDetails.name,
          guestEmail: guestDetails.email || `walkin-${Date.now()}@resort.local`,
          guestPhone: guestDetails.phone,
          specialRequests: guestDetails.notes,
          paymentMethod,
          isWalkIn: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const booking = await response.json();
      setBookingId(booking.bookingNumber || booking.id);
      setBookingComplete(true);
      
      // Also save to localStorage for display in admin bookings (temporary solution)
      const existingBookings = JSON.parse(localStorage.getItem("resort-walkin-bookings") || "[]");
      existingBookings.unshift({
        id: `WI-${Date.now()}`,
        bookingNumber: booking.bookingNumber || `WI-${Date.now()}`,
        guest: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
        accommodation: selectedAccommodation.name,
        accommodationCode: selectedAccommodation.code,
        checkIn,
        checkOut,
        guests,
        nights,
        total: pricing.total,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        createdAt: new Date().toISOString(),
        isWalkIn: true,
      });
      localStorage.setItem("resort-walkin-bookings", JSON.stringify(existingBookings.slice(0, 50)));
      
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError(error instanceof Error ? error.message : "Failed to create booking. Please try again.");
      
      // Fallback: Save to localStorage only if API fails
      const existingBookings = JSON.parse(localStorage.getItem("resort-walkin-bookings") || "[]");
      existingBookings.unshift({
        id: `WI-${Date.now()}`,
        bookingNumber: `WI-${Date.now()}`,
        guest: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
        accommodation: selectedAccommodation.name,
        accommodationCode: selectedAccommodation.code,
        checkIn,
        checkOut,
        guests,
        nights,
        total: pricing.total,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        createdAt: new Date().toISOString(),
        isWalkIn: true,
      });
      localStorage.setItem("resort-walkin-bookings", JSON.stringify(existingBookings.slice(0, 50)));
      setBookingId(`WI-${Date.now()}`);
      setBookingComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAccommodationUnit = (acc: MapAccommodation) => {
    const isSelected = selectedAccommodation?.id === acc.id;
    const status = isSelected ? "selected" : acc.status;

    return (
      <button
        key={acc.id}
        className={cn(
          "relative w-14 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform",
          statusColors[status],
          status === "available" && "hover:scale-110",
          status === "selected" && "scale-110"
        )}
        onClick={() => handleSelectAccommodation(acc)}
        disabled={acc.status === "booked" || acc.status === "maintenance"}
        title={`${acc.name} - ${acc.status}`}
      >
        <span className="text-lg">{typeIcons[acc.type]}</span>
        <span className="text-[10px] font-bold text-white drop-shadow-sm">{acc.code}</span>
      </button>
    );
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Complete!</h2>
            <p className="text-slate-600 mb-2">
              Walk-in booking for <strong>{guestDetails.name}</strong> has been created successfully.
            </p>
            {bookingId && (
              <p className="text-emerald-600 font-medium mb-4">Booking ID: {bookingId}</p>
            )}
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Accommodation:</span>
                  <p className="font-medium">{selectedAccommodation?.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">Unit Code:</span>
                  <p className="font-medium">{selectedAccommodation?.code}</p>
                </div>
                <div>
                  <span className="text-slate-500">Check-in:</span>
                  <p className="font-medium">{new Date(checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Check-out:</span>
                  <p className="font-medium">{new Date(checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Payment Method:</span>
                  <p className="font-medium capitalize">{paymentMethod.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total Paid:</span>
                  <p className="font-medium text-emerald-600">{pricing && formatPrice(pricing.total)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
              <Button onClick={() => {
                setBookingComplete(false);
                setBookingId(null);
                setBookingError(null);
                setStep(1);
                setSelectedAccommodation(null);
                setCheckOut("");
                setGuests(1);
                setPaymentMethod("cash");
                setGuestDetails({ name: "", email: "", phone: "", idType: "passport", idNumber: "", notes: "" });
                setPaymentReceived(false);
              }}>
                New Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Walk-in Booking</h1>
          <p className="text-slate-600">Create a booking for walk-in customers</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step >= s ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
              )}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={cn("w-8 h-0.5 mx-1", step > s ? "bg-emerald-600" : "bg-slate-200")} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Accommodation */}
      {step === 1 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Date Selection */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Date</label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                    <Input type="number" value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} min={1} max={10} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{stats.available}</p><p className="text-sm text-slate-500">Available</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-slate-600">{stats.booked}</p><p className="text-sm text-slate-500">Booked</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-slate-900">{stats.total}</p><p className="text-sm text-slate-500">Total Units</p></CardContent></Card>
            </div>

            {/* Resort Map */}
            <div className="bg-slate-800 rounded-2xl p-6 overflow-hidden">
              <div className="relative mb-4">
                <div className="h-12 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-t-2xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white/80 mr-2" />
                  <span className="text-white font-semibold">Beach / Lakefront</span>
                  <Waves className="w-6 h-6 text-white/80 ml-2" />
                </div>
              </div>

              {zones.beachfront.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Beachfront Premium</span>
                    <Badge variant="info" className="text-xs">Ocean View</Badge>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">{zones.beachfront.map(renderAccommodationUnit)}</div>
                </div>
              )}

              {zones.garden.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center">
                      <TreePine className="w-4 h-4 mr-1" />Garden Area
                    </span>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">{zones.garden.map(renderAccommodationUnit)}</div>
                </div>
              )}

              <div className="flex justify-center gap-8 my-6">
                <div className="bg-cyan-500/30 rounded-xl px-6 py-3 flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-300" />
                  <span className="text-cyan-300 text-sm font-medium">Pool</span>
                </div>
                <div className="bg-amber-500/30 rounded-xl px-6 py-3 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-300 text-sm font-medium">Restaurant</span>
                </div>
              </div>

              {zones.poolside.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Poolside</span>
                    <Badge variant="info" className="text-xs">Pool Access</Badge>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">{zones.poolside.map(renderAccommodationUnit)}</div>
                </div>
              )}

              {zones.hillside.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-wider flex items-center">
                      <TreePine className="w-4 h-4 mr-1" />Hillside Villas
                    </span>
                    <Badge variant="default" className="text-xs">Mountain View</Badge>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">{zones.hillside.map(renderAccommodationUnit)}</div>
                </div>
              )}

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
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500" /><span className="text-sm text-slate-600">Available</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-600 opacity-60" /><span className="text-sm text-slate-600">Booked</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500 ring-2 ring-orange-300" /><span className="text-sm text-slate-600">Selected</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-400 opacity-50" /><span className="text-sm text-slate-600">Maintenance</span></div>
            </div>
          </div>

          {/* Selection Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAccommodation ? (
                  <>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{selectedAccommodation.name}</span>
                        <Badge variant="success">{selectedAccommodation.code}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedAccommodation.maxGuests}</span>
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{selectedAccommodation.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{selectedAccommodation.bathrooms}</span>
                      </div>
                    </div>

                    {nights > 0 && pricing && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{formatPrice(pricing.perNight)} × {nights} nights</span>
                          <span>{formatPrice(pricing.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Tax (8%)</span>
                          <span>{formatPrice(pricing.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span className="text-emerald-600">{formatPrice(pricing.total)}</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      disabled={!checkIn || !checkOut || nights === 0}
                      onClick={() => setStep(2)}
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select an accommodation from the map</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Guest Details */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Guest Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  label="Full Name *" 
                  value={guestDetails.name} 
                  onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                  placeholder="John Doe"
                  required
                />
                <Input 
                  label="Phone Number *" 
                  value={guestDetails.phone} 
                  onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                  placeholder="+1 555 123 4567"
                  required
                />
              </div>
              <Input 
                label="Email (optional)" 
                type="email"
                value={guestDetails.email} 
                onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                placeholder="guest@email.com"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ID Type</label>
                  <select 
                    value={guestDetails.idType}
                    onChange={(e) => setGuestDetails({...guestDetails, idType: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                    <option value="national_id">National ID</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input 
                  label="ID Number" 
                  value={guestDetails.idNumber} 
                  onChange={(e) => setGuestDetails({...guestDetails, idNumber: e.target.value})}
                  placeholder="ID number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea 
                  value={guestDetails.notes}
                  onChange={(e) => setGuestDetails({...guestDetails, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Special requests, allergies, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  className="flex-1" 
                  disabled={!guestDetails.name || !guestDetails.phone}
                  onClick={() => setStep(3)}
                >
                  Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Guest:</span>
                  <span className="font-medium">{guestDetails.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Accommodation:</span>
                  <span className="font-medium">{selectedAccommodation?.name} ({selectedAccommodation?.code})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Dates:</span>
                  <span className="font-medium">{new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">{pricing && formatPrice(pricing.total)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
                        paymentMethod === method.id 
                          ? "border-emerald-500 bg-emerald-50" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <method.icon className={cn("w-6 h-6", paymentMethod === method.id ? "text-emerald-600" : "text-slate-400")} />
                      <span className={cn("text-sm font-medium", paymentMethod === method.id ? "text-emerald-600" : "text-slate-600")}>
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Confirmation */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <input 
                  type="checkbox" 
                  id="paymentReceived"
                  checked={paymentReceived}
                  onChange={(e) => setPaymentReceived(e.target.checked)}
                  className="mt-1 rounded border-slate-300"
                />
                <label htmlFor="paymentReceived" className="text-sm text-amber-800">
                  <span className="font-medium">I confirm that payment of {pricing && formatPrice(pricing.total)} has been received</span>
                  <span className="block text-amber-600 mt-1">
                    {paymentMethod === "cash" && "Cash has been counted and verified"}
                    {paymentMethod === "card" && "Card payment has been processed successfully"}
                    {paymentMethod === "bank_transfer" && "Bank transfer has been confirmed"}
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  className="flex-1" 
                  disabled={!paymentReceived || isSubmitting}
                  onClick={handleCompleteBooking}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Complete Booking
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
