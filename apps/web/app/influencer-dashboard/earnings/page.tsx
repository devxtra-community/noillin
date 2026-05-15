"use client";

import React, { useState, useEffect } from "react";
import { Search, Wallet, DollarSign, ArrowUpRight, History, ChevronRight, CheckCircle2, Clock, ShieldAlert, Loader2 } from "lucide-react";

import api from "@/lib/axios.client";

interface Order {
    _id: string;
    amount: number;
    platformFee: number;
    influencerAmount: number;
    status: "PENDING" | "IN_ESCROW" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    escrowStatus: "HOLD" | "RELEASED";
    payoutStatus: "HOLD" | "AVAILABLE" | "PROCESSING" | "PAID";
    createdAt: string;
    gigId: {
        title: string;
    };
    // Note: Brand name is not directly on the order, we'll use a placeholder or derived from buyer info if available
}

export default function EarningsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("30 days");

    const [hasStripeAccount, setHasStripeAccount] = useState(true);
    const [connectingStripe, setConnectingStripe] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const [ordersRes, profileRes] = await Promise.all([
                api.get("/orders/history"),
                api.get("/profile/get_profile")
            ]);
            setOrders(ordersRes.data);
            setHasStripeAccount(!!profileRes.data.data.stripeAccountId);
            if (ordersRes.data.length > 0) {
                setSelectedOrderId(ordersRes.data[0]._id);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectStripe = async () => {
        try {
            setConnectingStripe(true);
            const res = await api.post("/payments/connect");
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error("Stripe Connect failed:", error);
            alert("Failed to start Stripe onboarding. Please try again.");
        } finally {
            setConnectingStripe(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleWithdraw = async () => {
        const availableAmount = stats.available;
        if (availableAmount <= 0) return;

        if (!confirm(`Are you sure you want to withdraw ₹${availableAmount}?`)) return;

        try {
            setWithdrawing(true);
            await api.post("/payouts/withdraw");
            alert("Withdrawal successful! Funds are on the way.");
            fetchOrders(); // Refresh data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Withdrawal failed:", error);
            alert(error.response?.data?.message || "Withdrawal failed. Please try again.");
        } finally {
            setWithdrawing(false);
        }
    };

    const stats = {
        total: orders
            .filter(o => o.status === "COMPLETED")
            .reduce((sum, o) => sum + (o.influencerAmount || 0), 0),
        escrow: orders
            .filter(o => o.status === "IN_ESCROW")
            .reduce((sum, o) => sum + (o.influencerAmount || 0), 0),
        available: orders
            .filter(o => o.payoutStatus === "AVAILABLE")
            .reduce((sum, o) => sum + (o.influencerAmount || 0), 0),
        thisMonth: orders
            .filter(o => {
                const date = new Date(o.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            })
            .reduce((sum, o) => sum + (o.influencerAmount || 0), 0)
    };

    const filters = ["Last 7 days", "30 days", "Month"];

    const selectedOrder = orders.find(o => o._id === selectedOrderId) || orders[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600";
            case "IN_ESCROW": return "bg-blue-50 text-blue-600";
            case "PENDING": return "bg-orange-50 text-orange-600";
            case "DISPUTED": return "bg-rose-50 text-rose-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const getPayoutBadge = (status: string) => {
        switch (status) {
            case "PAID": return "bg-emerald-500 text-white";
            case "PROCESSING": return "bg-blue-500 text-white";
            case "AVAILABLE": return "bg-amber-500 text-white";
            default: return "bg-gray-200 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full flex flex-col font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-title-lg text-gray-900">Earnings</h1>
                    <p className="text-body-md text-gray-500 mt-1.5 uppercase tracking-wide">Manage your revenue and track your payouts</p>
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

            {/* 🔥 Stripe Verification Banner */}
            {!hasStripeAccount && (
                <div className="mb-8 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-title-lg text-white mb-2">Complete Your Payout Setup</h2>
                        <p className="text-body-md text-emerald-50 max-w-md">Connect your Stripe account to start receiving payments for your collaborations securely. It only takes a few minutes.</p>
                    </div>
                    <button
                        onClick={handleConnectStripe}
                        disabled={connectingStripe}
                        className="relative z-10 bg-white text-emerald-600 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {connectingStripe ? <Loader2 className="w-5 h-5 animate-spin" /> : "Connect Stripe Now"}
                        {!connectingStripe && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Available Balance */}
                <div className="lg:col-span-1 bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
                    <div>
                        <p className="text-label text-gray-400 !mb-2">Available Balance</p>
                        <h2 className="text-title-xl text-gray-900 leading-none">₹{stats.available.toLocaleString()}</h2>
                    </div>
                    <button
                        onClick={handleWithdraw}
                        disabled={stats.available <= 0 || withdrawing}
                        className={`mt-4 w-full ${stats.available > 0 ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-gray-200 cursor-not-allowed text-gray-400"} text-white font-black py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2`}
                    >
                        {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                        {withdrawing ? "Processing..." : "Withdraw"}
                    </button>
                </div>

                <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group h-full">
                    <p className="text-label text-gray-400 !mb-2">TOTAL EARNED</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-title-lg text-gray-900">₹{stats.total.toLocaleString()}</h3>
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-200 group-hover:text-emerald-500 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group h-full">
                    <p className="text-label text-gray-400 !mb-2">IN ESCROW</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-title-lg text-blue-600">₹{stats.escrow.toLocaleString()}</h3>
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-200 group-hover:text-emerald-500 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group h-full">
                    <p className="text-label text-gray-400 !mb-2">THIS MONTH</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-title-lg text-emerald-500">₹{stats.thisMonth.toLocaleString()}</h3>
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-200 group-hover:text-emerald-500 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Table */}
                <div className="xl:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
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

                    <div className="px-4 pb-6 overflow-auto max-h-[600px]">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Gig Name</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Net Amount</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-none">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => setSelectedOrderId(order._id)}
                                        className={`group cursor-pointer transition-all ${selectedOrderId === order._id
                                            ? "bg-emerald-50/40"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-6 py-5 first:rounded-l-2xl last:rounded-r-2xl border-t border-b border-l border-transparent transition-all group-hover:border-emerald-100/50">
                                            <div className="font-bold text-[14px] text-gray-900 leading-tight">{order.gigId?.title || "Influencer Booking"}</div>
                                            <div className="text-[11px] font-semibold text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-5 border-t border-b border-transparent group-hover:border-emerald-100/50 text-right">
                                            <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 border-t border-b border-transparent group-hover:border-emerald-100/50 text-right font-black text-[15px] text-gray-900">
                                            ₹{(order.influencerAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-5 last:rounded-r-2xl border-t border-b border-r border-transparent group-hover:border-emerald-100/50 text-gray-300">
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedOrderId === order._id ? "translate-x-1 text-emerald-500" : ""}`} />
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-20 text-gray-400 font-semibold italic">No transactions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Detail Sidecard */}
                {selectedOrder && (
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col h-fit sticky top-24">
                        <div className="p-8 border-b border-gray-50 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl font-black text-emerald-500 mb-4 shadow-sm">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-xl text-gray-900 tracking-tight text-center">{selectedOrder.gigId?.title || "Influencer Booking"}</h3>
                            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-80">Order Details</p>

                            <div className={`mt-5 px-5 py-2 rounded-xl text-[11px] font-black tracking-widest ${getPayoutBadge(selectedOrder.payoutStatus)} shadow-lg shadow-gray-100`}>
                                PAYOUT: {selectedOrder.payoutStatus}
                            </div>
                        </div>

                        <div className="p-8 space-y-10">
                            {/* Payout Info */}
                            <div>
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <History className="w-3 h-3" /> Status Tracking
                                </p>
                                <div className="space-y-6 relative">
                                    <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-gray-100"></div>
                                    <div className="flex gap-4 relative z-10">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-500 text-white flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-900 border-gray-100">Payment Received</p>
                                            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 relative z-10">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${selectedOrder.escrowStatus === "RELEASED" ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200 text-gray-300"}`}>
                                            <Clock className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className={`text-[13px] font-bold ${selectedOrder.escrowStatus === "RELEASED" ? "text-gray-900" : "text-gray-400"}`}>Escrow Released</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 relative z-10">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${selectedOrder.payoutStatus === "PAID" ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200 text-gray-300"}`}>
                                            <ShieldAlert className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <p className={`text-[13px] font-bold ${selectedOrder.payoutStatus === "PAID" ? "text-gray-900" : "text-gray-400"}`}>Final Payout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50">
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-5">Financial Breakdown</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] font-bold text-gray-500">Gross Price</span>
                                        <span className="text-[14px] font-black text-gray-900">₹{(selectedOrder.amount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] font-bold text-gray-500">Platform Fee (5%)</span>
                                        <span className="text-[14px] font-bold text-rose-500">-₹{(selectedOrder.platformFee || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="h-[1px] bg-gray-200/60 my-2"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[14px] font-black text-gray-900">Your Earning</span>
                                        <span className="text-[20px] font-black text-emerald-600 tracking-tighter">₹{(selectedOrder.influencerAmount || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
