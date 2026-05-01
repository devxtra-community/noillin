"use client";

import React, { useState, useEffect } from "react";
import { Clock, Briefcase, X, ChevronRight, Loader2, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

import api from "@/lib/axios.client";

interface Request {
  _id: string;
  gigId: { title: string };
  influencerId: { fullName: string };
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
  influencerId?: { fullName: string };
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED": return "Completed";
    case "IN_ESCROW": return "Securely Booked";
    case "PENDING": return "Payment Pending";
    case "CANCELLED": return "Cancelled";
    default: return status;
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "COMPLETED": return "text-emerald-600 bg-emerald-50";
    case "IN_ESCROW": return "text-blue-600 bg-blue-50";
    case "PENDING": return "text-orange-600 bg-orange-50 font-bold";
    case "CANCELLED": return "text-rose-600 bg-rose-50";
    default: return "text-gray-600 bg-gray-100";
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Requests</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{requests.length}</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Total connections</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Agreements</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{proposals.length}</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Accepted proposals</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Calendar</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Active</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Track milestones</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1 pb-4">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gig / Influencer</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Budget</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ...requests.map(r => ({ ...r, type: 'request' })),
                  ...orders.filter(o => o.status === 'PENDING' || o.status === 'IN_ESCROW').map(o => ({ ...o, type: 'order' }))
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ].sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime()).slice(0, 8).map((item: any) => (
                  <tr key={`${item.type}-${item._id}`} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5 text-sm font-bold text-gray-900">
                      {item.type === 'order' ? (
                        <div className="flex flex-col">
                          <span>{item.gigId?.title || "Collaboration"}</span>
                          <span className={`text-[10px] uppercase font-black ${item.status === 'IN_ESCROW' ? 'text-blue-500' : 'text-emerald-600'}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                      ) : (
                        item.gigId?.title || "Collaboration"
                      )}
                    </td>
                    <td className="py-5 text-sm font-bold text-gray-900 text-right">₹{item.amount}</td>
                    <td className="py-5 text-center">
                      {item.type === 'order' && item.status === 'PENDING' ? (
                        <Link
                          href={`/payment?orderId=${item._id}`}
                          className="px-4 py-1.5 text-[10px] font-black rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-full ${getStatusStyles(item.status)}`}>
                          {item.type === 'order' ? getStatusLabel(item.status) : item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && orders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-gray-400 italic">No recent requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Calendar & Aside Card */}
        <div className="flex flex-col gap-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-black text-gray-900 tracking-tight">Calendar</h3>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                <button
                  onClick={() => {
                    const newDate = new Date(currentViewDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentViewDate(newDate);
                  }}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-black uppercase text-gray-500 tracking-wider min-w-[120px] text-center">
                  {currentViewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(currentViewDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentViewDate(newDate);
                  }}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={`${day}-${i}`} className="text-[11px] font-black text-gray-300 py-2 uppercase">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1.5 text-sm text-center">
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
                    className={`flex justify-center items-center h-10 w-10 mx-auto text-[13px] font-bold cursor-pointer rounded-2xl relative transition-all ${isSelected
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-200 scale-110"
                      : hasProposal
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "text-gray-900 hover:bg-gray-50"
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col min-h-[280px] relative overflow-hidden group">
            {!selectedDate ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="text-[15px] font-black text-gray-900">Select a Date</h4>
                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">Check your accepted <br />collaboration details</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[.2em] mb-1">Collaboration</span>
                    <h4 className="text-[18px] font-black text-gray-900 tracking-tight leading-none italic">{new Date(selectedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</h4>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).length > 0 ? (
                    proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).map(p => (
                      <div key={p._id} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shadow-sm">📅</div>
                          <div>
                            <p className="text-[13px] font-black text-gray-900 leading-none">Agreed Date</p>
                            <p className="text-[11px] font-bold text-emerald-600 mt-1">{p.proposalData.time}</p>
                          </div>
                        </div>
                        <p className="text-[12px] font-bold text-gray-500 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 shadow-sm">&ldquo;{p.content}&rdquo;</p>

                        <Link
                          href="/brand-dashboard/messages"
                          className="mt-6 w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                          View in Chat
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-gray-400 text-[12px] font-bold italic">No collaborations scheduled for this day</p>
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
