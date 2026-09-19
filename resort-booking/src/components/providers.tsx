"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CurrencyProvider } from "@/contexts/currency-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </SessionProvider>
  );
}
