"use client";

import React, { useState, useEffect } from "react";
import { Plus, DollarSign, Clock, Calendar, ChevronRight, ChevronLeft, Loader2, ShieldAlert, Activity } from "lucide-react";
import Image from "next/image";

import api from "@/lib/axios.client";

interface Transaction {
    _id: string;
    status: string;
    amount?: number;
    influencerAmount?: number;
    createdAt: string;
    influencerProfile?: {
        fullName?: string;
        username?: string;
        profileImageUrl?: string;
    };
    gigId?: { title: string };
}

export default function BrandTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
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
            case "COMPLETED": return "bg-emerald-100/80 text-emerald-700 border border-emerald-200";
            case "IN_ESCROW": return "bg-blue-100/80 text-blue-700 border border-blue-200";
            case "CANCELLED": return "bg-rose-100/80 text-rose-700 border border-rose-200";
            default: return "bg-orange-100/80 text-orange-700 border border-orange-200";
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-transparent">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-8 lg:px-10 py-8 h-full flex flex-col gap-8 bg-transparent max-w-[1600px] mx-auto w-full">
            <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transactions</h1>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">Manage your platform credits and transaction history.</p>
            </div>

            {/* Top Metrics Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-xl shadow-slate-900/10 flex flex-col justify-between group hover:shadow-2xl transition-all relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-start justify-between w-full mb-6">
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Available Balance</p>
                    </div>
                    <div className="relative z-10 flex items-end justify-between w-full mt-auto">
                        <div>
                           <h3 className="text-4xl font-black text-white leading-tight">₹0</h3>
                           <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">Platform credits</p>
                        </div>
                        <button className="bg-white hover:bg-emerald-50 text-slate-900 p-3 rounded-2xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500 -z-10"></div>
                    <div className="flex items-start justify-between w-full mb-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
                        <div className="p-2.5 bg-blue-100/50 rounded-2xl text-blue-500 shadow-inner">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">₹{stats.totalSpent.toLocaleString()}</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">Lifetime spending</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-50 rounded-full group-hover:scale-110 transition-transform duration-500 -z-10"></div>
                    <div className="flex items-start justify-between w-full mb-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">In Escrow</p>
                        <div className="p-2.5 bg-orange-100/50 rounded-2xl text-orange-500 shadow-inner">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">₹{stats.inEscrow.toLocaleString()}</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">Active projects</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500 -z-10"></div>
                    <div className="flex items-start justify-between w-full mb-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">This Month</p>
                        <div className="p-2.5 bg-emerald-100/50 rounded-2xl text-emerald-500 shadow-inner">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">₹{stats.thisMonth.toLocaleString()}</h3>
                        <p className="text-[10px] font-medium text-emerald-500 uppercase mt-1">Current Cycle</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 flex-1 lg:overflow-hidden overflow-visible">
                {/* Left Column: Recent Transactions List */}
                <div className={`lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden flex-col lg:min-h-0 ${selectedId ? "hidden lg:flex" : "flex"}`}>
                    <div className="p-8 pb-4">
                        <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
                    </div>
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Influencer</th>
                                    <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Gross Amount</th>
                                    <th className="py-4 px-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                           <div className="flex flex-col items-center justify-center text-slate-400">
                                              <Activity className="w-10 h-10 text-slate-300 mb-4" />
                                              <p className="text-sm font-bold">No transactions found</p>
                                              <p className="text-xs mt-1">Your payment history will appear here.</p>
                                           </div>
                                        </td>
                                    </tr>
                                )}
                                {transactions.map((t) => (
                                    <tr
                                        key={t._id}
                                        onClick={() => setSelectedId(t._id)}
                                        className={`transition-all cursor-pointer group ${selectedId === t._id ? "bg-emerald-50/30" : "hover:bg-slate-50/80"}`}
                                    >
                                        <td className="py-6 px-8">
                                            <p className="text-[14px] font-bold text-slate-900">{t.gigId?.title || "Project Checkout"}</p>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1">{new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                {t.influencerProfile?.profileImageUrl ? (
                                                    <Image src={t.influencerProfile.profileImageUrl} width={36} height={36} alt="" className="w-9 h-9 rounded-2xl shadow-sm object-cover border border-slate-200 group-hover:border-emerald-200 transition-colors" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm border border-slate-200 group-hover:border-emerald-200 transition-colors">
                                                        {(t.influencerProfile?.fullName || t.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className={`text-[14px] font-bold ${selectedId === t._id ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"} transition-colors`}>{t.influencerProfile?.fullName || t.influencerProfile?.username || "Unknown Provider"}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className="text-[16px] font-black text-slate-900">₹{(t.amount || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedId === t._id ? "text-emerald-500 translate-x-1" : "text-slate-300 group-hover:translate-x-1"}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Transaction Details */}
                <div className={`lg:col-span-4 flex-col lg:min-h-0 ${selectedId ? "flex" : "hidden lg:flex"}`}>
                    {selectedTransaction ? (
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 flex flex-col lg:h-full relative lg:overflow-hidden overflow-visible lg:overflow-y-auto min-h-0 custom-scrollbar">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-bl-full pointer-events-none"></div>

                            <button 
                                onClick={() => setSelectedId(null)}
                                className="absolute left-6 top-8 p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 lg:hidden transition-colors z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-black text-slate-900 mb-8 text-center lg:text-left relative z-10">Transaction Details</h2>

                            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100 relative z-10">
                                <div className="mb-4">
                                    {selectedTransaction.influencerProfile?.profileImageUrl ? (
                                        <Image src={selectedTransaction.influencerProfile.profileImageUrl} width={80} height={80} alt="" className="w-20 h-20 rounded-[24px] shadow-sm object-cover border border-slate-200" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-[24px] bg-slate-100 flex items-center justify-center text-slate-600 font-black text-3xl shadow-sm border border-slate-200">
                                            {(selectedTransaction.influencerProfile?.fullName || selectedTransaction.influencerProfile?.username || "A").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 text-center">{selectedTransaction.influencerProfile?.fullName || selectedTransaction.influencerProfile?.username || "Unknown Provider"}</h3>
                                <p className="text-sm text-slate-500 font-medium text-center mt-1 mb-4">{selectedTransaction.gigId?.title || "Booking"}</p>
                                
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${getStatusStyle(selectedTransaction.status)}`}>
                                    {selectedTransaction.status}
                                </span>
                            </div>

                            <div className="space-y-8 flex-1 relative z-10">
                                {/* Timeline */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                                    <div className="space-y-6 relative ml-3">
                                        <div className="absolute left-[3px] top-3 bottom-3 w-[2px] bg-slate-100" />

                                        <div className="flex justify-between items-center relative pl-8">
                                            <div className="absolute left-[-2px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                            <span className="text-sm font-bold text-slate-900">Payment Processed</span>
                                            <span className="text-[11px] font-bold text-slate-400">{new Date(selectedTransaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>

                                        <div className="flex justify-between items-center relative pl-8">
                                            <div className={`absolute left-[-2px] w-3 h-3 rounded-full border-2 shadow-sm ${selectedTransaction.status === "COMPLETED" ? "bg-emerald-500 border-white" : "bg-slate-200 border-white"}`} />
                                            <span className={`text-sm font-bold ${selectedTransaction.status === "COMPLETED" ? "text-slate-900" : "text-slate-400"}`}>Work Delivered</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Breakdown</p>
                                    <div className="space-y-4 bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-bold text-slate-500">Total Purchase Power</span>
                                            <span className="text-[14px] font-black text-slate-900">₹{(selectedTransaction.amount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-bold text-slate-500">Net To Influencer</span>
                                            <span className="text-[14px] font-bold text-slate-500">₹{(selectedTransaction.influencerAmount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-bold text-slate-500">Escrow Disputed</span>
                                            <span className="text-[14px] font-bold text-slate-900">₹0</span>
                                        </div>
                                        <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                                            <span className="text-[14px] font-black text-slate-900">Total Settled</span>
                                            <span className="text-xl font-black text-emerald-500">₹{(selectedTransaction.amount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 relative z-10">
                                <button className="w-full py-4 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm">
                                    <ShieldAlert className="w-4 h-4" /> Report Issue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 p-10 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-600 font-bold text-sm">Select a transaction</p>
                            <p className="text-slate-400 text-xs mt-1">View timeline and financial breakdown.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
