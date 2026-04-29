"use client";

import React, { useState, useEffect } from "react";
import { Clock, Briefcase, X, Loader2, Calendar } from "lucide-react";

import api from "@/lib/axios.client";

interface Request {
  _id: string;
  gigId: { title: string };
  influencerId: { fullName: string };
  status: string;
  amount: number;
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

export default function BrandDashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using existing endpoints if available, otherwise fallback
        const [requestsRes, proposalsRes] = await Promise.all([
          api.get("/connections/history").catch(() => ({ data: [] })),
          api.get("/chat/agreed-proposals").catch(() => ({ data: { proposals: [] } }))
        ]);
        setRequests(requestsRes.data || []);
        setProposals(proposalsRes.data.proposals || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
                {requests.slice(0, 5).map((req) => (
                  <tr key={req._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5 text-sm font-bold text-gray-900">
                      {req.gigId?.title || "Collaboration"}
                    </td>
                    <td className="py-5 text-sm font-bold text-gray-900 text-right">₹{req.amount}</td>
                    <td className="py-5 text-center">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${req.status === 'accepted' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-gray-400 italic">No recent requests</td>
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
              <div key={day} className="text-[11px] font-bold text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-sm text-center">
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100">28</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100">29</div>
            <div className="flex justify-center items-center h-8 w-8 mx-auto text-gray-100">30</div>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`flex justify-center items-center h-8 w-8 mx-auto text-[13px] font-bold cursor-pointer rounded-full relative ${proposals.some(p => new Date(p.proposalData.date).getDate() === day)
                  ? "text-white bg-emerald-500 shadow-md"
                  : "text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedDate(null)}></div>
          <div className="bg-white rounded-[24px] w-full max-w-[380px] overflow-hidden shadow-2xl relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[19px] font-bold text-gray-900 tracking-tight">Schedule Details</h3>
                <p className="text-[13px] font-semibold text-gray-400 mt-0.5">{selectedDate}</p>
              </div>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 mb-6">
              {proposals.filter(p => new Date(p.proposalData.date).toLocaleDateString() === selectedDate).map(p => (
                <div key={p._id} className="border border-emerald-100 bg-emerald-50/20 rounded-[16px] p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg">📅</div>
                  <div>
                    <h4 className="text-[14px] font-bold text-emerald-900">Agreed Collaboration</h4>
                    <p className="text-[12px] text-emerald-600 font-medium">{p.proposalData.time}</p>
                    <p className="text-[10px] text-gray-400 mt-1 italic">{p.content}</p>
                  </div>
                </div>
              ))}
              {proposals.filter(p => new Date(p.proposalData.date).toLocaleDateString() === selectedDate).length === 0 && (
                <p className="text-center py-10 text-gray-400 text-sm italic">No scheduled activities</p>
              )}
            </div>

            <button onClick={() => setSelectedDate(null)} className="w-full bg-[#1CD36B] hover:bg-[#19C061] text-white font-bold py-3.5 rounded-[14px] text-[14px]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
