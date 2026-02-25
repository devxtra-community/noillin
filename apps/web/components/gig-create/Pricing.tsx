"use client";

import React, { useState } from "react";
import { FaMinus, FaPlus, FaInfoCircle } from "react-icons/fa";

import { useGigCreateStore } from "@/store/gigCreate.store";
import api from "@/lib/axios.client";

interface PricingProps {
    onBack: () => void;
    onNext: () => void;
}

export function Pricing({ onBack, onNext }: PricingProps) {
    const { gigId, pricing, setPricing } = useGigCreateStore();

    const [basePrice, setBasePrice] = useState<number>(pricing?.basePrice || 250);
    const [deliveryTimeInDays, setDeliveryTimeInDays] = useState<number>(pricing?.deliveryTimeInDays || 5);
    const [revisionsIncluded, setRevisionsIncluded] = useState<number>(pricing?.revisionsIncluded || 0);
    const [currency] = useState<"USD" | "INR">(pricing?.currency || "USD");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!gigId || isLoading) {
            if (!gigId) console.error("Gig ID missing");
            return;
        }

        setIsLoading(true);
        const pricingPayload = {
            basePrice,
            currency,
            negotiationAllowed: false,
            deliveryTimeInDays,
            revisionsIncluded
        };

        try {
            await api.patch(`/gigs/${gigId}/pricing`, pricingPayload);
            setPricing(pricingPayload);
            onNext();
        } catch (error) {
            console.error("Error saving pricing:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const platformFeeRate = 0; // 0% for now
    const platformFee = basePrice * platformFeeRate;
    const totalPayout = basePrice - platformFee;

    return (
        <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12">
                {/* Left Side: Form */}
                <div className="space-y-10">
                    {/* Base Price */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-800">
                            Base Price
                        </label>
                        <div className="relative max-w-100">
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(Number(e.target.value))}
                                className="w-full h-16 bg-gray-50/50 border border-transparent rounded-xl px-6 text-2xl font-bold text-gray-900 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaInfoCircle className="text-gray-400" />
                            <span>You&apos;ll receive payment after booking is confirmed.</span>
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-800">
                            Delivery Time
                        </label>
                        <div className="relative max-w-100">
                            <select
                                value={deliveryTimeInDays}
                                onChange={(e) => setDeliveryTimeInDays(Number(e.target.value))}
                                className="w-full h-14 bg-gray-50/50 border border-transparent rounded-xl px-5 text-sm font-medium text-gray-700 appearance-none cursor-pointer focus:bg-white focus:border-green-500 transition-all outline-none"
                            >
                                <option value={1}>1 Day</option>
                                <option value={2}>2 Days</option>
                                <option value={3}>3 Days</option>
                                <option value={5}>5 Days</option>
                                <option value={7}>7 Days</option>
                                <option value={14}>14 Days</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Revisions Included */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-800">
                            Revisions included
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setRevisionsIncluded((prev) => Math.max(0, prev - 1))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95"
                            >
                                <FaMinus size={12} />
                            </button>
                            <div className="w-20 h-12 flex items-center justify-center rounded-xl bg-gray-50/50 text-lg font-semibold text-gray-900">
                                {revisionsIncluded}
                            </div>
                            <button
                                onClick={() => setRevisionsIncluded((prev) => prev + 1)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95"
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Brand Preview */}
                <div className="bg-gray-50/50 rounded-3xl p-6 space-y-8 h-fit">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Brand Preview
                    </span>

                    {/* Card Mockup */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="relative h-44 bg-gray-900">
                            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-4xl overflow-hidden">
                                <div className="grid grid-cols-3 gap-2 opacity-40">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-lg bg-white/10" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight bg-green-50 px-2 py-0.5 rounded">
                                    IG REEL
                                </span>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900">
                                    <span className="text-yellow-400 text-xs">★</span> 4.9
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">
                                High-quality lifestyle reel for your brand
                            </h3>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                <span className="text-[10px] text-gray-400 font-medium">Starting at</span>
                                <span className="text-lg font-bold text-gray-900">${basePrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Your earnings</span>
                            <span className="font-semibold text-gray-900">${basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Platform fee (0%)</span>
                            <span className="text-green-500 font-semibold">-$0.00</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-900 pb-1">Total Payout</span>
                            <span className="text-3xl font-bold text-gray-900">${totalPayout.toFixed(2)}</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        Noillin charges 0% commission for creators. The price you set is exactly what you&apos;ll receive upon successful completion.
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-12">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                    <span className="text-lg">←</span> Back
                </button>

                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => console.log("Save draft")}
                        className="text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors"
                    >
                        Save draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#009366] hover:bg-[#007a55] text-white px-10 py-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
