"use client";

import React, { useState } from "react";
import { Search, Wallet, DollarSign, ArrowUpRight, History, MoreVertical, ChevronRight, CheckCircle2, Clock, ShieldAlert, AlertCircle, RefreshCw } from "lucide-react";

interface Transaction {
    id: number;
    brand: string;
    gig: string;
    price: string;
    totalAmount: string;
    deductions: string;
    netAmount: string;
    date: string;
    status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    timeline: {
        label: string;
        date: string;
        isCompleted: boolean;
    }[];
}

export default function EarningsPage() {
    const [selectedTxId, setSelectedTxId] = useState(1);
    const [activeFilter, setActiveFilter] = useState("30 days");

    const filters = ["Last 7 days", "30 days", "Month"];

    const [transactions] = useState<Transaction[]>([
        {
            id: 1,
            brand: "Lumina Skincare",
            gig: "IG Reel Promotion",
            price: "$150.00",
            totalAmount: "$150.00",
            deductions: "$15.00",
            netAmount: "$135.00",
            date: "Oct 24, 2023",
            status: "COMPLETED",
            timeline: [
                { label: "Payment Initiated", date: "Oct 22, 2023", isCompleted: true },
                { label: "Moved to Escrow", date: "Oct 23, 2023", isCompleted: true },
                { label: "Funds Released", date: "Oct 24, 2023", isCompleted: true },
            ]
        },
        {
            id: 2,
            brand: "Urban Coffee",
            gig: "TikTok Ad Campaign",
            price: "$275.00",
            totalAmount: "$275.00",
            deductions: "$27.50",
            netAmount: "$247.50",
            date: "Oct 22, 2023",
            status: "IN_ESCROW",
            timeline: [
                { label: "Payment Initiated", date: "Oct 21, 2023", isCompleted: true },
                { label: "Moved to Escrow", date: "Oct 22, 2023", isCompleted: true },
                { label: "Funds Released", date: "-", isCompleted: false },
            ]
        },
        {
            id: 3,
            brand: "TechNova",
            gig: "YouTube Review",
            price: "$500.00",
            totalAmount: "$500.00",
            deductions: "$50.00",
            netAmount: "$450.00",
            date: "Oct 20, 2023",
            status: "PENDING",
            timeline: [
                { label: "Payment Initiated", date: "Oct 20, 2023", isCompleted: true },
                { label: "Moved to Escrow", date: "-", isCompleted: false },
                { label: "Funds Released", date: "-", isCompleted: false },
            ]
        },
        {
            id: 4,
            brand: "Aura Fashion",
            gig: "Product Unboxing",
            price: "$210.00",
            totalAmount: "$210.00",
            deductions: "$21.00",
            netAmount: "$189.00",
            date: "Oct 19, 2023",
            status: "DISPUTED",
            timeline: [
                { label: "Payment Initiated", date: "Oct 18, 2023", isCompleted: true },
                { label: "Dispute Raised", date: "Oct 19, 2023", isCompleted: true },
                { label: "Under Review", date: "Oct 20, 2023", isCompleted: false },
            ]
        }
    ]);

    const selectedTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

    const stats = [
        { label: "TOTAL EARNED", value: "$12,450", color: "text-gray-900" },
        { label: "IN ESCROW", value: "$2,300", color: "text-blue-600" },
        { label: "THIS MONTH", value: "$3,200", color: "text-emerald-500" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600";
            case "IN_ESCROW": return "bg-blue-50 text-blue-600";
            case "PENDING": return "bg-orange-50 text-orange-600";
            case "DISPUTED": return "bg-rose-50 text-rose-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings</h1>
                    <p className="text-sm font-semibold text-gray-500 mt-1.5 uppercase tracking-wide">Manage your revenue and track your payouts</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex gap-1 shadow-sm">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 text-[13px] font-bold rounded-xl transition-all ${activeFilter === f
                                ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Available Balance - spans 2 columns on lg */}
                <div className="lg:col-span-1 bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
                    <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">$8,900</h2>
                    </div>
                    <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl text-xs shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2">
                        <Wallet className="w-4 h-4" /> Withdraw
                    </button>
                </div>

                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group h-full">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</h3>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-200 group-hover:text-emerald-500 transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Table */}
                <div className="xl:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between shrink-0">
                        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/10 transition-all w-60"
                            />
                        </div>
                    </div>

                    <div className="px-4 pb-6">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Brand Name</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Price</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-none">
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        onClick={() => setSelectedTxId(tx.id)}
                                        className={`group cursor-pointer transition-all ${selectedTxId === tx.id
                                            ? "bg-emerald-50/40"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-6 py-5 first:rounded-l-2xl last:rounded-r-2xl border-t border-b border-l border-transparent transition-all group-hover:border-emerald-100/50">
                                            <div className="font-bold text-[14px] text-gray-900 leading-tight">{tx.gig}</div>
                                            <div className="text-[11px] font-semibold text-gray-400 mt-1">{tx.date}</div>
                                        </td>
                                        <td className="px-6 py-5 border-t border-b border-transparent group-hover:border-emerald-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                    {tx.brand.charAt(0)}
                                                </div>
                                                <span className="font-bold text-[14px] text-gray-700">{tx.brand}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 border-t border-b border-transparent group-hover:border-emerald-100/50 text-right font-black text-[15px] text-gray-900">
                                            {tx.price}
                                        </td>
                                        <td className="px-4 py-5 last:rounded-r-2xl border-t border-b border-r border-transparent group-hover:border-emerald-100/50 text-gray-300">
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedTxId === tx.id ? "translate-x-1 text-emerald-500" : ""}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Detail Sidecard */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col h-fit sticky top-24">
                    <div className="p-8 border-b border-gray-50 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-black text-gray-400 mb-4 shadow-sm">
                            {selectedTx.brand.charAt(0)}
                        </div>
                        <h3 className="font-black text-xl text-gray-900 tracking-tight">{selectedTx.brand}</h3>
                        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-80">{selectedTx.gig}</p>

                        <div className={`mt-5 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest ${getStatusColor(selectedTx.status)} shadow-sm`}>
                            {selectedTx.status}
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Timeline */}
                        <div>
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <History className="w-3 h-3" /> Transaction Timeline
                            </p>
                            <div className="space-y-6 relative">
                                <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-gray-100"></div>
                                {selectedTx.timeline.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 relative z-10">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${item.isCompleted
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : "bg-white border-gray-200 text-gray-300"
                                            }`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className={`text-[13px] font-bold ${item.isCompleted ? "text-gray-900" : "text-gray-400"}`}>{item.label}</p>
                                            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{item.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50">
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-5">Financial Breakdown</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[13px] font-bold text-gray-500">Gross Amount</span>
                                    <span className="text-[14px] font-black text-gray-900">{selectedTx.totalAmount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[13px] font-bold text-gray-500">Deductions (10%)</span>
                                    <span className="text-[14px] font-bold text-rose-500">-{selectedTx.deductions}</span>
                                </div>
                                <div className="h-[1px] bg-gray-200/60 my-2"></div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[14px] font-black text-gray-900">Net Amount</span>
                                    <span className="text-[20px] font-black text-emerald-600 tracking-tighter">{selectedTx.netAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
                        <button className="w-full py-4 bg-white border-2 border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 transition-all rounded-[20px] text-[13px] font-bold text-gray-500 hover:text-emerald-600 flex items-center justify-center gap-2 group">
                            <ShieldAlert className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                            Report a Problem
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
