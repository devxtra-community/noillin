"use client";
import React from "react";
import { Eye, CreditCard, User, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

const reports = [
    {
        id: "#REP-88291",
        type: "Payment",
        typeColor: "bg-red-50 text-red-600",
        typeIcon: CreditCard,
        users: [
            { name: "User 1", avatar: "https://i.pravatar.cc/150?u=1" },
            { name: "User 2", avatar: "https://i.pravatar.cc/150?u=2" },
        ],
        status: "Under Review",
        statusColor: "text-orange-500",
    },
    {
        id: "#REP-88284",
        type: "Behavior",
        typeColor: "bg-orange-50 text-orange-600",
        typeIcon: User,
        users: [
            { name: "User 3", avatar: "https://i.pravatar.cc/150?u=3" },
            { name: "User 4", avatar: "https://i.pravatar.cc/150?u=4" },
        ],
        status: "Pending",
        statusColor: "text-blue-400",
    },
    {
        id: "#REP-88195",
        type: "Content",
        typeColor: "bg-blue-50 text-blue-600",
        typeIcon: FileText,
        users: [
            { name: "User 5", avatar: "https://i.pravatar.cc/150?u=5" },
            { name: "User 6", avatar: "https://i.pravatar.cc/150?u=6" },
        ],
        status: "Resolved",
        statusColor: "text-emerald-500",
    },
];

export default function DisputeTable() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Report ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Users Involved</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-400">
                                    {report.id}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-bold", report.typeColor)}>
                                        <report.typeIcon size={12} />
                                        {report.type}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center -space-x-2">
                                        {report.users.map((user, idx) => (
                                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm">
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", report.statusColor.replace('text-', 'bg-'))} />
                                        <span className={cn("text-xs font-bold", report.statusColor)}>{report.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                    <button className="p-2 text-gray-300 hover:text-gray-900 transition-all opacity-40 group-hover:opacity-100">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold">Showing 1 to 10 of 14 entries</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[#111827] text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">Prev</button>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[11px] font-bold">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all text-[#111827] text-[11px] font-bold">2</button>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[#111827] text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">Next</button>
                </div>
            </div>
        </div>
    );
}
