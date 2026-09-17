"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Shield, 
  ChevronLeft,
  Check
} from "lucide-react";
import { formatCurrency, formatDate, calculateNights, generateBookingNumber } from "@/lib/utils";

const accommodationsData: Record<string, {
  id: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  image: string;
}> = {
  "ocean-view-cottage": {
    id: "1",
    name: "Ocean View Cottage",
    type: "COTTAGE",
    price: 250,
    maxGuests: 4,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop",
  },
  "garden-suite": {
    id: "2",
    name: "Garden Suite",
    type: "SUITE",
    price: 180,
    maxGuests: 2,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  },
  "family-villa": {
    id: "3",
    name: "Family Villa",
    type: "VILLA",
    price: 400,
    maxGuests: 8,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  },
};

function BookingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const accommodationSlug = searchParams.get("accommodation") || "";
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "1";

  const accommodation = accommodationsData[accommodationSlug];

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: session?.user?.name || "",
    guestEmail: session?.user?.email || "",
    guestPhone: "",
    specialRequests: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        guestName: session.user.name || "",
        guestEmail: session.user.email || "",
      }));
    }
  }, [session]);

  if (!accommodation || !checkInParam || !checkOutParam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Invalid Booking</h1>
          <p className="text-slate-600 mb-4">Please select an accommodation and dates first.</p>
          <Link href="/accommodations">
            <Button>Browse Accommodations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const checkIn = new Date(checkInParam);
  const checkOut = new Date(checkOutParam);
  const guests = parseInt(guestsParam);
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = nights * accommodation.price;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee + taxes;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingNumber = generateBookingNumber();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push(`/booking/confirmation?bookingNumber=${bookingNumber}`);
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link 
            href={`/accommodations/${accommodationSlug}?checkIn=${checkInParam}&checkOut=${checkOutParam}&guests=${guests}`}
            className="inline-flex items-center text-slate-600 hover:text-emerald-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to accommodation
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Complete Your Booking</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= s 
                    ? "bg-emerald-600 text-white" 
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`ml-2 text-sm ${step >= s ? "text-slate-900" : "text-slate-500"}`}>
                {s === 1 ? "Guest Details" : s === 2 ? "Payment" : "Confirm"}
              </span>
              {s < 3 && <div className={`w-16 h-0.5 mx-4 ${step > s ? "bg-emerald-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Guest Details */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>Guest Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      id="guestName"
                      name="guestName"
                      label="Full Name"
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      id="guestEmail"
                      name="guestEmail"
                      label="Email"
                      type="email"
                      value={formData.guestEmail}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                    <Input
                      id="guestPhone"
                      name="guestPhone"
                      label="Phone Number"
                      type="tel"
                      value={formData.guestPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                    <Button 
                      type="button" 
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span>Payment Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                    
                    <Input
                      id="cardName"
                      name="cardName"
                      label="Name on Card"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        label="Expiry Date"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        label="CVC"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1"
                        onClick={() => setStep(3)}
                      >
                        Review Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>Review & Confirm</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-900">Guest Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Name:</span>
                          <p className="font-medium">{formData.guestName}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Email:</span>
                          <p className="font-medium">{formData.guestEmail}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Phone:</span>
                          <p className="font-medium">{formData.guestPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 space-y-4">
                      <h3 className="font-medium text-slate-900">Payment Method</h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <span>Card ending in {formData.cardNumber.slice(-4) || "****"}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="font-medium text-slate-900 mb-2">Cancellation Policy</h3>
                      <p className="text-sm text-slate-600">
                        Free cancellation up to 48 hours before check-in. After that, the first night 
                        is non-refundable.
                      </p>
                    </div>

                    <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="rounded border-slate-300 mt-1"
                        required 
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-emerald-600 hover:underline">
                          Terms of Service
                        </Link>,{" "}
                        <Link href="/cancellation" className="text-emerald-600 hover:underline">
                          Cancellation Policy
                        </Link>, and{" "}
                        <Link href="/privacy" className="text-emerald-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        isLoading={isLoading}
                      >
                        Confirm & Pay {formatCurrency(total)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <div className="flex space-x-4 p-4 border-b border-slate-200">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-24 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <Badge variant="success" className="mb-1">{accommodation.type}</Badge>
                    <h3 className="font-semibold text-slate-900">{accommodation.name}</h3>
                    <p className="text-sm text-slate-500">Paradise Resort</p>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <h3 className="font-semibold text-slate-900">Your Trip</h3>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Dates</p>
                      <p className="text-sm text-slate-600">
                        {formatDate(checkIn)} - {formatDate(checkOut)}
                      </p>
                      <p className="text-sm text-slate-500">{nights} nights</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Guests</p>
                      <p className="text-sm text-slate-600">{guests} {guests === 1 ? "guest" : "guests"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 space-y-3">
                  <h3 className="font-semibold text-slate-900">Price Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {formatCurrency(accommodation.price)} x {nights} nights
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Cleaning fee</span>
                    <span>{formatCurrency(cleaningFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Service fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Taxes</span>
                    <span>{formatCurrency(taxes)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingForm />
    </Suspense>
  );
}
