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
            <p>
              All reservations are subject to availability. A valid credit card is required 
              to secure your booking. By making a reservation, you agree to these terms 
              and conditions.
            </p>

            <h2>2. Check-in & Check-out</h2>
            <ul>
              <li>Check-in time: 2:00 PM (14:00)</li>
              <li>Check-out time: 11:00 AM</li>
              <li>Early check-in and late check-out may be available upon request (subject to availability and additional fees)</li>
              <li>Valid government-issued ID required at check-in</li>
            </ul>

            <h2>3. Cancellation Policy</h2>
            <ul>
              <li>Free cancellation up to 48 hours before check-in</li>
              <li>Cancellations within 48 hours: First night is non-refundable</li>
              <li>No-shows: Full booking amount is charged</li>
              <li>Peak season and holiday bookings may have different cancellation terms</li>
            </ul>

            <h2>4. Payment Terms</h2>
            <p>
              We accept major credit cards (Visa, MasterCard, American Express) and 
              bank transfers. Full payment is due at check-out unless otherwise arranged.
            </p>

            <h2>5. Guest Responsibilities</h2>
            <ul>
              <li>Guests are responsible for any damage to resort property</li>
              <li>Smoking is prohibited in all accommodations (designated areas available)</li>
              <li>Quiet hours: 10:00 PM to 7:00 AM</li>
              <li>Pets are not allowed unless in designated pet-friendly accommodations</li>
              <li>Maximum occupancy must be respected</li>
            </ul>

            <h2>6. Resort Rules</h2>
            <ul>
              <li>Pool hours: 7:00 AM to 10:00 PM</li>
              <li>Children under 12 must be supervised by an adult in pool areas</li>
              <li>No glass containers in pool or beach areas</li>
              <li>Resort wristbands must be worn at all times</li>
            </ul>

            <h2>7. Liability</h2>
            <p>
              Paradise Resort is not responsible for loss or theft of personal belongings. 
              Valuables should be stored in the in-room safe or at the front desk. 
              Guests participate in resort activities at their own risk.
            </p>

            <h2>8. Force Majeure</h2>
            <p>
              Paradise Resort shall not be liable for any failure to perform due to 
              circumstances beyond our control, including but not limited to natural 
              disasters, pandemics, or government actions.
            </p>

            <h2>9. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be 
              posted on our website and apply to bookings made after the update date.
            </p>

            <h2>10. Contact</h2>
            <p>
              For questions about these terms, please contact us at legal@paradiseresort.com 
              or call +1 (555) 123-4567.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
