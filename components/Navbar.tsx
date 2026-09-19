"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="h- flex justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-primary text-xl font-bold"
            >
              EventPlanner
            </Link>
          </div>
          <div
            className="
          hidden
          md:flex items-center space-x-4"
          >
            <Link
              href="/events"
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Events
            </Link>

            {session ? (
              <>
                <Link
                  href="/events/create"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Event
                </Link>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="bg-primary text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="bg-primary text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                  // href="/login"
                  onClick={() => login()}
                >
                  Sign in with Github
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-foreground hover:text-primary focus:outline-none focus:text-primary cursor-pointer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/events"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base block font-medium transition-colors"
              >
                Events
              </Link>

              <Link
                href="/events/create"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md  text-base block font-medium transition-colors"
              >
                Create Event
              </Link>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base block font-medium transition-colors"
              >
                Dashboard
              </Link>

              <div className="flex items-center space-x-2">
                <Link
                  className="bg-primary text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                  href="/login"
                >
                  Sign in with Github
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
