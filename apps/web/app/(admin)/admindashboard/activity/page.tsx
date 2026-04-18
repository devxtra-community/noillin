"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, ChevronLeft, User } from "lucide-react";

import { cn } from "@/lib/utils";
import api from "@/lib/axios.client";
import { FadeIn } from "@/components/animations/FadeIn";

interface Activity {
    id: string;
    type: "signup" | "gig" | "booking";
    title: string;
    entityName: string;
    entityImage?: string;
    createdAt: string;
    status: string;
    icon: string;
}

const statusColors: Record<string, string> = {
    signup: "bg-orange-50 text-orange-600 border-orange-100",
    gig: "bg-blue-50 text-blue-600 border-blue-100",
    booking: "bg-emerald-50 text-emerald-600 border-emerald-100",
    default: "bg-gray-50 text-gray-600 border-gray-100",
};

export default function AllActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = useCallback(async () => {
        try {
            const response = await api.get("/admin/recent-activity?limit=50");
            if (response.data.success) {
                setActivities(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch all activity:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    return (
        <div className="min-h-screen bg-[#FDFEFE] p-4 lg:p-8 space-y-8">
            <FadeIn>
                <div className="flex flex-col gap-6">
                    <Link
                        href="/admindashboard"
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors font-bold text-sm"
                    >
                        <ChevronLeft size={16} />
                        Back to Overview
                    </Link>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">Platform History</h1>
                        <p className="text-gray-400 font-bold text-sm">Full audit log of recent signups, listings, and transactions.</p>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                {loading ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm font-bold animate-pulse">Synchronizing platform data...</p>
                    </div>
                ) : !activities.length ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-20 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <Info size={32} />
                        </div>
                        <p className="text-gray-400 text-sm font-bold">No platform activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                        <th className="px-8 py-5">Event Type</th>
                                        <th className="px-8 py-5">Platform Entity</th>
                                        <th className="px-8 py-5">Current Status</th>
                                        <th className="px-8 py-5">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activities.map((activity) => (
                                        <tr key={activity.id} className="group hover:bg-gray-50/50 transition-all cursor-default">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                                                        {activity.icon}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{activity.title}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold tracking-tight uppercase">#{activity.id.toString().slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    {activity.entityImage ? (
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 relative overflow-hidden ring-2 ring-gray-50">
                                                            <Image unoptimized fill src={activity.entityImage} className="object-cover" alt="" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 ring-2 ring-gray-50">
                                                            <User size={12} />
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-gray-600 font-medium max-w-[200px] truncate">{activity.entityName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2.5 py-1.5 rounded-lg border capitalize tracking-tight",
                                                    statusColors[activity.type] || statusColors.default
                                                )}>
                                                    {activity.status.toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-[11px] text-gray-400">
                                                {new Date(activity.createdAt).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </FadeIn>
        </div>
    );
}
