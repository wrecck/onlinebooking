"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Wind,
  Tv,
  Coffee,
  Waves,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  MapPin
} from "lucide-react";
import { calculateNights } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { findPublicAccommodation, PublicAccommodation } from "@/lib/public-accommodations";

const accommodationsData: Record<string, {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
  policies: string[];
}> = {
  "ocean-view-cottage": {
    id: "1",
    name: "Ocean View Cottage",
    type: "COTTAGE",
    description: "A beautiful cottage with stunning ocean views and private beach access.",
    longDescription: `Experience the ultimate beachside retreat in our Ocean View Cottage. This stunning two-bedroom cottage offers breathtaking panoramic views of the ocean, with the soothing sound of waves as your constant companion.

The cottage features a spacious open-plan living area that flows seamlessly onto a private deck, perfect for enjoying your morning coffee while watching dolphins play in the surf. The fully equipped kitchen makes it easy to prepare meals, while the cozy living room with its plush furnishings invites you to relax after a day of exploration.

Both bedrooms are designed with comfort in mind, featuring premium bedding and blackout curtains for a restful night's sleep. The master bedroom includes direct access to the deck and stunning ocean views from your pillow.`,
    price: 250,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 128,
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Parking", "Beach Access", "Coffee Maker", "Washer"],
    policies: [
      "Check-in: 2:00 PM - 8:00 PM",
      "Check-out: 11:00 AM",
      "No smoking",
      "No pets allowed",
      "No parties or events",
    ],
  },
  "garden-suite": {
    id: "2",
    name: "Garden Suite",
    type: "SUITE",
    description: "Elegant suite surrounded by tropical gardens with a private terrace.",
    longDescription: `Escape to our Garden Suite, a tranquil haven nestled among lush tropical gardens. This elegant one-bedroom suite offers the perfect blend of comfort and natural beauty, ideal for couples seeking a romantic retreat.

Step onto your private terrace each morning to enjoy breakfast surrounded by colorful flowers and the gentle sounds of birdsong. The suite features floor-to-ceiling windows that bring the beauty of the gardens inside, creating a seamless connection with nature.

Inside, you'll find a beautifully appointed bedroom with a king-size bed draped in fine linens, a spacious bathroom with a soaking tub, and a cozy sitting area perfect for reading or enjoying a glass of wine.`,
    price: 180,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1200&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 95,
    amenities: ["WiFi", "Air Conditioning", "TV", "Mini Bar", "Coffee Maker", "Room Service"],
    policies: [
      "Check-in: 3:00 PM - 9:00 PM",
      "Check-out: 11:00 AM",
      "No smoking",
      "No pets allowed",
    ],
  },
  "family-villa": {
    id: "3",
    name: "Family Villa",
    type: "VILLA",
    description: "Spacious villa perfect for families with a private pool and playground.",
    longDescription: `Welcome to our Family Villa, the ultimate accommodation for families seeking space, comfort, and fun. This expansive four-bedroom villa offers everything you need for an unforgettable family vacation.

The villa features a private swimming pool surrounded by sun loungers and tropical landscaping, plus a dedicated play area for children. Inside, the open-plan living space includes a fully equipped gourmet kitchen, a large dining table perfect for family meals, and a comfortable living room with entertainment center.

Each of the four bedrooms has been thoughtfully designed with families in mind, including a master suite with ensuite bathroom and three additional bedrooms perfect for children. The villa also includes a separate media room with a large screen TV and gaming console.`,
    price: 400,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    size: 200,
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 72,
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Private Pool", "Parking", "Playground", "BBQ", "Washer", "Dryer"],
    policies: [
      "Check-in: 3:00 PM - 8:00 PM",
      "Check-out: 11:00 AM",
      "No smoking indoors",
      "Pets allowed with prior approval",
      "Pool hours: 8:00 AM - 10:00 PM",
    ],
  },
};

const defaultPolicies = [
  "Check-in: 2:00 PM",
  "Check-out: 11:00 AM",
  "No smoking",
  "Free cancellation before arrival",
];

type DetailRoom = {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
  policies: string[];
};

