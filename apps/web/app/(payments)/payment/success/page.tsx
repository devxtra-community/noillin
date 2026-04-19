"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* 🧾 The Receipt Modal (Image 1 Style) */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="p-8 sm:p-12 text-center">
          {/* ✅ Success Icon (Image 1 Style) */}
          <div className="w-20 h-20 bg-[#F1F9F5] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-14 h-14 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                <Check className="text-white w-8 h-8 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-[#4CAF50] text-3xl font-medium mb-12">Payment successful</h1>

          {/* 📋 Data Table (Exactly like Image 1) */}
          <div className="space-y-5 text-left max-w-sm mx-auto mb-16">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Payment type</span>
              <span className="text-gray-800 font-semibold">Net banking</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Bank</span>
              <span className="text-gray-800 font-semibold uppercase">HDFC</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Mobile</span>
              <span className="text-gray-800 font-semibold">8897131444</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Email</span>
              <span className="text-gray-800 font-semibold">sudheerreddy.ui@gmail.com</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100">
              <span className="text-base font-bold text-gray-700 uppercase tracking-tight">Amount paid</span>
              <span className="text-xl font-black text-gray-900">500.00</span>
            </div>

            <div className="flex justify-between items-center text-sm mt-3">
              <span className="text-gray-500 font-medium tracking-tight">Transaction id</span>
              <span className="text-gray-600 font-bold font-mono">125478965698</span>
            </div>
          </div>

          {/* 🔘 Action Buttons (Blue Style from Image 1) */}
          <div className="flex gap-3 justify-center">
            <button className="flex-1 bg-[#2196F3] hover:bg-[#1E88E5] text-white py-3.5 px-6 rounded-md font-bold uppercase text-[13px] tracking-widest transition-all">
              Print
            </button>
            <Link href="/gig-list" className="flex-1 bg-[#2196F3] hover:bg-[#1E88E5] text-white py-3.5 px-6 rounded-md font-bold uppercase text-[13px] tracking-widest transition-all text-center">
              Close
            </Link>
          </div>
        </div>

        {/* 🛡️ Trust Footer */}
        <div className="bg-gray-50 py-4 border-t border-gray-100 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Verified Secure Escrow Transaction</span>
        </div>
      </div>

    </div>
  );
}
