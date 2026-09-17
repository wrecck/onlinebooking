"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  ArrowRight
} from "lucide-react";

const mockBookings = [
  {
    id: "1",
    bookingNumber: "BK-2026-001",
    accommodation: {
      name: "Ocean View Cottage",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop",
      type: "COTTAGE",
    },
    checkIn: "2026-12-15",
    checkOut: "2026-12-18",
    guests: 2,
    total: 750,
    status: "confirmed",
  },
  {
    id: "2",
    bookingNumber: "BK-2026-002",
    accommodation: {
      name: "Garden Suite",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      type: "SUITE",
    },
    checkIn: "2026-11-20",
    checkOut: "2026-11-23",
    guests: 2,
    total: 540,
    status: "completed",
  },
];

const statusColors = {
  pending: "warning",
  confirmed: "success",
  checked_in: "info",
  completed: "default",
  cancelled: "danger",
} as const;

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/account/bookings");
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const upcomingBookings = mockBookings.filter(
    (b) => new Date(b.checkIn) > new Date() && b.status !== "cancelled"
  );
  const pastBookings = mockBookings.filter(
    (b) => new Date(b.checkOut) <= new Date() || b.status === "completed"
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-600">View and manage your reservations</p>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Upcoming Reservations
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={booking.accommodation.image}
                        alt={booking.accommodation.name}
                        className="w-full sm:w-48 h-40 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="success">
                                {booking.accommodation.type}
                              </Badge>
                              <Badge 
                                variant={statusColors[booking.status as keyof typeof statusColors]}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900">
                              {booking.accommodation.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Booking #{booking.bookingNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600">
                              ${booking.total}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Users className="w-4 h-4" />
                            <span>{booking.guests} guests</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>Paradise Resort</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Cancel Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 mb-4">
                  You don&apos;t have any upcoming reservations
                </p>
                <Link href="/accommodations">
                  <Button>
                    Browse Accommodations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Past Reservations
            </h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={booking.accommodation.image}
                        alt={booking.accommodation.name}
                        className="w-full sm:w-40 h-32 object-cover grayscale"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="default">
                                {booking.accommodation.type}
                              </Badge>
                              <Badge 
                                variant={statusColors[booking.status as keyof typeof statusColors]}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900">
                              {booking.accommodation.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-700">
                              ${booking.total}
                            </p>
                            <Button variant="ghost" size="sm" className="mt-2">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
