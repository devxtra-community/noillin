"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, ChevronRight, CheckCircle2 } from "lucide-react";

const bookingsData = [
    {
        id: 1,
        influencer: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        gigName: "IG Reel Promotion",
        price: "$150",
        bookedDate: "Oct 24, 2023",
        dueDate: "Oct 30, 2023",
        dueIn: "In 2 days",
        status: "Active",
        timeline: [
            { label: "Booking Created", status: "completed" },
            { label: "Payment in Escrow", status: "completed" },
            { label: "In Progress", status: "current" },
            { label: "Completed", status: "pending" },
        ]
    },
    {
        id: 2,
        influencer: "Marcus Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        gigName: "TikTok Ad Campaign",
        price: "$275",
        bookedDate: "Oct 20, 2023",
        dueDate: "Oct 28, 2023",
        dueIn: "In 1 day",
        status: "Active",
        timeline: [
            { label: "Booking Created", status: "completed" },
            { label: "Payment in Escrow", status: "completed" },
            { label: "In Progress", status: "current" },
            { label: "Completed", status: "pending" },
        ]
    },
    {
        id: 3,
        influencer: "Elena",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        gigName: "YouTube Review",
        price: "$500",
        bookedDate: "Oct 15, 2023",
        dueDate: "Oct 22, 2023",
        dueIn: "Overdue",
        status: "Disputed",
        timeline: [
            { label: "Booking Created", status: "completed" },
            { label: "Payment in Escrow", status: "completed" },
            { label: "In Progress", status: "completed" },
            { label: "Completed", status: "pending" },
        ]
    },
];

export default function BrandBookingsPage() {
    const [selectedId, setSelectedId] = useState(1);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const selectedBooking = bookingsData.find(b => b.id === selectedId) || bookingsData[0];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col min-h-0 bg-[#f8fafc]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage your ongoing collaborations</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white shadow-sm outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center p-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                        {["All", "Active", "Completed", "Disputed"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeFilter === filter
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Column: Table */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto flex-1 h-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 bg-gray-50/30">
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Influencer</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                    <th className="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookingsData.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        onClick={() => setSelectedId(booking.id)}
                                        className={`transition-all cursor-pointer group ${selectedId === booking.id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                                            }`}
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <Image width={32} height={32} src={booking.image} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-100" />
                                                <span className="text-sm font-bold text-gray-900">{booking.influencer}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm text-gray-500 font-medium">{booking.gigName}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm font-bold text-gray-900">{booking.price}</span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-colors ${selectedId === booking.id ? "text-emerald-500" : "text-gray-300"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className="lg:w-[400px] flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-full flex flex-col">
                        <div className="flex flex-col items-center mb-8 text-center">
                            <div className="relative mb-4">
                                <Image width={96} height={96} src={selectedBooking.image} alt="" className="w-24 h-24 rounded-full object-cover p-1 border-2 border-emerald-50 shadow-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedBooking.influencer}</h2>
                            <span className="mt-2 px-3 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Instagram
                            </span>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Gig Name</span>
                                <span className="text-sm font-bold text-gray-900">{selectedBooking.gigName}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Booked Date</span>
                                <span className="text-sm font-bold text-gray-900">{selectedBooking.bookedDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Due Date</span>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-rose-500">{selectedBooking.dueDate}</div>
                                    <div className="text-[10px] font-medium text-rose-400 uppercase tracking-wide">({selectedBooking.dueIn})</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-400">Total Price</span>
                                <span className="text-xl font-black text-emerald-500">{selectedBooking.price}</span>
                            </div>

                            {/* Timeline */}
                            <div className="pt-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Timeline</p>
                                <div className="space-y-6">
                                    {selectedBooking.timeline.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all ${step.status === 'completed'
                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                        : step.status === 'current'
                                                            ? 'bg-white border-emerald-500 text-emerald-500'
                                                            : 'bg-white border-gray-100 text-gray-200'
                                                    }`}>
                                                    {step.status === 'completed' ? (
                                                        <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                                                    ) : (
                                                        <div className={`w-2 h-2 rounded-full ${step.status === 'current' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-100'}`} />
                                                    )}
                                                </div>
                                                {idx !== selectedBooking.timeline.length - 1 && (
                                                    <div className={`w-0.5 h-10 -my-1 transition-colors ${step.status === 'completed' ? 'bg-emerald-500/20' : 'bg-gray-50'
                                                        }`} />
                                                )}
                                            </div>
                                            <div className="pt-0.5">
                                                <p className={`text-sm font-bold tracking-tight ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-900'
                                                    }`}>
                                                    {step.label}
                                                </p>
                                                {step.status === 'current' && (
                                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Current Step</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button className="w-full py-4 px-6 border-2 border-rose-50 text-rose-500 hover:bg-rose-50/30 font-bold rounded-2xl text-sm transition-all active:scale-95">
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
