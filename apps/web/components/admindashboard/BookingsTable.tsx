import React from "react";
import Image from "next/image";
import { Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Booking {
    id: string;
    _id: string;
    brand: string;
    brandLogo?: string;
    influencer: string;
    influencerAvatar?: string;
    amount: string;
    paymentStatus: string;
    bookingStatus: string;
    createdAt: string;
}



interface BookingsTableProps {
    bookings: Booking[];
    onSelect: (booking: Booking) => void;
}

export default function BookingsTable({ bookings, onSelect }: BookingsTableProps) {
    const getPaymentStatusStyles = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "IN_ESCROW": return "bg-blue-50 text-blue-600 border-blue-100";
            case "PENDING": return "bg-orange-50 text-orange-600 border-orange-100";
            case "DISPUTED": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    const getBookingStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "SUBMITTED": return "bg-blue-50 text-blue-600 border-blue-100";
            case "NOT STARTED": return "bg-gray-50 text-gray-600 border-gray-100";
            case "REJECTED": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Influencer</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Audit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map((booking) => (
                            <tr key={booking.id} onClick={() => onSelect(booking)} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-400">
                                    {booking.id}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center p-1 flex-shrink-0">
                                            <Image unoptimized width={100} height={100} src={booking.brandLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.brand)}`} alt={booking.brand || "Brand"} className="w-full h-full object-contain brightness-0 invert"

                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    if (target.parentElement) {
                                                        target.parentElement.textContent = booking.brand[0];
                                                    }
                                                }} />
                                        </div>
                                        <span className="text-sm font-bold text-[#111827]">{booking.brand}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
                                            <Image unoptimized width={100} height={100} src={booking.influencerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.influencer)}`} alt={booking.influencer || "Influencer"} className="w-full h-full object-cover" />
                                        </div>

                                        <span className="text-sm font-bold text-gray-700">{booking.influencer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-extrabold text-[#111827]">
                                    {booking.amount}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 w-fit uppercase", getPaymentStatusStyles(booking.paymentStatus))}>
                                        {booking.paymentStatus === "COMPLETED" && <CheckCircle2 size={10} />}
                                        {(booking.paymentStatus === "PENDING" || booking.paymentStatus === "IN_ESCROW") && <Clock size={10} />}
                                        {booking.paymentStatus === "DISPUTED" && <AlertTriangle size={10} />}
                                        {booking.paymentStatus.replace("_", " ")}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold border uppercase", getBookingStatusStyles(booking.bookingStatus))}>
                                        {booking.bookingStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                    <button className="p-2 text-gray-300 hover:text-gray-900 transition-all opacity-40 group-hover:opacity-100">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold leading-none">Showing {bookings.length} entries</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Previous</button>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[11px] font-bold shadow-sm">1</button>
                    </div>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}

