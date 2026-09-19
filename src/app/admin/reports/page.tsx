"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Home, Download } from "lucide-react";

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
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <Badge variant={parseFloat(revenueChange) >= 0 ? "success" : "danger"} className="text-xs">
                {parseFloat(revenueChange) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{revenueChange}%
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
                {parseFloat(bookingsChange) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{bookingsChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">{currentMonth.bookings}</p>
            <p className="text-sm text-slate-500">Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2"><Home className="w-5 h-5 text-purple-600" /></div>
            <p className="text-2xl font-bold text-slate-900">{currentMonth.occupancy}%</p>
            <p className="text-sm text-slate-500">Occupancy Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2"><Users className="w-5 h-5 text-amber-600" /></div>
            <p className="text-2xl font-bold text-slate-900">$579</p>
            <p className="text-sm text-slate-500">Avg. Booking Value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" />Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-slate-500">{data.month}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full flex items-center justify-end pr-2" style={{ width: `${(data.revenue / 65000) * 100}%` }}>
                      <span className="text-xs text-white font-medium">${(data.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-purple-600" />Occupancy Rate</CardTitle>
            <CardDescription>Percentage of booked nights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-slate-500">{data.month}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full flex items-center justify-end pr-2" style={{ width: `${data.occupancy}%` }}>
                      <span className="text-xs text-white font-medium">{data.occupancy}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
