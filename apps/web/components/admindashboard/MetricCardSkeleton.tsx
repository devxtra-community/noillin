import React from "react";

export default function MetricCardSkeleton({ startLoading = true }: { startLoading?: boolean }) {
    return (
        <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-500 ease-in-out ${startLoading ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between items-start mb-6">
                {/* Icon Placeholder */}
                <div className="w-12 h-12 rounded-xl bg-gray-200"></div>

                {/* Badge/Pill Placeholder */}
                <div className="w-16 h-5 rounded-full bg-gray-200"></div>
            </div>

            <div className="space-y-3">
                {/* Title Placeholder */}
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                {/* Value Placeholder */}
                <div className="w-28 h-8 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
