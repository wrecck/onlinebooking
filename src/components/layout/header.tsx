"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Resort</span>
            </Link>

            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link
                href="/accommodations"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Accommodations
              </Link>
              <Link
                href="/about"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account/bookings"
                  className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>
                {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : null}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700">{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Book Now</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/accommodations"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accommodations
              </Link>
              <Link
                href="/about"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {session ? (
                <>
                  <Link
                    href="/account/bookings"
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? (
                    <Link
                      href="/admin"
                      className="text-slate-600 hover:text-emerald-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    onClick={() => signOut()}
                    className="text-left text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
