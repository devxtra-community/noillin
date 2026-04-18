"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, CreditCard } from "lucide-react";

import api from "@/lib/axios.client";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCheckout = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        return;
      }

      try {
        // 🔥 Directly create Stripe Session (Backend now fetches amount automatically)
        const res = await api.post("/payments/checkout", {
          orderId
        });

        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          throw new Error("Failed to get checkout URL from server.");
        }
      } catch (err: unknown) {
        console.error(err);
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setError(errorResponse.response?.data?.message || "Something went wrong while starting checkout.");
      }
    };

    startCheckout();
  }, [orderId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-emerald-600 animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Preparing Secure Checkout</h1>
      <p className="text-gray-500 max-w-xs text-center">
        Setting up your encrypted payment session with Stripe. You'll be redirected in a moment.
      </p>

      <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">PCI DSS Compliant · Secure Escrow</span>
      </div>
    </div>
  );
}