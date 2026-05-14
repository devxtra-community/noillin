"use client";

import React, { useState } from "react";
import { Search, ChevronRight, ChevronLeft, ArrowUpRight, Activity } from "lucide-react";
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
        const titleMatch = (c.gigId?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.influencerId?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
        let statusMatch = false;
        if (activeFilter === "Pending") statusMatch = c.status === "pending";
        else if (activeFilter === "Accepted") statusMatch = c.status === "accepted";
        else if (activeFilter === "Rejected") statusMatch = c.status === "rejected";
        return titleMatch && statusMatch;
    });

    const selectedRequest = connections.find(r => r._id === selectedId) || filteredRequests[0];

    return (
        <div className="px-4 sm:px-8 lg:px-10 py-8 h-full flex flex-col min-h-0 bg-transparent max-w-[1600px] mx-auto w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Requests</h1>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Manage incoming and outgoing collaboration requests.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Filters */}
                    <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-[16px] shadow-sm">
                        {["Pending", "Accepted", "Rejected"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${activeFilter === filter
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-[16px] text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white shadow-sm outline-none transition-all placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Left Column: Table */}
                <div className={`flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden flex-col ${selectedId ? "hidden lg:flex" : "flex"}`}>
                    <div className="overflow-x-auto flex-1 h-full custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Influencer</th>
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="py-5 px-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRequests.map((req) => (
                                    <tr
                                        key={req._id}
                                        onClick={() => setSelectedId(req._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === req._id ? "bg-emerald-50/30" : "hover:bg-slate-50/80"
                                            }`}
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black shrink-0 shadow-sm border border-slate-200 bg-slate-100 text-slate-600 relative overflow-hidden group-hover:border-emerald-200 transition-colors">
                                                    {req.influencerId?.fullName?.charAt(0) || "I"}
                                                </div>
                                                <span className={`text-[15px] font-bold ${selectedId === req._id ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"} transition-colors`}>{req.influencerId?.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="text-sm text-slate-500 font-bold">{req.gigId?.title}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="text-[15px] font-black text-slate-900">₹{req.gigId?.pricing?.basePrice?.toLocaleString()}</span>
                                        </td>
                                        <td className="py-5 px-8 text-center">
                                            <span className={`inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${req.status === 'pending' ? 'text-amber-700 bg-amber-100/80 border-amber-200' : req.status === 'accepted' ? 'text-emerald-700 bg-emerald-100/80 border-emerald-200' : 'text-rose-700 bg-rose-100/80 border-rose-200'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedId === req._id ? "text-emerald-500 translate-x-1" : "text-slate-300 group-hover:translate-x-1"}`} />
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                           <div className="flex flex-col items-center justify-center text-slate-400">
                                              <Activity className="w-10 h-10 text-slate-300 mb-4" />
                                              <p className="text-sm font-bold">No requests found</p>
                                              <p className="text-xs mt-1">Try changing the filters above.</p>
                                           </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className={`lg:w-[420px] flex-col gap-6 ${selectedId ? "flex" : "hidden lg:flex"}`}>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 h-full flex flex-col relative overflow-hidden">
                        {selectedRequest ? (
                            <>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-bl-full pointer-events-none"></div>

                                <div className="flex flex-col items-center mb-10 relative z-10 mt-4">
                                    <button 
                                        onClick={() => setSelectedId(null)}
                                        className="absolute left-0 top-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="relative mb-6">
                                        <div className="w-28 h-28 rounded-[28px] flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-emerald-500/20 bg-emerald-50 text-emerald-600 border-2 border-white ring-4 ring-slate-50">
                                            {selectedRequest.influencerId?.fullName?.charAt(0) || "I"}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedRequest.influencerId?.fullName}</h2>
                                    <span className={`mt-3 px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${selectedRequest.status === 'pending' ? 'text-amber-700 bg-amber-50 border-amber-200' : selectedRequest.status === 'accepted' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1 relative z-10 px-2">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 pb-4">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Gig Name</span>
                                        <span className="text-[14px] font-black text-slate-900 text-right">{selectedRequest.gigId?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 pb-4">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Requested</span>
                                        <span className="text-[14px] font-bold text-slate-900">{new Date(selectedRequest.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                                        <span className="text-2xl font-black text-emerald-500">₹{selectedRequest.gigId?.pricing?.basePrice?.toLocaleString()}</span>
                                    </div>

                                    {/* Brand Note (If provided) */}
                                    {selectedRequest.note && (
                                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-[20px] p-6 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Note</h4>
                                            <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap italic">&ldquo;{selectedRequest.note}&rdquo;</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex flex-col gap-4 relative z-10">
                                    {selectedRequest.status === "pending" && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-[20px] p-5 text-center">
                                           <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Waiting for influencer</p>
                                           <p className="text-[11px] font-medium text-amber-600 mt-1">They must review your request before you can chat.</p>
                                        </div>
                                    )}
                                    {selectedRequest.status === "accepted" && (
                                        <button
                                            onClick={() => router.push(`/brand-dashboard/messages?gigRequestId=${selectedRequest._id}`)}
                                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4.5 rounded-[20px] font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest h-[56px]"
                                        >
                                            Message Influencer <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                   <Activity className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-600">Select a Request</p>
                                   <p className="text-xs mt-1 max-w-[200px]">Click on any row in the table to view its details here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
