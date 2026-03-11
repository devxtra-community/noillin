"use client";
import React from "react";
import { Eye, Check, X, FileText, UserCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface VerificationTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requests: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelectUser: (user: any) => void;
    onApprove: (email: string) => void;
    onReject: (email: string) => void;
    loading: boolean;
}

export default function VerificationTable({
    requests,
    onSelectUser,
    onApprove,
    onReject,
    loading
}: VerificationTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading requests...</p>
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <UserCheck size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-[#111827]">No pending verifications</h3>
                    <p className="text-gray-400 text-sm">All set! There are no user applications waiting for review.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Submitted Documents</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.map((request) => (
                            <tr
                                key={request._id}
                                className="hover:bg-gray-50/30 transition-colors cursor-pointer"
                                onClick={() => onSelectUser(request)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-100">
                                                {request.email.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-extrabold text-[#111827]">{request.email.split('@')[0]}</div>
                                            <div className="text-xs font-medium text-gray-400">{request.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize",
                                        request.role === "INFLUENCER"
                                            ? "bg-purple-50 text-purple-600 border-purple-100"
                                            : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {request.role.toLowerCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {request.documents ? (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg group cursor-pointer hover:bg-white hover:border-gray-200 transition-all">
                                                <FileText size={14} className="text-gray-400 group-hover:text-red-500" />
                                                <span className="text-[11px] font-bold text-gray-600">Verification Doc</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">No documents</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[11px] font-bold",
                                        request.status === "APPROVED" && "bg-emerald-50 text-emerald-600",
                                        request.status === "PENDING" && "bg-orange-50 text-orange-600",
                                        request.status === "REJECTED" && "bg-red-50 text-red-600"
                                    )}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            onClick={(e) => { e.stopPropagation(); onSelectUser(request); }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                            onClick={(e) => { e.stopPropagation(); onApprove(request.email); }}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            onClick={(e) => { e.stopPropagation(); onReject(request.email); }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 font-sans tracking-tight">Showing {requests.length} entries</span>
            </div>
        </div>
    );
}
