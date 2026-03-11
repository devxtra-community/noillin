import React from "react";

import { cn } from "@/lib/utils";

const activities = [
    {
        icon: "👤",
        title: "New Signup",
        entity: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=alex" },
        status: "Pending Verification",
        time: "2 mins ago",
        statusColor: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
        icon: "📅",
        title: "New Booking",
        entity: { name: "Summer Campaign" },
        status: "Confirmed",
        time: "14 mins ago",
        statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
        icon: "🎬",
        title: "New Gig Published",
        entity: { name: "UGC Video Review" },
        status: "Active",
        time: "45 mins ago",
        statusColor: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        icon: "⚠️",
        title: "Dispute Raised",
        entity: { name: "Order #8821" },
        status: "Urgent",
        time: "1 hour ago",
        statusColor: "bg-red-50 text-red-600 border-red-100",
    },
    {
        icon: "💰",
        title: "Payout Processed",
        entity: { name: "$1,200.00" },
        status: "Completed",
        time: "3 hours ago",
        statusColor: "bg-gray-50 text-gray-600 border-gray-100",
    },
];

export default function ActivityTable() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Recent Platform Activity</h3>
                <button className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
                    View All
                </button>
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
                        {activities.map((activity, idx) => (
                            <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
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
                                        {activity.entity.avatar && (
                                            <img
                                                src={activity.entity.avatar}
                                                className="w-5 h-5 rounded-full object-cover"
                                                alt={activity.entity.name}
                                            />
                                        )}
                                        <span className="text-sm text-gray-600">{activity.entity.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-1 rounded-md border",
                                        activity.statusColor
                                    )}>
                                        {activity.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
