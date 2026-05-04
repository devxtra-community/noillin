"use client";
import React from "react";
import { Eye, CreditCard, User, FileText } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface InvolvedUser {
    name: string;
    avatar?: string;
}

export interface Report {
    _id: string;
    reportId: string;
    type: string;
    status: string;
    entityType: string;
    usersInvolved?: InvolvedUser[];
}

interface DisputeTableProps {
    reports: Report[];
    selectedReportId: string | null;
    onSelect: (id: string) => void;
}


export default function DisputeTable({ reports, selectedReportId, onSelect }: DisputeTableProps) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case "PAYMENT": return { color: "bg-red-50 text-red-600", icon: CreditCard };
            case "BEHAVIOR": return { color: "bg-orange-50 text-orange-600", icon: User };
            case "CONTENT": return { color: "bg-blue-50 text-blue-600", icon: FileText };
            default: return { color: "bg-gray-50 text-gray-600", icon: FileText };
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PENDING": return { color: "text-blue-400", bg: "bg-blue-400" };
            case "UNDER_REVIEW": return { color: "text-orange-500", bg: "bg-orange-500" };
            case "RESOLVED": return { color: "text-emerald-500", bg: "bg-emerald-500" };
            default: return { color: "text-gray-400", bg: "bg-gray-400" };
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Report ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Entities / Users</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reports.map((report) => {
                            const typeStyles = getTypeStyles(report.type);
                            const statusStyles = getStatusStyles(report.status);
                            const isSelected = selectedReportId === report._id;

                            return (
                                <tr
                                    key={report._id}
                                    onClick={() => onSelect(report._id)}
                                    className={cn(
                                        "hover:bg-gray-50/30 transition-colors group cursor-pointer",
                                        isSelected && "bg-emerald-50/30 border-l-2 border-l-emerald-500"
                                    )}
                                >
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-400">
                                        {report.reportId}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase", typeStyles.color)}>
                                            <typeStyles.icon size={12} />
                                            {report.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center -space-x-2">
                                            {report.usersInvolved?.map((user: InvolvedUser, idx: number) => (

                                                <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm relative group/avatar" title={user.name}>
                                                    <Image unoptimized width={50} height={50} src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <span className="ml-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                {report.entityType}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", statusStyles.bg)} />
                                            <span className={cn("text-xs font-bold uppercase", statusStyles.color)}>{report.status.replace("_", " ")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                        <button className={cn("p-2 transition-all", isSelected ? "text-emerald-500" : "text-gray-300 group-hover:text-gray-900")}>
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    No reports found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold tracking-tight">Total {reports.length} security alerts active.</p>
            </div>
        </div>
    );
}
