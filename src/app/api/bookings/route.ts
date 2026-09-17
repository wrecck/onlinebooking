import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { generateBookingNumber, calculateNights } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      where.userId = session.user.id;
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        accommodation: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      accommodationId,
      checkIn,
      checkOut,
      guestsCount,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = body;

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      select: { id: true, basePrice: true, maxGuests: true },
    });

    if (!accommodation) {
      return NextResponse.json(
        { error: "Accommodation not found" },
        { status: 404 }
      );
    }

    if (guestsCount > accommodation.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${accommodation.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        accommodationId,
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

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 400 }
      );
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const baseTotal = Number(accommodation.basePrice) * nights;
    const taxAmount = baseTotal * 0.08;
    const totalPrice = baseTotal + taxAmount + 50;

    let userId = session?.user?.id;

    if (!userId) {
      let user = await prisma.user.findUnique({
        where: { email: guestEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: guestEmail,
            name: guestName,
            phone: guestPhone,
          },
        });
      }

      userId = user.id;
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        accommodationId,
        userId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestsCount,
        nights,
        baseTotal,
        taxAmount,
        totalPrice,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        status: "PENDING",
      },
      include: {
        accommodation: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            property: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
