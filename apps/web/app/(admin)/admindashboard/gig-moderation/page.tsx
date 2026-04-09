"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
    Briefcase,
    AlertCircle,
    PauseCircle,
    DollarSign,
    Filter,
    Search,
    CheckCircle,
    Flag,
    TrendingUp,
    Download,
    Plus,
    ChevronDown
} from "lucide-react";

import MetricCard from "@/components/admindashboard/MetricCard";
import MetricCardSkeleton from "@/components/admindashboard/MetricCardSkeleton";
import GigsTabs from "@/components/admindashboard/GigsTabs";
import GigsTable, { type Gig } from "@/components/admindashboard/GigsTable";
import DeleteConfirmationModal from "@/components/admindashboard/DeleteConfirmationModal";
import { FadeIn } from "@/components/animations/FadeIn";
import api from "@/lib/axios.client";
import { useGigStats } from "@/hooks/useGigStats";

export default function GigsModerationPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [isAtRest, setIsAtRest] = useState<boolean>(false);

    const { stats, loading: statsLoading } = useGigStats();

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [allGigs, setAllGigs] = useState<Gig[]>([]);

    // Computed counts for GigsTabs based on allGigs currently held in state
    const tabCounts = useMemo(() => ({
        all: allGigs.length,
        reported: allGigs.filter((g) => g.status === "reported").length,
        paused: allGigs.filter((g) => g.status === "paused").length,
    }), [allGigs]);

    const handleDeleteClick = (gig: Gig) => {
        setSelectedGig(gig);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedGig) return;
        try {
            await api.delete(`/gigs/${selectedGig._id}`);
            setAllGigs((prev) => prev.filter((g) => g._id !== selectedGig._id));
        } catch (error) {
            console.error("Failed to delete gig:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedGig(null);
        }
    }, [selectedGig]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <FadeIn delay={0}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">Gig Moderation</h1>
                        <p className="text-gray-400 font-bold text-sm">Review and manage influencer service listings to ensure platform compliance.</p>
                    </div>

                </div>
            </FadeIn>

            {/* Metrics Grid */}
            <FadeIn onDone={() => setIsAtRest(true)} delay={0.1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsLoading ? (
                        <>
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                            <MetricCardSkeleton startLoading={isAtRest} />
                        </>
                    ) : (
                        <>
                            <MetricCard
                                title="Active Gigs"
                                value={stats.activeGigs.toLocaleString()}
                                change="+5.2%"
                                isPositive={true}
                                icon={CheckCircle}
                                iconColor="text-emerald-500"
                                iconBg="bg-emerald-50"
                            />
                            <MetricCard
                                title="Reported Gigs"
                                value={stats.reportedGigs.toLocaleString()}
                                status={stats.reportedGigs > 0 ? "Action Required" : "All Clear"}
                                icon={Flag}
                                iconColor="text-red-500"
                                iconBg="bg-red-50"
                            />
                            <MetricCard
                                title="Paused Gigs"
                                value={stats.pausedGigs.toLocaleString()}
                                status="Stable"
                                icon={PauseCircle}
                                iconColor="text-orange-500"
                                iconBg="bg-orange-50"
                            />
                            <MetricCard
                                title="Total Revenue (Gigs)"
                                value={`₹${stats.totalRevenue.toLocaleString()}`}
                                change="+12.4%"
                                isPositive={true}
                                icon={TrendingUp}
                                iconColor="text-blue-500"
                                iconBg="bg-blue-50"
                            />
                        </>
                    )}
                </div>
            </FadeIn>

            {/* Moderation Controls & Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <GigsTabs activeTab={activeTab} onChange={setActiveTab} />

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group min-w-[280px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#111827] transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search gigs, influencers..."
                                className="w-full pl-11 pr-4 py-3 text-sm font-bold text-[#111827] bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-100 focus:ring-4 focus:ring-gray-100/50 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <button className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl text-gray-500 font-bold text-sm transition-all shadow-sm group">
                            Platform: <span className="text-[#111827]">All</span>
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>

                        <button className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl text-gray-500 font-bold text-sm transition-all shadow-sm group">
                            Price: <span className="text-[#111827]">Any</span>
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>

                        <button className="p-3 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl text-gray-400 hover:text-[#111827] transition-all shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <FadeIn delay={0.2}>
                    <GigsTable
                        onDeleteClick={handleDeleteClick}
                        statusFilter={activeTab}
                        searchQuery={searchQuery}
                        onGigsLoaded={setAllGigs}
                    />
                </FadeIn>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
