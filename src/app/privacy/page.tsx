import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-emerald-100">Last updated: September 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a reservation, or contact us for support.</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Billing and payment information</li>
              <li>Booking preferences and special requests</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage your reservations</li>
              <li>Send booking confirmations and updates</li>
              <li>Improve our services and customer experience</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access.</p>

            <h2>4. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@paradiseresort.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
