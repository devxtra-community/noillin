"use client";

import React, { useState, useEffect } from "react";
import { Plus, DollarSign, Calendar, Clock, X, ChevronRight, User, Loader2 } from "lucide-react";

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

export default function InfluencerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/history");
        setOrders(response.data);
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

  const handleDateClick = (day: number) => {
    setSelectedDate(`May ${day}, 2024`);
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

        {/* Calendar Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Select Date</h3>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
              <button className="text-gray-400 hover:text-gray-900 p-1">&lt;</button>
              May 2024
              <button className="text-gray-400 hover:text-gray-900 p-1">&gt;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-semibold text-gray-500 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-sm text-center">
            {/* Dummy Days */}
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-300 font-medium">28</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-300 font-medium">29</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-300 font-medium">30</div>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`flex justify-center items-center h-8 w-8 mx-auto font-semibold cursor-pointer rounded-full ${day === 13
                  ? "text-white bg-emerald-500 shadow-md shadow-emerald-200 font-bold"
                  : "text-gray-900 hover:bg-gray-50"
                  } relative`}
              >
                {day}
                {(day === 7 || day === 14) && (
                  <div className="w-1 h-1 bg-emerald-500 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2"></div>
                )}
              </div>
            ))}
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-300 font-medium">1</div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Marked</span>
          </div>
        </div>
      </div>

      {/* Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setSelectedDate(null)}
          ></div>

          <div className="bg-white rounded-[24px] w-full max-w-[380px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-[19px] font-bold text-gray-900 tracking-tight">Due Today</h3>
                  <p className="text-[13px] font-semibold text-gray-400 mt-0.5">{selectedDate}</p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {orders
                  .filter(o => o.dueDate && new Date(o.dueDate).toLocaleDateString() === selectedDate)
                  .map((order) => (
                    <div key={order._id} className="border border-gray-100 bg-white shadow-sm rounded-[16px] p-4 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all cursor-pointer group flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-50 text-emerald-600">
                        <User className="w-6 h-6 opacity-90" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">{order.gigId?.title}</h4>
                        <p className="text-[12px] text-gray-500 mt-0.5 font-medium truncate">{order.gigId?.description || "Collaboration"}</p>
                        <p className="text-[12px] font-bold text-gray-800 mt-2.5">Price: ₹{order.influencerAmount}</p>
                      </div>
                      <div className="self-center flex-shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                {orders.filter(o => o.dueDate && new Date(o.dueDate).toLocaleDateString() === selectedDate).length === 0 && (
                  <p className="text-center py-10 text-gray-400 text-sm italic">No gigs due on this date</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full bg-[#1CD36B] hover:bg-[#19C061] text-white font-bold py-3.5 px-4 rounded-[14px] text-[14px] shadow-sm transition-colors">
                  View All Gigs
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full bg-white text-gray-500 hover:text-gray-800 font-bold py-3 px-4 rounded-[14px] text-[14px] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
