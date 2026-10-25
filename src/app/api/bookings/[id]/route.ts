import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getPrisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        accommodation: {
          include: {
            images: true,
            property: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
          },
        },
        user: {
          select: { name: true, email: true, phone: true },
        },
        payments: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      booking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await request.json();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      existingBooking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowedUpdates = ["status", "specialRequests", "guestPhone"];
    
    if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      allowedUpdates.push("guestName", "guestEmail", "guestsCount");
    }

    const updates: Record<string, unknown> = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updates,
      include: {
        accommodation: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
