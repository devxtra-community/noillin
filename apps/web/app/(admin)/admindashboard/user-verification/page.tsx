"use client";
import React, { useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    Briefcase,
    DollarSign,
    Search,
    Clock,
    Zap
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import VerificationTable from "@/components/admindashboard/VerificationTable";
import TableSkeleton from "@/components/admindashboard/TableSkeleton";
import VerificationTabs from "@/components/admindashboard/VerificationTabs";
import UserDetailsDrawer from "@/components/admindashboard/UserDetailsDrawer";
import api from "@/lib/axios.client";
import { useAdminStats } from "@/hooks/useAdminStats";
import { FadeIn } from "@/components/animations/FadeIn";

export default function VerificationPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAtRest, setIsAtRest] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState("all");

    const { requests, userCount, gigCount, loading, refresh } = useAdminStats();

    // Filter requests based on active tab
    const filteredRequests = requests.filter((r) => {
        if (activeTab === "all") return true;
        if (activeTab === "influencers") return r.role === "INFLUENCER";
        if (activeTab === "brands") return r.role === "BRAND";
        return true;
    });

    const tabCounts = {
        all: requests.length,
        influencers: requests.filter((r) => r.role === "INFLUENCER").length,
        brands: requests.filter((r) => r.role === "BRAND").length,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectUser = (user: any) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const handleApprove = async (email: string) => {
        try {
            const response = await api.post("/admin/signup/approve", { email });
            if (response.data.success) {
                // Refresh list
                refresh();
            }
        } catch (error) {
            console.error("Failed to approve:", error);
        }
    };

    const handleReject = async (email: string) => {
        try {
            const response = await api.post("/admin/signup/reject", { email });
            if (response.data.success) {
                // Refresh list
                refresh();
            }
        } catch (error) {
            console.error("Failed to reject:", error);
        }
    };

    return (
        <>
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">User Verification</h1>
                <p className="text-gray-400 font-medium font-sans">Review and manage pending influencer and brand applications.</p>
            </div>

            {/* Metric Cards */}
            <FadeIn onDone={() => setIsAtRest(true)} delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
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
                                icon={Clock}
                                iconColor="text-orange-500"
                                iconBg="bg-orange-50"
                            />
                            <MetricCard
                                title="Total Gigs"
                                value={gigCount}
                                status="Live Now"
                                icon={Zap}
                                iconColor="text-blue-500"
                                iconBg="bg-blue-50"
                            />
                            <MetricCard
                                title="Today's Revenue"
                                value="$12,450.00"
                                change="8.4%"
                                isPositive={true}
                                icon={DollarSign}
                                iconColor="text-emerald-500"
                                iconBg="bg-emerald-50"
                            />
                        </>
                    )}
                </div>
            </FadeIn>

            {/* Verification Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <VerificationTabs activeTab={activeTab} onChange={setActiveTab} counts={tabCounts} />
                <div className="w-full sm:w-80 group">
                    <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 text-xs font-bold text-[#111827] bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Verification Table */}
            <FadeIn>
                {loading ? (
                    <TableSkeleton startLoading={isAtRest} />
                ) : (
                    <VerificationTable
                        requests={filteredRequests}
                        onSelectUser={handleSelectUser}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        loading={loading}
                    />
                )}
            </FadeIn>

            {/* User Details Drawer */}
            <UserDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                user={selectedUser}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    );
}
