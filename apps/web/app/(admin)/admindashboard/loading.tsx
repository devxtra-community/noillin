"use client";
import React, { useState } from "react";

import { FadeIn } from "@/components/animations/FadeIn";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import TableSkeleton from "@/components/admindashboard/TableSkeleton";
import StatsChartSkeleton from "@/components/admindashboard/StatsChartSkeleton";
import SystemHealthSkeleton from "@/components/admindashboard/SystemHealthSkeleton";

export default function AdminDashboardLoading() {
    const [isAtRest, setIsAtRest] = useState<boolean>(false);

    return (
        <>
            {/* Header Placeholder */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                <FadeIn delay={0}>
                    <div className="space-y-1">
                        <div className="w-48 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="w-64 h-4 rounded-lg bg-gray-200 animate-pulse"></div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <div className="w-32 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                </FadeIn>
            </div>

            {/* Skeletons mimicking the Dashboard Metrics Grid */}
            <FadeIn onDone={() => setIsAtRest(true)} delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <MetricCardSkeleton startLoading={isAtRest} />
                    <MetricCardSkeleton startLoading={isAtRest} />
                    <MetricCardSkeleton startLoading={isAtRest} />
                    <MetricCardSkeleton startLoading={isAtRest} />
                </div>
            </FadeIn>

            {/* Main Grid Skeletons */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <FadeIn delay={0.3}>
                        <TableSkeleton startLoading={isAtRest} />
                    </FadeIn>
                </div>
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex-1">
                        <FadeIn delay={0.4}>
                            <StatsChartSkeleton startLoading={isAtRest} />
                        </FadeIn>
                    </div>
                    <div className="flex-1">
                        <FadeIn delay={0.5}>
                            <SystemHealthSkeleton startLoading={isAtRest} />
                        </FadeIn>
                    </div>
                </div>
            </div>
        </>
    );
}
