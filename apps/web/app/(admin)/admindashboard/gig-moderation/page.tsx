"use client";
import React, { useState } from "react";
import {
    Bell,
    Download,
    Plus,
    Menu,
    Briefcase,
    AlertCircle,
    PauseCircle,
    DollarSign,
    Filter,
    Search
} from "lucide-react";

import Sidebar from "@/components/admindashboard/Sidebar";
import MetricCard from "@/components/admindashboard/MetricCard";
import GigsTabs from "@/components/admindashboard/GigsTabs";
import GigsTable from "@/components/admindashboard/GigsTable";
import DeleteConfirmationModal from "@/components/admindashboard/DeleteConfirmationModal";

export default function GigsModerationPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGig, setSelectedGig] = useState<unknown>(null);

    const handleDeleteClick = (gig: unknown) => {
        setSelectedGig(gig);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedGig && typeof selectedGig === 'object' && 'id' in selectedGig) {
            console.log("Deleting gig:", selectedGig.id);
        }
        // Add actual delete logic here
    };

    return (
        <>
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Gig Moderation</h1>
                <p className="text-gray-400 font-medium font-sans">Review and manage influencer service listings to ensure platform compliance.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                    title="Active Gigs"
                    value="4,281"
                    change="5.2%"
                    isPositive={true}
                    icon={Briefcase}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50"
                />
                <MetricCard
                    title="Reported Gigs"
                    value="24"
                    status="Action Required"
                    icon={AlertCircle}
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                />
                <MetricCard
                    title="Paused Gigs"
                    value="156"
                    status="Stable"
                    icon={PauseCircle}
                    iconColor="text-orange-500"
                    iconBg="bg-orange-50"
                />
                <MetricCard
                    title="Total Revenue (Gigs)"
                    value="$84,250.00"
                    change="12.4%"
                    isPositive={true}
                    icon={DollarSign}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
            </div>

            {/* Moderation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <GigsTabs />
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80 group">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search gigs, influencers..."
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold text-[#111827] bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Gigs Table */}
            <GigsTable onDeleteClick={handleDeleteClick} />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
