"use client";

import React, { useState } from "react";
import { Search, Check, X, ChevronRight, Calendar, Clock, Globe } from "lucide-react";

export default function RequestsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Pending");
    const [requests] = useState([
        {
            id: 1,
            brand: "Nike",
            gig: "IG Reel Promotion",
            price: "$150.00",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            color: "bg-black text-white",
            status: "Pending",
            date: "May 24, 2024",
            time: "10:30 AM"
        },
        {
            id: 2,
            brand: "Apple",
            gig: "TikTok Ad Integration",
            price: "$275.00",
            platform: "TikTok",
            platformColor: "bg-gray-100 text-gray-600",
            color: "bg-[#F5F5F7] text-gray-900 border border-gray-200",
            status: "Pending",
            date: "May 25, 2024",
            time: "02:15 PM"
        },
        {
            id: 3,
            brand: "Coca-Cola",
            gig: "YouTube Product Review",
            price: "$500.00",
            platform: "YouTube",
            platformColor: "bg-indigo-50 text-indigo-600",
            color: "bg-red-600 text-white",
            status: "Accepted",
            date: "May 22, 2024",
            time: "09:00 AM"
        },
        {
            id: 4,
            brand: "Samsung",
            gig: "Product Unboxing",
            price: "$210.00",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            color: "bg-blue-600 text-white",
            status: "Pending",
            date: "May 26, 2024",
            time: "11:45 AM"
        },
        {
            id: 5,
            brand: "Tesla",
            gig: "Eco Campaign",
            price: "$325.00",
            platform: "Instagram",
            platformColor: "bg-rose-50 text-rose-600",
            color: "bg-gray-800 text-white",
            status: "Pending",
            date: "May 28, 2024",
            time: "04:30 PM"
        },
    ]);

    const filteredByStatus = requests.filter(req => req.status === activeFilter);

    const filteredRequests = filteredByStatus.filter(req =>
        req.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.gig.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [selectedRequestId, setSelectedRequestId] = useState(filteredRequests[0]?.id || requests[0].id);

    const selectedRequest = requests.find(req => req.id === selectedRequestId) || requests[0];

    const filters = ["Pending", "Accepted", "Rejected"];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1500px] mx-auto w-full h-full flex flex-col overflow-hidden">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">Requests</h1>
                    <p className="text-[14px] text-gray-500 mt-1">Manage incoming collaboration requests</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {/* Status Filters */}
                    <div className="flex items-center p-1 bg-gray-100/80 rounded-full w-full sm:w-auto">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-5 py-1.5 text-[13px] font-bold rounded-full transition-all ${activeFilter === f
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Content Container (2-Column Grid) */}
            <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 h-full">
                {/* Table Card (Left Column) */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto overflow-y-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Brands</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Gig Name</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 text-right">Price</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredRequests.map((req) => (
                                    <tr
                                        key={req.id}
                                        onClick={() => setSelectedRequestId(req.id)}
                                        className={`group cursor-pointer transition-all ${selectedRequestId === req.id ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm ${req.color}`}>
                                                    {req.brand.charAt(0)}
                                                </div>
                                                <span className="font-bold text-[14px] text-gray-900">{req.brand}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-500">{req.gig}</td>
                                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900 text-right">{req.price}</td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedRequestId === req.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" : "text-gray-300 group-hover:text-gray-500"}`}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-gray-400 text-sm italic">No {activeFilter.toLowerCase()} requests found.</td>
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
                            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Request Details</h2>

                            {/* Brand Profile */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-xl font-black mb-4 shadow-xl shadow-gray-200/50 ${selectedRequest.color}`}>
                                    {selectedRequest.brand.charAt(0)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5">{selectedRequest.brand}</h3>
                                <div className="flex items-center justify-center gap-2">
                                    <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-full ${selectedRequest.platformColor} flex items-center gap-1.5`}>
                                        <Globe className="w-2.5 h-2.5" />
                                        {selectedRequest.platform}
                                    </span>
                                </div>
                            </div>

                            {/* Simple Details List */}
                            <div className="space-y-1.5 flex-grow">
                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Platform</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-900">{selectedRequest.platform}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Received Date</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-900">{selectedRequest.date}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Received Time</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-900">{selectedRequest.time}</span>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-400">Base Price</span>
                                    </div>
                                    <span className="text-[17px] font-black text-emerald-600">{selectedRequest.price}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-[16px] text-sm shadow-lg shadow-emerald-200/50 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                    Accept Collaboration
                                </button>
                                <button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                    Ignore Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
