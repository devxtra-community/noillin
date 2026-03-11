"use client";
import React, { useEffect, useState } from "react";
import { X, FileText, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface UserDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    onApprove: (email: string) => void;
    onReject: (email: string) => void;
}

export default function UserDetailsDrawer({
    isOpen,
    onClose,
    user,
    onApprove,
    onReject
}: UserDetailsDrawerProps) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [animate, setAnimate] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    // Synchronize isVisible with isOpen state when it becomes true to avoid setState during mount
    if (isOpen && !isVisible) {
        setIsVisible(true);
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            // Stagger animation to ensure mount occurs before transition
            timer = setTimeout(() => setAnimate(true), 10);
        } else {
            // Start exit animation
            timer = setTimeout(() => {
                setAnimate(false);
                // Delay unmounting until exit animation finishes (300ms)
                setTimeout(() => setIsVisible(false), 300);
            }, 0);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleApproveAction = () => {
        if (user?.email) {
            onApprove(user.email);
            onClose();
        }
    };

    const handleRejectAction = () => {
        if (user?.email) {
            onReject(user.email);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
                    animate ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Slider Panel */}
            <div className={cn(
                "absolute inset-y-0 right-0 max-w-full flex transition-transform duration-300 ease-in-out",
                animate ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-[#111827]">User Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                        {/* Profile Info */}
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden ring-4 ring-emerald-50">
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-100 text-2xl">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-extrabold text-[#111827] leading-none">{user?.email?.split('@')[0]}</h3>
                                <p className="text-gray-400 font-medium text-sm">{user?.email}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold border capitalize",
                                        user?.role === "INFLUENCER" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {user?.role?.toLowerCase()}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100 capitalize">{user?.status?.toLowerCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Followers", value: "0" },
                                { label: "Engagement", value: "0%" },
                                { label: "Avg. Likes", value: "0" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-gray-50/50 rounded-xl p-4 text-center border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-lg font-extrabold text-[#111827] mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Verification Documents */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-emerald-500" />
                                <h4 className="text-sm font-extrabold text-[#111827]">Verification Documents</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="group p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-white group-hover:text-emerald-500 transition-all">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">Verification Document</p>
                                            <p className="text-[11px] text-gray-400 font-medium">Uploaded Document</p>
                                        </div>
                                    </div>
                                    <button className="text-emerald-500 text-sm font-bold px-3 py-1 hover:bg-emerald-50 rounded-lg transition-all">View</button>
                                </div>
                            </div>
                        </div>

                        {/* Rejection Reason */}
                        <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 space-y-4">
                            <h4 className="text-sm font-extrabold text-red-900">Rejection Reason</h4>
                            <textarea
                                placeholder="Type rejection reason here..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full h-24 p-4 bg-white border border-red-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-gray-300 resize-none font-medium"
                            />
                            <p className="text-[10px] font-bold text-red-400 italic font-sans">* This reason will be sent to the user via email.</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-200 text-red-500 font-bold hover:bg-red-50 transition-all text-sm"
                            onClick={handleRejectAction}
                        >
                            <X size={18} />
                            Reject Application
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all text-sm"
                            onClick={handleApproveAction}
                        >
                            <Check size={18} />
                            Approve User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
