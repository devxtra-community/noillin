"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const calendarDays = [
    { day: 1, type: "default" }, { day: 2, type: "default" }, { day: 3, type: "default" }, { day: 4, type: "default" },
    { day: 5, type: "default" }, { day: 6, type: "default" }, { day: 7, type: "default" }, { day: 8, type: "default" },
    { day: 9, type: "default" }, { day: 10, type: "has-event" }, { day: 11, type: "default" }, { day: 12, type: "default" },
    { day: 13, type: "default" }, { day: 14, type: "default" }, { day: 15, type: "selected" }, { day: 16, type: "default" },
    { day: 17, type: "default" }, { day: 18, type: "default" }, { day: 19, type: "default" }, { day: 20, type: "default" },
    { day: 21, type: "default" }, { day: 22, type: "has-event" }, { day: 23, type: "default" }, { day: 24, type: "default" },
    { day: 25, type: "default" }, { day: 26, type: "default" }, { day: 27, type: "default" }, { day: 28, type: "default" },
    { day: 29, type: "default" }, { day: 30, type: "default" }, { day: 31, type: "default" }
];

const events = [
    {
        id: 1,
        influencer: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        gigName: "IG Reel Promotion",
        time: "10:00 AM",
        status: "Active"
    },
    {
        id: 2,
        influencer: "Marcus Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        gigName: "TikTok Ad Campaign",
        time: "02:30 PM",
        status: "Active"
    },
    {
        id: 3,
        influencer: "Elena",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        gigName: "YouTube Review",
        time: "05:00 PM",
        status: "Active"
    }
];

export default function BrandCalendarPage() {
    const [selectedDay, setSelectedDay] = useState(15);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col min-h-0 bg-[#f8fafc]">
            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Left Column: Calendar Grid */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col items-center">
                    <div className="w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-2xl font-bold text-gray-900">Select Date</h1>
                            <div className="flex items-center gap-8">
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                                </button>
                                <span className="text-lg font-bold text-gray-900">May 2024</span>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-12 gap-x-4 mb-16">
                            {days.map((day) => (
                                <div key={day} className="text-center text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">
                                    {day}
                                </div>
                            ))}
                            {/* Padding for May 2024 starting on Wednesday */}
                            <div className="h-20"></div>
                            <div className="h-20"></div>
                            <div className="h-20"></div>

                            {calendarDays.map((date) => (
                                <div key={date.day} className="h-20 flex flex-col items-center justify-center relative">
                                    <button
                                        onClick={() => setSelectedDay(date.day)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${selectedDay === date.day
                                                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-100 scale-110"
                                                : "text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {date.day}
                                    </button>
                                    {date.type === "has-event" && selectedDay !== date.day && (
                                        <div className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    )}
                                    {selectedDay === date.day && (
                                        <div className="absolute -bottom-4 w-10 h-1bg-emerald-500/20 rounded-full blur-md" />
                                    )}
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
                    <div className="mb-6">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Due Today</span>
                        <h2 className="text-3xl font-black text-gray-900 mt-2">May 15, 2024</h2>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 pb-8 flex-1">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={event.image} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{event.influencer}</h3>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{event.gigName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        {event.time}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                                </div>
                            </div>
                        ))}

                        {/* Empty State placeholder if needed */}
                        <div className="hidden mt-20 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <CalendarIcon className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No more tasks for today</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
