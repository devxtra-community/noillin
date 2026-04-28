"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Calendar, Clock, Globe, XCircle, AlertCircle, Check, Loader2 } from "lucide-react";

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

export default function BookingsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await api.get("/orders/history");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const tabs = ["All", "Active", "Completed", "Disputed"];

    const filteredBookings = orders.filter(o => {
        const titleMatch = o.gigId?.title?.toLowerCase().includes(searchQuery.toLowerCase());

        let statusMatch = true;
        if (activeTab === "Active") {
            statusMatch = o.status === "IN_ESCROW" || o.status === "PENDING";
        } else if (activeTab === "Completed") {
            statusMatch = o.status === "COMPLETED";
        } else if (activeTab === "Disputed") {
            statusMatch = o.status === "DISPUTED";
        }

        return titleMatch && statusMatch;
    });

    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    useEffect(() => {
        if (filteredBookings.length > 0 && !selectedBookingId) {
            setSelectedBookingId(filteredBookings[0]._id);
        }
    }, [filteredBookings, selectedBookingId]);

    const selectedBooking = orders.find(o => o._id === selectedBookingId) || filteredBookings[0];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600";
            case "IN_ESCROW": return "bg-blue-50 text-blue-600";
            case "PENDING": return "bg-orange-50 text-orange-600";
            case "DISPUTED": return "bg-rose-50 text-rose-600";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

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
                                        key={b._id}
                                        onClick={() => setSelectedBookingId(b._id)}
                                        className={`group cursor-pointer transition-all ${selectedBookingId === b._id ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm bg-slate-100 text-slate-600">
                                                    {b.gigId?.title?.charAt(0) || "B"}
                                                </div>
                                                <span className="font-bold text-[14px] text-gray-900 truncate max-w-[150px]">{b.gigId?.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-500">{b.status}</td>
                                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900 text-right">₹{b.influencerAmount.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedBookingId === b._id ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" : "text-gray-300 group-hover:text-gray-500"}`}>
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
                            <div className="p-6 flex flex-col h-full">
                                {selectedBooking ? (
                                    <>
                                        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Booking Details</h2>

                                        {/* Brand Profile */}
                                        <div className="flex flex-col items-center text-center mb-8">
                                            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-xl font-black mb-4 shadow-xl shadow-gray-200/50 bg-emerald-50 text-emerald-600">
                                                {selectedBooking.gigId?.title?.charAt(0) || "B"}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5">{selectedBooking.gigId?.title}</h3>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-full ${getStatusStyles(selectedBooking.status)} flex items-center gap-1.5`}>
                                                    <Globe className="w-2.5 h-2.5" />
                                                    {selectedBooking.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Details List */}
                                        <div className="space-y-1.5 flex-grow overflow-y-auto">
                                            <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                        <AlertCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-400">Status</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-900">{selectedBooking.status}</span>
                                            </div>

                                            <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-400">Booked Date</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[13px] font-bold text-gray-900">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {selectedBooking.dueDate && (
                                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[13px] font-bold text-gray-400">Due Date</span>
                                                    </div>
                                                    <span className="text-[13px] font-bold text-rose-600">{new Date(selectedBooking.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}

                                            <div className="py-6 border-b border-gray-50/80">
                                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> Booking Lifecycle
                                                </p>
                                                <div className="space-y-6 relative ml-2">
                                                    <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gray-100"></div>
                                                    {[
                                                        { label: "Order Created", isCompleted: true },
                                                        { label: "Funds in Escrow", isCompleted: selectedBooking.status === "IN_ESCROW" || selectedBooking.status === "COMPLETED" },
                                                        { label: "Work Approved", isCompleted: selectedBooking.status === "COMPLETED" },
                                                        { label: "Funds Released", isCompleted: selectedBooking.status === "COMPLETED" },
                                                    ].map((step, idx) => (
                                                        <div key={idx} className="flex gap-4 relative z-10">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${step.isCompleted
                                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                                                                : "bg-white border-gray-200 text-gray-300"
                                                                }`}>
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                            <p className={`text-[13px] font-bold ${step.isCompleted ? "text-gray-900" : "text-gray-400 opacity-60"}`}>{step.label}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-400">Total Price</span>
                                                </div>
                                                <span className="text-[17px] font-black text-emerald-600">₹{selectedBooking.influencerAmount.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all flex items-center justify-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Cancel Booking
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">Select a booking to see details</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
