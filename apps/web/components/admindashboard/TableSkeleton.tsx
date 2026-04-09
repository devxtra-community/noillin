import React from "react";

export default function TableSkeleton({ startLoading = true }: { startLoading?: boolean }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col transition-all duration-500 ease-in-out ${startLoading ? 'animate-pulse' : ''}`}>
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <div className="w-48 h-5 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="overflow-x-auto flex-1 p-6 space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-6">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
