"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Search,
    Clock,
    CheckCircle2,
    Users,
    Filter
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import TableSkeleton from "@/components/admindashboard/TableSkeleton";
import InvestigationSkeleton from "@/components/admindashboard/InvestigationSkeleton";
import DisputeTabs from "@/components/admindashboard/DisputeTabs";
import DisputeTable, { Report } from "@/components/admindashboard/DisputeTable";
import DisputeInvestigation from "@/components/admindashboard/DisputeInvestigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { AdminGuard } from "@/components/rbac/Guards";
import api from "@/lib/axios.client";

export default function DisputesReportsPage() {
    const [isAtRest, setIsAtRest] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);


    const fetchReports = useCallback(async () => {
        try {
            const res = await api.get("/admin/reports");
            setReports(res.data.data);
            if (res.data.data.length > 0 && !selectedReportId) {
                setSelectedReportId(res.data.data[0]._id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedReportId]);

    useEffect(() => {
        fetchReports();
        const timer = setTimeout(() => setIsAtRest(true), 500);
        return () => clearTimeout(timer);
    }, [fetchReports]);

    return (
        <AdminGuard>
            <div className="flex gap-8">
                {/* Left Column: Metrics & Table */}
                <div className="flex-1 space-y-8 min-w-0">
                    {/* Welcome Header */}
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-none">Disputes & Reports</h1>
                        <p className="text-gray-400 font-medium font-sans">Resolve conflicts safely and transparently.</p>
                    </div>

                    {/* Metrics Grid */}
                    <FadeIn onDone={() => setIsAtRest(true)} delay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {isLoading ? (
                                <>
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                    <MetricCardSkeleton startLoading={isAtRest} />
                                </>
                            ) : (
                                <>
                                    <MetricCard
                                        title="Pending Review"
                                        value="14"
                                        status="Urgent"
                                        icon={Clock}
                                        iconColor="text-orange-500"
                                        iconBg="bg-orange-50"
                                    />
                                    <MetricCard
                                        title="Resolved Today"
                                        value="38"
                                        change="+12%"
                                        isPositive={true}
                                        icon={CheckCircle2}
                                        iconColor="text-emerald-500"
                                        iconBg="bg-emerald-50"
                                    />
                                    <MetricCard
                                        title="Avg. Resolution Time"
                                        value="4.2h"
                                        icon={Users}
                                        iconColor="text-[#111827]"
                                        iconBg="bg-gray-100"
                                    />
                                </>
                            )}
                        </div>
                    </FadeIn>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-2">
                        <DisputeTabs />
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-80 group">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Report ID..."
                                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                />
                            </div>
                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all shadow-sm">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Disputes Table */}
                    <FadeIn delay={0.2}>
                        {isLoading ? (
                            <TableSkeleton startLoading={isAtRest} />
                        ) : (
                            <DisputeTable reports={reports} selectedReportId={selectedReportId} onSelect={setSelectedReportId} />
                        )}
                    </FadeIn>
                </div>

                {/* Right Column: Investigation View */}
                <div className="hidden min-[1600px]:block">
                    <FadeIn delay={0.3}>
                        {isLoading ? (
                            <InvestigationSkeleton startLoading={isAtRest} />
                        ) : (
                            <DisputeInvestigation reportId={selectedReportId} onReportResolved={fetchReports} />
                        )}
                    </FadeIn>
                </div>
            </div>
        </AdminGuard>
    );
}
