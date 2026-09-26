"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Save,
  Upload,
  Bed,
  Bath,
  Users,
  Home,
  Trash2
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

const STORAGE_KEY = "resort-accommodations";

const accommodationTypes = [
  { value: "ROOM", label: "Room" },
  { value: "COTTAGE", label: "Cottage" },
  { value: "VILLA", label: "Villa" },
  { value: "SUITE", label: "Suite" },
  { value: "BUNGALOW", label: "Bungalow" },
  { value: "CABIN", label: "Cabin" },
];

const accommodationZones = [
  { value: "", label: "Select Zone (for map)" },
  { value: "BEACHFRONT", label: "Beachfront" },
  { value: "GARDEN", label: "Garden" },
  { value: "POOLSIDE", label: "Poolside" },
  { value: "HILLSIDE", label: "Hillside" },
  { value: "LAKEFRONT", label: "Lakefront" },
  { value: "MOUNTAINVIEW", label: "Mountain View" },
];

const amenitiesList = [
  "Air Conditioning",
  "WiFi",
  "TV",
  "Mini Bar",
  "Kitchen",
  "Ocean View",
  "Garden View",
  "Pool Access",
  "Private Bathroom",
  "Balcony",
  "Terrace",
  "Hot Tub",
  "Fireplace",
  "Parking",
];

export default function AddAccommodationPage() {
  const router = useRouter();
  const { formatPrice, currency } = useCurrency();
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    code: "",
    zone: "",
    type: "ROOM",
    description: "",
    price: "",
    maxGuests: "2",
    bedrooms: "1",
    bathrooms: "1",
    size: "",
    amenities: [] as string[],
    images: [] as string[],
    status: "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Get existing accommodations from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const accommodations = stored ? JSON.parse(stored) : [];
    
    const newAccommodation = {
      id: `acc-${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      code: formData.code || null,
      zone: formData.zone || null,
      type: formData.type,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      maxGuests: parseInt(formData.maxGuests) || 2,
      bedrooms: parseInt(formData.bedrooms) || 1,
      bathrooms: parseInt(formData.bathrooms) || 1,
      size: formData.size ? parseInt(formData.size) : null,
      amenities: formData.amenities,
      status: formData.status,
      bookings: 0,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop",
    };
    
    accommodations.push(newAccommodation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accommodations));
    
    console.log("Created accommodation:", newAccommodation);
    
    setSaving(false);
    router.push("/admin/accommodations");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/accommodations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add Accommodation</h1>
            <p className="text-slate-600">Create a new room, cottage, or villa</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the main details of the accommodation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Ocean View Cottage"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Slug
                    </label>
                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="ocean-view-cottage"
                    />
                    <p className="text-xs text-slate-500 mt-1">Auto-generated from name</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit Code (for map)
                    </label>
                    <Input
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g., BF-1, GR-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">Displayed on the walk-in booking map</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Zone (for map)
                    </label>
                    <select
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {accommodationZones.map(zone => (
                        <option key={zone.value} value={zone.value}>
                          {zone.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Section on the resort map</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      {accommodationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe the accommodation..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity & Size</CardTitle>
                <CardDescription>Specify the accommodation capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      Max Guests *
                    </label>
                    <Input
                      type="number"
                      name="maxGuests"
                      value={formData.maxGuests}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Bed className="w-4 h-4 inline mr-1" />
                      Bedrooms *
                    </label>
                    <Input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Bath className="w-4 h-4 inline mr-1" />
                      Bathrooms *
                    </label>
                    <Input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Home className="w-4 h-4 inline mr-1" />
                      Size (m²)
                    </label>
                    <Input
                      type="number"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      min="10"
                      placeholder="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Select all amenities available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity)
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="sr-only"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Add photos of the accommodation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x150?text=Invalid+URL";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Add Image URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newImageUrl.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, newImageUrl.trim()]
                            }));
                            setNewImageUrl("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newImageUrl.trim()) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, newImageUrl.trim()]
                          }));
                          setNewImageUrl("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Paste an image URL and click Add (or press Enter)
                  </p>
                </div>
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Tip: Use free image hosts like Unsplash, Imgur, or Cloudinary
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set the nightly rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Base Price per Night ({currency.code}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {currency.symbol}
                    </span>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    This is the base rate before any pricing rules apply
                  </p>
                </div>

                {formData.price && (
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700">
                      Preview: <span className="font-bold">{formatPrice(parseFloat(formData.price) / currency.rate)}</span>/night
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-medium">{formData.name || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Unit Code:</span>
                  <span className="font-medium font-mono">{formData.code || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Zone:</span>
                  <span className="font-medium">{formData.zone ? accommodationZones.find(z => z.value === formData.zone)?.label : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Capacity:</span>
                  <span className="font-medium">{formData.maxGuests} guests</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Bedrooms:</span>
                  <span className="font-medium">{formData.bedrooms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-medium">{formData.amenities.length} selected</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-bold text-emerald-600">
                    {formData.price ? `${currency.symbol}${formData.price}` : "-"}/night
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Accommodation
                  </>
                )}
              </Button>
              <Link href="/admin/accommodations">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
