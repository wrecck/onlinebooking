import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (type && type !== "all") {
      where.type = type;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const accommodations = await prisma.accommodation.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    const accommodationsWithRating = accommodations.map((acc) => {
      const ratings = acc.reviews.map((r) => r.rating);
      const averageRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

      return {
        ...acc,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
        amenities: acc.amenities.map((a) => a.amenity),
      };
    });

    return NextResponse.json(accommodationsWithRating);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const {
      propertyId,
      name,
      slug,
      type,
      description,
      shortDescription,
      basePrice,
      maxGuests,
      bedrooms,
      bathrooms,
      size,
      amenityIds,
    } = body;

    const accommodation = await prisma.accommodation.create({
      data: {
        propertyId,
        name,
        slug,
        type,
        description,
        shortDescription,
        basePrice,
        maxGuests,
        bedrooms,
        bathrooms,
        size,
        amenities: amenityIds
          ? {
              create: amenityIds.map((amenityId: string) => ({
                amenityId,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    return NextResponse.json(accommodation, { status: 201 });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return NextResponse.json(
      { error: "Failed to create accommodation" },
      { status: 500 }
    );
  }
}
