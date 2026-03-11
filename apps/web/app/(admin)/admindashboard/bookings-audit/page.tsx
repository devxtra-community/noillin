"use client";
import React from "react";
import {
    Search,
    CheckCircle,
    Clock,
    DollarSign,
    RefreshCw,
    Filter
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import BookingsTabs from "@/components/admindashboard/BookingsTabs";
import BookingsTable from "@/components/admindashboard/BookingsTable";
import InvestigationView from "@/components/admindashboard/InvestigationView";
import { AdminGuard } from "@/components/rbac/Guards";

export default function BookingsAuditPage() {
    return (
        <AdminGuard level="SUPER">
            <div className="flex gap-8">
                {/* Left Column: Metrics & Table */}
                <div className="flex-1 space-y-8 min-w-0">
                    {/* Welcome Header */}
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-none">Bookings & Payments Audit</h1>
                        <p className="text-gray-400 font-medium font-sans">Investigate transaction history and booking lifecycles. Read-only access.</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <MetricCard
                            title="Completed Bookings"
                            value="1,284"
                            change="8.2%"
                            isPositive={true}
                            icon={CheckCircle}
                            iconColor="text-emerald-500"
                            iconBg="bg-emerald-50"
                        />
                        <MetricCard
                            title="Pending Payments"
                            value="42"
                            status="Review Needed"
                            icon={Clock}
                            iconColor="text-orange-500"
                            iconBg="bg-orange-50"
                        />
                        <MetricCard
                            title="Active Escrows"
                            value="156"
                            status="Stable"
                            icon={RefreshCw}
                            iconColor="text-blue-500"
                            iconBg="bg-blue-50"
                        />
                        <MetricCard
                            title="Total Volume (MTD)"
                            value="$248,500.00"
                            change="14.1%"
                            isPositive={true}
                            icon={DollarSign}
                            iconColor="text-[#111827]"
                            iconBg="bg-gray-100"
                        />
                    </div>

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
                    <BookingsTable />
                </div>

                {/* Right Column: Investigation View */}
                <div className="hidden min-[1600px]:block">
                    <InvestigationView />
                </div>
            </div>
        </AdminGuard>
    );
}
