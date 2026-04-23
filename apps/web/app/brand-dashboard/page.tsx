"use client";

import React, { useState } from "react";
import { Clock, Briefcase, Wallet, X, ChevronRight, User } from "lucide-react";

// Dummy data for Brand Dashboard reference
const recentRequests = [
  { gigName: "Summer Solstice Campaign", influencer: "Sarah Jenkins", price: "$450.00", status: "Pending", statusColor: "text-orange-600 bg-orange-50" },
  { gigName: "Tech Review: Pro X2", influencer: "Marcus Chen", price: "$1,200.00", status: "Accepted", statusColor: "text-emerald-600 bg-emerald-50" },
  { gigName: "Healthy Eats Series", influencer: "Elena Rodriguez", price: "$300.00", status: "Rejected", statusColor: "text-rose-600 bg-rose-50" },
  { gigName: "City Walk Vlogs", influencer: "Jordan Smith", price: "$550.00", status: "Pending", statusColor: "text-orange-600 bg-orange-50" },
  { gigName: "Fitness Challenge 2024", influencer: "Taylor Reed", price: "$800.00", status: "Accepted", statusColor: "text-emerald-600 bg-emerald-50" },
];

const modalDetails = [
  { id: 1, title: "Campaign Launch", description: "Review final assets for Summer Solstice...", time: "10:00 AM", color: "bg-orange-100 text-orange-700" },
  { id: 2, title: "Influencer Sync", description: "Meeting with Marcus Chen for Tech Review...", time: "1:30 PM", color: "bg-emerald-100 text-emerald-700" },
  { id: 3, title: "Payment Processing", description: "Verify pending transactions for Q2...", time: "4:00 PM", color: "bg-blue-100 text-blue-700" },
];

export default function BrandDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (day: number) => {
    setSelectedDate(`May ${day}, 2024`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Requests</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">12</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Pending collaborations</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Bookings</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">4</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Active campaigns</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Transactions</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">$2,450</h2>
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Total spent</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Requests</h3>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1 pb-4">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gig Name</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Influencer Name</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRequests.map((req, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5">
                      <span className="font-bold text-sm text-gray-900">{req.gigName}</span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 overflow-hidden">
                          {req.influencer.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-600">{req.influencer}</span>
                      </div>
                    </td>
                    <td className="py-5 text-sm font-bold text-gray-900">{req.price}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${req.statusColor}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
              <div key={day} className="text-[11px] font-bold text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-sm text-center">
            {/* Dummy Days */}
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100 font-medium">28</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100 font-medium">29</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100 font-medium">30</div>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`flex justify-center items-center h-8 w-8 mx-auto text-[13px] font-bold cursor-pointer rounded-full transition-all ${day === 13
                  ? "text-white bg-emerald-500 shadow-md shadow-emerald-200"
                  : "text-gray-900 hover:bg-emerald-50 hover:text-emerald-600"
                  } relative`}
              >
                {day}
                {(day === 15 || day === 22) && (
                  <div className="w-1 h-1 bg-emerald-500 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2"></div>
                )}
              </div>
            ))}
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100 font-medium">1</div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-100 border border-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Marked</span>
          </div>
        </div>
      </div>

      {/* Date Modal - Keeping the interaction from influencer dashboard */}
      {selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setSelectedDate(null)}
          ></div>

          <div className="bg-white rounded-[24px] w-full max-w-[380px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-[19px] font-bold text-gray-900 tracking-tight">Today&apos;s Schedule</h3>
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
                {modalDetails.map((item) => (
                  <div key={item.id} className="border border-gray-100 bg-white shadow-sm rounded-[16px] p-4 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all cursor-pointer group flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}>
                      <Briefcase className="w-6 h-6 opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">{item.title}</h4>
                      <p className="text-[12px] text-gray-500 mt-0.5 font-medium truncate">{item.description}</p>
                      <p className="text-[12px] font-bold text-gray-800 mt-2.5">{item.time}</p>
                    </div>
                    <div className="self-center flex-shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full bg-[#1CD36B] hover:bg-[#19C061] text-white font-bold py-3.5 px-4 rounded-[14px] text-[14px] shadow-sm transition-colors uppercase tracking-wider">
                  View Full Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
