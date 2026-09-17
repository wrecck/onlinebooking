import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Bed, Bath, Filter } from "lucide-react";

const accommodations = [
  {
    id: "1",
    name: "Ocean View Cottage",
    slug: "ocean-view-cottage",
    type: "COTTAGE",
    description: "A beautiful cottage with stunning ocean views and private beach access. Features a fully equipped kitchen, spacious living area, and a private deck perfect for watching sunsets.",
    price: 250,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Garden Suite",
    slug: "garden-suite",
    type: "SUITE",
    description: "Elegant suite surrounded by tropical gardens with a private terrace. Perfect for couples seeking a romantic retreat with modern amenities.",
    price: 180,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 95,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Family Villa",
    slug: "family-villa",
    type: "VILLA",
    description: "Spacious villa perfect for families with a private pool and playground. Includes a full kitchen, multiple living spaces, and stunning garden views.",
    price: 400,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    size: 200,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 72,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Deluxe Room",
    slug: "deluxe-room",
    type: "ROOM",
    description: "Comfortable deluxe room with a king-size bed and mountain views. Includes all modern amenities and daily housekeeping.",
    price: 120,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Beachfront Bungalow",
    slug: "beachfront-bungalow",
    type: "BUNGALOW",
    description: "Step directly onto the sand from this charming beachfront bungalow. Wake up to the sound of waves and enjoy unobstructed ocean views.",
    price: 320,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: 75,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Mountain Cabin",
    slug: "mountain-cabin",
    type: "CABIN",
    description: "Cozy cabin nestled in the hills with panoramic mountain views. Features a fireplace, outdoor hot tub, and hiking trails nearby.",
    price: 220,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    size: 110,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 64,
    isFeatured: false,
  },
];

const accommodationTypes = [
  { value: "all", label: "All Types" },
  { value: "ROOM", label: "Rooms" },
  { value: "COTTAGE", label: "Cottages" },
  { value: "VILLA", label: "Villas" },
  { value: "SUITE", label: "Suites" },
  { value: "CABIN", label: "Cabins" },
  { value: "BUNGALOW", label: "Bungalows" },
];

export default function AccommodationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Our Accommodations
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            From cozy rooms to luxurious villas, find the perfect accommodation for your stay.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {accommodationTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={type.value === "all" ? "primary" : "secondary"}
                  size="sm"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold">{accommodations.length}</span> accommodations
          </p>
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <Link key={accommodation.id} href={`/accommodations/${accommodation.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="success">{accommodation.type}</Badge>
                    {accommodation.isFeatured && (
                      <Badge variant="warning">Featured</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {accommodation.name}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{accommodation.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {accommodation.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{accommodation.maxGuests}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{accommodation.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>{accommodation.bathrooms}</span>
                    </div>
                    <span>{accommodation.size} m²</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      {accommodation.reviewCount} reviews
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-emerald-600">
                        ${accommodation.price}
                      </span>
                      <span className="text-sm text-slate-500">/night</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
