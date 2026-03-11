"use client";
import React, { useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    Briefcase,
    DollarSign,
    Search
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import VerificationTable from "@/components/admindashboard/VerificationTable";
import VerificationTabs from "@/components/admindashboard/VerificationTabs";
import UserDetailsDrawer from "@/components/admindashboard/UserDetailsDrawer";
import api from "@/lib/axios.client";

export default function VerificationPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/signup/");
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

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
                fetchRequests();
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
                fetchRequests();
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
                    value={requests.length.toString()}
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

            {/* Verification Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <VerificationTabs />
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
            <VerificationTable
                requests={requests}
                onSelectUser={handleSelectUser}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={loading}
            />

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
