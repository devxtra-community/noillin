"use client";

import React, { useState, useEffect } from "react";
import { Clock, Briefcase, X, ChevronRight, Loader2, Calendar, ChevronLeft, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import api from "@/lib/axios.client";

interface Request {
  _id: string;
  gigId: { title: string };
  influencerId: { fullName: string; profileImageUrl?: string };
  status: string;
  amount: number;
  createdAt: string;
}

interface Proposal {
  _id: string;
  proposalData: {
    date: string;
    time: string;
    status: string;
  };
  content: string;
}

interface Order {
  _id: string;
  gigId: { title: string };
  amount: number;
  status: string;
  createdAt: string;
  influencerId?: { fullName: string; profileImageUrl?: string };
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED": return "Completed";
    case "IN_ESCROW": return "Securely Booked";
    case "PENDING": return "Payment Pending";
    case "CANCELLED": return "Cancelled";
    case "accepted": return "Accepted";
    case "rejected": return "Rejected";
    case "pending": return "Under Review";
    default: return status;
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "COMPLETED": return "text-emerald-700 bg-emerald-100/80 border border-emerald-200";
    case "IN_ESCROW": return "text-blue-700 bg-blue-100/80 border border-blue-200";
    case "PENDING": return "text-orange-700 bg-orange-100/80 border border-orange-200 font-bold";
    case "CANCELLED": case "rejected": return "text-rose-700 bg-rose-100/80 border border-rose-200";
    case "accepted": return "text-emerald-700 bg-emerald-100/80 border border-emerald-200";
    case "pending": return "text-amber-700 bg-amber-100/80 border border-amber-200";
    default: return "text-slate-600 bg-slate-100 border border-slate-200";
  }
};

