"use client";

import React, { useState } from "react";
import { Search, ChevronRight, Calendar, Clock, Globe, XCircle, AlertCircle, Check } from "lucide-react";

interface Booking {
    id: number;
    brand: string;
    gig: string;
    price: string;
    status: string;
    statusColor: string;
    color: string;
    platform: string;
    platformColor: string;
    bookedDate: string;
    bookedTime: string;
    dueDate: string;
}

export default function BookingsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const tabs = ["All", "Active", "Completed", "Disputed"];

    const [bookings] = useState<Booking[]>([
        {
            id: 1,
            brand: "Lumina Skincare",
            gig: "IG Reel Promotion",
            price: "$150",
            status: "IN ESCROW",
            statusColor: "bg-blue-50 text-blue-600",
            color: "bg-[#0A192F] text-white",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            bookedDate: "April 20, 2024",
            bookedTime: "11:00 AM",
            dueDate: "April 30, 2024"
        },
        {
            id: 2,
            brand: "Urban Coffee",
            gig: "TikTok Ad Campaign",
            price: "$275",
            status: "PENDING",
            statusColor: "bg-orange-50 text-orange-600",
            color: "bg-orange-100 text-orange-900",
            platform: "TikTok",
            platformColor: "bg-gray-100 text-gray-600",
            bookedDate: "April 21, 2024",
            bookedTime: "03:30 PM",
            dueDate: "May 05, 2024"
        },
        {
            id: 3,
            brand: "TechNova",
            gig: "YouTube Review",
            price: "$500",
            status: "COMPLETED",
            statusColor: "bg-emerald-50 text-emerald-600",
            color: "bg-teal-50 text-teal-700",
            platform: "YouTube",
            platformColor: "bg-indigo-50 text-indigo-600",
            bookedDate: "April 15, 2024",
            bookedTime: "09:15 AM",
            dueDate: "April 25, 2024"
        },
        {
            id: 4,
            brand: "Aura Fashion",
            gig: "Product Unboxing",
            price: "$210",
            status: "CANCELLED",
            statusColor: "bg-gray-100 text-gray-800",
            color: "bg-emerald-50 text-emerald-800",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            bookedDate: "April 18, 2024",
            bookedTime: "10:00 AM",
            dueDate: "April 28, 2024"
        },
        {
            id: 5,
            brand: "GreenLife",
            gig: "Eco Campaign",
            price: "$325",
            status: "DISPUTED",
            statusColor: "bg-rose-50 text-rose-600",
            color: "bg-black text-white",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            bookedDate: "April 22, 2024",
            bookedTime: "01:00 PM",
            dueDate: "May 02, 2024"
        },
    ]);

    const filteredBookings = bookings.filter(b => {
        const matchesQuery = b.brand.toLowerCase().includes(searchQuery.toLowerCase()) || b.gig.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        if (activeTab === "Active") {
            matchesTab = b.status === "IN ESCROW" || b.status === "PENDING";
        } else if (activeTab !== "All") {
            matchesTab = b.status === activeTab.toUpperCase();
        }

        return matchesQuery && matchesTab;
    });

    const [selectedBookingId, setSelectedBookingId] = useState(filteredBookings[0]?.id || bookings[0].id);
    const selectedBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1500px] mx-auto w-full h-full flex flex-col overflow-hidden">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">Bookings</h1>
                    <p className="text-[14px] text-gray-500 mt-1">Track and manage your ongoing collaborations</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search bookings..."
                            className="w-full sm:w-64 xl:w-72 pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 bg-white"
                        />
                    </div>

                    {/* Tabs / Filters */}
                    <div className="flex items-center p-1 bg-gray-100/80 rounded-full w-full sm:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-1.5 text-[13px] font-bold whitespace-nowrap rounded-full transition-all ${activeTab === tab
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Container (2-Column Grid) */}
            <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 h-full">
                {/* Table Card (Left Column) */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto overflow-y-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Brand</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Gig Name</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 text-right">Price</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBookings.map((b) => (
                                    <tr
                                        key={b.id}
                                        onClick={() => setSelectedBookingId(b.id)}
                                        className={`group cursor-pointer transition-all ${selectedBookingId === b.id ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm ${b.color}`}>
                                                    {b.brand.charAt(0)}
                                                </div>
                                                <span className="font-bold text-[14px] text-gray-900">{b.brand}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-500">{b.gig}</td>
                                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900 text-right">{b.price}</td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedBookingId === b.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" : "text-gray-300 group-hover:text-gray-500"}`}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-gray-400 text-sm italic">No {activeTab.toLowerCase()} bookings found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Card (Right Column) */}
                <div className="xl:w-[360px] shrink-0 h-full">
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full sticky top-0">
                        <div className="p-6 flex flex-col h-full">
                            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Booking Details</h2>

                            {/* Brand Profile */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-xl font-black mb-4 shadow-xl shadow-gray-200/50 ${selectedBooking.color}`}>
                                    {selectedBooking.brand.charAt(0)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5">{selectedBooking.brand}</h3>
                                <div className="flex items-center justify-center gap-2">
                                    <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-full ${selectedBooking.platformColor} flex items-center gap-1.5`}>
                                        <Globe className="w-2.5 h-2.5" />
                                        {selectedBooking.platform}
                                    </span>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="space-y-1.5 flex-grow">
                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Gig Name</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-900">{selectedBooking.gig}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Booked Date</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[13px] font-bold text-gray-900">{selectedBooking.bookedDate}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{selectedBooking.bookedTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Due Date</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-rose-600">{selectedBooking.dueDate}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Status</span>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${selectedBooking.statusColor}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Total Price</span>
                                    </div>
                                    <span className="text-[17px] font-black text-emerald-600">{selectedBooking.price}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]">
                                    <XCircle className="w-4 h-4" />
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
