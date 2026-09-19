"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What are the check-in and check-out times?",
    answer: "Check-in is at 2:00 PM (14:00) and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and additional fees."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Free cancellation is available up to 48 hours before your check-in date. Cancellations within 48 hours will be charged for the first night. No-shows will be charged the full booking amount."
  },
  {
    question: "Is parking available?",
    answer: "Yes, we offer complimentary parking for all guests. Our parking area is secure and monitored 24/7."
  },
  {
    question: "Do you allow pets?",
    answer: "Pets are only allowed in our designated pet-friendly accommodations. Please contact us before booking if you plan to bring a pet. Additional fees may apply."
  },
  {
    question: "What amenities are included?",
    answer: "All accommodations include free WiFi, air conditioning, daily housekeeping, access to the pool and fitness center, and complimentary breakfast."
  },
  {
    question: "How do I make a special request?",
    answer: "You can add special requests during the booking process or contact our front desk at any time. We'll do our best to accommodate your needs."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. Payment is due at check-out unless otherwise arranged."
  },
  {
    question: "Is there a minimum stay requirement?",
    answer: "Minimum stay requirements may apply during peak seasons and holidays. Please check the booking page for specific dates."
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4">
          <p className="text-slate-600">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">Find answers to common questions about your stay at Paradise Resort.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <a href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">Contact our support team →</a>
        </div>
      </div>
    </div>
  );
}
