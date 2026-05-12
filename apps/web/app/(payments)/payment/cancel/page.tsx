"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle, ShieldAlert } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-300">

                {/* ❌ Cancel Icon */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                        <XCircle className="text-white w-7 h-7 stroke-[2.5]" />
                    </div>
                </div>

                <h1 className="text-gray-900 text-2xl font-bold mb-4 tracking-tight">Payment Cancelled</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto">
                    No worries! You haven&apos;t been charged. You can return to the chat to continue your negotiation or try again later.
                </p>

                {/* 🔘 Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/brand-dashboard/messages"
                        className="w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Return to Chat
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-white hover:bg-gray-50 text-gray-500 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* 🛡️ Secure Note */}
                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 opacity-50">
                    <ShieldAlert className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your payment info is never stored</span>
                </div>
            </div>
        </div>
    );
}
