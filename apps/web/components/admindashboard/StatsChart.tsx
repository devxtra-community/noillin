import React from "react";

export default function StatsChart() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-gray-900">Revenue Trend</h3>
                <select className="text-xs font-bold text-gray-400 bg-transparent border-none focus:ring-0 cursor-pointer">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>

            <div className="flex-1 relative min-h-[160px]">
                {/* Simple SVG Chart Mockup */}
                <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 50}
                            x2="400"
                            y2={i * 50}
                            stroke="#f1f5f9"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Area under the line */}
                    <path
                        d="M0 140 Q 50 110, 100 120 T 200 110 T 300 50 T 400 45 L 400 200 L 0 200 Z"
                        fill="url(#gradient)"
                        className="opacity-20"
                    />

                    {/* The Line */}
                    <path
                        d="M0 140 Q 50 110, 100 120 T 200 110 T 300 50 T 400 45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-300 font-bold -ml-1">
                    <span>2,500</span>
                    <span>2,000</span>
                    <span>1,500</span>
                    <span>1,000</span>
                    <span>500</span>
                    <span>0</span>
                </div>
            </div>

            <div className="mt-4 flex justify-between px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day} className="text-[10px] font-bold text-gray-300 uppercase">
                        {day}
                    </span>
                ))}
            </div>
        </div>
    );
}
