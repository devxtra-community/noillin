"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as ChevronIcon, Youtube, Video, Music, Globe, Calendar as CalendarIcon, Clock } from "lucide-react";

interface Gig {
    id: number;
    title: string;
    description: string;
    time: string;
    platform: string;
    platformIcon: React.ReactNode;
    color: string;
}

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(15);
    const [currentMonth] = useState("May 2024");

    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Simplified May 2024 calendar data
    const days = [
        { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 },
        { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, hasEvent: true }, { day: 9 }, { day: 10 }, { day: 11 },
        { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, hasEvent: true, isToday: true }, { day: 16 }, { day: 17 }, { day: 18, hasEvent: true },
        { day: 19 }, { day: 20 }, { day: 21 }, { day: 22, hasEvent: true }, { day: 23 }, { day: 24 }, { day: 25, hasEvent: true },
        { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }
    ];

    const gigsDueToday: Gig[] = [
        {
            id: 1,
            title: "IG Reel Promotion",
            description: "Beauty & Wellness • Video Content",
            time: "10:00 AM",
            platform: "Instagram",
            platformIcon: <Video className="w-5 h-5 text-rose-500" />,
            color: "bg-rose-50"
        },
        {
            id: 2,
            title: "TikTok Ad Campaign",
            description: "Food & Beverage • Short Form",
            time: "02:30 PM",
            platform: "TikTok",
            platformIcon: <Music className="w-5 h-5 text-gray-800" />,
            color: "bg-gray-100"
        },
        {
            id: 3,
            title: "YouTube Review",
            description: "Electronics • Long Form",
            time: "05:00 PM",
            platform: "YouTube",
            platformIcon: <Youtube className="w-5 h-5 text-red-600" />,
            color: "bg-red-50"
        }
    ];

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
                            <span className="text-md font-bold text-gray-900">{currentMonth}</span>
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
                            {/* Empty spacing for May 2024 (starts on Wednesday) */}
                            <div className="h-12"></div>
                            <div className="h-12"></div>
                            <div className="h-12"></div>

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
                        <h2 className="text-3xl font-black text-gray-900 mt-2">May {selectedDate}, 2024</h2>
                    </div>

                    <div className="space-y-4">
                        {gigsDueToday.map((gig) => (
                            <button
                                key={gig.id}
                                className="w-full bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-5 hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all group text-left"
                            >
                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${gig.color}`}>
                                    {gig.platformIcon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-[16px] text-gray-900 truncate tracking-tight">{gig.title}</h3>
                                    </div>
                                    <p className="text-[12px] font-bold text-gray-400 truncate tracking-wide">{gig.description}</p>
                                    <div className="flex items-center gap-1.5 mt-2.5">
                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[12px] font-black text-emerald-600">{gig.time}</span>
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
