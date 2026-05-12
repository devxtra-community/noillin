"use client";

import Link from "next/link";

import NoillinIcon from "./NoillinIcon";

export default function AuthNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <NoillinIcon />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-gray-500 font-medium">New to Noillin?</span>
            <Link
              href="/signup"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
