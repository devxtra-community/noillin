"use client";
import React from "react";
import { FileText, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

import { Booking } from "./BookingsTable";

import { cn } from "@/lib/utils";

export default function InvestigationView({ booking }: { booking: Booking | null }) {

    if (!booking) {
        return (
            <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-140px)]">
                <HelpCircle size={48} className="text-gray-200 mb-4" />
                <h3 className="text-sm font-bold text-gray-900">No Booking Selected</h3>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">Select a booking from the list to view audit details.</p>
            </div>
        );
    }

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
                            <p className="text-base font-extrabold text-[#111827]">{booking.id}</p>
                        </div>
                    </div>
                </div>

                {/* Booking Timeline Mock (Since we don't have full history yet) */}
                <div className="space-y-6">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking Timeline</h4>
                    <div className="space-y-6 relative ml-1.5">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

                        <div className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full border-2 bg-emerald-500 border-emerald-500 text-white flex items-center justify-center z-10">
                                <CheckCircle2 size={12} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#111827]">Booking Created</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{new Date(booking.createdAt).toLocaleDateString()} • {new Date(booking.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative">
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center z-10",
                                booking.paymentStatus !== "PENDING" ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200"
                            )}>
                                {booking.paymentStatus !== "PENDING" ? <CheckCircle2 size={12} /> : null}
                            </div>
                            <div>
                                <p className={cn("text-xs font-bold", booking.paymentStatus === "PENDING" ? "text-gray-400" : "text-[#111827]")}>Payment Secured</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{booking.paymentStatus !== "PENDING" ? "Completed" : "Awaiting Transaction"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment Details</h4>
                        <ShieldCheck className="text-emerald-500" size={18} />
                    </div>
                    <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-50 space-y-4 text-[11px]">
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-400">Total Amount</span>
                            <span className="text-[#111827]">{booking.amount}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-400">Status</span>
                            <span className="text-emerald-600 uppercase">{booking.paymentStatus}</span>
                        </div>
                        <div className="pt-4 border-t border-emerald-100 flex justify-between items-center">
                            <span className="text-sm font-extrabold text-[#111827]">Escrow Balance</span>
                            <span className="text-lg font-extrabold text-[#111827] leading-none">{booking.paymentStatus === "IN_ESCROW" ? booking.amount : "$0.00"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Audit Mode Footer */}
            <div className="p-4 bg-orange-50/50 border-t border-orange-100 m-4 rounded-2xl flex gap-3 align-start">
                <HelpCircle className="text-orange-400 flex-shrink-0" size={18} />
                <p className="text-[10px] text-orange-600 font-bold leading-relaxed">
                    Audit Mode Active! <span className="text-orange-400">Read-only view. No modifications permitted.</span>
                </p>
            </div>
        </div>
    );
}
