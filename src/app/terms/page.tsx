import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-emerald-100">Last updated: September 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Reservation & Booking</h2>
            <p>All reservations are subject to availability. A valid credit card is required to secure your booking.</p>

            <h2>2. Check-in & Check-out</h2>
            <ul>
              <li>Check-in time: 2:00 PM (14:00)</li>
              <li>Check-out time: 11:00 AM</li>
              <li>Valid government-issued ID required at check-in</li>
            </ul>

            <h2>3. Cancellation Policy</h2>
            <ul>
              <li>Free cancellation up to 48 hours before check-in</li>
              <li>Cancellations within 48 hours: First night is non-refundable</li>
              <li>No-shows: Full booking amount is charged</li>
            </ul>

            <h2>4. Guest Responsibilities</h2>
            <ul>
              <li>Guests are responsible for any damage to resort property</li>
              <li>Smoking is prohibited in all accommodations</li>
              <li>Quiet hours: 10:00 PM to 7:00 AM</li>
            </ul>

            <h2>5. Contact</h2>
            <p>For questions about these terms, please contact us at legal@paradiseresort.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
