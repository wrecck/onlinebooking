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
            <p>
              We collect information you provide directly to us, such as when you create 
              an account, make a reservation, or contact us for support. This may include:
            </p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Billing and payment information</li>
              <li>Booking preferences and special requests</li>
              <li>Communication history with our staff</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage your reservations</li>
              <li>Send booking confirmations and updates</li>
              <li>Improve our services and customer experience</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send promotional offers (with your consent)</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to 
              third parties without your consent, except as necessary to:
            </p>
            <ul>
              <li>Process payments through secure payment providers</li>
              <li>Comply with legal requirements</li>
              <li>Protect our rights and property</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or 
              destruction. All payment information is encrypted using SSL technology.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience, remember 
              your preferences, and analyze site traffic. You can control cookie 
              settings through your browser preferences.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, 
              please contact us at privacy@paradiseresort.com or call +1 (555) 123-4567.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
