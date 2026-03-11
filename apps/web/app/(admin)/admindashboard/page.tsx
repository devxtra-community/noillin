"use client";
import React, { useState } from "react";
import {
    Users,
    UserCheck,
    Briefcase,
    DollarSign,
    Search,
    Bell,
    Download,
    Plus,
    Menu
} from "lucide-react";

import Sidebar from "@/components/admindashboard/Sidebar";
import MetricCard from "@/components/admindashboard/MetricCard";
import ActivityTable from "@/components/admindashboard/ActivityTable";
import StatsChart from "@/components/admindashboard/StatsChart";
import SystemHealth from "@/components/admindashboard/SystemHealth";

export default function DashboardPage() {
    return (
        <>
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Platform Overview</h1>
                <p className="text-gray-400 font-medium font-sans">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Users"
                    value="24,512"
                    change="12%"
                    isPositive={true}
                    icon={Users}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50"
                />
                <MetricCard
                    title="Pending Verifications"
                    value="128"
                    status="Action Required"
                    icon={UserCheck}
                    iconColor="text-orange-500"
                    iconBg="bg-orange-50"
                />
                <MetricCard
                    title="Active Gigs"
                    value="1,842"
                    status="Live Now"
                    icon={Briefcase}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-50"
                />
                <MetricCard
                    title="Today's Revenue"
                    value="$12,450.00"
                    change="8.4%"
                    isPositive={true}
                    icon={DollarSign}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                />
            </div>

            {/* Main Grid: Activity and Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
                <div className="xl:col-span-2">
                    <ActivityTable />
                </div>

                <div className="flex flex-col gap-6 h-full ">
                    <div className="flex-1">
                        <StatsChart />
                    </div>
                    <div className="flex-1">
                        <SystemHealth />
                    </div>
                </div>
            </div>
        </>
    );
}
