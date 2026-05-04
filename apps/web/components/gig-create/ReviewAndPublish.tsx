"use client";

import React from "react";
import { FaEdit, FaCheckCircle, FaVideo, FaImage, FaFileAlt, FaInfoCircle } from "react-icons/fa";

import { useGigCreateStore } from "@/store/gigCreate.store";
import api from "@/lib/axios.client";

interface ReviewAndPublishProps {
    onBack: () => void;
    onNext: () => void;
    goToStep: (step: number) => void;
}



export function ReviewAndPublish({ onBack, onNext, goToStep }: ReviewAndPublishProps) {
    const { details, deliverables, pricing, gigId } = useGigCreateStore();
    const [isLoading, setIsLoading] = React.useState(false);

    const platformFeeRate = 0.05;
    const basePrice = pricing?.basePrice || 0;
    const totalPayout = basePrice > 0 ? basePrice - (basePrice * platformFeeRate) : 0;



    const handlePublish = async () => {
        if (!gigId) {
            console.error("Gig ID missing");
            return;
        }

        try {
            await api.post(`/gigs/${gigId}/publish`);

            console.log("Published successfully");

            onNext?.();   // clean optional chaining
        } catch (error) {
            console.error("Publish failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12">
                {/* Left Side: Summary Sections */}
                <div className="space-y-8">
                    {/* Gig Details Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Gig Details</h2>
                            <button
                                onClick={() => goToStep(1)}
                                className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-green-700 transition-colors"
                            >
                                <FaEdit size={12} /> Edit
                            </button>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-24 h-24 bg-[#111827] rounded-3xl overflow-hidden shrink-0 flex items-center justify-center text-white/20 font-bold text-xs p-2 text-center group-hover:scale-105 transition-transform">
                                <FaCheckCircle size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 leading-tight">
                                    {details.title || "Untitled Gig"}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-md">
                                    {details.shortDescription || "No description provided."}
                                </p>
                                <div className="flex gap-2 pt-2">
                                    {details.category && (
                                        <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {details.category}
                                        </span>
                                    )}
                                    {details.platform && (
                                        <span className="bg-green-50 text-green-600 text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {details.platform}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deliverables Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Deliverables</h2>
                            <button
                                onClick={() => goToStep(2)}
                                className="text-[10px) font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-green-700 transition-colors"
                            >
                                <FaEdit size={12} /> Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {deliverables.length > 0 ? (
                                deliverables.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#111827] shadow-sm">
                                            {item.contentType === 'video' ? <FaVideo size={16} /> :
                                                item.contentType === 'image' ? <FaImage size={16} /> :
                                                    <FaFileAlt size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">
                                                {item.quantity}x {item.contentType === 'video' ? 'Video' : item.contentType === 'image' ? 'Image' : 'Post'}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-30">
                                                {item.includedItems?.join(' • ') || "No details"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">No deliverables defined.</p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pricing Breakdown</h2>
                            <button
                                onClick={() => goToStep(3)}
                                className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-green-700 transition-colors"
                            >
                                <FaEdit size={12} /> Edit
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="space-y-1 text-center sm:text-left">
                                <p className="text-3xl font-black text-gray-900 tracking-tight">
                                    ${pricing?.basePrice?.toFixed(2) || "0.00"}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Rate</p>
                            </div>

                            <div className="hidden sm:block w-px h-12 bg-gray-100" />

                            <div className="flex-1 w-full bg-[#009366]/5 rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-[#009366] uppercase tracking-widest">You Receive</p>
                                    <p className="text-xl font-black text-[#009366]">
                                        ${totalPayout.toFixed(2)}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#009366] flex items-center justify-center text-white">
                                    <FaCheckCircle size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Publish Actions */}
                <div className="space-y-6">

                    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[#009366] shrink-0">
                                <FaInfoCircle size={10} />
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                By publishing, you agree to our terms and conditions. Your gig will be visible to brands immediately.
                            </p>
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={isLoading}
                            className="w-full bg-[#009366] hover:bg-[#007a55] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-green-500/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Publishing
                                </>
                            ) : (
                                "Publish Gig"
                            )}
                        </button>
                    </div>
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

                <button
                    type="button"
                    onClick={() => console.log("Save draft")}
                    className="text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors"
                >
                    Save draft
                </button>
            </div>
        </div>
    );
}
