import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@resort.com" },
    update: {},
    create: {
      email: "admin@resort.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create test guest user
  const guestPassword = await bcrypt.hash("guest123", 12);
  const guest = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      email: "guest@example.com",
      name: "John Doe",
      password: guestPassword,
      phone: "+1 555-0100",
      role: "GUEST",
    },
  });
  console.log("Created guest user:", guest.email);

  // Create property
  const property = await prisma.property.upsert({
    where: { id: "resort-main" },
    update: {},
    create: {
      id: "resort-main",
      name: "Paradise Resort",
      description:
        "A luxurious beachfront resort offering world-class amenities and breathtaking ocean views.",
      address: "123 Paradise Lane",
      city: "Beach City",
      country: "United States",
      phone: "+1 555-123-4567",
      email: "info@paradiseresort.com",
      website: "https://paradiseresort.com",
      checkInTime: "14:00",
      checkOutTime: "11:00",
      policies:
        "No smoking. Pets allowed with prior approval. Pool hours: 8am-10pm.",
    },
  });
  console.log("Created property:", property.name);

  // Create amenities
  const amenitiesData = [
    { name: "WiFi", icon: "wifi", category: "Technology" },
    { name: "Air Conditioning", icon: "wind", category: "Comfort" },
    { name: "TV", icon: "tv", category: "Entertainment" },
    { name: "Kitchen", icon: "utensils", category: "Facilities" },
    { name: "Parking", icon: "car", category: "Services" },
    { name: "Pool Access", icon: "waves", category: "Recreation" },
    { name: "Beach Access", icon: "umbrella", category: "Recreation" },
    { name: "Coffee Maker", icon: "coffee", category: "Facilities" },
    { name: "Mini Bar", icon: "glass", category: "Facilities" },
    { name: "Room Service", icon: "bell", category: "Services" },
    { name: "Washer", icon: "washer", category: "Facilities" },
    { name: "Dryer", icon: "dryer", category: "Facilities" },
    { name: "BBQ", icon: "flame", category: "Facilities" },
    { name: "Balcony", icon: "door", category: "Features" },
    { name: "Ocean View", icon: "eye", category: "Features" },
  ];

  const amenities = await Promise.all(
    amenitiesData.map((amenity) =>
      prisma.amenity.upsert({
        where: { name: amenity.name },
        update: {},
        create: amenity,
      })
    )
  );
  console.log("Created amenities:", amenities.length);

  // Create accommodations
  const accommodationsData = [
    {
      name: "Ocean View Cottage",
      slug: "ocean-view-cottage",
      type: "COTTAGE" as const,
      description:
        "A beautiful cottage with stunning ocean views and private beach access. Features a fully equipped kitchen, spacious living area, and a private deck perfect for watching sunsets.",
      shortDescription:
        "Stunning ocean views with private beach access",
      basePrice: 250,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      size: 85,
      isFeatured: true,
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Parking", "Beach Access", "Coffee Maker", "Washer"],
      images: [
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      ],
    },
    {
      name: "Garden Suite",
      slug: "garden-suite",
      type: "SUITE" as const,
      description:
        "Elegant suite surrounded by tropical gardens with a private terrace. Perfect for couples seeking a romantic retreat with modern amenities.",
      shortDescription: "Romantic suite with tropical garden views",
      basePrice: 180,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      size: 45,
      isFeatured: true,
      amenities: ["WiFi", "Air Conditioning", "TV", "Mini Bar", "Coffee Maker", "Room Service"],
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      ],
    },
    {
      name: "Family Villa",
      slug: "family-villa",
      type: "VILLA" as const,
      description:
        "Spacious villa perfect for families with a private pool and playground. Includes a full kitchen, multiple living spaces, and stunning garden views.",
      shortDescription: "Spacious villa with private pool",
      basePrice: 400,
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      size: 200,
      isFeatured: true,
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Pool Access", "Parking", "BBQ", "Washer", "Dryer"],
      images: [
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop",
      ],
    },
    {
      name: "Deluxe Room",
      slug: "deluxe-room",
      type: "ROOM" as const,
      description:
        "Comfortable deluxe room with a king-size bed and mountain views. Includes all modern amenities and daily housekeeping.",
      shortDescription: "Comfortable room with mountain views",
      basePrice: 120,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      size: 35,
      isFeatured: false,
      amenities: ["WiFi", "Air Conditioning", "TV", "Coffee Maker", "Room Service"],
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop",
      ],
    },
    {
      name: "Beachfront Bungalow",
      slug: "beachfront-bungalow",
      type: "BUNGALOW" as const,
      description:
        "Step directly onto the sand from this charming beachfront bungalow. Wake up to the sound of waves and enjoy unobstructed ocean views.",
      shortDescription: "Direct beach access bungalow",
      basePrice: 320,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      size: 75,
      isFeatured: true,
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Beach Access", "Balcony", "Ocean View"],
      images: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&h=800&fit=crop",
      ],
    },
    {
      name: "Mountain Cabin",
      slug: "mountain-cabin",
      type: "CABIN" as const,
      description:
        "Cozy cabin nestled in the hills with panoramic mountain views. Features a fireplace, outdoor hot tub, and hiking trails nearby.",
      shortDescription: "Cozy cabin with mountain views",
      basePrice: 220,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      size: 110,
      isFeatured: false,
      amenities: ["WiFi", "Kitchen", "TV", "Parking", "BBQ"],
      images: [
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop",
      ],
    },
  ];

  for (const accData of accommodationsData) {
    const { amenities: amenityNames, images, ...data } = accData;

    const accommodation = await prisma.accommodation.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        propertyId: property.id,
      },
    });

    // Add amenities
    const amenityRecords = amenities.filter((a: { name: string }) => amenityNames.includes(a.name));
    for (const amenity of amenityRecords) {
      await prisma.accommodationAmenity.upsert({
        where: {
          accommodationId_amenityId: {
            accommodationId: accommodation.id,
            amenityId: amenity.id,
          },
        },
        update: {},
        create: {
          accommodationId: accommodation.id,
          amenityId: amenity.id,
        },
      });
    }

    // Add images
    for (let i = 0; i < images.length; i++) {
      await prisma.accommodationImage.create({
        data: {
          accommodationId: accommodation.id,
          url: images[i],
          isPrimary: i === 0,
          sortOrder: i,
        },
      });
    }

    console.log("Created accommodation:", accommodation.name);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
