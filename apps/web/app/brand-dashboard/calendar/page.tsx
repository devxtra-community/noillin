"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, ChevronRight as ChevronIcon, Calendar as CalendarIcon, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";

interface Order {
    _id: string;
    amount: number;
    platformFee: number;
    influencerAmount: number;
    status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    escrowStatus: "HOLD" | "RELEASED";
    payoutStatus: "HOLD" | "AVAILABLE" | "PROCESSING" | "PAID";
    createdAt: string;
    dueDate?: string;
    gigId: {
        title: string;
        description?: string;
    };
    influencerId: {
        _id: string;
        fullName?: string;
        name?: string;
        profileImage?: string;
        profileImageUrl?: string;
    };
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case "COMPLETED": return "Completed";
        case "IN_ESCROW": return "Securely Booked";
        case "PENDING": return "Payment Pending";
        case "DISPUTED": return "Disputed";
        case "CANCELLED": return "Cancelled";
        default: return status;
    }
};

const getStatusStyles = (status: string) => {
    switch (status) {
        case "COMPLETED": return "text-emerald-500 font-bold";
        case "IN_ESCROW": return "text-blue-500 font-bold";
        case "PENDING": return "text-orange-500 font-bold uppercase tracking-widest";
        default: return "text-gray-400 font-bold";
    }
};

export default function BrandCalendarPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    const router = useRouter();

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/orders/history");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch brand calendar data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendarData();
    }, []);

    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
        const day = i + 1;
        const hasEvent = orders.some(o => {
            if (!o.dueDate) return false;
            const d = new Date(o.dueDate);
            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        });
        return { day, hasEvent };
    });

    const gigsDueToday = orders.filter(o => {
        if (!o.dueDate) return false;
        const d = new Date(o.dueDate);
        return d.getDate() === selectedDate && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    if (loading) {
        return (
            <div className="h-[80vh] w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col min-h-0 bg-[#f8fafc]">
            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Left Column: Calendar Grid */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col items-center">
                    <div className="w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Select Date</h1>
                            <div className="flex items-center gap-6">
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-bold text-gray-900">{currentMonthLabel}</span>
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-4 mb-8 w-full">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-10 gap-x-4 mb-16 w-full">
                            {Array.from({ length: firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-14"></div>
                            ))}

                            {days.map((date) => (
                                <div key={date.day} className="h-14 flex flex-col items-center justify-center relative">
                                    <button
                                        onClick={() => setSelectedDate(date.day)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-[15px] font-bold transition-all relative z-10 ${selectedDate === date.day
                                            ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-110"
                                            : "text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {date.day}
                                        {date.hasEvent && selectedDate !== date.day && (
                                            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        )}
                                        {date.hasEvent && selectedDate === date.day && (
                                            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center border-t border-gray-50 pt-8">
                            <button className="text-xs font-bold text-gray-400 hover:text-emerald-500 transition-colors uppercase tracking-widest">
                                View All Gigs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Day Schedule */}
                <div className="lg:w-[450px] flex flex-col">
                    <div className="mb-6 pl-2">
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Expected Delivery</span>
                        <h2 className="text-3xl font-black text-gray-900 mt-2">{monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}</h2>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 pb-8 flex-1">
                        {gigsDueToday.length > 0 ? gigsDueToday.map((gig) => (
                            <button
                                key={gig._id}
                                onClick={() => router.push(`/brand-dashboard/bookings?orderId=${gig._id}`)}
                                className="w-full group bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all cursor-pointer flex items-center text-left gap-4"
                            >
                                <div className="w-14 h-14 rounded-[20px] bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
                                    {gig.influencerId?.profileImageUrl || gig.influencerId?.profileImage ? (
                                        <img src={gig.influencerId.profileImageUrl || gig.influencerId.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Globe className="w-6 h-6 text-emerald-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[16px] font-bold text-gray-900 truncate tracking-tight">{gig.gigId?.title || "Gig Details"}</h3>
                                    <p className="text-[12px] font-bold text-gray-400 truncate tracking-wide mt-0.5">{gig.influencerId?.fullName || gig.influencerId?.name || "Influencer"}</p>
                                    <div className="flex items-center gap-1.5 mt-2.5">
                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className={`text-[11px] uppercase tracking-widest ${getStatusStyles(gig.status)}`}>{getStatusLabel(gig.status)}</span>
                                    </div>
                                </div>
                                <div className="p-2 rounded-full text-gray-300 group-hover:text-emerald-500 transition-colors">
                                    <ChevronIcon className="w-5 h-5" />
                                </div>
                            </button>
                        )) : (
                            <div className="mt-20 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                <CalendarIcon className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Deliverables Today</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
