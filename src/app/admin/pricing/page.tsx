"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Calendar, 
  Percent,
  DollarSign,
  Edit,
  Trash2,
  Sun,
  Snowflake,
  Star,
  Clock
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

const pricingRules = [
  {
    id: "1",
    name: "Peak Season",
    type: "SEASONAL",
    description: "December - February rates",
    startDate: "2026-12-01",
    endDate: "2027-02-28",
    modifier: 25,
    isPercentage: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Weekend Rate",
    type: "WEEKEND",
    description: "Friday & Saturday nights",
    startDate: null,
    endDate: null,
    modifier: 15,
    isPercentage: true,
    isActive: true,
  },
  {
    id: "3",
    name: "Holiday Premium",
    type: "HOLIDAY",
    description: "Christmas & New Year",
    startDate: "2026-12-24",
    endDate: "2027-01-02",
    modifier: 50,
    isPercentage: true,
    isActive: true,
  },
  {
    id: "4",
    name: "Long Stay Discount",
    type: "LONG_STAY",
    description: "7+ nights booking",
    startDate: null,
    endDate: null,
    modifier: -10,
    isPercentage: true,
    isActive: true,
  },
  {
    id: "5",
    name: "Early Bird",
    type: "EARLY_BIRD",
    description: "Book 30+ days in advance",
    startDate: null,
    endDate: null,
    modifier: -5,
    isPercentage: true,
    isActive: false,
  },
  {
    id: "6",
    name: "Low Season",
    type: "SEASONAL",
    description: "June - August rates",
    startDate: "2027-06-01",
    endDate: "2027-08-31",
    modifier: -15,
    isPercentage: true,
    isActive: true,
  },
];

const accommodationPrices = [
  { id: "1", name: "Beachfront Cottage", code: "BF", basePrice: 320, type: "COTTAGE" },
  { id: "2", name: "Garden Room", code: "GR", basePrice: 120, type: "ROOM" },
  { id: "3", name: "Garden Suite", code: "GS", basePrice: 180, type: "SUITE" },
  { id: "4", name: "Poolside Bungalow", code: "PB", basePrice: 250, type: "BUNGALOW" },
  { id: "5", name: "Hillside Villa", code: "HV", basePrice: 400, type: "VILLA" },
  { id: "6", name: "Mountain Cabin", code: "HC", basePrice: 220, type: "CABIN" },
];

const typeIcons: Record<string, React.ReactNode> = {
  SEASONAL: <Sun className="w-4 h-4" />,
  WEEKEND: <Calendar className="w-4 h-4" />,
  HOLIDAY: <Star className="w-4 h-4" />,
  LONG_STAY: <Clock className="w-4 h-4" />,
  EARLY_BIRD: <Clock className="w-4 h-4" />,
  LAST_MINUTE: <Clock className="w-4 h-4" />,
};

export default function AdminPricingPage() {
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const { formatPrice, currency } = useCurrency();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Always";
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
          <h1 className="text-2xl font-bold text-slate-900">Pricing</h1>
          <p className="text-slate-600">Manage base prices and pricing rules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>

      {/* Base Prices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Base Prices
          </CardTitle>
          <CardDescription>Set the base nightly rate for each accommodation type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                  <th className="pb-3 font-medium">Accommodation</th>
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Base Price ({currency.code}/night)</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accommodationPrices.map((acc) => (
                  <tr key={acc.id} className="text-sm">
                    <td className="py-3 font-medium text-slate-900">{acc.name}</td>
                    <td className="py-3">
                      <Badge variant="default">{acc.code}</Badge>
                    </td>
                    <td className="py-3 text-slate-600">{acc.type}</td>
                    <td className="py-3">
                      {editingPrice === acc.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            defaultValue={acc.basePrice}
                            className="w-24"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setEditingPrice(null)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-medium">
                          {formatPrice(acc.basePrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingPrice(acc.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            Pricing Rules
          </CardTitle>
          <CardDescription>Dynamic pricing adjustments based on season, dates, or conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingRules.map((rule) => (
              <div 
                key={rule.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  rule.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    rule.modifier > 0 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {typeIcons[rule.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900">{rule.name}</h4>
                      <Badge variant={rule.isActive ? "success" : "default"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{rule.description}</p>
                    {(rule.startDate || rule.endDate) && (
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(rule.startDate)} - {formatDate(rule.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold ${
                    rule.modifier > 0 ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {rule.modifier > 0 ? "+" : ""}{rule.modifier}%
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fee Configuration */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cleaning Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">{formatPrice(50)}</span>
              <span className="text-slate-500">per booking</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Edit
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">10%</span>
              <span className="text-slate-500">of subtotal</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Edit
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tax Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">8%</span>
              <span className="text-slate-500">of subtotal</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Edit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
