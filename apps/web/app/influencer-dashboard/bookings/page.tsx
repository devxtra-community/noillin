"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, XCircle, AlertCircle, Check, Loader2, UploadCloud, FileText, CheckCircle, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import api from "@/lib/axios.client";
import { uploadToS3 } from "@/lib/s3-uploads";

interface Order {
    _id: string;
    amount: number;
    platformFee: number;
    influencerAmount: number;
    status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    escrowStatus: "HOLD" | "RELEASED";
    payoutStatus: "HOLD" | "AVAILABLE" | "PROCESSING" | "PAID";
    workStatus?: "NOT_STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED";
    deliverableUrl?: string;
    rejectionNote?: string;
    createdAt: string;
    dueDate?: string;
    gigId: {
        title: string;
        description?: string;
    };
    brandProfile?: {
        _id: string;
        userId?: string;
        companyName: string;
        contactEmail?: string;
        profileImageUrl?: string;
    };
    connectionId?: string;
    isVirtual?: boolean;
}

export default function BookingsPage() {
    return (
        <Suspense fallback={<div className="h-[80vh] w-full flex items-center justify-center"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>}>
            <BookingsContent />
        </Suspense>
    );
}

function BookingsContent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get("orderId");

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

    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = async (orderId: string) => {
        if (!selectedFile) return;
        try {
            setUploading(true);
            const url = await uploadToS3(selectedFile, "deliverables");
            await api.patch(`/orders/submit/${orderId}`, { deliverableUrl: url });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, workStatus: "SUBMITTED", deliverableUrl: url, rejectionNote: undefined } : o));
            setSelectedFile(null);
        } catch (err) {
            console.error("Failed to upload deliverable:", err);
            alert("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const tabs = ["All", "Active", "Completed", "Disputed"];

    const filteredBookings = orders.filter(o => {
        const titleMatch = (o.gigId?.title || "").toLowerCase().includes(searchQuery.toLowerCase());

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
        if (orderIdParam) {
            setSelectedBookingId(orderIdParam);
        } else if (filteredBookings.length > 0 && !selectedBookingId) {
            if (typeof window !== "undefined" && window.innerWidth >= 1280) {
                setSelectedBookingId(filteredBookings[0]._id);
            }
        }
    }, [filteredBookings, selectedBookingId, orderIdParam]);

    const selectedBooking = orders.find(o => o._id === selectedBookingId) || filteredBookings[0];

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "COMPLETED": return "Completed";
            case "IN_ESCROW": return "Order Booked (Escrow)";
            case "PENDING": return "Awaiting Payment";
            case "DISPUTED": return "Disputed";
            case "CANCELLED": return "Cancelled";
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
                <div className={`xl:bg-white xl:rounded-[24px] xl:shadow-sm xl:border xl:border-gray-100 flex-1 overflow-hidden flex flex-col ${selectedBookingId ? "hidden xl:flex" : "flex"}`}>
                    {/* Desktop View: Table */}
                    <div className="hidden xl:block overflow-x-auto overflow-y-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Brand</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Gig Name</th>
                                    <th className="pb-4 pt-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6">Status</th>
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
                                                <div className="w-8 h-8 rounded-full relative shrink-0">
                                                    {b.brandProfile?.profileImageUrl && (
                                                        <img
                                                            src={b.brandProfile.profileImageUrl}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-100 absolute inset-0"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const fallback = e.currentTarget.nextSibling as HTMLDivElement;
                                                                if (fallback) fallback.style.display = 'flex';
                                                            }}
                                                        />
                                                    )}
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm bg-slate-100 text-slate-600"
                                                        style={{ display: b.brandProfile?.profileImageUrl ? 'none' : 'flex' }}
                                                    >
                                                        {(b.brandProfile?.companyName || "B").charAt(0)}
                                                    </div>
                                                </div>
                                                 <div className="flex flex-col">
                                                    <Link href={`/brand-profile-page?id=${b.brandProfile?._id || b.brandProfile?.userId}`} className="font-bold text-[14px] text-gray-900 truncate max-w-[150px] hover:text-emerald-600 transition-colors">
                                                        {b.brandProfile?.companyName || "Unknown Brand"}
                                                    </Link>
                                                    {b.brandProfile?.contactEmail && (
                                                        <span className="text-[11px] text-gray-400 font-medium">{b.brandProfile.contactEmail}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-500 truncate max-w-[200px]">{b.gigId?.title}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(b.status)}`}>
                                                {getStatusLabel(b.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] font-bold text-gray-900 text-right">₹{(b.influencerAmount || 0).toLocaleString()}</td>
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

                    {/* Mobile/Tablet View: Gorgeous Cards List */}
                    <div className="xl:hidden flex-1 overflow-y-auto py-2 px-1 space-y-4">
                        {filteredBookings.map((b) => (
                            <div
                                key={b._id}
                                onClick={() => setSelectedBookingId(b._id)}
                                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                                    selectedBookingId === b._id
                                        ? "bg-emerald-50/40 border-emerald-200 shadow-sm"
                                        : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full relative shrink-0">
                                            {b.brandProfile?.profileImageUrl && (
                                                <img
                                                    src={b.brandProfile.profileImageUrl}
                                                    alt=""
                                                    className="w-9 h-9 rounded-full object-cover shadow-sm bg-gray-100 absolute inset-0"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextSibling as HTMLDivElement;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                            )}
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shadow-sm bg-slate-100 text-slate-600"
                                                style={{ display: b.brandProfile?.profileImageUrl ? 'none' : 'flex' }}
                                            >
                                                {(b.brandProfile?.companyName || "B").charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-[14px] text-gray-900 leading-tight truncate">
                                                {b.brandProfile?.companyName || "Unknown Brand"}
                                            </span>
                                            {b.brandProfile?.contactEmail && (
                                                <span className="text-[11px] text-gray-400 font-medium truncate">
                                                    {b.brandProfile.contactEmail}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${getStatusStyles(b.status)}`}>
                                        {getStatusLabel(b.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2.5 border-t border-gray-50/60 min-w-0">
                                    <div className="flex flex-col min-w-0 max-w-[60%]">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Gig Title</span>
                                        <span className="text-[12px] font-bold text-gray-700 truncate">{b.gigId?.title}</span>
                                    </div>
                                    <div className="flex flex-col text-right shrink-0">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price</span>
                                        <span className="text-[13px] font-black text-gray-900">₹{(b.influencerAmount || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredBookings.length === 0 && (
                            <div className="py-20 text-center text-gray-400 text-sm italic">
                                No {activeTab.toLowerCase()} bookings found matching your search.
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Card (Right Column) */}
                <div className={`xl:w-[400px] shrink-0 h-full ${selectedBookingId ? "flex" : "hidden xl:flex"}`}>
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full sticky top-0 overflow-y-auto scrollbar-hide w-full">
                        <div className="p-6 flex flex-col min-h-full">
                            {selectedBookingId && selectedBooking ? (
                                <>
                                    {/* Back Button on mobile */}
                                    <button
                                        onClick={() => setSelectedBookingId(null)}
                                        className="xl:hidden flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-6 text-sm font-semibold -ml-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Back to Bookings
                                    </button>
                                    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Booking Details</h2>
                                    {/* Brand & Campaign Header */}
                                     <div className="bg-emerald-50/30 rounded-3xl p-5 border border-emerald-100/30 mb-6 flex flex-col items-center text-center">
                                         <div className="relative mb-3">
                                             <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center text-lg font-black text-emerald-500">
                                                 {selectedBooking.brandProfile?.profileImageUrl ? (
                                                     <Image 
                                                         src={selectedBooking.brandProfile.profileImageUrl} 
                                                         width={56} 
                                                         height={56} 
                                                         alt="" 
                                                         className="w-full h-full object-cover"
                                                         onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                     />
                                                 ) : (
                                                     (selectedBooking.brandProfile?.companyName || "B").charAt(0)
                                                 )}
                                             </div>
                                         </div>
                                         <Link href={`/brand-profile-page?id=${selectedBooking.brandProfile?._id || selectedBooking.brandProfile?.userId}`} className="hover:text-emerald-600 transition-colors">
                                             <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{selectedBooking.brandProfile?.companyName || "Unknown Brand"}</h3>
                                         </Link>
                                         <h4 className="text-[15px] font-black text-gray-900 tracking-tight leading-snug mt-2 max-w-[280px]">{selectedBooking.gigId?.title || "Campaign Booking"}</h4>
                                         {selectedBooking.gigId?.description && (
                                             <p className="text-[12px] font-semibold text-gray-400 mt-2 px-2 line-clamp-3 leading-relaxed">{selectedBooking.gigId.description}</p>
                                         )}
                                         <div className="mt-4 flex items-center justify-center gap-2">
                                             <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm ${getStatusStyles(selectedBooking.status)}`}>
                                                 {getStatusLabel(selectedBooking.status)}
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
                                            <span className="text-[13px] font-bold text-gray-900">{getStatusLabel(selectedBooking.status)}</span>
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
                                                <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-100/70"></div>
                                                {[
                                                    { label: "Request Accepted", isCompleted: true },
                                                    { label: "Funds in Escrow", isCompleted: selectedBooking.status === "IN_ESCROW" || selectedBooking.status === "COMPLETED" },
                                                    { label: "Work Submitted", isCompleted: selectedBooking.workStatus === "SUBMITTED" || selectedBooking.workStatus === "APPROVED" || selectedBooking.status === "COMPLETED" },
                                                    { label: "Work Approved", isCompleted: selectedBooking.workStatus === "APPROVED" || selectedBooking.status === "COMPLETED" },
                                                    { label: "Funds Released", isCompleted: selectedBooking.status === "COMPLETED" },
                                                ].map((step, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 relative z-10">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${step.isCompleted
                                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100"
                                                            : "bg-white border-gray-200 text-gray-300"
                                                            }`}>
                                                            {step.isCompleted ? (
                                                                <Check className="w-3 h-3" />
                                                            ) : (
                                                                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full shrink-0" />
                                                            )}
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
                                            <span className="text-[17px] font-black text-emerald-600">₹{(selectedBooking.influencerAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        {selectedBooking.status === "IN_ESCROW" && (selectedBooking.workStatus === "NOT_STARTED" || selectedBooking.workStatus === "REJECTED") ? (
                                            <div className="flex flex-col gap-4">
                                                {selectedBooking.workStatus === "REJECTED" && (
                                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-2">
                                                        <div className="flex items-center gap-2 mb-2 text-rose-600">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-[11px] font-black uppercase tracking-wider">Rejection Feedback</span>
                                                        </div>
                                                        <p className="text-xs text-rose-500 font-medium leading-relaxed">{selectedBooking.rejectionNote || "Please review the requirements and resubmit."}</p>
                                                    </div>
                                                )}

                                                <div className="relative">
                                                    <div className={`border-2 border-dashed rounded-[24px] p-8 transition-all flex flex-col items-center justify-center gap-3 ${selectedFile ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50/50"}`}>
                                                        {selectedFile ? (
                                                            <>
                                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-1 shadow-lg shadow-emerald-200">
                                                                    <FileText className="w-6 h-6" />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] mb-1">{selectedFile.name}</p>
                                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Ready to submit ({Math.round(selectedFile.size / 1024)} KB)</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedFile(null)}
                                                                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-400"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-1">
                                                                    <UploadCloud className="w-6 h-6" />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-sm font-bold text-gray-900 mb-1">Upload Deliverable</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supports common media types</p>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    disabled={uploading || !selectedFile}
                                                    onClick={() => handleFileUpload(selectedBooking._id)}
                                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 text-white font-extrabold py-4 px-4 rounded-[20px] text-[13px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/40"
                                                >
                                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    {selectedBooking.workStatus === "REJECTED" ? "Resubmit Final Work" : "Submit Output for Approval"}
                                                </button>
                                                <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest px-4 leading-relaxed mt-1">Once submitted, the brand will review and release funds to your account.</p>
                                            </div>
                                        ) : selectedBooking.workStatus === "SUBMITTED" ? (
                                            <div className="flex flex-col gap-4">
                                                <div className="w-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold py-5 px-4 rounded-[24px] text-sm text-center flex flex-col items-center gap-2">
                                                    <Clock className="w-5 h-5 animate-spin" />
                                                    <div className="flex flex-col">
                                                        <span className="uppercase tracking-widest text-[10px] mb-1">Awaiting Review</span>
                                                        <span>Pending Brand Confirmation</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Your Submission</p>
                                                    <a
                                                        href={selectedBooking.deliverableUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <p className="text-[13px] font-bold text-gray-900 truncate">Deliverable File</p>
                                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Open Link</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        ) : selectedBooking.status === "COMPLETED" ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="p-4 bg-emerald-50 rounded-[24px] border border-emerald-100 flex items-center gap-4 mb-2">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                                        <CheckCircle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-black text-gray-900">Project Completed</p>
                                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Funds available</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => window.location.href = "/influencer-dashboard/earnings"}
                                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-[20px] text-sm transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                                                >
                                                    Manage Earnings
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-3.5 px-4 rounded-[16px] text-sm transition-all flex items-center justify-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Cancel Booking
                                            </button>
                                        )}
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
    );
}
