"use client";

import React from "react";
import Link from "next/link";

import NoillinIcon from "./NoillinIcon";

export default function Footer() {
  return (
    <footer className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1 space-y-6">
            <NoillinIcon />
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              The world&apos;s most advanced infrastructure for professional brand-creator collaborations.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="/gig-list" className="hover:text-emerald-500 transition-colors">Explore Gigs</Link></li>
              <li><Link href="/signup" className="hover:text-emerald-500 transition-colors">Register Brand</Link></li>
              <li><Link href="/signup?role=INFLUENCER" className="hover:text-emerald-500 transition-colors">Join as Creator</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Status</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Noillin Inc. Crafted for the future.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-base">🔒</span> SECURE PAYMENTS
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-base">✔</span> VERIFIED CREATORS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
