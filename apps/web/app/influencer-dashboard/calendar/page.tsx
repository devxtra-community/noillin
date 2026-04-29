"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as ChevronIcon, Globe, Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";

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
}



export default function CalendarPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/orders/history");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch calendar data:", error);
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
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1500px] mx-auto w-full h-full flex flex-col">
            <div className="flex flex-col xl:flex-row gap-8 flex-1">

                {/* Left Section: Calendar */}
                <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Select Date</h1>
                        <div className="flex items-center gap-6">
                            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-md font-bold text-gray-900">{currentMonthLabel}</span>
                            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="grid grid-cols-7 gap-4 mb-8">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-[11px] font-bold text-gray-400 tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-10 gap-x-4">
                            {Array.from({ length: firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-12"></div>
                            ))}

                            {days.map((d) => (
                                <div key={d.day} className="flex flex-col items-center group relative">
                                    <button
                                        onClick={() => setSelectedDate(d.day)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-[15px] font-bold transition-all relative z-10 ${selectedDate === d.day
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110"
                                            : "text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {d.day}
                                        {d.hasEvent && selectedDate !== d.day && (
                                            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        )}
                                        {d.hasEvent && selectedDate === d.day && (
                                            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-10">
                        <button className="w-full py-4 border border-gray-100 rounded-[20px] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all hover:text-gray-900">
                            View All Gigs
                        </button>
                    </div>
                </div>

                {/* Right Section: Gigs Due */}
                <div className="xl:w-[450px] shrink-0 flex flex-col py-4">
                    <div className="mb-10 pl-2">
                        <span className="text-[11px] font-extrabold text-emerald-500 uppercase tracking-[0.2em]">Due Today</span>
                        <h2 className="text-3xl font-black text-gray-900 mt-2">{monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}</h2>
                    </div>

                    <div className="space-y-4">
                        {gigsDueToday.map((gig) => (
                            <button
                                key={gig._id}
                                className="w-full bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-5 hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all group text-left"
                            >
                                <div className="w-14 h-14 rounded-[20px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-[16px] text-gray-900 truncate tracking-tight">{gig.gigId?.title}</h3>
                                    </div>
                                    <p className="text-[12px] font-bold text-gray-400 truncate tracking-wide">{gig.status}</p>
                                    <div className="flex items-center gap-1.5 mt-2.5">
                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[12px] font-black text-emerald-600">₹{gig.influencerAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="p-2 rounded-full text-gray-300 group-hover:text-emerald-500 transition-colors">
                                    <ChevronIcon className="w-5 h-5" />
                                </div>
                            </button>
                        ))}

                        {/* Empty State Illustration would go here if no gigs */}
                    </div>

                    <div className="mt-8 flex-1 flex items-center justify-center opacity-30 grayscale pointer-events-none select-none">
                        {/* Placeholder for visual balance */}
                        <div className="flex flex-col items-center">
                            <CalendarIcon className="w-20 h-20 text-gray-200 mb-4" />
                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">No more tasks for today</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
