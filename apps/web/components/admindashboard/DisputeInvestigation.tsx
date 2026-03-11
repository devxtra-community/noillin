"use client";
import React from "react";
import { MessageSquare, ShieldCheck, Info, CornerDownRight, AlertTriangle, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function DisputeInvestigation() {
    return (
        <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sticky top-28 h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-extrabold text-[#111827]">Investigation View</h3>
                    <p className="text-[11px] font-bold text-gray-400">Report #REP-88291</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-bold hover:bg-gray-100 transition-all uppercase tracking-wider">
                    <MessageSquare size={12} />
                    Full Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {/* Issue Description */}
                <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Issue Description</h4>
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 italic">
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            &quot;Influencer failed to include the agreed-upon brand mentions in the final video delivery. Payment was released but content does not meet the brief requirements.&quot;
                        </p>
                    </div>
                </div>

                {/* Chat History Snippet */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chat History Snippet</h4>
                    <div className="space-y-3">
                        {/* Influencer Message */}
                        <div className="flex items-start gap-2 max-w-[85%]">
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                                <Image unoptimized width={100} height={100} src="https://i.pravatar.cc/150?u=sarah" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl p-3 rounded-tl-none">
                                <p className="text-[11px] font-medium text-gray-700">I&apos;ve uploaded the video. Can you check?</p>
                            </div>
                        </div>
                        {/* Brand Message */}
                        <div className="flex items-start gap-2 max-w-[85%] ml-auto flex-row-reverse text-right">
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                                <Image unoptimized width={100} height={100} src="https://i.pravatar.cc/150?u=nike" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-emerald-500 text-white rounded-2xl p-3 rounded-tr-none">
                                <p className="text-[11px] font-medium leading-normal">Wait, you missed the 30s brand shoutout!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Trail */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Audit Trail</h4>
                    <div className="space-y-6 relative ml-1.5">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

                        <div className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-500 text-white flex items-center justify-center z-10">
                                <CornerDownRight size={12} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#111827]">Report Created</p>
                                <p className="text-[10px] text-gray-400 font-medium">Oct 24, 2023 • 09:12 AM</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-orange-500 text-white flex items-center justify-center z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#111827]">Admin Assigned (You)</p>
                                <p className="text-[10px] text-gray-400 font-medium">Oct 24, 2023 • 10:45 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Admin Notes</h4>
                        <span className="text-[10px] font-bold text-red-500 tracking-tight">*Required for action</span>
                    </div>
                    <textarea
                        className="w-full h-24 bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-[11px] font-medium text-gray-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none outline-none"
                        placeholder="Type notes here..."
                    />
                </div>
            </div>

            {/* Resolution Actions */}
            <div className="p-4 bg-white border-t border-gray-50 space-y-3">
                <button className="w-full bg-emerald-500 text-white py-3 px-4 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                    <ShieldCheck size={16} />
                    Refund Recommendation
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button className="py-2.5 bg-white border border-gray-200 text-[#111827] rounded-xl text-[11px] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <AlertTriangle size={14} className="text-gray-400" />
                        Warning
                    </button>
                    <button className="py-2.5 bg-white border border-gray-200 text-red-500 rounded-xl text-[11px] font-bold hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <ShieldAlert size={14} />
                        Escalate
                    </button>
                </div>
            </div>

            {/* Regulatory Note */}
            <div className="p-4 mx-4 mb-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 align-start">
                <Info className="text-blue-500 flex-shrink-0" size={16} />
                <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                    Transparency Rule! <span className="text-blue-400 leading-normal">All notes and actions are logged in the immutable audit trail and visible to senior management.</span>
                </p>
            </div>
        </div>
    );
}
