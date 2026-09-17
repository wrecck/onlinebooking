import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const accommodation = await prisma.accommodation.findUnique({
      where: { slug },
      include: {
        property: true,
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
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        pricingRules: {
          where: { isActive: true },
        },
        blockedDates: true,
      },
    });

    if (!accommodation) {
      return NextResponse.json(
        { error: "Accommodation not found" },
        { status: 404 }
      );
    }

    const ratings = accommodation.reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    return NextResponse.json({
      ...accommodation,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      amenities: accommodation.amenities.map((a) => a.amenity),
    });
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const accommodation = await prisma.accommodation.update({
      where: { slug },
      data: body,
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    return NextResponse.json(accommodation);
  } catch (error) {
    console.error("Error updating accommodation:", error);
    return NextResponse.json(
      { error: "Failed to update accommodation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.accommodation.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    return NextResponse.json(
      { error: "Failed to delete accommodation" },
      { status: 500 }
    );
  }
}
