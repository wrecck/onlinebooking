"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
};

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", rate: 56.50 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.50 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  { code: "THB", symbol: "฿", name: "Thai Baht", rate: 35.50 },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rate: 4.47 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);

  useEffect(() => {
    // First check for user's saved currency preference
    const userCurrency = localStorage.getItem("resort-currency");
    if (userCurrency) {
      const found = currencies.find(c => c.code === userCurrency);
      if (found) {
        setCurrencyState(found);
        return;
      }
    }
    
    // If no user preference, check admin's default currency setting
    const adminSettings = localStorage.getItem("resort-admin-settings");
    if (adminSettings) {
      try {
        const settings = JSON.parse(adminSettings);
        if (settings.defaultCurrency) {
          const found = currencies.find(c => c.code === settings.defaultCurrency);
          if (found) {
            setCurrencyState(found);
            // Also save as user preference so it persists
            localStorage.setItem("resort-currency", found.code);
          }
        }
      } catch (e) {
        console.error("Failed to parse admin settings:", e);
      }
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("resort-currency", newCurrency.code);
  };

  const convertPrice = (amountInUSD: number): number => {
    return Math.round(amountInUSD * currency.rate * 100) / 100;
  };

  const formatPrice = (amountInUSD: number): string => {
    const converted = convertPrice(amountInUSD);
    
    // Format based on currency
    if (currency.code === "JPY") {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${currency.symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
