"use client";
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const tabs = [
    { id: "all", label: "All Requests" },
    { id: "influencers", label: "Influencers" },
    { id: "brands", label: "Brands" },
];

export default function VerificationTabs() {
    const [activeTab, setActiveTab] = React.useState("all");

    return (
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl w-fit border border-gray-100">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "px-6 py-2 text-sm font-bold rounded-lg transition-all",
                        activeTab === tab.id
                            ? "bg-[#0b121f] text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
