"use client";

import { useState } from "react";
import { useCurrency, currencies } from "@/contexts/currency-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-sm text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-slate-100"
      >
        <span className="font-medium">{currency.code}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 max-h-64 overflow-y-auto">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between",
                  currency.code === c.code && "bg-emerald-50 text-emerald-600"
                )}
              >
                <span>
                  <span className="font-medium">{c.symbol}</span>
                  <span className="ml-2 text-slate-600">{c.code}</span>
                </span>
                <span className="text-xs text-slate-400">{c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
