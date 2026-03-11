"use client";
import React from "react";
import { FileText, MessageSquare, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export default function InvestigationView() {
    return (
        <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sticky top-28 h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#111827]">Investigation View</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Read Only</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {/* Selected Booking Card */}
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <FileText className="text-gray-400" size={24} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400">Selected Booking</p>
                            <p className="text-base font-extrabold text-[#111827]">#BK-99210</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold hover:bg-emerald-100 transition-all">
                        <MessageSquare size={14} />
                        View Chat
                    </button>
                </div>

                {/* Booking Timeline */}
                <div className="space-y-6">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking Timeline</h4>
                    <div className="space-y-6 relative ml-1.5">
                        {/* Vertical Line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

                        {/* Timeline Items */}
                        {[
                            { label: "Booking Created", date: "Oct 24, 2023 • 09:12 AM", status: "completed" },
                            { label: "Payment Secured (Escrow)", date: "Oct 24, 2023 • 09:15 AM", status: "completed" },
                            { label: "Content Submitted", date: "Oct 26, 2023 • 02:45 PM", status: "current" },
                            { label: "Awaiting Brand Approval", date: "Current Status", status: "pending" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 relative">
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center z-10",
                                    item.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" :
                                        item.status === "current" ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-100" :
                                            "bg-white border-gray-200"
                                )}>
                                    {item.status === "completed" && <CheckCircle2 size={12} />}
                                    {item.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </div>
                                <div>
                                    <p className={cn("text-xs font-bold", item.status === "pending" ? "text-gray-400" : "text-[#111827]")}>
                                        {item.label}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Confirmation */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment Confirmation</h4>
                        <ShieldCheck className="text-emerald-500" size={18} />
                    </div>
                    <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-50 space-y-4 text-[11px]">
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-400">Transaction ID</span>
                            <span className="text-[#111827]">TXN_882910042</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-400">Method</span>
                            <span className="text-[#111827]">Stripe (Visa **** 4242)</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-400">Platform Fee</span>
                            <span className="text-emerald-600">$125.00 (10%)</span>
                        </div>
                        <div className="pt-4 border-t border-emerald-100 flex justify-between items-center">
                            <span className="text-sm font-extrabold text-[#111827]">Total Paid</span>
                            <span className="text-lg font-extrabold text-[#111827] leading-none">$1,250.00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Audit Mode Footer */}
            <div className="p-4 bg-orange-50/50 border-t border-orange-100 m-4 rounded-2xl flex gap-3 align-start">
                <HelpCircle className="text-orange-400 flex-shrink-0" size={18} />
                <p className="text-[10px] text-orange-600 font-bold leading-relaxed">
                    Audit Mode Active! <span className="text-orange-400">You are viewing this record in read-only mode. To resolve disputes or issue refunds, please escalate to the Finance Department.</span>
                </p>
            </div>
        </div>
    );
}
