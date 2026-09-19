"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Eye,
  MoreVertical
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

const guests = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0101",
    totalBookings: 3,
    totalSpent: 2450,
    lastBooking: "2026-09-15",
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 555-0102",
    totalBookings: 1,
    totalSpent: 540,
    lastBooking: "2026-09-10",
    status: "active",
    createdAt: "2026-06-20",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.w@email.com",
    phone: "+1 555-0103",
    totalBookings: 5,
    totalSpent: 4200,
    lastBooking: "2026-09-18",
    status: "vip",
    createdAt: "2025-08-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 555-0104",
    totalBookings: 2,
    totalSpent: 860,
    lastBooking: "2026-08-20",
    status: "active",
    createdAt: "2026-03-05",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@email.com",
    phone: "+1 555-0105",
    totalBookings: 1,
    totalSpent: 320,
    lastBooking: "2026-07-15",
    status: "inactive",
    createdAt: "2026-07-10",
  },
];

const statusColors = {
  active: "success",
  vip: "warning",
  inactive: "default",
} as const;

export default function AdminGuestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guests</h1>
          <p className="text-slate-600">Manage guest accounts and history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{guests.length}</p>
            <p className="text-sm text-slate-500">Total Guests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {guests.filter(g => g.status === "active").length}
            </p>
            <p className="text-sm text-slate-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {guests.filter(g => g.status === "vip").length}
            </p>
            <p className="text-sm text-slate-500">VIP Guests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(guests.reduce((sum, g) => sum + g.totalSpent, 0))}
            </p>
            <p className="text-sm text-slate-500">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Bookings</th>
                  <th className="px-4 py-3 font-medium">Total Spent</th>
                  <th className="px-4 py-3 font-medium">Last Booking</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="text-sm hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{guest.name}</p>
                          <p className="text-xs text-slate-500">
                            Member since {formatDate(guest.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="flex items-center text-slate-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {guest.email}
                        </p>
                        <p className="flex items-center text-slate-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {guest.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      {guest.totalBookings}
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">
                      {formatPrice(guest.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(guest.lastBooking)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[guest.status as keyof typeof statusColors]}>
                        {guest.status.toUpperCase()}
                      </Badge>
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

      {filteredGuests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No guests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
