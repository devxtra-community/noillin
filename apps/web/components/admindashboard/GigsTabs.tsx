"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const tabs = [
    { id: "all", label: "All Gigs", count: 128 },
    { id: "reported", label: "Reported", count: 24, isAlert: true },
    { id: "paused", label: "Paused", count: 18 },
];

export default function GigsTabs() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="flex items-center p-1 bg-gray-50/50 rounded-xl border border-gray-100 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                        activeTab === tab.id
                            ? "bg-white text-[#111827] shadow-sm ring-1 ring-gray-200/50"
                            : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                    )}
                >
                    {tab.label}
                    <span className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px]",
                        activeTab === tab.id
                            ? (tab.isAlert ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600")
                            : "bg-gray-100/50 text-gray-400"
                    )}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
