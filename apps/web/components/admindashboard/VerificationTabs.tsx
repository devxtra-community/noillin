"use client";
import React from "react";
import { motion } from "framer-motion";

const tabs = [
    { id: "all", label: "All Requests" },
    { id: "influencers", label: "Influencers" },
    { id: "brands", label: "Brands" },
];

interface VerificationTabsProps {
    activeTab: string;
    onChange: (tab: string) => void;
    counts?: { all: number; influencers: number; brands: number };
}

export default function VerificationTabs({ activeTab, onChange, counts }: VerificationTabsProps) {
    return (
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl w-fit border border-gray-100">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className="relative px-6 py-2 text-sm font-bold rounded-lg transition-colors duration-150 flex items-center gap-2"
                    style={{ color: activeTab === tab.id ? "#ffffff" : "#6b7280" }}
                >
                    {/* Animated sliding background */}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="verification-tab-bg"
                            className="absolute inset-0 bg-[#0b121f] rounded-lg shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                    {counts && (
                        <span
                            className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                                background: activeTab === tab.id ? "rgba(255,255,255,0.15)" : "#e5e7eb",
                                color: activeTab === tab.id ? "#ffffff" : "#6b7280",
                            }}
                        >
                            {counts[tab.id as keyof typeof counts]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
