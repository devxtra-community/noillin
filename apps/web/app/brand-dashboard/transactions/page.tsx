"use client";

import React, { useState } from "react";
import { Plus, DollarSign, Clock, Calendar, ChevronRight, CheckCircle2 } from "lucide-react";

const transactions = [
    {
        id: 1,
        gigName: "IG Reel Promotion",
        date: "May 12, 2024",
        influencer: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        amount: "$150.00",
        status: "Completed",
    },
    {
        id: 2,
        gigName: "TikTok Ad Campaign",
        date: "May 14, 2024",
        influencer: "Marcus Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        amount: "$275.00",
        status: "In Escrow",
    },
    {
        id: 3,
        gigName: "YouTube Review",
        date: "May 15, 2024",
        influencer: "Elena",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        amount: "$500.00",
        status: "Completed",
    },
    {
        id: 4,
        gigName: "Product Unboxing",
        date: "May 10, 2024",
        influencer: "Alex",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        amount: "$210.00",
        status: "Completed",
    },
];

export default function BrandTransactionsPage() {
    const [selectedId, setSelectedId] = useState(1);
    const selectedTransaction = transactions.find(t => t.id === selectedId) || transactions[0];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col gap-8 bg-[#f8fafc]">
            {/* Top Metrics Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">$5,200</h3>
                    </div>
                    <button className="bg-[#1CD36B] hover:bg-[#19C061] text-white p-4 rounded-2xl shadow-lg shadow-emerald-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-xs font-bold px-5">
                        <Plus className="w-4 h-4" />
                        Add Funds
                    </button>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Spent</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">$12,450</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">Lifetime spending</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">In Escrow</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">$2,300</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">Active projects</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">This Month</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">$3,200</h3>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">+12% from last month</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
                {/* Left Column: Recent Transactions List */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 pb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 bg-gray-50/10">
                                    <th className="py-4 px-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Gig Name</th>
                                    <th className="py-4 px-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Influencer</th>
                                    <th className="py-4 px-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Amount</th>
                                    <th className="py-4 px-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => setSelectedId(t.id)}
                                        className={`transition-all cursor-pointer group ${selectedId === t.id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-6 px-10">
                                            <p className="text-sm font-bold text-gray-900">{t.gigName}</p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">{t.date}</p>
                                        </td>
                                        <td className="py-6 px-10">
                                            <div className="flex items-center gap-3">
                                                <img src={t.image} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                                                <span className="text-sm font-bold text-gray-900">{t.influencer}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-10">
                                            <span className="text-sm font-black text-gray-900">{t.amount}</span>
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-all ${selectedId === t.id ? "text-emerald-500 translate-x-1" : "text-gray-200"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Transaction Details */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Transaction Details</h2>

                        <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <img src={selectedTransaction.image} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{selectedTransaction.influencer}</h3>
                                    <p className="text-xs text-gray-400 font-medium">{selectedTransaction.gigName}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[9px] font-black rounded-full uppercase tracking-widest">
                                {selectedTransaction.status}
                            </span>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Timeline */}
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Timeline</p>
                                <div className="space-y-6 relative ml-3">
                                    <div className="absolute left-[-1px] top-2 bottom-2 w-0.5 bg-gray-50" />

                                    {[
                                        { label: "Payment Initiated", date: "May 12" },
                                        { label: "In Escrow", date: "May 12" },
                                        { label: "Work Delivered", date: "May 14" },
                                        { label: "Completed", date: "May 15" }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex justify-between items-center relative pl-8">
                                            <div className="absolute left-[-5px] w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                            <span className="text-xs font-bold text-gray-900">{step.label}</span>
                                            <span className="text-[10px] font-medium text-gray-400">{step.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="pt-8 border-t border-gray-50 space-y-6">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Financial Breakdown</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-400">Subtotal Paid</span>
                                        <span className="text-xs font-bold text-gray-900">{selectedTransaction.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-400">Platform Fee (10%)</span>
                                        <span className="text-xs font-bold text-gray-900">$15.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-400">Processing Taxes</span>
                                        <span className="text-xs font-bold text-gray-900">$12.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Total Paid</span>
                                        <span className="text-lg font-black text-emerald-500">$177.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50">
                            <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl text-xs font-bold transition-all active:scale-95">
                                Report a Problem
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
