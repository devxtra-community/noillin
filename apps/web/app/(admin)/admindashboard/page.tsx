"use client";
import React, { useState } from "react";
import {
    Users,
    UserCheck,
    Briefcase,
    DollarSign
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import ActivityTable from "@/components/admindashboard/ActivityTable";
import StatsChart from "@/components/admindashboard/StatsChart";
import SystemHealth from "@/components/admindashboard/SystemHealth";
import TableSkeleton from "@/components/admindashboard/TableSkeleton";
import StatsChartSkeleton from "@/components/admindashboard/StatsChartSkeleton";
import SystemHealthSkeleton from "@/components/admindashboard/SystemHealthSkeleton";
import { useAdminStats } from "@/hooks/useAdminStats";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { requests, userCount, gigCount, revenue, loading } = useAdminStats();
    const [isAtRest, setIsAtRest] = useState<boolean>(false)
    return (
        <>
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                <FadeIn delay={0}>
                    <div className="space-y-1">
                        <h1 className="text-title-lg text-gray-900">Platform Overview</h1>
                        <p className="text-body-md text-gray-500">Welcome back, here&apos;s what&apos;s happening today.</p>
                    </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <Button variant="default" className="shadow-lg hover:shadow-xl transition-all cursor-pointer">Download Report</Button>
                </FadeIn>
            </div>

            {/* Metrics Grid */}

            <FadeIn onDone={() => setIsAtRest(true)} delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <>
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                        </>
                    ) : (
                        <>
                            <MetricCard
                                title="Total Users"
                                value={userCount}
                                change="12%"
                                isPositive={true}
                                icon={Users}
                                iconColor="text-emerald-500"
                                iconBg="bg-emerald-50"
                            />
                            <MetricCard
                                title="Pending Verifications"
                                value={requests.length}
                                status="Action Required"
                                icon={UserCheck}
                                iconColor="text-orange-500"
                                iconBg="bg-orange-50"
                            />
                            <MetricCard
                                title="Total Gigs"
                                value={gigCount}
                                status="Live Now"
                                icon={Briefcase}
                                iconColor="text-blue-500"
                                iconBg="bg-blue-50"
                            />
                            <MetricCard
                                title="Platform Revenue"
                                value={`₹${(revenue || 0).toLocaleString()}`}
                                change="10.5%"
                                isPositive={true}
                                icon={DollarSign}
                                iconColor="text-emerald-600"
                                iconBg="bg-emerald-50"
                            />
                        </>
                    )}
                </div>
            </FadeIn>

            {/* Main Grid: Activity and Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
                <div className="xl:col-span-2">
                    <FadeIn delay={0.3}>
                        {loading ? <TableSkeleton startLoading={isAtRest} /> : <ActivityTable />}
                    </FadeIn>
                </div>
                <div className="flex flex-col gap-6 h-full ">
                    <div className="flex-1">
                        <FadeIn delay={0.4}>
                            {loading ? <StatsChartSkeleton startLoading={isAtRest} /> : <StatsChart />}
                        </FadeIn>
                    </div>
                    <div className="flex-1">
                        <FadeIn delay={0.5}>
                            {loading ? <SystemHealthSkeleton startLoading={isAtRest} /> : <SystemHealth />}
                        </FadeIn>
                    </div>
                </div>
            </div >
        </>
    );
}
