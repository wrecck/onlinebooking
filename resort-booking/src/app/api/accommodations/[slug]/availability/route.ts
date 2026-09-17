import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "checkIn and checkOut dates are required" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const accommodation = await prisma.accommodation.findUnique({
      where: { slug },
      select: { id: true, basePrice: true, maxGuests: true },
    });

    if (!accommodation) {
      return NextResponse.json(
        { error: "Accommodation not found" },
        { status: 404 }
      );
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        accommodationId: accommodation.id,
        status: {
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    });

    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        accommodationId: accommodation.id,
        OR: [
          {
            AND: [
              { startDate: { lte: checkInDate } },
              { endDate: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { startDate: { lt: checkOutDate } },
              { endDate: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: checkInDate } },
              { endDate: { lte: checkOutDate } },
            ],
          },
        ],
      },
    });

    const isAvailable = conflictingBookings.length === 0 && blockedDates.length === 0;

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const pricingRules = await prisma.pricingRule.findMany({
      where: {
        accommodationId: accommodation.id,
        isActive: true,
        OR: [
          { startDate: null },
          {
            AND: [
              { startDate: { lte: checkOutDate } },
              { endDate: { gte: checkInDate } },
            ],
          },
        ],
      },
      orderBy: { priority: "desc" },
    });

    let totalPrice = Number(accommodation.basePrice) * nights;

    for (const rule of pricingRules) {
      if (rule.isPercentage) {
        totalPrice += totalPrice * (Number(rule.priceModifier) / 100);
      } else {
        totalPrice += Number(rule.priceModifier) * nights;
      }
    }

    return NextResponse.json({
      isAvailable,
      nights,
      basePrice: Number(accommodation.basePrice),
      totalPrice: Math.round(totalPrice * 100) / 100,
      maxGuests: accommodation.maxGuests,
      blockedReason: blockedDates.length > 0 ? blockedDates[0].reason : null,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
