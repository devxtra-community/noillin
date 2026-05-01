"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ChevronRight, CheckCircle2, Loader2, ShieldCheck, Download, Undo2, Ban } from "lucide-react";
import { useSearchParams } from "next/navigation";

import api from "@/lib/axios.client";
import { SecureMediaPreview } from "@/components/shared/SecureMediaPreview";

export default function BrandBookingsPage() {
    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-[#f8fafc]"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>}>
            <BrandBookingsContent />
        </Suspense>
    );
}

function BrandBookingsContent() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookingsData, setBookingsData] = useState<any[]>([]);
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
            case "COMPLETED": return "bg-emerald-50 text-emerald-600";
            case "IN_ESCROW": return "bg-blue-50 text-blue-600";
            case "PENDING": return "bg-orange-50 text-orange-600 font-bold";
            case "DISPUTED": return "bg-rose-50 text-rose-600";
            default: return "bg-gray-100 text-gray-800";
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
            <div className="h-full w-full flex items-center justify-center bg-[#f8fafc]">
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
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-gray-400 font-semibold italic">No bookings found</td>
                                    </tr>
                                )}
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        onClick={() => setSelectedId(booking._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === booking._id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                                            }`}
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                {booking.influencerProfile?.profileImageUrl ? (
                                                    <img src={booking.influencerProfile.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-emerald-100 text-emerald-600 shadow-sm">
                                                        {(booking.influencerProfile?.fullName || booking.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-sm font-bold text-gray-900">{booking.influencerProfile?.fullName || booking.influencerProfile?.username || "Unknown Influencer"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sm text-gray-500 font-medium">{booking.gigId?.title}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-colors ${selectedId === booking._id ? "text-emerald-500" : "text-gray-300"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className="lg:w-[420px] flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-full flex flex-col overflow-y-auto scrollbar-hide">
                        {!selectedBooking ? (
                            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm text-center">
                                Select a booking from the list
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col items-center mb-8 text-center">
                                    <div className="relative mb-4">
                                        {selectedBooking.influencerProfile?.profileImageUrl ? (
                                            <img src={selectedBooking.influencerProfile.profileImageUrl} alt="" className="w-24 h-24 rounded-full object-cover p-1 border-2 border-emerald-50 shadow-sm" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 bg-emerald-100 text-emerald-600 shadow-sm">
                                                {(selectedBooking.influencerProfile?.fullName || selectedBooking.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedBooking.influencerProfile?.fullName || selectedBooking.influencerProfile?.username || "Unknown Influencer"}</h2>
                                    <span className={`mt-2 px-3 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusStyles(selectedBooking.status)}`}>
                                        {getStatusLabel(selectedBooking.status)}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm font-medium text-gray-400">Gig Name</span>
                                        <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{selectedBooking.gigId?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm font-medium text-gray-400">Order Status</span>
                                        <span className="text-sm font-bold text-gray-900">{getStatusLabel(selectedBooking.status)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm font-medium text-gray-400">Booked Date</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(selectedBooking.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {selectedBooking.dueDate && (
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-sm font-medium text-gray-400">Due Date</span>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-rose-500">{new Date(selectedBooking.dueDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <span className="text-sm font-medium text-gray-400">Total Price</span>
                                        <span className="text-xl font-black text-emerald-500">₹{(selectedBooking.amount || 0).toLocaleString()}</span>
                                    </div>

                                    {/* Timeline */}
                                    <div className="pt-8">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Timeline</p>
                                        <div className="space-y-6">
                                            {generateTimeline(selectedBooking.status, selectedBooking.workStatus).map((step, idx) => (
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
                                                        {idx !== 3 && (
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
                                    {selectedBooking.status === "IN_ESCROW" && selectedBooking.workStatus === "SUBMITTED" ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="p-4 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 text-center">Secure Deliverable Preview</p>
                                                <SecureMediaPreview
                                                    url={selectedBooking.deliverableUrl}
                                                    type={selectedBooking.deliverableUrl.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image"}
                                                />
                                            </div>

                                            {showRejectForm ? (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="relative">
                                                        <textarea
                                                            className="w-full p-4 border border-rose-100 rounded-[20px] text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 outline-none transition-all placeholder:text-gray-300 bg-rose-50/10"
                                                            placeholder="What needs to be changed? Provide clear feedback..."
                                                            rows={3}
                                                            value={rejectionNote}
                                                            onChange={(e) => setRejectionNote(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setShowRejectForm(false)}
                                                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            disabled={rejecting || !rejectionNote}
                                                            onClick={() => handleRejectWork(selectedBooking._id)}
                                                            className="flex-[2] bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                                                        >
                                                            {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                                            Send Revision Request
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setShowRejectForm(true)}
                                                        className="flex-1 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 font-bold py-3.5 px-4 rounded-[20px] text-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Undo2 className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                    <button
                                                        disabled={approving}
                                                        onClick={() => handleApproveWork(selectedBooking._id)}
                                                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-[20px] text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
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
                                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-[20px] text-sm transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
                                                >
                                                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                                    Download Final Files
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
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-[20px] text-sm transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck className="w-5 h-5" />
                                            Pay 100% Secure Escrow
                                        </button>
                                    ) : (
                                        <button className="w-full border-2 border-rose-50 text-rose-500 hover:bg-rose-50/30 font-bold py-4 px-6 rounded-[20px] text-sm transition-all active:scale-95">
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
