import React from "react";
import Image from "next/image";
import { Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

const bookings = [
    {
        id: "#BK-99210",
        brand: "Nike Global",
        brandLogo: "https://logo.clearbit.com/nike.com",
        influencer: "Sarah Jenkins",
        influencerAvatar: "https://i.pravatar.cc/150?u=sarah",
        amount: "$1,250.00",
        paymentStatus: "PAID",
        paymentStatusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
        bookingStatus: "In Progress",
        bookingStatusColor: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        id: "#BK-88200",
        brand: "Samsung Mobile",
        brandLogo: "https://logo.clearbit.com/samsung.com",
        influencer: "Marcus Chen",
        influencerAvatar: "https://i.pravatar.cc/150?u=marcus",
        amount: "$4,800.00",
        paymentStatus: "ESCROW",
        paymentStatusColor: "bg-orange-50 text-orange-600 border-orange-100",
        bookingStatus: "Pending Approval",
        bookingStatusColor: "bg-gray-100 text-gray-600 border-gray-200",
    },
    {
        id: "#BK-99195",
        brand: "Coca-Cola",
        brandLogo: "https://logo.clearbit.com/cocacola.com",
        influencer: "Elena Rodriguez",
        influencerAvatar: "https://i.pravatar.cc/150?u=elena",
        amount: "$950.00",
        paymentStatus: "DISPUTED",
        paymentStatusColor: "bg-red-50 text-red-600 border-red-100",
        bookingStatus: "On Hold",
        bookingStatusColor: "bg-red-50 text-red-600 border-red-100",
    },
];

export default function BookingsTable() {
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
                            <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-400">
                                    {booking.id}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center p-1 flex-shrink-0">
                                            <Image unoptimized width={100} height={100} src={booking.brandLogo} alt={booking.brand} className="w-full h-full object-contain brightness-0 invert"
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
                                            <Image unoptimized width={100} height={100} src={booking.influencerAvatar} alt={booking.influencer} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{booking.influencer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-extrabold text-[#111827]">
                                    {booking.amount}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 w-fit", booking.paymentStatusColor)}>
                                        {booking.paymentStatus === "PAID" && <CheckCircle2 size={10} />}
                                        {booking.paymentStatus === "ESCROW" && <Clock size={10} />}
                                        {booking.paymentStatus === "DISPUTED" && <AlertTriangle size={10} />}
                                        {booking.paymentStatus}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold border", booking.bookingStatusColor)}>
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
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold leading-none">Showing 1 to 10 of 1,284 entries</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Previous</button>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[11px] font-bold shadow-sm">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all text-[#111827] text-[11px] font-bold">2</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all text-[#111827] text-[11px] font-bold">3</button>
                    </div>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}
