import React from "react";

export default function SystemHealth() {
    return (
        <div className="bg-[#0f172a] p-8 rounded-2xl shadow-xl h-full text-white">
            <div className="flex items-center gap-2 mb-8">
                <h3 className="font-bold text-lg">System Health</h3>
            </div>

            <div className="flex items-center gap-2 mb-10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-emerald-400 text-sm font-bold">All systems operational</span>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">API Latency</span>
                        <span className="text-xs font-bold text-white">42ms</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[15%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Storage Usage</span>
                        <span className="text-xs font-bold text-white">64%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[64%] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
