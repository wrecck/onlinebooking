"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Calendar,
  Eye,
  MoreVertical,
  Download,
  UserPlus,
  X,
  Mail,
  Phone,
  CreditCard,
  User,
  Home,
  Clock,
  Printer
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

const bookings = [
  {
    id: "BK-2026-001",
    guest: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0101",
    accommodation: "Ocean View Cottage",
    checkIn: "2026-12-15",
    checkOut: "2026-12-18",
    guests: 2,
    nights: 3,
    total: 750,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-12-01",
  },
  {
    id: "BK-2026-002",
    guest: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 555-0102",
    accommodation: "Garden Suite",
    checkIn: "2026-12-16",
    checkOut: "2026-12-19",
    guests: 2,
    nights: 3,
    total: 540,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2026-12-02",
  },
  {
    id: "BK-2026-003",
    guest: "Mike Wilson",
    email: "mike.w@email.com",
    phone: "+1 555-0103",
    accommodation: "Family Villa",
    checkIn: "2026-12-18",
    checkOut: "2026-12-22",
    guests: 6,
    nights: 4,
    total: 1600,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-12-03",
  },
  {
    id: "BK-2026-004",
    guest: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 555-0104",
    accommodation: "Deluxe Room",
    checkIn: "2026-12-20",
    checkOut: "2026-12-23",
    guests: 2,
    nights: 3,
    total: 360,
    status: "checked_in",
    paymentStatus: "paid",
    createdAt: "2026-12-05",
  },
  {
    id: "BK-2026-005",
    guest: "David Brown",
    email: "david.b@email.com",
    phone: "+1 555-0105",
    accommodation: "Beachfront Bungalow",
    checkIn: "2026-12-22",
    checkOut: "2026-12-26",
    guests: 4,
    nights: 4,
    total: 1280,
    status: "confirmed",
    paymentStatus: "partial",
    createdAt: "2026-12-06",
  },
  {
    id: "BK-2026-006",
    guest: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 555-0106",
    accommodation: "Ocean View Cottage",
    checkIn: "2026-12-10",
    checkOut: "2026-12-12",
    guests: 2,
    nights: 2,
    total: 500,
    status: "checked_out",
    paymentStatus: "paid",
    createdAt: "2026-11-28",
  },
];

const statusColors = {
  pending: "warning",
  confirmed: "success",
  checked_in: "info",
  checked_out: "default",
  cancelled: "danger",
} as const;

const paymentColors = {
  pending: "warning",
  paid: "success",
  partial: "info",
  refunded: "danger",
} as const;

interface Booking {
  id: string;
  bookingNumber?: string;
  guest: string;
  email: string;
  phone: string;
  accommodation: string;
  accommodationCode?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  isWalkIn?: boolean;
}

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { formatPrice } = useCurrency();
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Load walk-in bookings from localStorage
    const walkInBookings = JSON.parse(localStorage.getItem("resort-walkin-bookings") || "[]");
    
    // Convert walk-in bookings to match the booking format
    interface WalkInBooking {
      id?: string;
      bookingNumber?: string;
      guest: string;
      email: string;
      phone: string;
      accommodation: string;
      accommodationCode?: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      nights: number;
      total: number;
      status?: string;
      paymentStatus?: string;
      paymentMethod?: string;
      createdAt: string;
    }
    
    const formattedWalkInBookings: Booking[] = walkInBookings.map((wb: WalkInBooking) => ({
      id: wb.id || wb.bookingNumber || `WI-${Date.now()}`,
      bookingNumber: wb.bookingNumber,
      guest: wb.guest,
      email: wb.email,
      phone: wb.phone,
      accommodation: wb.accommodation,
      accommodationCode: wb.accommodationCode,
      checkIn: wb.checkIn,
      checkOut: wb.checkOut,
      guests: wb.guests,
      nights: wb.nights,
      total: wb.total,
      status: wb.status || "confirmed",
      paymentStatus: wb.paymentStatus || "paid",
      paymentMethod: wb.paymentMethod,
      createdAt: wb.createdAt,
      isWalkIn: true,
    }));

    // Merge with mock bookings, walk-ins first (most recent)
    setAllBookings([...formattedWalkInBookings, ...bookings]);
  }, []);

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = 
      booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.accommodation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-600">Manage all reservations</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{allBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {allBookings.filter(b => b.status === "confirmed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {allBookings.filter(b => b.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Walk-in</p>
            <p className="text-2xl font-bold text-blue-600">
              {allBookings.filter(b => b.isWalkIn).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(allBookings.reduce((sum, b) => sum + b.total, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by guest, booking ID, or accommodation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "confirmed", "checked_in", "checked_out", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-medium">Booking ID</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Accommodation</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="text-sm hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-emerald-600">{booking.id}</span>
                        {booking.isWalkIn && (
                          <Badge variant="info" className="text-xs">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Walk-in
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{booking.guest}</p>
                        <p className="text-slate-500 text-xs">{booking.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{booking.accommodation}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{booking.nights} nights, {booking.guests} guests</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[booking.status as keyof typeof statusColors]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={paymentColors[booking.paymentStatus as keyof typeof paymentColors]}>
                        {booking.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {formatPrice(booking.total)}
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No bookings found</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                <p className="text-sm text-slate-500">{selectedBooking.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedBooking.isWalkIn && (
                  <Badge variant="info">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Walk-in
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Status:</span>
                  <Badge variant={statusColors[selectedBooking.status as keyof typeof statusColors]}>
                    {selectedBooking.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Payment:</span>
                  <Badge variant={paymentColors[selectedBooking.paymentStatus as keyof typeof paymentColors]}>
                    {selectedBooking.paymentStatus}
                  </Badge>
                </div>
                {selectedBooking.paymentMethod && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Method:</span>
                    <span className="text-sm font-medium capitalize">{selectedBooking.paymentMethod.replace("_", " ")}</span>
                  </div>
                )}
              </div>

              {/* Guest Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Guest Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Name</p>
                    <p className="font-medium text-slate-900">{selectedBooking.guest}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                    <p className="font-medium text-slate-900 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                    <p className="font-medium text-slate-900 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedBooking.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Guests</p>
                    <p className="font-medium text-slate-900">{selectedBooking.guests} guest(s)</p>
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-600" />
                  Accommodation
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Property</p>
                    <p className="font-medium text-slate-900">{selectedBooking.accommodation}</p>
                    {selectedBooking.accommodationCode && (
                      <p className="text-sm text-slate-500">Unit: {selectedBooking.accommodationCode}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Duration</p>
                    <p className="font-medium text-slate-900">{selectedBooking.nights} night(s)</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Dates
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Check-in</p>
                    <p className="font-medium text-slate-900">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Check-out</p>
                    <p className="font-medium text-slate-900">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-emerald-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Payment Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span>{formatPrice(selectedBooking.total * 0.92)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span>{formatPrice(selectedBooking.total * 0.08)}</span>
                  </div>
                  <hr className="border-emerald-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-emerald-600">{formatPrice(selectedBooking.total)}</span>
                  </div>
                </div>
              </div>

              {/* Booking Meta */}
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Booked on {formatDate(selectedBooking.createdAt)}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                {selectedBooking.status === "pending" && (
                  <Button>Confirm Booking</Button>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button>Check-in Guest</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
