"use client";

import React, { useState } from "react";
import { Search, ChevronRight, Globe, Calendar, Clock, DollarSign } from "lucide-react";

const requestsData = [
    {
        id: 1,
        influencer: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        gigName: "IG Reel Promotion",
        platform: "Instagram",
        price: "$150.00",
        status: "Pending",
        statusColor: "text-orange-600 bg-orange-50",
        date: "Oct 24, 2023",
        time: "02:30 PM"
    },
    {
        id: 2,
        influencer: "Marcus Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        gigName: "TikTok Integration",
        platform: "TikTok",
        price: "$275.00",
        status: "Accepted",
        statusColor: "text-emerald-600 bg-emerald-50",
        date: "Oct 25, 2023",
        time: "11:15 AM"
    },
    {
        id: 3,
        influencer: "Elena Rodriguez",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        gigName: "Product Unboxing",
        platform: "Instagram",
        price: "$210.00",
        status: "Rejected",
        statusColor: "text-rose-600 bg-rose-50",
        date: "Oct 22, 2023",
        time: "04:45 PM"
    },
];

export default function BrandRequestsPage() {
    const [selectedId, setSelectedId] = useState(1);
    const [activeFilter, setActiveFilter] = useState("Pending");
    const [searchQuery, setSearchQuery] = useState("");

    const selectedRequest = requestsData.find(r => r.id === selectedId) || requestsData[0];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col min-h-0 bg-[#f8fafc]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage incoming collaboration requests</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Filters */}
                    <div className="flex items-center p-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                        {["Pending", "Accepted", "Rejected"].map((filter) => (
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

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white shadow-sm outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requestsData.map((req) => (
                                    <tr
                                        key={req.id}
                                        onClick={() => setSelectedId(req.id)}
                                        className={`transition-all cursor-pointer group ${selectedId === req.id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                                            }`}
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <img src={req.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                <span className="text-sm font-bold text-gray-900">{req.influencer}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm text-gray-500 font-medium">{req.gigName}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm font-bold text-gray-900">{req.price}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full border border-current opacity-80 ${req.statusColor}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-colors ${selectedId === req.id ? "text-emerald-500" : "text-gray-300"}`} />
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
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4">
                                <img src={selectedRequest.image} alt="" className="w-24 h-24 rounded-full object-cover p-1 border-2 border-emerald-50" />
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                                    <Globe className="w-3 h-3 text-emerald-500" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedRequest.influencer}</h2>
                            <span className="mt-2 px-3 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                {selectedRequest.platform}
                            </span>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Gig Name</span>
                                <span className="text-sm font-bold text-gray-900">{selectedRequest.gigName}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Platform</span>
                                <span className="text-sm font-bold text-gray-900">{selectedRequest.platform}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Status</span>
                                <span className={`px-4 py-1 text-[11px] font-bold rounded-full ${selectedRequest.statusColor}`}>
                                    {selectedRequest.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Requested Date</span>
                                <span className="text-sm font-bold text-gray-900">{selectedRequest.date}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm font-medium text-gray-400">Requested Time</span>
                                <span className="text-sm font-bold text-gray-900">{selectedRequest.time}</span>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-400">Price</span>
                                <span className="text-xl font-black text-emerald-500">{selectedRequest.price}</span>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-4">
                            <button className="w-full bg-[#1CD36B] hover:bg-[#19C061] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 active:scale-95">
                                Accept Collaboration
                            </button>
                            <button className="w-full py-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">
                                Ignore Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
