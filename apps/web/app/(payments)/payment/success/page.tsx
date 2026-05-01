"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ShieldCheck, Printer, History } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";

interface Order {
  _id: string;
  amount: number;
  stripePaymentIntentId?: string;
  connectionId?: string;
  [key: string]: unknown; // Allow other fields with unknown type to satisfy lint
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const router = useRouter();
  const { user } = useAuthStore();
  const chatDashboardPath = user?.role?.toLowerCase() === 'influencer' ? 'influencer-dashboard' : 'brand-dashboard';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (searchParams.get("session_id")) {
          const res = await api.get(`/orders/by-session/${searchParams.get("session_id")}`);
          setOrder(res.data);
        } else if (orderId) {
          const res = await api.get(`/orders/details/${orderId}`);
          setOrder(res.data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, searchParams]);

  useEffect(() => {
    if (!order?.connectionId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev <= 1 ? 0 : prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.connectionId]);

  useEffect(() => {
    if (countdown === 0 && order?.connectionId) {
      router.push(`/${chatDashboardPath}/messages?gigRequestId=${order.connectionId}`);
    }
  }, [countdown, order?.connectionId, router, chatDashboardPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#2196F3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 font-sans">

      {/* 🧾 The Receipt Modal */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-500">

        <div className="p-8 sm:p-12 text-center">
          {/* ✅ Success Icon */}
          <div className="w-20 h-20 bg-[#F1F9F5] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-14 h-14 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <Check className="text-white w-8 h-8 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-[#4CAF50] text-3xl font-bold mb-10 tracking-tight">Payment Successful</h1>

          {/* 📋 Data Table */}
          <div className="space-y-5 text-left max-w-md mx-auto mb-12">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Payment Account</span>
              <span className="text-gray-800 font-bold">Standard Account</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Transaction ID</span>
              <span className="text-gray-800 font-mono font-bold text-[12px]">{order?._id || "---"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Stripe Reference</span>
              <span className="text-gray-800 font-mono font-bold text-[12px] truncate max-w-[150px]">{order?.stripePaymentIntentId || "Direct Payment"}</span>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Amount Paid</span>
                <span className="text-3xl font-black text-gray-900">₹{order?.amount?.toLocaleString() || "0.00"}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-1 text-right uppercase tracking-[0.1em]">Including all taxes</p>
            </div>
          </div>

          {/* 🔘 Action Buttons */}
          <div className="flex flex-col gap-3 mt-10">
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-bold uppercase text-[12px] tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-100">
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <Link href="/transactions" className="flex-1 bg-[#2196F3] hover:bg-[#1E88E5] text-white py-4 px-6 rounded-xl font-bold uppercase text-[12px] tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                <History className="w-4 h-4" />
                History
              </Link>
            </div>
            <Link href={`/${chatDashboardPath}/messages?gigRequestId=${order?.connectionId}`} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-3.5 px-6 rounded-xl font-black uppercase text-[12px] tracking-widest transition-all text-center flex items-center justify-center gap-2 border border-emerald-100 shadow-sm animate-pulse">
              Go Back to Chat ({countdown}s)
            </Link>
          </div>
        </div>

        {/* 🛡️ Trust Footer */}
        <div className="bg-gray-50 py-5 border-t border-gray-100 flex items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Secure Escrow Transaction</span>
        </div>
      </div>

    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2196F3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

