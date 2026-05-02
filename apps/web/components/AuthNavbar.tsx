"use client";

import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-sm">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5 text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Noillin
              </span>
            </Link>
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
