"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Calendar, Globe, Loader2 } from "lucide-react";

import api from "@/lib/axios.client";

interface ConnectionRequest {
    _id: string;
    brandId: { _id: string; fullName: string; profileImageUrl?: string };
    influencerId: string;
    gigId: { title: string; description?: string; pricing?: { basePrice: number } };
    status: "pending" | "accepted" | "rejected";
    note?: string;
    createdAt: string;
}

export default function RequestsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Pending");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get("/connections/my?role=influencer");
            setOrders(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = orders.filter(o => {
        const titleMatch = (o.gigId?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.brandId?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());

        let statusMatch = false;
        if (activeFilter === "Pending") statusMatch = o.status === "pending";
        else if (activeFilter === "Accepted") statusMatch = o.status === "accepted";
        else if (activeFilter === "Rejected") statusMatch = o.status === "rejected";

        return titleMatch && statusMatch;
    });

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    useEffect(() => {
        if (filteredRequests.length > 0 && !selectedRequestId) {
            setSelectedRequestId(filteredRequests[0]._id);
        }
    }, [filteredRequests, selectedRequestId]);

    const selectedRequest = orders.find(o => o._id === selectedRequestId) || filteredRequests[0];

    const filters = ["Pending", "Accepted", "Rejected"];

    const handleAccept = async (connectionId: string) => {
        try {
            await api.patch(`/connections/${connectionId}/accept`);
            fetchRequests();
        } catch (error) {
            console.error("Failed to accept request:", error);
        }
    };

    const handleReject = async (connectionId: string) => {
        try {
            await api.patch(`/connections/${connectionId}/reject`);
            fetchRequests();
        } catch (error) {
            console.error("Failed to reject request:", error);
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
                                        key={req._id}
                                        onClick={() => setSelectedRequestId(req._id)}
                                        className={`group cursor-pointer transition-all ${selectedRequestId === req._id ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm bg-slate-100 text-slate-600">
                                                    {req.brandId?.fullName?.charAt(0) || "B"}
                                                </div>
                                                <span className="font-bold text-[14px] text-gray-900 truncate max-w-[150px]">{req.brandId?.fullName || "Brand User"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-500 truncate max-w-[200px]">{req.gigId?.title || "Gig Request"}</td>
                                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900 text-right">₹{((req.gigId?.pricing?.basePrice || 0) * 0.9).toLocaleString()}</td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedRequestId === req._id ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" : "text-gray-300 group-hover:text-gray-500"}`}>
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
                <div className="xl:w-[400px] shrink-0 h-full">
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full sticky top-0">
                        <div className="p-6 flex flex-col h-full">
                            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Request Details</h2>

                            {selectedRequest ? (
                                <div className="flex flex-col h-full min-h-0">
                                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                                        {/* Brand Profile */}
                                        <div className="flex flex-col items-center text-center mb-8">
                                            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-xl font-black mb-4 shadow-xl shadow-gray-200/50 bg-emerald-50 text-emerald-600">
                                                {selectedRequest.brandId?.fullName?.charAt(0) || "B"}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1.5">{selectedRequest.brandId?.fullName || "Brand User"}</h3>
                                            <p className="text-xs text-gray-500 font-medium mb-3">{selectedRequest.gigId?.title}</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1.5">
                                                    <Globe className="w-2.5 h-2.5" />
                                                    {selectedRequest.status}
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
                                                    <span className="text-[13px] font-bold text-gray-400">Status</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-900">{selectedRequest.status}</span>
                                            </div>

                                            <div className="flex items-center justify-between py-2 text-sm border-b border-gray-50/80">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-400">Received Date</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <div className="space-y-4 bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/50 mt-6">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-gray-400 uppercase tracking-widest">Gig Amount</span>
                                                    <span className="font-bold text-gray-900">₹{(selectedRequest.gigId?.pricing?.basePrice || 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-gray-400 uppercase tracking-widest">Platform Fee</span>
                                                        <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-black">10%</span>
                                                    </div>
                                                    <span className="font-bold text-rose-500">- ₹{((selectedRequest.gigId?.pricing?.basePrice || 0) * 0.1).toLocaleString()}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Est. Payout</span>
                                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Securely Held</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-emerald-600">₹{((selectedRequest.gigId?.pricing?.basePrice || 0) * 0.9).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brand Note (If provided) */}
                                        {selectedRequest.note && (
                                            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-2">
                                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Message from Brand</h4>
                                                <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{selectedRequest.note}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions - Fixed at bottom */}
                                    {selectedRequest.status === "pending" && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                            <button
                                                onClick={() => handleAccept(selectedRequest._id)}
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-[16px] text-sm shadow-lg shadow-emerald-200/50 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                                            >
                                                Accept Collaboration
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedRequest._id)}
                                                className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                                            >
                                                Ignore Request
                                            </button>
                                        </div>
                                    )}

                                    {selectedRequest.status === "accepted" && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                            <button
                                                onClick={() => router.push(`/influencer-dashboard/messages?gigRequestId=${selectedRequest._id}`)}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-[16px] text-sm shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                                            >
                                                Message Brand
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                                    Select a request to see details
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
