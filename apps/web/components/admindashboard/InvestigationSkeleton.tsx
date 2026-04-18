import React from "react";

export default function InvestigationSkeleton({ startLoading = true }: { startLoading?: boolean }) {
    return (
        <div className={`w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sticky top-28 h-[calc(100vh-140px)] transition-all duration-500 ease-in-out ${startLoading ? 'animate-pulse' : ''}`}>
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
                <div className="w-16 h-6 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div className="h-24 bg-gray-50 rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2">
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
                                <div className="space-y-2">
                                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-50 rounded-2xl border border-gray-100"></div>
                </div>
            </div>
        </div>
    );
}