function toDetail(room: PublicAccommodation, rich?: (typeof accommodationsData)[string]): DetailRoom {
  const images = room.images.length > 0 ? room.images : rich?.images || [room.image];
  return {
    id: room.id,
    name: room.name,
    type: room.type,
    description: rich?.description || room.description,
    longDescription: rich?.longDescription || room.description,
    price: room.price,
    maxGuests: room.maxGuests,
    bedrooms: room.bedrooms,
    bathrooms: room.bathrooms,
    size: room.size || rich?.size || 0,
    images,
    rating: room.rating || rich?.rating || 0,
    reviewCount: room.reviewCount || rich?.reviewCount || 0,
    amenities: room.amenities.length > 0 ? room.amenities : rich?.amenities || [],
    policies: rich?.policies || defaultPolicies,
  };
}

const amenityIcons: Record<string, React.ElementType> = {
  "WiFi": Wifi,
  "Air Conditioning": Wind,
  "TV": Tv,
  "Parking": Car,
  "Coffee Maker": Coffee,
  "Beach Access": Waves,
};

function AccommodationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const slug = params.slug as string;
  const staticRoom = accommodationsData[slug];
  
  const [accommodation, setAccommodation] = useState<DetailRoom | null>(
    staticRoom
      ? {
          ...staticRoom,
        }
      : null
  );
  const [ready, setReady] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(Math.max(1, Number(searchParams.get("guests") || "1")));

  useEffect(() => {
    const found = findPublicAccommodation(slug);
    if (found) {
      setAccommodation(toDetail(found, accommodationsData[slug]));
    } else if (accommodationsData[slug]) {
      setAccommodation(accommodationsData[slug]);
    } else {
      setAccommodation(null);
    }
    setCurrentImage(0);
    setReady(true);
  }, [slug]);

  useEffect(() => {
    if (!accommodation) return;
    setGuests((current) => Math.min(Math.max(1, current), accommodation.maxGuests));
  }, [accommodation]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Accommodation Not Found</h1>
          <Link href="/accommodations">
            <Button>View All Accommodations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;
  const subtotal = nights * accommodation.price;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + cleaningFee + serviceFee;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % accommodation.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + accommodation.images.length) % accommodation.images.length);
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    router.push(`/booking?accommodation=${slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-emerald-600">Home</Link>
            <span className="text-slate-400">/</span>
            <Link href="/accommodations" className="text-slate-500 hover:text-emerald-600">Accommodations</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">{accommodation.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">{accommodation.type}</Badge>
                {accommodation.rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{accommodation.rating}</span>
                    {accommodation.reviewCount > 0 && (
                      <span className="text-slate-500">({accommodation.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{accommodation.name}</h1>
              <p className="text-slate-600 mt-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Paradise Resort, Beach City
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={accommodation.images[currentImage]}
                alt={accommodation.name}
                className="w-full h-[400px] object-cover"
              />
              {accommodation.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {accommodation.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImage ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {accommodation.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImage ? "border-emerald-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${accommodation.name} ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-slate-500" />
                <span>{accommodation.maxGuests} guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bed className="w-5 h-5 text-slate-500" />
                <span>{accommodation.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="w-5 h-5 text-slate-500" />
                <span>{accommodation.bathrooms} bathrooms</span>
              </div>
              {accommodation.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">{accommodation.size} m²</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About this place</h2>
              <div className="prose prose-slate max-w-none">
                {accommodation.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-slate-600 mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">House Rules</h2>
              <ul className="space-y-2">
                {accommodation.policies.map((policy, index) => (
                  <li key={index} className="flex items-center space-x-2 text-slate-600">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatPrice(accommodation.price)}
                    </span>
                    <span className="text-slate-500 font-normal"> / night</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Check-in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Check-out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {Array.from({ length: accommodation.maxGuests }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>{formatPrice(accommodation.price)} x {nights} nights</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Cleaning fee</span>
                      <span>{formatPrice(cleaningFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                >
                  {nights > 0 ? "Reserve" : "Check Availability"}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  You won&apos;t be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );
}

export default function AccommodationDetailRoute() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccommodationDetailPage />
    </Suspense>
  );
}
