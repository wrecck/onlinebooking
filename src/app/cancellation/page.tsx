import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cancellation Policy</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">Understanding our flexible cancellation options.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Free Cancellation</h3>
              <p className="text-sm text-slate-600">Cancel up to 48 hours before check-in for a full refund</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Late Cancellation</h3>
              <p className="text-sm text-slate-600">Within 48 hours: first night charged, rest refunded</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">No-Show</h3>
              <p className="text-sm text-slate-600">Full booking amount will be charged</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Detailed Cancellation Terms
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Standard Bookings</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Free cancellation up to 48 hours before check-in (2:00 PM local time)</li>
                  <li>Cancellation within 48 hours: First night is non-refundable</li>
                  <li>No-show: 100% of booking amount charged</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Peak Season & Holidays</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Free cancellation up to 7 days before check-in</li>
                  <li>Cancellation within 7 days: 50% of total amount charged</li>
                  <li>Cancellation within 48 hours: Full amount charged</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Special Promotions & Non-Refundable Rates</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Non-refundable bookings cannot be cancelled for a refund</li>
                  <li>Date changes may be possible subject to availability</li>
                  <li>Contact us directly for special circumstances</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How to Cancel</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Log in to your account and go to &quot;My Bookings&quot;</li>
                  <li>Select the booking you wish to cancel</li>
                  <li>Click &quot;Cancel Booking&quot; and confirm</li>
                  <li>You&apos;ll receive a confirmation email with refund details</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Refund Processing</h3>
                <p className="text-slate-600">
                  Refunds are processed within 5-10 business days. The refund will be credited to the original payment method used during booking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">Need to modify or cancel a booking?</p>
          <div className="flex justify-center gap-4">
            <Link href="/account/bookings">
              <Button>My Bookings</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
