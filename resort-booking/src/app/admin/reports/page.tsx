"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Home,
  Download
} from "lucide-react";

const monthlyData = [
  { month: "Jan", revenue: 45000, bookings: 85, occupancy: 72 },
  { month: "Feb", revenue: 52000, bookings: 92, occupancy: 78 },
  { month: "Mar", revenue: 48000, bookings: 88, occupancy: 75 },
  { month: "Apr", revenue: 61000, bookings: 105, occupancy: 82 },
  { month: "May", revenue: 58000, bookings: 98, occupancy: 80 },
  { month: "Jun", revenue: 42000, bookings: 75, occupancy: 65 },
  { month: "Jul", revenue: 38000, bookings: 68, occupancy: 58 },
  { month: "Aug", revenue: 41000, bookings: 72, occupancy: 62 },
  { month: "Sep", revenue: 55000, bookings: 95, occupancy: 78 },
];

const topAccommodations = [
  { name: "Beachfront Cottage 1", bookings: 45, revenue: 14400, occupancy: 85 },
  { name: "Hillside Villa 1", bookings: 32, revenue: 12800, occupancy: 76 },
  { name: "Poolside Bungalow 3", bookings: 38, revenue: 9500, occupancy: 72 },
  { name: "Garden Suite 1", bookings: 52, revenue: 9360, occupancy: 88 },
  { name: "Garden Room 1", bookings: 65, revenue: 7800, occupancy: 92 },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const bookingsChange = ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">Analytics and insights for your resort</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <Badge variant={parseFloat(revenueChange) >= 0 ? "success" : "danger"} className="text-xs">
                {parseFloat(revenueChange) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {revenueChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">${currentMonth.revenue.toLocaleString()}</p>
            <p className="text-sm text-slate-500">Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <Badge variant={parseFloat(bookingsChange) >= 0 ? "success" : "danger"} className="text-xs">
                {parseFloat(bookingsChange) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {bookingsChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{currentMonth.bookings}</p>
            <p className="text-sm text-slate-500">Bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{currentMonth.occupancy}%</p>
            <p className="text-sm text-slate-500">Occupancy Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">$579</p>
            <p className="text-sm text-slate-500">Avg. Booking Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>Revenue trend over the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-slate-500">{data.month}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(data.revenue / 65000) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-purple-600" />
              Occupancy Rate
            </CardTitle>
            <CardDescription>Percentage of booked nights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-slate-500">{data.month}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${data.occupancy}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {data.occupancy}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Accommodations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Accommodations</CardTitle>
          <CardDescription>Ranked by total revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                  <th className="pb-3 font-medium">Rank</th>
                  <th className="pb-3 font-medium">Accommodation</th>
                  <th className="pb-3 font-medium">Bookings</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topAccommodations.map((acc, index) => (
                  <tr key={acc.name} className="text-sm">
                    <td className="py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? "bg-amber-100 text-amber-600" :
                        index === 1 ? "bg-slate-200 text-slate-600" :
                        index === 2 ? "bg-orange-100 text-orange-600" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-900">{acc.name}</td>
                    <td className="py-3 text-slate-600">{acc.bookings}</td>
                    <td className="py-3 text-emerald-600 font-medium">${acc.revenue.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${acc.occupancy}%` }}
                          />
                        </div>
                        <span className="text-slate-600">{acc.occupancy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports for your records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Revenue Report", icon: DollarSign },
              { name: "Booking Report", icon: Calendar },
              { name: "Guest Report", icon: Users },
              { name: "Occupancy Report", icon: Home },
            ].map((report) => (
              <Button key={report.name} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <report.icon className="w-6 h-6 text-slate-600" />
                <span>{report.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
