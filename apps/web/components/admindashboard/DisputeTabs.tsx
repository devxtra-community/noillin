"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const tabs = [
    { id: "all", label: "All Reports" },
    { id: "payment", label: "Payment" },
    { id: "behavior", label: "Behavior" },
];

export default function DisputeTabs() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="flex items-center p-1 bg-gray-50/50 rounded-xl border border-gray-100 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                        activeTab === tab.id
                            ? "bg-[#111827] text-white shadow-sm"
                            : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
