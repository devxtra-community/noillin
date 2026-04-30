"use client";

import React, { useState, useEffect } from "react";
import { Plus, DollarSign, Calendar, Clock, X, ChevronRight, Loader2, ChevronLeft } from "lucide-react";

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
  dueDate?: string;
  gigId: {
    title: string;
    description?: string;
  };
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

export default function InfluencerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, proposalsRes] = await Promise.all([
          api.get("/orders/history"),
          api.get("/chat/agreed-proposals")
        ]);
        setOrders(ordersRes.data);
        setProposals(proposalsRes.data.proposals || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = {
    earnings: orders
      .filter(o => o.status === "COMPLETED")
      .reduce((sum, o) => sum + (o.influencerAmount || 0), 0),
    activeBookings: orders.filter(o => o.status === "IN_ESCROW").length,
    pendingRequests: orders.filter(o => o.status === "PENDING").length,
  };

  const recentBookings = orders.slice(0, 5);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-emerald-600 bg-emerald-50";
      case "IN_ESCROW": return "text-blue-600 bg-blue-50";
      case "PENDING": return "text-orange-600 bg-orange-50";
      case "CANCELLED": return "text-rose-600 bg-rose-50";
      default: return "text-gray-600 bg-gray-100";
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full font-sans">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors w-full sm:w-auto shrink-0">
          <Plus className="w-4 h-4" />
          Create new gig
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Total Earnings</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">₹{stats.earnings.toLocaleString()}</h2>
              <div className="inline-block mt-3 bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-md">
                +12%
              </div>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Active Bookings</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{stats.activeBookings}</h2>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Pending Requests</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{stats.pendingRequests}</h2>
              {stats.pendingRequests > 0 && (
                <div className="inline-block mt-3 bg-orange-50 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-md">
                  Action Needed
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Your Bookings</h3>
              <p className="text-xs text-gray-500 mt-1">Recently updated influencer collaborations.</p>
            </div>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1 pb-4">
            <table className="w-full text-left border-separate border-spacing-y-2 min-w-[500px]">
              <thead>
                <tr>
                  <th className="px-4 pb-3 text-xs font-semibold text-gray-500">Gig</th>
                  <th className="px-4 pb-3 text-xs font-semibold text-gray-500 text-right">Price</th>
                  <th className="px-4 pb-3 text-xs font-semibold text-gray-500 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 first:rounded-l-xl last:rounded-r-xl border-t border-b border-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                          {booking.gigId?.title?.charAt(0) || "B"}
                        </div>
                        <span className="font-semibold text-sm text-gray-900 truncate max-w-[200px]">{booking.gigId?.title || "Influencer Booking"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-gray-900 text-right">₹{(booking.influencerAmount || 0).toLocaleString()}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${getStatusStyles(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-20 text-gray-400 font-semibold italic">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Calendar & Aside Card */}
        <div className="flex flex-col gap-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-6 flex flex-col h-fit">
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
                <span className="bg-gray-50 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase text-gray-500 tracking-wider min-w-[110px] text-center">
                  {currentViewDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
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
                const hasEvent = orders.some(o => o.dueDate && new Date(o.dueDate).toDateString() === dateString) ||
                  proposals.some(p => new Date(p.proposalData.date).toDateString() === dateString);
                const isSelected = selectedDate === dateString;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateString)}
                    className={`flex justify-center items-center h-10 w-10 mx-auto text-[13px] font-bold cursor-pointer rounded-2xl relative transition-all ${isSelected
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-200 scale-110"
                      : hasEvent
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 shrink-0"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aside Detail Card */}
          <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-8 flex flex-col min-h-[320px] relative overflow-hidden group">
            {!selectedDate ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">Timeline Detail</h4>
                <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-[0.2em] leading-relaxed">Select a date to view <br />your direct milestones</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[.3em] mb-1.5">Schedule</span>
                    <h4 className="text-[20px] font-black text-gray-900 tracking-tighter leading-none">{new Date(selectedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</h4>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Unified Orders & Proposals */}
                  {[
                    ...orders.filter(o => o.dueDate && new Date(o.dueDate).toDateString() === selectedDate).map(o => ({ ...o, type: 'locked' })),
                    ...proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).map(p => ({ ...p, type: 'negotiated' }))
                  ].length > 0 ? (
                    [
                      ...orders.filter(o => o.dueDate && new Date(o.dueDate).toDateString() === selectedDate).map(o => ({ ...o, type: 'locked' })),
                      ...proposals.filter(p => new Date(p.proposalData.date).toDateString() === selectedDate).map(p => ({ ...p, type: 'negotiated' }))
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ].map((item: any) => (
                      <div key={`${item.type}-${item._id}`} className={`rounded-2xl p-5 border ${item.type === 'locked' ? 'bg-gray-50 border-gray-100' : 'bg-emerald-50/30 border-emerald-100/50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${item.type === 'locked' ? 'bg-white text-gray-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            {item.type === 'locked' ? <Clock className="w-5 h-5" /> : "📅"}
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-gray-900 leading-none">{item.gigId?.title || "Agreed Date"}</p>
                            <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{item.type === 'locked' ? 'Final Deadline' : `Time: ${item.proposalData.time}`}</p>
                          </div>
                        </div>

                        {item.type === 'negotiated' && (
                          <p className="text-[12px] font-bold text-gray-500 leading-relaxed bg-white/50 p-3 rounded-xl border border-emerald-50 italic">&ldquo;{item.content}&rdquo;</p>
                        )}

                        <button
                          onClick={() => window.location.href = "/influencer-dashboard/bookings"}
                          className="mt-6 w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm group/btn"
                        >
                          Dashboard Manager
                          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">No Milestones</p>
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
