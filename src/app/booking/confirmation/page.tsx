"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Download, 
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get("bookingNumber") || "BK-XXXXX";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-slate-600">
          Your reservation has been successfully completed.
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-500">Booking Reference</p>
              <p className="text-2xl font-bold text-emerald-600">{bookingNumber}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="space-y-6">
            {/* Accommodation */}
            <div className="flex space-x-4">
              <img
                src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=200&h=150&fit=crop"
                alt="Ocean View Cottage"
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-slate-900">Ocean View Cottage</h3>
                <p className="text-sm text-slate-500">Paradise Resort, Beach City</p>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Check-in</p>
                  <p className="font-medium text-slate-900">Fri, Dec 15, 2026</p>
                  <p className="text-sm text-slate-500">From 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Check-out</p>
                  <p className="font-medium text-slate-900">Sun, Dec 17, 2026</p>
                  <p className="text-sm text-slate-500">By 11:00 AM</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium text-slate-900">123 Paradise Lane, Beach City, PC 12345</p>
                <Link href="#" className="text-sm text-emerald-600 hover:underline">
                  Get Directions
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">What&apos;s Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Check your email</p>
                <p className="text-sm text-slate-600">
                  We&apos;ve sent a confirmation email with all the details of your booking.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Contact us if you need anything</p>
                <p className="text-sm text-slate-600">
                  Have questions? Our team is available 24/7 at +1 (555) 123-4567.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Need Help?</h2>
          <p className="text-slate-600 mb-4">
            If you have any questions about your booking, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+15551234567" className="flex items-center space-x-2 text-emerald-600 hover:underline">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </a>
            <a href="mailto:bookings@resort.com" className="flex items-center space-x-2 text-emerald-600 hover:underline">
              <Mail className="w-4 h-4" />
              <span>bookings@resort.com</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/account/bookings" className="flex-1">
          <Button variant="outline" className="w-full">
            View My Bookings
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full">
            Back to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
