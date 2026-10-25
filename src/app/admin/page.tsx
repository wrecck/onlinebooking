"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Home, 
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

const recentBookings = [
  {
    id: "BK-001",
    guest: "John Smith",
    accommodation: "Ocean View Cottage",
    checkIn: "Dec 15, 2026",
    checkOut: "Dec 18, 2026",
    status: "confirmed",
    amount: 750,
  },
  {
    id: "BK-002",
    guest: "Sarah Johnson",
    accommodation: "Garden Suite",
    checkIn: "Dec 16, 2026",
    checkOut: "Dec 19, 2026",
    status: "pending",
    amount: 540,
  },
  {
    id: "BK-003",
    guest: "Mike Wilson",
    accommodation: "Family Villa",
    checkIn: "Dec 18, 2026",
    checkOut: "Dec 22, 2026",
    status: "confirmed",
    amount: 1600,
  },
  {
    id: "BK-004",
    guest: "Emily Davis",
    accommodation: "Deluxe Room",
    checkIn: "Dec 20, 2026",
    checkOut: "Dec 23, 2026",
    status: "checked_in",
    amount: 360,
  },
];

const statusColors = {
  pending: "warning",
  confirmed: "success",
  checked_in: "info",
  cancelled: "danger",
} as const;

export default function AdminDashboard() {
  const { formatPrice } = useCurrency();

  const stats = [
    {
      title: "Total Bookings",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      description: "This month",
    },
    {
      title: "Revenue",
      value: formatPrice(45230),
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Home,
      description: "Average this month",
    },
    {
      title: "Total Guests",
      value: "342",
      change: "-3%",
      trend: "down",
      icon: Users,
      description: "This month",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <a href="/admin/bookings" className="text-sm text-emerald-600 hover:underline">
              View All
            </a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">Booking ID</th>
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Accommodation</th>
                    <th className="pb-3 font-medium">Dates</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="text-sm">
                      <td className="py-3 font-medium text-slate-900">{booking.id}</td>
                      <td className="py-3 text-slate-600">{booking.guest}</td>
                      <td className="py-3 text-slate-600">{booking.accommodation}</td>
                      <td className="py-3 text-slate-600">
                        {booking.checkIn} - {booking.checkOut}
                      </td>
                      <td className="py-3">
                        <Badge variant={statusColors[booking.status as keyof typeof statusColors]}>
                          {booking.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        {formatPrice(booking.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Occupancy */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="/admin/bookings/new"
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">New Booking</span>
              </a>
              <a 
                href="/admin/accommodations/new"
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Home className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">Add Accommodation</span>
              </a>
              <a 
                href="/admin/reports"
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">View Reports</span>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Check-ins</span>
                <span className="font-semibold text-slate-900">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Check-outs</span>
                <span className="font-semibold text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available Rooms</span>
                <span className="font-semibold text-emerald-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Occupied</span>
                <span className="font-semibold text-slate-900">12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
