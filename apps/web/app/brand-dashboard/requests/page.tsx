"use client";

import React, { useState } from "react";
import { Search, ChevronRight,  } from "lucide-react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";

interface ConnectionRequest {
    _id: string;
    brandId: { _id: string; fullName: string; profileImageUrl?: string };
    influencerId: { _id: string; fullName: string; profileImageUrl?: string };
    gigId: { title: string; pricing?: { basePrice: number } };
    status: "pending" | "accepted" | "rejected";
    note?: string;
    createdAt: string;
}

export default function BrandRequestsPage() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("Pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [connections, setConnections] = useState<ConnectionRequest[]>([]);

    React.useEffect(() => {
        api.get("/connections/my?role=brand").then(res => {
            const data = res.data.data || [];
            setConnections(data);
            if (data.length > 0) setSelectedId(data[0]._id);
        }).catch(err => console.error(err));
    }, []);

    const filteredRequests = connections.filter(c => {
        const titleMatch = c.gigId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.influencerId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        let statusMatch = false;
        if (activeFilter === "Pending") statusMatch = c.status === "pending";
        else if (activeFilter === "Accepted") statusMatch = c.status === "accepted";
        else if (activeFilter === "Rejected") statusMatch = c.status === "rejected";
        return titleMatch && statusMatch;
    });

    const selectedRequest = connections.find(r => r._id === selectedId) || filteredRequests[0];

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
                                {filteredRequests.map((req) => (
                                    <tr
                                        key={req._id}
                                        onClick={() => setSelectedId(req._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === req._id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                                            }`}
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm bg-slate-100 text-slate-600">
                                                    {req.influencerId?.fullName?.charAt(0) || "I"}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{req.influencerId?.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm text-gray-500 font-medium">{req.gigId?.title}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm font-bold text-gray-900">₹{req.gigId?.pricing?.basePrice?.toLocaleString()}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full border border-current opacity-80 ${req.status === 'pending' ? 'text-orange-600 bg-orange-50' : req.status === 'accepted' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-colors ${selectedId === req._id ? "text-emerald-500" : "text-gray-300"}`} />
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-gray-400 text-sm italic">No requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className="lg:w-[400px] flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-full flex flex-col">
                        {selectedRequest ? (
                            <>
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative mb-4">
                                        <div className="w-24 h-24 rounded-[20px] flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-gray-200/50 bg-emerald-50 text-emerald-600">
                                            {selectedRequest.influencerId?.fullName?.charAt(0) || "I"}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedRequest.influencerId?.fullName}</h2>
                                    <span className="mt-2 px-3 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {selectedRequest.status}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="flex justify-between items-center py-1 border-b border-gray-50 pb-3">
                                        <span className="text-sm font-medium text-gray-400">Gig Name</span>
                                        <span className="text-sm font-bold text-gray-900 text-right">{selectedRequest.gigId?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-50 pb-3">
                                        <span className="text-sm font-medium text-gray-400">Requested Date</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                        <span className="text-sm font-medium text-gray-400">Price</span>
                                        <span className="text-xl font-black text-emerald-500">₹{selectedRequest.gigId?.pricing?.basePrice?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Brand Note (If provided) */}
                                {selectedRequest.note && (
                                    <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-2">
                                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Your Initial Note</h4>
                                        <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{selectedRequest.note}</p>
                                    </div>
                                )}

                                <div className="mt-10 flex flex-col gap-4">
                                    {selectedRequest.status === "pending" && (
                                        <p className="text-center text-sm font-bold text-gray-400 italic">Waiting for influencer to accept...</p>
                                    )}
                                    {selectedRequest.status === "accepted" && (
                                        <button
                                            onClick={() => router.push(`/brand-dashboard/messages?gigRequestId=${selectedRequest._id}`)}
                                            className="w-full bg-[#1CD36B] hover:bg-[#19C061] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 active:scale-95"
                                        >
                                            Message Influencer
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">Select a request to see details</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
