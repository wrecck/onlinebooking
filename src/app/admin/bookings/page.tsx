"use client";

import { useState } from "react";
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
  Download
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

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { formatPrice } = useCurrency();

  const filteredBookings = bookings.filter((booking) => {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {bookings.filter(b => b.status === "confirmed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {bookings.filter(b => b.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(bookings.reduce((sum, b) => sum + b.total, 0))}
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
                      <span className="font-medium text-emerald-600">{booking.id}</span>
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
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}
