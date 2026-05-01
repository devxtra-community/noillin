"use client";

import React, { useState, useEffect } from "react";
import { Plus, DollarSign, Clock, Calendar, ChevronRight, Loader2, ShieldAlert } from "lucide-react";

import api from "@/lib/axios.client";

export default function BrandTransactionsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [transactions, setTransactions] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [stats, setStats] = useState({ totalSpent: 0, inEscrow: 0, thisMonth: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/orders/history").then((res) => {
            setTransactions(res.data);
            if (res.data.length > 0) setSelectedId(res.data[0]._id);
            setStats({
                totalSpent: res.data.filter((t: { status: string }) => t.status === "COMPLETED").reduce((sum: number, t: { amount?: number }) => sum + (t.amount || 0), 0),
                inEscrow: res.data.filter((t: { status: string }) => t.status === "IN_ESCROW").reduce((sum: number, t: { amount?: number }) => sum + (t.amount || 0), 0),
                thisMonth: res.data.filter((t: { createdAt: string }) => {
                    const d = new Date(t.createdAt);
                    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
                }).reduce((sum: number, t: { amount?: number }) => sum + (t.amount || 0), 0)
            });
        }).finally(() => setLoading(false));
    }, []);

    const selectedTransaction = transactions.find(t => t._id === selectedId);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-500";
            case "IN_ESCROW": return "bg-blue-50 text-blue-500";
            case "CANCELLED": return "bg-red-50 text-red-500";
            default: return "bg-orange-50 text-orange-500";
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col gap-8 bg-[#f8fafc]">
            {/* Top Metrics Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">₹0</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">Platform credits</p>
                    </div>
                    <button className="bg-[#1CD36B] hover:bg-[#19C061] text-white p-4 rounded-2xl shadow-lg shadow-emerald-50 transition-all hover:scale-105 flex items-center gap-2 text-xs font-bold px-5">
                        <Plus className="w-4 h-4" />
                        Add Funds
                    </button>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Spent</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">₹{stats.totalSpent.toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">Lifetime spending</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">In Escrow</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">₹{stats.inEscrow.toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">Active projects</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">This Month</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-tight">₹{stats.thisMonth.toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Current Cycle</p>
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
                                    <th className="py-4 px-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Gross Amount</th>
                                    <th className="py-4 px-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-gray-400 font-semibold italic">No transactions found</td>
                                    </tr>
                                )}
                                {transactions.map((t) => (
                                    <tr
                                        key={t._id}
                                        onClick={() => setSelectedId(t._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === t._id ? "bg-emerald-50/30" : "hover:bg-gray-50/50"}`}
                                    >
                                        <td className="py-6 px-10">
                                            <p className="text-sm font-bold text-gray-900">{t.gigId?.title || "Project Checkout"}</p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-6 px-10">
                                            <div className="flex items-center gap-3">
                                                {t.influencerProfile?.profileImageUrl ? (
                                                    <img src={t.influencerProfile.profileImageUrl} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                                        {(t.influencerProfile?.fullName || t.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-sm font-bold text-gray-900">{t.influencerProfile?.fullName || t.influencerProfile?.username || "Unknown Provider"}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-10">
                                            <span className="text-sm font-black text-gray-900">₹{(t.amount || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                            <ChevronRight className={`w-4 h-4 transition-all ${selectedId === t._id ? "text-emerald-500 translate-x-1" : "text-gray-200"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Transaction Details */}
                <div className="lg:col-span-4 flex flex-col">
                    {selectedTransaction ? (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col h-full sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-8">Transaction Details</h2>

                            <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                                <div className="flex items-center gap-4">
                                    {selectedTransaction.influencerProfile?.profileImageUrl ? (
                                        <img src={selectedTransaction.influencerProfile.profileImageUrl} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm">
                                            {(selectedTransaction.influencerProfile?.fullName || selectedTransaction.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{selectedTransaction.influencerProfile?.fullName || selectedTransaction.influencerProfile?.username || "Unknown Provider"}</h3>
                                        <p className="text-xs text-gray-400 font-medium">{selectedTransaction.gigId?.title || "Booking"}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest ${getStatusStyle(selectedTransaction.status)}`}>
                                    {selectedTransaction.status}
                                </span>
                            </div>

                            <div className="space-y-8 flex-1">
                                {/* Timeline */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Timeline</p>
                                    <div className="space-y-6 relative ml-3">
                                        <div className="absolute left-[-1px] top-2 bottom-2 w-[2px] bg-gray-50" />

                                        <div className="flex justify-between items-center relative pl-8">
                                            <div className="absolute left-[-5px] w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                            <span className="text-xs font-bold text-gray-900">Payment Processed</span>
                                            <span className="text-[10px] font-medium text-gray-400">{new Date(selectedTransaction.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center relative pl-8">
                                            <div className={`absolute left-[-5px] w-2.5 h-2.5 rounded-full border-2 shadow-sm ${selectedTransaction.status === "COMPLETED" ? "bg-emerald-500 border-white" : "bg-gray-200 border-white"}`} />
                                            <span className={`text-xs font-bold ${selectedTransaction.status === "COMPLETED" ? "text-gray-900" : "text-gray-400"}`}>Work Delivered</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="pt-8 border-t border-gray-50 space-y-6">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Financial Breakdown</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-400">Total Purchase Power</span>
                                            <span className="text-xs font-bold text-gray-900">₹{(selectedTransaction.amount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-400">Net To Influencer</span>
                                            <span className="text-xs font-bold text-gray-500">₹{(selectedTransaction.influencerAmount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-400">Escrow Disputed</span>
                                            <span className="text-xs font-bold text-gray-900">₹0</span>
                                        </div>
                                        <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-900">Total Settled</span>
                                            <span className="text-lg font-black text-emerald-500">₹{(selectedTransaction.amount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50">
                                <button className="w-full py-4 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Report Transaction Issue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center h-[50vh] text-center">
                            <Clock className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold text-sm">Select a transaction to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
