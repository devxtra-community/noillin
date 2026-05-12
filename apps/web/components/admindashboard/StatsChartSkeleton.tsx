import React from "react";

export default function StatsChartSkeleton({ startLoading = true }: { startLoading?: boolean }) {
    return (
        <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col transition-all duration-500 ease-in-out ${startLoading ? 'animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-8">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg min-h-[160px]"></div>
            <div className="mt-4 flex justify-between px-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="w-6 h-3 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );
}
