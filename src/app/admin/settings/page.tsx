"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  Clock, 
  DollarSign,
  Save,
  Check
} from "lucide-react";
import { currencies } from "@/contexts/currency-context";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    resortName: "Paradise Resort",
    email: "info@paradiseresort.com",
    phone: "+1 (555) 123-4567",
    address: "123 Paradise Lane, Beach City, PC 12345",
    website: "https://paradiseresort.com",
    defaultCurrency: "USD",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    taxRate: "8",
    cleaningFee: "50",
    serviceFeePercent: "10",
    cancellationHours: "48",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    // In production, this would save to the database
    console.log("Saving settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your resort configuration</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              General Information
            </CardTitle>
            <CardDescription>Basic resort details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Resort Name
              </label>
              <Input
                name="resortName"
                value={settings.resortName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <Input
                name="phone"
                value={settings.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <Input
                name="address"
                value={settings.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website
              </label>
              <Input
                name="website"
                value={settings.website}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Currency & Pricing
            </CardTitle>
            <CardDescription>Configure currency and fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Default Currency
              </label>
              <select
                name="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Guests can still change currency on the website
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tax Rate (%)
              </label>
              <Input
                name="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cleaning Fee (USD)
              </label>
              <Input
                name="cleaningFee"
                type="number"
                value={settings.cleaningFee}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service Fee (%)
              </label>
              <Input
                name="serviceFeePercent"
                type="number"
                value={settings.serviceFeePercent}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-in/out Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Check-in & Check-out
            </CardTitle>
            <CardDescription>Set default times</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Check-in Time
              </label>
              <Input
                name="checkInTime"
                type="time"
                value={settings.checkInTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Check-out Time
              </label>
              <Input
                name="checkOutTime"
                type="time"
                value={settings.checkOutTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Free Cancellation Window (hours before check-in)
              </label>
              <Input
                name="cancellationHours"
                type="number"
                value={settings.cancellationHours}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supported Currencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Supported Currencies
            </CardTitle>
            <CardDescription>Currencies available for guests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currencies.map((c) => (
                <Badge 
                  key={c.code} 
                  variant={c.code === settings.defaultCurrency ? "success" : "default"}
                  className="text-sm py-1 px-3"
                >
                  {c.symbol} {c.code}
                  {c.code === settings.defaultCurrency && " (Default)"}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Exchange rates are updated automatically. Base prices are stored in USD.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
