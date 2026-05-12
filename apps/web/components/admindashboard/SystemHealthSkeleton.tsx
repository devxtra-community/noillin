import React from "react";

export default function SystemHealthSkeleton({ startLoading = true }: { startLoading?: boolean }) {
    return (
        <div className={`bg-[#0f172a] p-8 rounded-2xl shadow-xl h-full flex flex-col transition-all duration-500 ease-in-out ${startLoading ? 'animate-pulse' : ''}`}>
            <div className="mb-8 flex items-center gap-2">
                <div className="w-32 h-5 bg-slate-800 rounded"></div>
            </div>
            <div className="mb-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-32 h-4 bg-slate-800 rounded"></div>
            </div>
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="w-20 h-4 bg-slate-800 rounded"></div>
                            <div className="w-8 h-4 bg-slate-800 rounded"></div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
