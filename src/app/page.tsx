"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/currency-context";
import { 
  Waves, 
  TreePine, 
  Utensils, 
  Wifi, 
  Car, 
  Star,
  ArrowRight,
  Calendar,
  Users,
  MapPin
} from "lucide-react";

const featuredAccommodations = [
  {
    id: "1",
    name: "Ocean View Cottage",
    slug: "ocean-view-cottage",
    type: "COTTAGE",
    description: "A beautiful cottage with stunning ocean views and private beach access.",
    price: 250,
    maxGuests: 4,
    bedrooms: 2,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "2",
    name: "Garden Suite",
    slug: "garden-suite",
    type: "SUITE",
    description: "Elegant suite surrounded by tropical gardens with a private terrace.",
    price: 180,
    maxGuests: 2,
    bedrooms: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 95,
  },
  {
    id: "3",
    name: "Family Villa",
    slug: "family-villa",
    type: "VILLA",
    description: "Spacious villa perfect for families with a private pool and playground.",
    price: 400,
    maxGuests: 8,
    bedrooms: 4,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 72,
  },
];

const amenities = [
  { icon: Waves, name: "Swimming Pool", description: "Infinity pool with ocean view" },
  { icon: Utensils, name: "Restaurant", description: "Fine dining & room service" },
  { icon: Wifi, name: "Free WiFi", description: "High-speed internet" },
  { icon: Car, name: "Free Parking", description: "Secure parking space" },
  { icon: TreePine, name: "Nature Trails", description: "Guided hiking tours" },
];

export default function HomePage() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ guests });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your Perfect Getaway Awaits
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Experience luxury and tranquility at our beautiful resort. 
            Choose from cottages, rooms, and villas for an unforgettable stay.
          </p>
          
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 md:p-6 shadow-2xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    required
                    className="w-full text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    required
                    className="w-full text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                <div className="flex items-center space-x-2 border rounded-lg px-3 py-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-slate-700 focus:outline-none bg-transparent"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6+ Guests</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full" size="lg">
                  Search
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link href="/select-accommodation" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-1" />
                View Resort Map & Select Accommodation
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Accommodations
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our most popular stays, handpicked for their exceptional comfort and stunning locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAccommodations.map((accommodation) => (
              <Link key={accommodation.id} href={`/accommodations/${accommodation.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3" variant="success">
                      {accommodation.type}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {accommodation.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{accommodation.rating}</span>
                        <span className="text-sm text-slate-500">({accommodation.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {accommodation.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-slate-500">
                        <span>{accommodation.bedrooms} bed</span>
                        <span>•</span>
                        <span>{accommodation.maxGuests} guests</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-emerald-600">{formatPrice(accommodation.price)}</span>
                        <span className="text-sm text-slate-500">/night</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/accommodations">
              <Button variant="outline" size="lg">
                View All Accommodations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Resort Amenities
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for a perfect stay, all included with your booking.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {amenities.map((amenity) => (
              <div 
                key={amenity.name}
                className="text-center p-6 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <amenity.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{amenity.name}</h3>
                <p className="text-sm text-slate-500">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Perfect Vacation?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Book now and get 10% off your first stay. Use code WELCOME10 at checkout.
          </p>
          <Link href="/search">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              Book Your Stay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Find Us in Paradise
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Nestled along the pristine coastline, our resort offers the perfect 
                escape from everyday life. Just 30 minutes from the airport, yet 
                worlds away from the hustle and bustle.
              </p>
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Resort Address</p>
                  <p className="text-slate-600">123 Paradise Lane, Beach City, PC 12345</p>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline">
                  Get Directions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
                alt="Resort aerial view"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
