"use client";

import Link from "next/link";

export default function SetupFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#10B981] rounded flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-3.5 w-3.5 text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Noillin</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The premium platform for creators and brands to collaborate and grow together.
            </p>
          </div>

          {/* Help Column */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:justify-items-end">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Setup Guide</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {currentYear} Noillin Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
