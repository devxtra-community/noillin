import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Loader2, CheckCircle2, ChevronRight, FileText, X } from "lucide-react";
import Image from "next/image";

import api from "@/lib/axios.client";
import { cn } from "@/lib/utils";

interface InvolvedUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuditTrail {
    action: string;
    createdAt: string | Date;
}

interface ReportDetails {
    _id: string;
    reportId: string;
    status: string;
    entityType: string;
    entityId: string;
    entityDetails?: {
        title?: string;
    };
    usersInvolved: InvolvedUser[];
    description: string;
    adminNotes?: string;
    auditTrail: AuditTrail[];
    resolution?: string;
}

interface DisputeInvestigationProps {
    reportId: string | null;
    onReportResolved: () => void;
}


export default function DisputeInvestigation({ reportId, onReportResolved }: DisputeInvestigationProps) {
    const [report, setReport] = useState<ReportDetails | null>(null);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");

    useEffect(() => {
        if (reportId) {
            loadReport(reportId);
        }
    }, [reportId]);

    const loadReport = async (id: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/reports/${id}`);
            setReport(res.data.data);
            setAdminNotes(res.data.data.adminNotes || "");

            // If it's PENDING, move to UNDER_REVIEW automatically when viewed
            if (res.data.data.status === "PENDING") {
                await api.patch(`/admin/reports/${id}/status`);
                // Silently refresh to update status in UI
                const refresh = await api.get(`/admin/reports/${id}`);
                setReport(refresh.data.data);
            }
        } catch (err) {
            console.error("Failed to load report details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (resolution: "VALID" | "INVALID") => {
        if (!report) return;
        if (!adminNotes.trim()) {
            alert("Admin notes are required for resolution.");
            return;
        }

        setSubmitting(true);
        try {
            await api.patch(`/admin/reports/${report._id}/resolve`, {
                resolution,
                adminNotes
            });
            onReportResolved();
            // Reload the report state
            loadReport(report._id);
        } catch (err) {
            console.error("Failed to resolve report:", err);
            alert("Failed to resolve report. Check console.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!reportId) {
        return (
            <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-140px)]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <ShieldAlert size={32} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Select a Report</h3>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">Select a case from the list to begin investigation.</p>
            </div>
        );
    }

    if (loading && !report) {
        return (
            <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-140px)]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sticky top-28 h-[calc(100vh-140px)] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-extrabold text-[#111827]">Investigation View</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{report?.reportId || "..."}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border",
                        report?.status === "RESOLVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                        {report?.status?.replace("_", " ")}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {/* Entity Details */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reported Entity</h4>
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                {report?.entityType === "GIG" ? <FileText size={18} /> : <ShieldCheck size={18} />}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{report?.entityType}</p>
                                <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                                    {report?.entityDetails?.title || report?.entityId}
                                </p>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Users Involved</p>
                            <div className="flex flex-col gap-2">
                                {report?.usersInvolved?.map((u: InvolvedUser) => (
                                    <div key={u._id} className="flex items-center gap-2">

                                        <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                                            <Image unoptimized width={20} height={20} src={`https://ui-avatars.com/api/?name=${u.name || "User"}`} alt={u.name || "User"} />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-700">{u.name}</span>
                                        <span className="text-[9px] text-gray-400 font-medium">({u.email})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Issue Description */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Report Description</h4>
                    <div className="bg-rose-50/30 rounded-2xl p-5 border border-rose-100/50">
                        <p className="text-xs text-rose-900/70 leading-relaxed font-bold">
                            &quot;{report?.description || "No description provided."}&quot;
                        </p>
                    </div>
                </div>

                {/* Audit Trail */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Moderation History</h4>
                    <div className="space-y-6 relative ml-1.5">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

                        {report?.auditTrail?.map((audit: AuditTrail, idx: number) => (
                            <div key={idx} className="flex gap-4 relative">

                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm",
                                    audit.action === "REPORT_CREATED" ? "bg-rose-500 text-white" :
                                        audit.action.includes("RESOLVED") ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                                )}>
                                    <ChevronRight size={12} />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-xs font-bold text-[#111827] uppercase tracking-tight leading-none mb-1">
                                        {audit.action.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {new Date(audit.createdAt).toLocaleDateString()} • {new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-3 pb-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Resolution Notes</h4>
                        <span className="text-[10px] font-bold text-rose-500 tracking-tight">*Required for action</span>
                    </div>
                    <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        disabled={report?.status === "RESOLVED"}
                        className="w-full h-24 bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-[11px] font-medium text-gray-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none outline-none disabled:opacity-70"
                        placeholder="Explain the reason for this moderation action..."
                    />
                </div>
            </div>

            {/* Resolution Actions */}
            {report?.status !== "RESOLVED" ? (
                <div className="p-4 bg-white border-t border-gray-50 space-y-3">
                    <button
                        onClick={() => handleResolve("VALID")}
                        disabled={submitting}
                        className="w-full bg-emerald-500 text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        Confirm Violation (Apply Action)
                    </button>
                    <button
                        onClick={() => handleResolve("INVALID")}
                        disabled={submitting}
                        className="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <X size={14} />
                        Dismiss Report (No Violation)
                    </button>
                </div>
            ) : (
                <div className="p-6 bg-emerald-50 border-t border-emerald-100 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Case Resolved as {report?.resolution}</p>
                    <p className="text-[10px] text-emerald-600 font-bold text-center">This case is now locked in the audit trail.</p>
                </div>
            )}
        </div>
    );
}