export default function BrandDashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [requestsRes, proposalsRes, ordersRes] = await Promise.all([
          api.get("/connections/history").catch(() => ({ data: [] })),
          api.get("/chat/agreed-proposals").catch(() => ({ data: { proposals: [] } })),
          api.get("/orders/history").catch(() => ({ data: [] }))
        ]);
        setRequests(requestsRes.data || []);
        setProposals(proposalsRes.data.proposals || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-10 py-8 max-w-[1600px] mx-auto w-full">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-title-lg text-slate-900">Platform Overview</h1>
          <p className="text-body-md text-slate-500 mt-1.5">Welcome back! Here&apos;s what&apos;s happening across your campaigns today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/brand-dashboard/requests" className="px-4 py-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm">
            View Requests
          </Link>
          <Link href="/gig-list" className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2">
            Create Campaign <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label text-slate-400">Active Requests</p>
              <div className="flex items-end gap-3">
                <h2 className="text-title-xl text-slate-900">{requests.length}</h2>
                <span className="flex items-center text-[10px] font-black text-emerald-500 mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><TrendingUp className="w-3 h-3 mr-1"/> Active</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 border border-orange-100 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label text-slate-400">Agreements</p>
              <div className="flex items-end gap-3">
                <h2 className="text-title-xl text-slate-900">{proposals.length}</h2>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label text-slate-400">Calendar Sync</p>
              <div className="flex items-end gap-3">
                <h2 className="text-title-xl text-slate-900">Active</h2>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 border border-blue-100 shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm shadow-slate-200/50 border border-slate-100 p-8 flex flex-col relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity className="w-32 h-32 text-slate-400" />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-title-lg text-slate-900 !text-xl">Recent Activity</h3>
            <Link href="/brand-dashboard/transactions" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 pb-4 relative z-10">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Gig / Influencer</th>
                  <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right w-[30%]">Budget</th>
                  <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-[30%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                {(
                  [
                    ...requests.map(r => ({ ...r, type: 'request' as const })),
                    ...orders.filter(o => o.status === 'PENDING' || o.status === 'IN_ESCROW').map(o => ({ ...o, type: 'order' as const }))
                  ] as Array<(Request & { type: 'request' }) | (Order & { type: 'order' })>
                ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8).map((item) => (
                  <tr key={`${item.type}-${item._id}`} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 shadow-sm border border-slate-200">
                           {item.influencerId?.fullName?.charAt(0) || "I"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.type === 'order' ? item.gigId?.title : item.gigId?.title || "Collaboration"}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {item.influencerId?.fullName || "Influencer"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-[15px] font-black text-slate-900 text-right">₹{item.amount?.toLocaleString() || "0"}</td>
                    <td className="py-5 text-center">
                      {item.type === 'order' && item.status === 'PENDING' ? (
                        <Link
                          href={`/payment?orderId=${item._id}`}
                          className="inline-block px-5 py-2 text-[11px] font-black rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <span className={`inline-block px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${getStatusStyles(item.status)}`}>
                          {item.type === 'order' ? getStatusLabel(item.status) : getStatusLabel(item.status)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && orders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-16">
                       <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                             <Activity className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-sm font-bold">No recent activity</p>
                          <p className="text-xs mt-1">Your requests and orders will appear here.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Calendar & Aside Card */}
        <div className="flex flex-col gap-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-[32px] shadow-sm shadow-slate-200/50 border border-slate-100 p-8 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Timeline</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <button
                  onClick={() => {
                    const newDate = new Date(currentViewDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentViewDate(newDate);
                  }}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors border border-transparent hover:border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black uppercase text-slate-600 tracking-wider min-w-[100px] text-center">
                  {currentViewDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(currentViewDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentViewDate(newDate);
                  }}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors border border-transparent hover:border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={`${day}-${i}`} className="text-[10px] font-black text-slate-300 py-1 uppercase">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-sm text-center">
              {/* Padding for start of month */}
              {Array.from({ length: new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="h-10 w-10"></div>
              ))}

              {/* Dynamic Calendar Days */}
              {Array.from({ length: new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                const dateString = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day).toDateString();
                const hasProposal = proposals.some(p => new Date(p.proposalData.date).toDateString() === dateString);
                const isSelected = selectedDate === dateString;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateString)}
                    className={`flex justify-center items-center h-10 w-10 mx-auto text-[13px] font-bold cursor-pointer rounded-[14px] relative transition-all ${isSelected
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110 z-10"
                      : hasProposal
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100/50"
                        : "text-slate-700 hover:bg-slate-50 border border-transparent"
                      }`}
                  >
                    {day}
                    {hasProposal && !isSelected && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 shrink-0"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aside Detail Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] shadow-xl shadow-slate-900/10 p-8 flex flex-col min-h-[280px] relative overflow-hidden group">
             {/* Decorative element */}
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            {!selectedDate ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center text-white/50 mb-5 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 border border-white/5">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="text-[16px] font-black text-white">Date Details</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-2 uppercase tracking-widest leading-relaxed">Select a highlighted date<br />to view collaborations</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5">Collaboration</span>
                    <h4 className="text-[20px] font-black text-white tracking-tight leading-none">{new Date(selectedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</h4>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-2.5 bg-white/10 rounded-xl text-white/60 hover:bg-white/20 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  {proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).length > 0 ? (
                    proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).map(p => (
                      <div key={p._id} className="bg-white/5 rounded-[24px] p-5 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-[16px] bg-emerald-500/20 flex items-center justify-center text-xl shadow-inner border border-emerald-500/30">📅</div>
                          <div>
                            <p className="text-[12px] font-black text-white/80 uppercase tracking-wider">Agreed Time</p>
                            <p className="text-[16px] font-bold text-emerald-400 mt-0.5">{p.proposalData.time}</p>
                          </div>
                        </div>
                        <p className="text-[13px] font-medium text-slate-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5 italic shadow-inner">&ldquo;{p.content}&rdquo;</p>

                        <Link
                          href="/brand-dashboard/messages"
                          className="mt-6 w-full py-3.5 bg-white text-slate-900 hover:bg-emerald-50 rounded-[16px] text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          View in Chat
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex items-center justify-center h-full">
                      <p className="text-slate-400 text-[13px] font-medium text-center">No collaborations scheduled<br/>for this day.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
