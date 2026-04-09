"use client";
import React from "react";
import { motion } from "framer-motion";

const tabs = [
    { id: "all", label: "All Gigs" },
    { id: "reported", label: "Reported" },
    { id: "paused", label: "Paused" },
];

interface GigsTabsProps {
    activeTab: string;
    onChange: (tab: string) => void;
    counts?: {
        all: number;
        reported: number;
        paused: number;
    };
}

export default function GigsTabs({ activeTab, onChange, counts }: GigsTabsProps) {
    return (
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl w-fit border border-gray-100 shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className="relative px-5 py-2 text-[13px] font-bold rounded-lg transition-colors duration-200 flex items-center gap-2 outline-none group"
                    style={{ color: activeTab === tab.id ? "#ffffff" : "#6b7280" }}
                >
                    {/* Animated sliding background */}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="gigs-tab-bg"
                            className="absolute inset-0 bg-[#0b121f] rounded-lg shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">
                        {tab.label}
                    </span>
                    {counts && counts[tab.id as keyof typeof counts] !== undefined && (
                        <span
                            className="relative z-10 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-all"
                            style={{
                                background: activeTab === tab.id ? "rgba(255,255,255,0.15)" : "#f3f4f6",
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
