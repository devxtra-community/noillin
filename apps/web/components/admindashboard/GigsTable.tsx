"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Eye, Trash2, Info, Youtube, Instagram, PlayCircle, PauseCircle } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import api from "@/lib/axios.client";

// Simple custom TikTok icon since lucide might not have it or it might be different
const TikTokIcon = ({ size = 16, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.6-1.51-2.03-2.52-.02 4.17-.01 8.33-.02 12.5 0 .09-.01.18-.02.26a6.115 6.115 0 0 1-8.23 5.48c-1.12-.42-2.11-1.18-2.82-2.18-.73-1.04-1.09-2.31-1-3.58.07-1.39.67-2.73 1.69-3.69 1-.95 2.37-1.47 3.75-1.43 0 1.34-.01 2.67-.01 4.01-.84-.04-1.74.22-2.38.79-.64.58-.91 1.5-.7 2.33.2.82.91 1.45 1.75 1.58.55.08 1.12-.04 1.58-.35.48-.32.8-.84.87-1.41.02-.34.02-.68.02-1.02 0-5.83.01-11.66.01-17.5z" />
    </svg>
);

export interface Influencer {
    _id: string;
    displayName: string;
    profileImage?: string;
}

export interface Gig {
    _id: string;
    title: string;
    platform: "instagram" | "youtube" | "tiktok";
    status: "draft" | "published" | "paused" | "archived" | "reported";
    pricing: { basePrice: number; currency: "INR" | "USD" };
    primaryInfluencerId: Influencer;
    createdAt?: string;
}

const statusStyle: Record<string, { bg: string, text: string, dot: string }> = {
    published: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    active: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" }, // Support "active" alias from image
    draft: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
    paused: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
    reported: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-500" },
    archived: { bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
};

const platformConfig: Record<string, { icon: React.ElementType, color: string }> = {
    instagram: { icon: Instagram, color: "text-pink-500" },
    youtube: { icon: Youtube, color: "text-red-500" },
    tiktok: { icon: TikTokIcon, color: "text-[#111827]" },
};

interface GigsTableProps {
    onDeleteClick: (gig: Gig) => void;
    statusFilter?: string;
    searchQuery?: string;
    onGigsLoaded?: (gigs: Gig[]) => void;
}

export default function GigsTable({ onDeleteClick, statusFilter = "all", searchQuery = "", onGigsLoaded }: GigsTableProps) {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const fetchGigs = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = {
                page,
                limit,
                status: statusFilter === "all" ? "" : statusFilter
            };
            const response = await api.get("/gigs", { params });
            const data = response.data;

            // Map data and ensure types
            const fetchedGigs = (data.data ?? []).map((g: Gig) => ({
                ...g,
                // Handle different status names if necessary
                status: g.status === "published" && statusFilter === "all" ? "active" : g.status
            }));

            setGigs(fetchedGigs);
            setTotalPages(data.pagination?.totalPages ?? 1);
            setTotal(data.pagination?.total ?? 0);
            onGigsLoaded?.(fetchedGigs);
        } catch (error) {
            console.error("Failed to fetch gigs:", error);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, onGigsLoaded]);

    useEffect(() => {
        fetchGigs();
    }, [fetchGigs]);

    // Local search filter (secondary)
    const filtered = gigs.filter((g) => {
        const searchMatch = !searchQuery ||
            g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.primaryInfluencerId?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-24 flex flex-col items-center justify-center gap-4 shadow-sm">
                <div className="w-12 h-12 border-4 border-[#111827]/5 border-t-[#111827] rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-sm">Organizing your listings...</p>
            </div>
        );
    }

    if (!filtered.length) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-24 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <Info size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-[#111827]">No match found</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50/80">
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30">Gig Title</th>
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30">Influencer</th>
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30">Platform</th>
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30">Price</th>
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30">Status</th>
                            <th className="px-8 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50/30 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                        {filtered.map((gig) => {
                            const platform = platformConfig[gig.platform?.toLowerCase() || ""] || { icon: Info, color: "text-gray-400" };
                            const status = statusStyle[gig.status || "draft"] || statusStyle.draft;

                            return (
                                <tr key={gig._id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                <Image unoptimized fill src={`https://picsum.photos/seed/${gig._id}/200/200`} alt="" className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111827] group-hover:text-emerald-600 transition-colors">{gig.title}</p>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: GIG-{gig._id.slice(-4).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden relative border border-white shadow-sm">
                                                <Image unoptimized fill src={gig.primaryInfluencerId?.profileImage || `https://i.pravatar.cc/150?u=${gig.primaryInfluencerId?._id}`} alt="" className="object-cover" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{gig.primaryInfluencerId?.displayName || "Influencer"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                            <platform.icon size={18} className={platform.color} />
                                            <span className="text-xs font-bold text-gray-500 capitalize">{gig.platform}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="text-sm font-extrabold text-[#111827]">
                                            {gig.pricing.currency === "INR" ? "₹" : "$"}{gig.pricing.basePrice.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full", status.bg)}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", status.dot)} />
                                            <span className={cn("text-[11px] font-extrabold capitalize leading-none", status.text)}>
                                                {gig.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2 ">
                                            <button className="p-2.5 text-gray-400 hover:text-[#111827] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-xl transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-xl transition-all">
                                                {gig.status === "paused" ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(gig)}
                                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-[11px] font-bold text-gray-400 hover:text-[#111827] transition-all disabled:opacity-30 uppercase tracking-widest"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={cn(
                                    "w-9 h-9 flex items-center justify-center rounded-xl text-[11px] font-bold transition-all shadow-sm",
                                    page === p
                                        ? "bg-emerald-500 text-white shadow-emerald-100"
                                        : "bg-white border border-gray-100 hover:border-gray-200 text-[#111827]"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-[11px] font-bold text-gray-400 hover:text-[#111827] transition-all disabled:opacity-30 uppercase tracking-widest"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
