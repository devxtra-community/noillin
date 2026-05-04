import React, { useState } from "react";
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

import api from "@/lib/axios.client";

interface ReportingModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityId: string;
    entityType: "GIG" | "ORDER" | "USER";
}

export function ReportingModal({ isOpen, onClose, entityId, entityType }: ReportingModalProps) {
    const [type, setType] = useState<"CONTENT" | "PAYMENT" | "BEHAVIOR">(entityType === "ORDER" ? "PAYMENT" : "CONTENT");
    const [subType, setSubType] = useState<"NOT_RECEIVED" | "LOW_QUALITY" | "SCAM" | "PAYMENT_ISSUE" | "">("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            setError("Please provide a description of the issue.");
            return;
        }
        if (type === "PAYMENT" && !subType) {
            setError("Please select a specific reason for the payment issue.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/reports", {
                entityId,
                entityType,
                type,
                ...(type === "PAYMENT" ? { subType } : {}),
                description
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setDescription("");
                setSubType("");
            }, 2000);
        } catch (err: unknown) {
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(errorResponse.response?.data?.message || "Failed to submit report. Please try again.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onClose()} />
            <div className="bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {success ? (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Report Submitted</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                            Our safety team has been notified. We will review the details and take appropriate action shortly.
                        </p>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-rose-500">
                                <ShieldAlert size={20} />
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Report Issue</h3>
                            </div>
                            <button disabled={loading} onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 disabled:opacity-50">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                            Reporting: {entityType}
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-600 items-start">
                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                <p className="text-xs font-bold leading-relaxed">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {entityType !== "ORDER" && (
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Report Category</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as "CONTENT" | "PAYMENT" | "BEHAVIOR")}

                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none input-select-chevron"
                                    >
                                        <option value="CONTENT">Inappropriate Content</option>
                                        <option value="BEHAVIOR">Harassment / Behavior</option>
                                        <option value="PAYMENT">Payment / Fraud Issue</option>
                                    </select>
                                </div>
                            )}

                            {type === "PAYMENT" && (
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Specific Reason</label>
                                    <select
                                        value={subType}
                                        onChange={(e) => setSubType(e.target.value as "NOT_RECEIVED" | "LOW_QUALITY" | "SCAM" | "PAYMENT_ISSUE" | "")}

                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none input-select-chevron"
                                    >
                                        <option value="">-- Select Reason --</option>
                                        <option value="NOT_RECEIVED">Deliverable Not Received</option>
                                        <option value="LOW_QUALITY">Extremely Low Quality</option>
                                        <option value="SCAM">Suspected Scam</option>
                                        <option value="PAYMENT_ISSUE">Other Payment Issue</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Detailed Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide specific details to help our Trust & Safety team investigate..."
                                    className="w-full h-32 px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-70 text-white rounded-2xl font-black text-[13px] shadow-xl shadow-rose-500/20 hover:-translate-y-0.5 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                                    {loading ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
