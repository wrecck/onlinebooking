"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/currency-context";
import {
  Calendar,
  Users,
  Map,
  Check,
  Bed,
  Bath,
  Maximize2,
  Wifi,
  Wind,
  Coffee,
  Tv,
  Car,
  Waves,
  Star,
} from "lucide-react";
import {
  formatStayDate,
  isRoomUnavailable,
  loadBookings,
  loadPublicAccommodations,
  nightsBetween,
  PublicAccommodation,
  zoneLabels,
} from "@/lib/public-accommodations";

const typeFilters = ["all", "ROOM", "COTTAGE", "VILLA", "SUITE", "BUNGALOW", "CABIN"];

const amenityIcons: Record<string, typeof Check> = {
  "Free WiFi": Wifi,
  WiFi: Wifi,
  "Air conditioning": Wind,
  "Air Conditioning": Wind,
  TV: Tv,
  Kitchen: Coffee,
  Parking: Car,
  "Pool access": Waves,
  "Pool Access": Waves,
  "Ocean view": Waves,
  "Ocean View": Waves,
  "Beach access": Waves,
};

function amenityIcon(name: string) {
  return amenityIcons[name] || Check;
}

function ratingLabel(rating?: number) {
  if (!rating) return "";
  if (rating >= 4.8) return "Excellent";
  if (rating >= 4.5) return "Very good";
  return "Good";
}

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = searchParams.get("guests") || "2";

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState<PublicAccommodation[]>([]);
  const [bookings, setBookings] = useState<ReturnType<typeof loadBookings>>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState<"recommended" | "price-asc" | "price-desc">("recommended");
  const [showSmaller, setShowSmaller] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setGuests(initialGuests);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  useEffect(() => {
    setRooms(loadPublicAccommodations());
    setBookings(loadBookings());
    setLoaded(true);
  }, []);

  const guestCount = Math.max(1, parseInt(guests, 10) || 1);
  const nights = nightsBetween(initialCheckIn, initialCheckOut);
  const today = new Date().toISOString().split("T")[0];

  const listed = useMemo(() => {
    const active = rooms.filter((room) => room.status !== "inactive");
    const typed = active.filter((room) => typeFilter === "all" || room.type === typeFilter);
    const sized = showSmaller ? typed : typed.filter((room) => room.maxGuests >= guestCount);

    const decorated = sized.map((room) => ({
      room,
      unavailable: isRoomUnavailable(room, initialCheckIn, initialCheckOut, bookings),
      tooSmall: room.maxGuests < guestCount,
    }));

    decorated.sort((a, b) => {
      if (a.unavailable !== b.unavailable) return a.unavailable ? 1 : -1;
      if (sort === "price-asc") return a.room.price - b.room.price;
      if (sort === "price-desc") return b.room.price - a.room.price;
      const ratingDiff = (b.room.rating || 0) - (a.room.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return a.room.price - b.room.price;
    });

    return decorated;
  }, [rooms, bookings, typeFilter, showSmaller, guestCount, initialCheckIn, initialCheckOut, sort]);

  const hiddenSmaller = rooms.filter(
    (room) => room.status !== "inactive" && room.maxGuests < guestCount && (typeFilter === "all" || room.type === typeFilter)
  ).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests);
    router.push(`/search?${params.toString()}`);
  };

  const bookRoom = (room: PublicAccommodation) => {
    const params = new URLSearchParams({
      accommodation: room.slug || room.id,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      guests: String(guestCount),
    });
    router.push(`/booking?${params.toString()}`);
  };

  const detailsHref = (room: PublicAccommodation) => {
    const params = new URLSearchParams();
    if (initialCheckIn) params.set("checkIn", initialCheckIn);
    if (initialCheckOut) params.set("checkOut", initialCheckOut);
    params.set("guests", String(guestCount));
    return `/accommodations/${encodeURIComponent(room.slug || room.id)}?${params.toString()}`;
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px_auto] gap-3 items-end">
            <label className="block text-left">
              <span className="block text-xs font-medium text-slate-500 mb-1">Check-in</span>
              <span className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  required
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm text-slate-800 focus:outline-none"
                />
              </span>
            </label>
            <label className="block text-left">
              <span className="block text-xs font-medium text-slate-500 mb-1">Check-out</span>
              <span className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  required
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm text-slate-800 focus:outline-none"
                />
              </span>
            </label>
            <label className="block text-left">
              <span className="block text-xs font-medium text-slate-500 mb-1">Guests</span>
              <span className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                <Users className="w-4 h-4 text-slate-400" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-transparent focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <Button type="submit" className="h-[42px]">Search</Button>
          </form>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <p>
              {initialCheckIn && initialCheckOut ? (
                <>
                  <span className="font-medium text-slate-900">
                    {formatStayDate(initialCheckIn)} – {formatStayDate(initialCheckOut)}
                  </span>
                  {" · "}
                  {nights} {nights === 1 ? "night" : "nights"}
                  {" · "}
                  {guestCount} {guestCount === 1 ? "guest" : "guests"}
                </>
              ) : (
                "Choose dates to see prices for your stay"
              )}
            </p>
            <Link href={`/select-accommodation?checkIn=${initialCheckIn}&checkOut=${initialCheckOut}&guests=${guestCount}`} className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-medium">
              <Map className="w-4 h-4 mr-1" />
              View resort map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Available rooms</h1>
            <p className="text-sm text-slate-500">
              {loaded ? `${listed.length} ${listed.length === 1 ? "room" : "rooms"} for your stay` : "Loading rooms..."}
            </p>
          </div>
          <label className="text-sm text-slate-600 flex items-center gap-2">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {typeFilters.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                typeFilter === type
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {!showSmaller && hiddenSmaller > 0 && (
          <button
            type="button"
            onClick={() => setShowSmaller(true)}
            className="mb-4 text-sm text-emerald-700 hover:underline"
          >
            Show {hiddenSmaller} {hiddenSmaller === 1 ? "room" : "rooms"} that fit fewer than {guestCount} guests
          </button>
        )}

        <div className="space-y-4">
          {listed.map(({ room, unavailable, tooSmall }) => {
            const stayTotal = nights > 0 ? room.price * nights : room.price;
            const IconList = room.amenities.slice(0, 6);
            const href = detailsHref(room);
            return (
              <article
                key={room.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm ${
                  unavailable ? "border-slate-200 opacity-80" : "border-slate-200"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <Link
                    href={href}
                    className="md:w-64 lg:w-72 shrink-0 relative bg-slate-200 block group"
                    aria-label={`View details for ${room.name}`}
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-52 md:h-full md:min-h-[240px] object-cover group-hover:opacity-95"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
                      }}
                    />
                    {room.code && (
                      <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-semibold px-2 py-1 rounded">
                        {room.code}
                      </span>
                    )}
                  </Link>

                  <div className="flex-1 p-4 md:p-5 flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="default">{room.type}</Badge>
                            {room.zone && (
                              <span className="text-xs text-slate-500">{zoneLabels[room.zone] || room.zone}</span>
                            )}
                          </div>
                          <h2 className="text-lg font-bold text-slate-900">
                            <Link href={href} className="hover:text-emerald-700 hover:underline">
                              {room.name}
                            </Link>
                          </h2>
                        </div>
                        {room.rating ? (
                          <div className="text-right shrink-0">
                            <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-sm font-bold px-2 py-0.5 rounded">
                              <Star className="w-3.5 h-3.5 fill-white" />
                              {room.rating.toFixed(1)}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {ratingLabel(room.rating)}
                              {room.reviewCount ? ` · ${room.reviewCount} reviews` : ""}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        {room.size ? (
                          <span className="inline-flex items-center gap-1">
                            <Maximize2 className="w-4 h-4 text-slate-400" />
                            {room.size} m²
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-400" />
                          Up to {room.maxGuests} guests
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Bed className="w-4 h-4 text-slate-400" />
                          {room.bedrooms} {room.bedrooms === 1 ? "bedroom" : "bedrooms"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Bath className="w-4 h-4 text-slate-400" />
                          {room.bathrooms} {room.bathrooms === 1 ? "bathroom" : "bathrooms"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{room.description}</p>

                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                        {IconList.map((amenity) => {
                          const Icon = amenityIcon(amenity);
                          return (
                            <li key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                              <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                              {amenity}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="lg:w-60 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col">
                      <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Free cancellation
                      </p>
                      <p className="text-sm text-slate-600 mt-1">Pay at the resort</p>
                      <p className="text-xs text-slate-500 mt-1">Best available rate</p>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        {unavailable ? (
                          <p className="text-base font-semibold text-red-600">
                            {room.status === "maintenance" ? "Under maintenance" : "Sold out for these dates"}
                          </p>
                        ) : tooSmall ? (
                          <p className="text-sm font-medium text-amber-700">
                            Fits {room.maxGuests} guests
                          </p>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-slate-900">{formatPrice(stayTotal)}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {nights > 0
                                ? `${formatPrice(room.price)} per night · ${nights} ${nights === 1 ? "night" : "nights"}`
                                : `${formatPrice(room.price)} per night`}
                            </p>
                            <p className="text-xs text-slate-400">Taxes calculated at checkout</p>
                          </>
                        )}

                        <Button
                          type="button"
                          className="w-full mt-3"
                          disabled={unavailable || tooSmall || nights === 0}
                          onClick={() => bookRoom(room)}
                        >
                          {unavailable ? "Unavailable" : "Book"}
                        </Button>
                        {!unavailable && nights > 0 && !tooSmall && (
                          <p className="text-xs text-center text-slate-400 mt-2">You won&apos;t be charged yet</p>
                        )}
                        {nights === 0 && !unavailable && (
                          <p className="text-xs text-center text-slate-400 mt-2">Select dates to book</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {loaded && listed.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No rooms match this search</h2>
            <p className="text-slate-600 mt-2">Try fewer guests, a different room type, or other dates.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchResults />
    </Suspense>
  );
}
