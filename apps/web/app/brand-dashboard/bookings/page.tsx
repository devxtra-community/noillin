"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ChevronRight, ChevronLeft, CheckCircle2, Loader2, ShieldCheck, Download, Undo2, Ban, Activity } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import api from "@/lib/axios.client";
import { SecureMediaPreview } from "@/components/shared/SecureMediaPreview";

export default function BrandBookingsPage() {
    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>}>
            <BrandBookingsContent />
        </Suspense>
    );
}

interface Order {
    _id: string;
    connectionId: string;
    status: string;
    workStatus: string;
    deliverableUrl?: string;
    amount: number;
    createdAt: string;
    dueDate?: string;
    influencerProfile?: {
        fullName?: string;
        username?: string;
        profileImageUrl?: string;
    };
    gigId?: { title: string };
    rejectionNote?: string;
}

function BrandBookingsContent() {
    const [bookingsData, setBookingsData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get("orderId");

    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [rejectionNote, setRejectionNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "COMPLETED": return "Completed";
            case "IN_ESCROW": return "Securely Booked";
            case "PENDING": return "Payment Pending";
            case "DISPUTED": return "Disputed";
            case "CANCELLED": return "Cancelled";
            case "REJECTED": return "Revision Requested";
            default: return status;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-100/80 text-emerald-700 border border-emerald-200";
            case "IN_ESCROW": return "bg-blue-100/80 text-blue-700 border border-blue-200";
            case "PENDING": return "bg-orange-100/80 text-orange-700 border border-orange-200 font-bold";
            case "DISPUTED": return "bg-rose-100/80 text-rose-700 border border-rose-200";
            default: return "bg-slate-100 text-slate-600 border border-slate-200";
        }
    };

    const handleApproveWork = async (orderId: string) => {
        try {
            setApproving(true);
            await api.patch(`/orders/approve/${orderId}`);
            setBookingsData(prev => prev.map(b => b._id === orderId ? { ...b, status: "COMPLETED", workStatus: "APPROVED", escrowStatus: "RELEASED" } : b));
        } catch (err) {
            console.error("Failed to approve work:", err);
        } finally {
            setApproving(false);
        }
    };

    const handleRejectWork = async (orderId: string) => {
        if (!rejectionNote) return;
        try {
            setRejecting(true);
            await api.patch(`/orders/reject/${orderId}`, { note: rejectionNote });
            setBookingsData(prev => prev.map(b => b._id === orderId ? { ...b, workStatus: "REJECTED", rejectionNote } : b));
            setShowRejectForm(false);
            setRejectionNote("");
        } catch (err) {
            console.error("Failed to reject work:", err);
        } finally {
            setRejecting(false);
        }
    };

    useEffect(() => {
        api.get("/orders/history").then((res) => {
            setBookingsData(res.data);
            if (orderIdParam) {
                setSelectedId(orderIdParam);
            } else if (res.data.length > 0) {
                setSelectedId(res.data[0]._id);
            }
        }).finally(() => setLoading(false));
    }, [orderIdParam]);

    const filteredBookings = bookingsData.filter(b => {
        const titleMatch = (b.gigId?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        let statusMatch = true;

        if (activeFilter === "Active") {
            statusMatch = b.status === "IN_ESCROW" || b.status === "PENDING";
        } else if (activeFilter === "Completed") {
            statusMatch = b.status === "COMPLETED";
        } else if (activeFilter === "Disputed") {
            statusMatch = b.status === "DISPUTED";
        }

        return titleMatch && statusMatch;
    });

    const selectedBooking = bookingsData.find(b => b._id === selectedId) || null;

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const generateTimeline = (status: string, workStatus: string) => {
        const steps = [
            { label: "Request Placed & Accepted", status: 'completed' },
            { label: "Payment Secured in Escrow", status: (status === 'IN_ESCROW' || status === 'COMPLETED') ? 'completed' : 'current' },
            { label: "Work Submission & Review", status: (workStatus === 'SUBMITTED' || workStatus === 'APPROVED' || status === 'COMPLETED') ? 'completed' : (status === 'IN_ESCROW') ? 'current' : 'pending' },
            { label: "Project Finalized", status: (status === 'COMPLETED') ? 'completed' : (workStatus === 'APPROVED') ? 'current' : 'pending' },
        ];

        // Handle Rejection Case
        if (workStatus === 'REJECTED') {
            steps[2] = { label: "Revision Requested", status: 'current' };
        }

        return steps;
    };

    return (
        <div className="px-4 sm:px-8 lg:px-10 py-8 h-full flex flex-col min-h-0 bg-transparent max-w-[1600px] mx-auto w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Track and manage your ongoing collaborations</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Filters */}
                    <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-[16px] shadow-sm">
                        {["All", "Active", "Completed", "Disputed"].map((filter) => (
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
                            placeholder="Search bookings..."
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-[16px] text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 bg-white shadow-sm outline-none transition-all placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 lg:overflow-hidden overflow-visible">
                {/* Left Column: Table */}
                <div className={`flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden flex-col lg:min-h-0 ${selectedId ? "hidden lg:flex" : "flex"}`}>
                    <div className="overflow-x-auto flex-1 h-full custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Influencer</th>
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                    <th className="py-5 px-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                           <div className="flex flex-col items-center justify-center text-slate-400">
                                              <Activity className="w-10 h-10 text-slate-300 mb-4" />
                                              <p className="text-sm font-bold">No bookings found</p>
                                              <p className="text-xs mt-1">Try changing the filters above.</p>
                                           </div>
                                        </td>
                                    </tr>
                                )}
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        onClick={() => setSelectedId(booking._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === booking._id ? "bg-emerald-50/30" : "hover:bg-slate-50/80"
                                            }`}
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                {booking.influencerProfile?.profileImageUrl ? (
                                                    <Image src={booking.influencerProfile.profileImageUrl} width={40} height={40} alt="" className="w-10 h-10 rounded-2xl object-cover shadow-sm bg-slate-100 border border-slate-200 group-hover:border-emerald-200 transition-colors" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black shrink-0 shadow-sm border border-slate-200 bg-slate-100 text-slate-600 relative overflow-hidden group-hover:border-emerald-200 transition-colors">
                                                        {(booking.influencerProfile?.fullName || booking.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className={`text-[15px] font-bold ${selectedId === booking._id ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"} transition-colors`}>{booking.influencerProfile?.fullName || booking.influencerProfile?.username || "Unknown Influencer"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="text-sm text-slate-500 font-bold">{booking.gigId?.title}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${getStatusStyles(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedId === booking._id ? "text-emerald-500 translate-x-1" : "text-slate-300 group-hover:translate-x-1"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className={`lg:w-[420px] flex-col gap-6 lg:min-h-0 ${selectedId ? "flex" : "hidden lg:flex"}`}>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 lg:h-full flex flex-col relative lg:overflow-hidden overflow-visible lg:overflow-y-auto min-h-0 custom-scrollbar">
                        {!selectedBooking ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                   <Activity className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-600">Select a Booking</p>
                                   <p className="text-xs mt-1 max-w-[200px]">Click on any row in the table to view its details here.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-bl-full pointer-events-none"></div>

                                <div className="flex flex-col items-center mb-8 text-center relative z-10 mt-4">
                                    <button 
                                        onClick={() => setSelectedId(null)}
                                        className="absolute left-0 top-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="relative mb-6">
                                        {selectedBooking.influencerProfile?.profileImageUrl ? (
                                            <Image src={selectedBooking.influencerProfile.profileImageUrl} width={112} height={112} alt="" className="w-28 h-28 rounded-[28px] object-cover shadow-xl shadow-slate-200/50 border-2 border-white ring-4 ring-slate-50" />
                                        ) : (
                                            <div className="w-28 h-28 rounded-[28px] flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-emerald-500/20 bg-emerald-50 text-emerald-600 border-2 border-white ring-4 ring-slate-50">
                                                {(selectedBooking.influencerProfile?.fullName || selectedBooking.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedBooking.influencerProfile?.fullName || selectedBooking.influencerProfile?.username || "Unknown Influencer"}</h2>
                                    <span className={`mt-3 px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${getStatusStyles(selectedBooking.status)}`}>
                                        {getStatusLabel(selectedBooking.status)}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1 relative z-10 px-2">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 pb-4">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Gig Name</span>
                                        <span className="text-[14px] font-black text-slate-900 text-right max-w-[200px] truncate">{selectedBooking.gigId?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 pb-4">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Booked</span>
                                        <span className="text-[14px] font-bold text-slate-900">{new Date(selectedBooking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>

                                    {selectedBooking.dueDate && (
                                        <div className="flex justify-between items-center py-2 border-b border-slate-100 pb-4">
                                            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
                                            <span className="text-[14px] font-black text-rose-500">{new Date(selectedBooking.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Total Price</span>
                                        <span className="text-2xl font-black text-emerald-500">₹{(selectedBooking.amount || 0).toLocaleString()}</span>
                                    </div>

                                    {/* Timeline */}
                                    <div className="pt-8">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Timeline</p>
                                        <div className="space-y-6">
                                            {generateTimeline(selectedBooking.status, selectedBooking.workStatus).map((step, idx) => (
                                                <div key={idx} className="flex gap-4 group">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all ${step.status === 'completed'
                                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-2 border-emerald-500'
                                                            : step.status === 'current'
                                                                ? 'bg-white border-[3px] border-emerald-500 text-emerald-500 shadow-sm'
                                                                : 'bg-slate-50 border-2 border-slate-200 text-slate-300'
                                                            }`}>
                                                            {step.status === 'completed' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                                            ) : (
                                                                <div className={`w-2.5 h-2.5 rounded-full ${step.status === 'current' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                                                            )}
                                                        </div>
                                                        {idx !== 3 && (
                                                            <div className={`w-0.5 h-10 -my-1 transition-colors ${step.status === 'completed' ? 'bg-emerald-200' : 'bg-slate-100'
                                                                }`} />
                                                        )}
                                                    </div>
                                                    <div className="pt-0.5">
                                                        <p className={`text-sm font-bold tracking-tight ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
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

                                <div className="mt-10 relative z-10">
                                    {selectedBooking.status === "IN_ESCROW" && selectedBooking.workStatus === "SUBMITTED" ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-[24px]">
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 text-center">Secure Deliverable Preview</p>
                                                {selectedBooking.deliverableUrl && (
                                                    <SecureMediaPreview
                                                        url={selectedBooking.deliverableUrl}
                                                        type={selectedBooking.deliverableUrl.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image"}
                                                    />
                                                )}
                                            </div>

                                            {showRejectForm ? (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="relative">
                                                        <textarea
                                                            className="w-full p-4 border border-rose-200 rounded-[20px] text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 outline-none transition-all placeholder:text-slate-400 bg-rose-50/30"
                                                            placeholder="What needs to be changed? Provide clear feedback..."
                                                            rows={3}
                                                            value={rejectionNote}
                                                            onChange={(e) => setRejectionNote(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setShowRejectForm(false)}
                                                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all shadow-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            disabled={rejecting || !rejectionNote}
                                                            onClick={() => handleRejectWork(selectedBooking._id)}
                                                            className="flex-[2] bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                                                        >
                                                            {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                                            Send Revision
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setShowRejectForm(true)}
                                                        className="flex-1 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 font-black py-4 px-4 rounded-[20px] text-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Undo2 className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                    <button
                                                        disabled={approving}
                                                        onClick={() => handleApproveWork(selectedBooking._id)}
                                                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black py-4 px-4 rounded-[20px] text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
                                                    >
                                                        {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                        Approve & Release
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedBooking.status === "COMPLETED" ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold py-5 px-4 rounded-[24px] text-sm text-center flex flex-col items-center gap-2">
                                                <CheckCircle2 className="w-6 h-6" />
                                                <div className="flex flex-col">
                                                    <span className="uppercase tracking-widest text-[10px] mb-1">Success</span>
                                                    <span>Investment Released</span>
                                                </div>
                                            </div>
                                            {selectedBooking.deliverableUrl && (
                                                <a
                                                    href={selectedBooking.deliverableUrl}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-[20px] text-sm transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group uppercase tracking-widest"
                                                >
                                                    <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                                    Download Files
                                                </a>
                                            )}
                                        </div>
                                    ) : selectedBooking.workStatus === "REJECTED" ? (
                                        <div className="w-full bg-rose-50 border border-rose-100 text-rose-500 font-bold py-6 px-4 rounded-[24px] text-sm text-center flex flex-col items-center gap-2">
                                            <Undo2 className="w-6 h-6" />
                                            <div className="flex flex-col">
                                                <span className="uppercase tracking-widest text-[10px] mb-1">Revision in Progress</span>
                                                <span>Awaiting updated files from influencer</span>
                                            </div>
                                        </div>
                                    ) : selectedBooking.status === "IN_ESCROW" ? (
                                        <div className="w-full bg-blue-50/50 border border-blue-100 border-dashed text-blue-500 font-bold py-8 px-4 rounded-[24px] text-sm text-center flex flex-col items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                                            <div className="flex flex-col">
                                                <span className="uppercase tracking-widest text-[10px] opacity-60 mb-1">Awaiting Delivery</span>
                                                <span>Influencer is working on your project</span>
                                            </div>
                                        </div>
                                    ) : selectedBooking.status === "PENDING" ? (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await api.post("/payments/checkout", {
                                                        gigRequestId: selectedBooking.connectionId
                                                    });
                                                    window.location.href = res.data.url;
                                                } catch (err) {
                                                    console.error("Payment initiation failed:", err);
                                                    alert("Failed to initiate payment. Please try again.");
                                                }
                                            }}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4.5 px-6 rounded-[20px] text-sm transition-all shadow-xl shadow-emerald-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest h-[56px]"
                                        >
                                            <ShieldCheck className="w-5 h-5" />
                                            Pay 100% Secure Escrow
                                        </button>
                                    ) : (
                                        <button className="w-full border-2 border-rose-100 text-rose-500 hover:bg-rose-50 font-bold py-4 px-6 rounded-[20px] text-sm transition-all active:scale-95">
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
