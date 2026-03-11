"use client";
import React from "react";
import { Eye, Info, Trash2, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const gigs = [
    {
        id: "GIG-8821",
        title: "Instagram Story Promotion (3x)",
        influencer: "Sarah Jenkins",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        platform: "Instagram",
        platformIcon: Instagram,
        platformColor: "text-pink-500",
        price: "$450.00",
        status: "Reported",
        statusColor: "bg-red-50 text-red-600",
    },
    {
        id: "GIG-9012",
        title: "TikTok Dance Challenge Video",
        influencer: "Marcus Chen",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        platform: "TikTok",
        platformIcon: ({ className }: { className: string }) => (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
        ),
        platformColor: "text-black",
        price: "$1,200.00",
        status: "Active",
        statusColor: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "GIG-7742",
        title: "YouTube Tech Review (10 min)",
        influencer: "Alex Rivera",
        avatar: "https://i.pravatar.cc/150?u=alex",
        platform: "YouTube",
        platformIcon: Youtube,
        platformColor: "text-red-500",
        price: "$2,500.00",
        status: "Paused",
        statusColor: "bg-orange-50 text-orange-600",
    },
];

interface GigsTableProps {
    onDeleteClick: (gig: unknown) => void;
}

export default function GigsTable({ onDeleteClick }: GigsTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gig Title</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Influencer</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Platform</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {gigs.map((gig) => (
                            <tr key={gig.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <Image unoptimized width={100} height={100} src={`https://picsum.photos/seed/${gig.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#111827]">{gig.title}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">ID: {gig.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
                                            <Image unoptimized width={100} height={100} src={gig.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{gig.influencer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <gig.platformIcon className={cn("w-4 h-4", gig.platformColor)} />
                                        <span className="text-xs font-bold text-gray-600">{gig.platform}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className="text-sm font-bold text-[#111827]">{gig.price}</span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border border-transparent", gig.statusColor)}>
                                        {gig.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                            <Info size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteClick(gig)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-bold">Showing 1 to 10 of 128 entries</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Previous</button>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[11px] font-bold">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all text-[#111827] text-[11px] font-bold">2</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all text-[#111827] text-[11px] font-bold">3</button>
                    </div>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}
