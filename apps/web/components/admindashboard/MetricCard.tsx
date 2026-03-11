import React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string;
    change?: string;
    status?: string;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    isPositive?: boolean;
}

export default function MetricCard({
    title,
    value,
    change,
    status,
    icon: Icon,
    iconColor,
    iconBg,
    isPositive,
}: MetricCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", iconBg)}>
                    <Icon size={24} className={iconColor} />
                </div>
                {change && (
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full",
                        isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {isPositive ? "+" : ""}{change}
                    </span>
                )}
                {status && (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full lowercase">
                        {status}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}
