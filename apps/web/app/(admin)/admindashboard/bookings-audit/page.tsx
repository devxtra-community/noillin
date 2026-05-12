"use client";
import React, { useState, useEffect } from "react";
import {
    Search,
    CheckCircle,
    Clock,
    DollarSign,
    RefreshCw,
    Filter,
    Download
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import TableSkeleton from "@/components/admindashboard/TableSkeleton";
import InvestigationSkeleton from "@/components/admindashboard/InvestigationSkeleton";
import BookingsTabs from "@/components/admindashboard/BookingsTabs";
import BookingsTable, { Booking } from "@/components/admindashboard/BookingsTable";
import { FadeIn } from "@/components/animations/FadeIn";
import InvestigationView from "@/components/admindashboard/InvestigationView";
import { AdminGuard } from "@/components/rbac/Guards";
import api from "@/lib/axios.client";

interface Metrics {
    completedBookings: number;
    pendingPayments: number;
    activeEscrows: number;
    totalVolume: number;
}

export default function BookingsAuditPage() {
    const [isAtRest, setIsAtRest] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [auditData, setAuditData] = useState<{ metrics: Metrics; bookings: Booking[] } | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);


    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await api.get("/admin/bookings");
                if (response.data.success) {
                    setAuditData(response.data.data);
                    // Automatically select the first booking if available
                    if (response.data.data.bookings.length > 0) {
                        setSelectedBooking(response.data.data.bookings[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch bookings audit data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuditData();
    }, []);

    const metrics = auditData?.metrics || {
        completedBookings: 0,
        pendingPayments: 0,
        activeEscrows: 0,
        totalVolume: 0
    };

    return (
        <AdminGuard>
            <div className="flex gap-8">
                {/* Left Column: Metrics & Table */}
                <div className="flex-1 space-y-8 min-w-0">
                    {/* Welcome Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-none">Bookings & Payments Audit</h1>
                            <p className="text-gray-400 font-medium font-sans">Investigate transaction history and booking lifecycles. Read-only access.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-[#111827] shadow-sm hover:bg-gray-50 transition-all">
                            <Download size={16} className="text-gray-400" />
                            Export Audit Log
                        </button>
                    </div>

                    {/* Metric Cards */}
                    <FadeIn onDone={() => setIsAtRest(true)} delay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {isLoading ? (
                                <>
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                </>
                            ) : (
                                <>
                                    <MetricCard
                                        title="Completed Bookings"
                                        value={metrics.completedBookings.toLocaleString()}
                                        change="8.2%"
                                        isPositive={true}
                                        icon={CheckCircle}
                                        iconColor="text-emerald-600"
                                        iconBg="bg-emerald-50"
                                    />
                                    <MetricCard
                                        title="Pending Payments"
                                        value={metrics.pendingPayments.toLocaleString()}
                                        status="Review Needed"
                                        icon={Clock}
                                        iconColor="text-orange-600"
                                        iconBg="bg-orange-50"
                                    />
                                    <MetricCard
                                        title="Active Escrows"
                                        value={metrics.activeEscrows.toLocaleString()}
                                        status="Stable"
                                        icon={RefreshCw}
                                        iconColor="text-blue-600"
                                        iconBg="bg-blue-50"
                                    />
                                    <MetricCard
                                        title="Total Volume (Life)"
                                        value={`₹${metrics.totalVolume.toLocaleString()}`}
                                        change="14.1%"
                                        isPositive={true}
                                        icon={DollarSign}
                                        iconColor="text-emerald-600"
                                        iconBg="bg-emerald-50"
                                    />
                                </>
                            )}
                        </div>
                    </FadeIn>

                    {/* Moderation Controls */}
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-2">
                        <BookingsTabs />
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-80 group">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search ID, Brand..."
                                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                />
                            </div>
                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all shadow-sm">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <FadeIn delay={0.2}>
                        {isLoading ? (
                            <TableSkeleton startLoading={isAtRest} />
                        ) : (
                            <BookingsTable bookings={auditData?.bookings || []} onSelect={setSelectedBooking} />
                        )}
                    </FadeIn>
                </div>

                {/* Right Column: Investigation View */}
                <div className="hidden min-[1600px]:block">
                    <FadeIn delay={0.3}>
                        {isLoading ? (
                            <InvestigationSkeleton startLoading={isAtRest} />
                        ) : (
                            <InvestigationView booking={selectedBooking} />
                        )}
                    </FadeIn>
                </div>
            </div>
        </AdminGuard>
    );
}

