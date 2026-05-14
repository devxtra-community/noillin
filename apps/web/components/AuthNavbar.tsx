"use client";

import Link from "next/link";

import NoillinIcon from "./NoillinIcon";

export default function AuthNavbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-xl">
      <div className="mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-14">
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
