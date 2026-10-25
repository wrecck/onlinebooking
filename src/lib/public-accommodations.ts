export const ACCOMMODATIONS_STORAGE_KEY = "resort-accommodations";
export const BOOKINGS_STORAGE_KEY = "resort-walkin-bookings";

export interface PublicAccommodation {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  zone?: string | null;
  type: string;
  description: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  size?: number | null;
  amenities: string[];
  status: string;
  image: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
}

export const zoneLabels: Record<string, string> = {
  BEACHFRONT: "Beachfront",
  GARDEN: "Garden",
  POOLSIDE: "Poolside",
  HILLSIDE: "Hillside",
  LAKEFRONT: "Lakefront",
  MOUNTAINVIEW: "Mountain View",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

const defaultAmenities = [
  "Free WiFi",
  "Air conditioning",
  "Private bathroom",
  "Toiletries",
  "TV",
  "Free bottled water",
];

interface CatalogExtra {
  description: string;
  size: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  image: string;
}

const catalogExtras: Record<string, CatalogExtra> = {
  "ocean-view-cottage": {
    description: "Cottage with ocean views, a private deck, and a small kitchen.",
    size: 85,
    amenities: ["Ocean view", "Kitchen", "Balcony", "Free WiFi", "Air conditioning", "Private bathroom"],
    rating: 4.9,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
  },
  "garden-suite": {
    description: "Quiet suite set in the gardens, with a terrace and a king bed.",
    size: 45,
    amenities: ["Garden view", "Terrace", "Mini bar", "Free WiFi", "Air conditioning", "Private bathroom"],
    rating: 4.8,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  },
  "family-villa": {
    description: "Large villa for families, with several bedrooms and a full kitchen.",
    size: 200,
    amenities: ["Kitchen", "Pool access", "Parking", "Free WiFi", "Air conditioning", "Hot tub"],
    rating: 4.9,
    reviewCount: 72,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
  },
  "deluxe-room": {
    description: "Comfortable room with a king bed, daily housekeeping, and garden light.",
    size: 35,
    amenities: ["King bed", "Free WiFi", "Air conditioning", "Private bathroom", "TV", "Toiletries"],
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
  },
  "beachfront-bungalow": {
    description: "Bungalow a few steps from the sand, with a balcony facing the water.",
    size: 75,
    amenities: ["Beach access", "Ocean view", "Balcony", "Free WiFi", "Air conditioning", "Private bathroom"],
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
  },
  "poolside-bungalow": {
    description: "Bungalow beside the pool, with two bedrooms and a shaded terrace.",
    size: 70,
    amenities: ["Pool access", "Terrace", "Free WiFi", "Air conditioning", "Private bathroom", "TV"],
    rating: 4.8,
    reviewCount: 41,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
  },
};

function withExtras(base: Omit<PublicAccommodation, "description" | "amenities" | "image" | "images"> & {
  description?: string;
  amenities?: string[];
  image?: string;
  images?: string[];
}): PublicAccommodation {
  const extra = catalogExtras[base.slug];
  const images = (base.images && base.images.length > 0)
    ? base.images
    : base.image
      ? [base.image]
      : extra
        ? [extra.image]
        : [FALLBACK_IMAGE];

  return {
    ...base,
    description: base.description || extra?.description || "Comfortable stay with resort amenities.",
    size: base.size ?? extra?.size ?? null,
    amenities: base.amenities && base.amenities.length > 0 ? base.amenities : (extra?.amenities || defaultAmenities),
    image: images[0],
    images,
    rating: base.rating ?? extra?.rating,
    reviewCount: base.reviewCount ?? extra?.reviewCount,
  };
}

export const defaultPublicAccommodations: PublicAccommodation[] = [
  withExtras({
    id: "1",
    name: "Ocean View Cottage",
    slug: "ocean-view-cottage",
    code: "BF-1",
    zone: "BEACHFRONT",
    type: "COTTAGE",
    price: 250,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    status: "active",
  }),
  withExtras({
    id: "2",
    name: "Garden Suite",
    slug: "garden-suite",
    code: "GR-1",
    zone: "GARDEN",
    type: "SUITE",
    price: 180,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    status: "active",
  }),
  withExtras({
    id: "3",
    name: "Family Villa",
    slug: "family-villa",
    code: "HV-1",
    zone: "HILLSIDE",
    type: "VILLA",
    price: 400,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    status: "active",
  }),
  withExtras({
    id: "4",
    name: "Deluxe Room",
    slug: "deluxe-room",
    code: "GR-2",
    zone: "GARDEN",
    type: "ROOM",
    price: 120,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    status: "maintenance",
  }),
  withExtras({
    id: "5",
    name: "Beachfront Bungalow",
    slug: "beachfront-bungalow",
    code: "BF-2",
    zone: "BEACHFRONT",
    type: "BUNGALOW",
    price: 320,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    status: "active",
  }),
  withExtras({
    id: "6",
    name: "Poolside Bungalow",
    slug: "poolside-bungalow",
    code: "PB-1",
    zone: "POOLSIDE",
    type: "BUNGALOW",
    price: 280,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    status: "active",
  }),
];

interface StoredAccommodation {
  id: string;
  name: string;
  slug?: string;
  code?: string | null;
  zone?: string | null;
  type?: string;
  description?: string;
  price?: number;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number | null;
  amenities?: string[];
  status?: string;
  image?: string;
  images?: string[];
}

function normalizeStored(raw: StoredAccommodation): PublicAccommodation {
  const slug = raw.slug || raw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return withExtras({
    id: raw.id,
    name: raw.name,
    slug,
    code: raw.code,
    zone: raw.zone,
    type: raw.type || "ROOM",
    description: raw.description,
    price: Number(raw.price) || 0,
    maxGuests: Number(raw.maxGuests) || 2,
    bedrooms: Number(raw.bedrooms) || 1,
    bathrooms: Number(raw.bathrooms) || 1,
    size: raw.size,
    amenities: raw.amenities,
    status: raw.status || "active",
    image: raw.image,
    images: raw.images,
  });
}

export function loadPublicAccommodations(): PublicAccommodation[] {
  if (typeof window === "undefined") return defaultPublicAccommodations;
  try {
    const stored = localStorage.getItem(ACCOMMODATIONS_STORAGE_KEY);
    if (!stored) return defaultPublicAccommodations;
    const parsed = JSON.parse(stored) as StoredAccommodation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultPublicAccommodations;
    return parsed.map(normalizeStored);
  } catch {
    return defaultPublicAccommodations;
  }
}

export function findPublicAccommodation(idOrSlug: string): PublicAccommodation | undefined {
  const list = loadPublicAccommodations();
  return list.find(
    (room) => room.id === idOrSlug || room.slug === idOrSlug || room.code === idOrSlug
  );
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

export function parseDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatStayDate(iso: string): string {
  const date = parseDate(iso);
  if (!date) return iso;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

interface StoredBooking {
  accommodationCode?: string;
  accommodation?: string;
  checkIn: string;
  checkOut: string;
  status?: string;
}

export function isRoomUnavailable(
  room: PublicAccommodation,
  checkIn: string,
  checkOut: string,
  bookings: StoredBooking[]
): boolean {
  if (room.status === "inactive") return true;
  if (room.status === "maintenance") return true;
  if (!checkIn || !checkOut) return false;

  return bookings.some((booking) => {
    if (booking.status === "cancelled") return false;
    const sameRoom =
      (room.code && booking.accommodationCode === room.code) ||
      booking.accommodation === room.name ||
      booking.accommodation === room.slug;
    if (!sameRoom) return false;
    return checkIn < booking.checkOut && checkOut > booking.checkIn;
  });
}

export function loadBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
