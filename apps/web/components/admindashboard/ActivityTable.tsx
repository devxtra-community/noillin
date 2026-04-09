"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import api from "@/lib/axios.client";

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

// Helper for relative time
function formatRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
}

export default function ActivityTable() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = useCallback(async () => {
        try {
            const response = await api.get("/admin/recent-activity");
            if (response.data.success) {
                setActivities(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch recent activity:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full p-8 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm font-bold">Fetching latest updates...</p>
            </div>
        );
    }

    if (!activities.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full p-12 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <Info size={24} />
                </div>
                <p className="text-gray-400 text-sm font-bold">No recent activity found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Recent Platform Activity</h3>
                <Link href="/admindashboard/activity" className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                            <th className="px-6 py-4">Activity</th>
                            <th className="px-6 py-4">Entity</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {activities.map((activity) => (
                            <tr key={activity.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs">
                                            {activity.icon}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{activity.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {activity.entityImage && (
                                            <div className="w-5 h-5 rounded-full bg-gray-100 relative overflow-hidden">
                                                <Image
                                                    unoptimized
                                                    fill
                                                    src={activity.entityImage}
                                                    className="object-cover"
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-600 max-w-[150px] truncate">{activity.entityName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-1 rounded-md border capitalize",
                                        statusColors[activity.type] || statusColors.default
                                    )}>
                                        {activity.status.toLowerCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-400 font-medium">{formatRelativeTime(activity.createdAt)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
