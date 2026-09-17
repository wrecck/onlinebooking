"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Users,
  Bed
} from "lucide-react";

const accommodations = [
  {
    id: "1",
    name: "Ocean View Cottage",
    slug: "ocean-view-cottage",
    type: "COTTAGE",
    price: 250,
    maxGuests: 4,
    bedrooms: 2,
    status: "active",
    bookings: 45,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=200&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Garden Suite",
    slug: "garden-suite",
    type: "SUITE",
    price: 180,
    maxGuests: 2,
    bedrooms: 1,
    status: "active",
    bookings: 38,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Family Villa",
    slug: "family-villa",
    type: "VILLA",
    price: 400,
    maxGuests: 8,
    bedrooms: 4,
    status: "active",
    bookings: 28,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200&h=150&fit=crop",
  },
  {
    id: "4",
    name: "Deluxe Room",
    slug: "deluxe-room",
    type: "ROOM",
    price: 120,
    maxGuests: 2,
    bedrooms: 1,
    status: "maintenance",
    bookings: 62,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200&h=150&fit=crop",
  },
  {
    id: "5",
    name: "Beachfront Bungalow",
    slug: "beachfront-bungalow",
    type: "BUNGALOW",
    price: 320,
    maxGuests: 4,
    bedrooms: 2,
    status: "active",
    bookings: 35,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200&h=150&fit=crop",
  },
];

export default function AdminAccommodationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || acc.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accommodations</h1>
          <p className="text-slate-600">Manage your rooms, cottages, and villas</p>
        </div>
        <Link href="/admin/accommodations/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Accommodation
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search accommodations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "ROOM", "COTTAGE", "VILLA", "SUITE", "BUNGALOW"].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type === "all" ? "All" : type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodations List */}
      <div className="grid gap-4">
        {filteredAccommodations.map((accommodation) => (
          <Card key={accommodation.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center">
                <img
                  src={accommodation.image}
                  alt={accommodation.name}
                  className="w-32 h-24 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {accommodation.name}
                        </h3>
                        <Badge 
                          variant={accommodation.status === "active" ? "success" : "warning"}
                        >
                          {accommodation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {accommodation.maxGuests} guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {accommodation.bedrooms} bed
                        </span>
                        <Badge variant="default">{accommodation.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        ${accommodation.price}
                        <span className="text-sm font-normal text-slate-500">/night</span>
                      </p>
                      <p className="text-sm text-slate-500">
                        {accommodation.bookings} bookings
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 flex items-center gap-2">
                  <Link href={`/accommodations/${accommodation.slug}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/accommodations/${accommodation.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccommodations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No accommodations found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
