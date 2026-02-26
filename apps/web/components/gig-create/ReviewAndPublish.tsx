"use client";

import React from "react";
import { FaEdit, FaCheckCircle, FaVideo, FaImage, FaFileAlt, FaInfoCircle } from "react-icons/fa";

import { AvailabilitySlot, useGigCreateStore, WeeklyRule } from "@/store/gigCreate.store";
import api from "@/lib/axios.client";
import { cn } from "@/lib/utils";

interface ReviewAndPublishProps {
    onBack: () => void;
    onNext: () => void;
    goToStep: (step: number) => void;
}

// --- Constants & Types ---
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
    day: string;
    enabled: boolean;
    slots: TimeSlot[];
}

interface DateOverride {
    date: string;
    unavailable: boolean;
}

// --- Helper Functions ---
const to12Hour = (time24: string) => {
    if (!time24) return "09:00 AM";
    if (time24.includes("AM") || time24.includes("PM")) return time24;
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours);
    const m = minutes || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

// --- Preview Component ---
interface AvailabilityPreviewProps {
    availabilityRules: DayAvailability[];
    overrides: DateOverride[];
}

function AvailabilityPreview({ availabilityRules, overrides }: AvailabilityPreviewProps) {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [viewDate, setViewDate] = React.useState(new Date());

    const getDashedDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const isDateAvailable = (date: Date) => {
        // Don't show availability for past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;

        const dateString = getDashedDate(date);
        const override = overrides.find(o => o.date === dateString);
        if (override) return !override.unavailable;

        const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const rule = availabilityRules.find(r => r.day === dayName);
        return rule?.enabled && rule.slots.length > 0;
    };

    const currentMonthYear = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const selectedDayName = DAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
    const selectedRule = availabilityRules.find(r => r.day === selectedDayName);
    const selectedOverride = overrides.find(o => o.date === getDashedDate(selectedDate));

    // Slots are only valid if it's not a past day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastDay = selectedDate < today;
    const displaySlots = (isPastDay || (selectedOverride && selectedOverride.unavailable)) ? [] : (selectedRule?.enabled ? selectedRule.slots : []);

    return (
        <div className="bg-[#111827] text-white rounded-4xl p-6 shadow-2xl shadow-gray-200 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/20 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold uppercase tracking-wider mb-6">
                    Live Availability
                </span>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-gray-200">{currentMonthYear}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]">{"<"}</button>
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]">{">"}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 text-[9px] text-gray-500 font-bold text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
                        {[...Array(firstDayOfMonth)].map((_, i) => <div key={i} />)}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const dayNum = i + 1;
                            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
                            const available = isDateAvailable(date);
                            const todayNow = new Date();
                            todayNow.setHours(0, 0, 0, 0);
                            const isPast = date < todayNow;
                            const isToday = dayNum === todayNow.getDate() && viewDate.getMonth() === todayNow.getMonth() && viewDate.getFullYear() === todayNow.getFullYear();
                            const isSelected = dayNum === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    disabled={false} // Allow clicking past days to see "no slots" but UI will reflect status
                                    className={cn(
                                        "w-7 h-7 flex flex-col items-center justify-center mx-auto rounded-lg transition-all relative",
                                        isSelected ? "bg-[#009366] text-white shadow-lg shadow-green-500/20 scale-110 z-10" : "text-gray-300 hover:bg-white/5",
                                        !available && !isSelected && "opacity-30 grayscale",
                                        isPast && !isSelected && "text-gray-600 opacity-20",
                                        isToday && !isSelected && "border border-[#009366]/50"
                                    )}
                                >
                                    <span className="text-[10px]">{dayNum}</span>
                                    {available && !isSelected && <div className="w-1 h-1 rounded-full bg-[#009366] mt-0.5" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 mb-3">
                            <span className={cn("w-1.5 h-1.5 rounded-full", displaySlots.length > 0 ? "bg-green-500" : "bg-red-500")} />
                            {displaySlots.length > 0 ? 'Available on ' : isPastDay ? 'Past date ' : 'Unavailable on '}
                            {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {displaySlots.length > 0 ? (
                                displaySlots.map((s, i) => (
                                    <div key={i} className="py-2 px-1 rounded-lg bg-white/5 border border-white/5 text-center text-[9px] font-bold text-green-400">
                                        {to12Hour(s.start)}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 py-4 text-center text-[9px] text-gray-500 italic bg-white/5 rounded-xl border border-white/5">
                                    {isPastDay ? "Date has passed" : "No slots available"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ReviewAndPublish({ onBack, onNext, goToStep }: ReviewAndPublishProps) {
    const { details, deliverables, pricing, availability, gigId } = useGigCreateStore();
    const [isLoading, setIsLoading] = React.useState(false);

    // Prepare data for the preview component
    const normalizedRules: DayAvailability[] = (availability?.weeklyRules || []).map((r: WeeklyRule) => ({
        day: r.day.charAt(0).toUpperCase() + r.day.slice(1),
        enabled: r.isEnabled,
        slots: (r.slots || []).map((s: AvailabilitySlot) => ({
            start: s.startTime,
            end: s.endTime
        }))
    }));

    const normalizedOverrides: DateOverride[] = (availability?.dateOverrides || []).map((o) => ({
        date: o.date,
        unavailable: !o.isAvailable
    }));

    const handlePublish = async () => {
        if (!gigId || isLoading) {
            if (!gigId) console.error("Gig ID missing");
            return;
        }

        setIsLoading(true);
        try {
            await api.post(`/gigs/${gigId}/publish`);
            onNext();
        } catch (error) {
            console.error("Error publishing gig:", error);
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
                                    <p className="text-[10px] font-black text-[#009366] uppercase tracking-widest">You Recieve</p>
                                    <p className="text-xl font-black text-[#009366]">
                                        ${pricing?.basePrice?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#009366] flex items-center justify-center text-white">
                                    <FaCheckCircle size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Availability Preview */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</span>
                        <button onClick={() => goToStep(4)} className="text-[10px] font-black text-green-600 hover:text-green-700 uppercase tracking-widest transition-colors">Adjust</button>
                    </div>
                    <AvailabilityPreview availabilityRules={normalizedRules} overrides={normalizedOverrides} />

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
