"use client";

import React, { useState } from "react";
import { FaPlus, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";

import api from "@/lib/axios.client";
import { AvailabilitySlot, useGigCreateStore, WeeklyRule } from "@/store/gigCreate.store";
import { cn } from "@/lib/utils";

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

interface AvailabilityProps {
  onBack: () => void;
  onNext: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

// Helper to convert 24h string to 12h display
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

// Helper to convert 12h display to 24h string
const convertTo24Hour = (time: string) => {
  const [hourMin, modifier] = time.split(" ");

  const [rawHours, minutes] = hourMin.split(":");
  let hours = rawHours;

  if (modifier === "PM" && hours !== "12") {
    hours = String(Number(hours) + 12);
  }

  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
};

const TIME_OPTIONS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
  "09:00 PM"
];

// --- Preview Component ---

interface AvailabilityPreviewProps {
  availabilityRules: DayAvailability[];
  overrides: DateOverride[];
}

function AvailabilityPreview({ availabilityRules, overrides }: AvailabilityPreviewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  // Reset selectedDate time to start of day for accurate string comparison
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

    // Check overrides first
    const override = overrides.find(o => o.date === dateString);
    if (override) return !override.unavailable;

    // Check weekly rules
    const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]; // DAYS is Mon-Sun
    const rule = availabilityRules.find(r => r.day === dayName);
    return rule?.enabled && rule.slots.length > 0;
  };

  const currentMonthYear = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const selectedDayName = DAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
  const selectedRule = availabilityRules.find(r => r.day === selectedDayName);
  const selectedOverride = overrides.find(o => o.date === getDashedDate(selectedDate));

  // Slots are only valid if it's not a past day
  const todayThreshold = new Date();
  todayThreshold.setHours(0, 0, 0, 0);
  const isPastDay = selectedDate < todayThreshold;
  const displaySlots = (isPastDay || (selectedOverride && selectedOverride.unavailable)) ? [] : (selectedRule?.enabled ? selectedRule.slots : []);

  return (
    <div className="bg-[#111827] text-white rounded-4xl p-6 shadow-2xl shadow-gray-200 relative overflow-hidden h-fit">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/20 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />

      <div className="relative z-10">
        <span className="inline-block px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold uppercase tracking-wider mb-6">
          Booking Preview
        </span>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 space-y-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-200">{currentMonthYear}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]"
              >
                {"<"}
              </button>
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]"
              >
                {">"}
              </button>
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
                  className={cn(
                    "w-7 h-7 flex flex-col items-center justify-center mx-auto rounded-lg transition-all relative",
                    isSelected ? "bg-[#009366] text-white shadow-lg shadow-green-500/20 scale-110 z-10" : "text-gray-300 hover:bg-white/5",
                    !available && !isSelected && "opacity-30 grayscale",
                    isPast && !isSelected && "text-gray-600 opacity-20",
                    isToday && !isSelected && "border border-[#009366]/50"
                  )}
                >
                  <span className="text-[10px]">{dayNum}</span>
                  {available && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-[#009366] mt-0.5" />
                  )}
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
                    {s.start}
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

        <div className="mt-6 flex gap-3 items-start px-2">
          <div className="w-6 h-6 rounded-full bg-green-50/10 flex items-center justify-center text-green-500 shrink-0">
            <FaPlus size={8} />
          </div>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
            Brands will see this view. Time slots confirmed after payment.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Availability({ onBack, onNext }: AvailabilityProps) {
  const { availability, setAvailability } = useGigCreateStore();

  const [availabilityRules, setAvailabilityRules] = useState<DayAvailability[]>(() => {
  if (availability?.weeklyRules?.length) {
    return DAYS.map(day => {
      const existing = availability.weeklyRules.find(
        (r: WeeklyRule) => r.day.toLowerCase() === day.toLowerCase()
      );

      return {
        day,
        enabled: existing?.isEnabled ?? false,
        slots:
          existing?.slots.map((s: AvailabilitySlot) => ({
            start: to12Hour(s.startTime),
            end: to12Hour(s.endTime)
          })) ?? []
      };
    });
  }

  return DAYS.map((day) => ({
    day,
    enabled: day === "Monday",
    slots: day === "Monday"
      ? [{ start: "09:00 AM", end: "05:00 PM" }]
      : []
  }));
});

  const [overrides, setOverrides] = useState<DateOverride[]>(
    availability?.dateOverrides?.map((o) => ({
      date: o.date,
      unavailable: !o.isAvailable
    })) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleDay = (index: number) => {
    setAvailabilityRules((prev) =>
      prev.map((rule, i) => {
        if (i === index) {
          const newEnabled = !rule.enabled;
          return {
            ...rule,
            enabled: newEnabled,
            slots: newEnabled && rule.slots.length === 0 ? [{ start: "09:00 AM", end: "05:00 PM" }] : rule.slots
          };
        }
        return rule;
      })
    );
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAvailabilityRules((prev) =>
      prev.map((rule, i) =>
        i === dayIndex ? {
          ...rule,
          slots: rule.slots.map((s, si) => si === slotIndex ? { ...s, [field]: value } : s)
        } : rule
      )
    );
  };

  const addSlot = (dayIndex: number) => {
    setAvailabilityRules((prev) =>
      prev.map((rule, i) =>
        i === dayIndex ? {
          ...rule,
          slots: [...rule.slots, { start: "09:00 AM", end: "05:00 PM" }]
        } : rule
      )
    );
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailabilityRules((prev) =>
      prev.map((rule, i) =>
        i === dayIndex ? {
          ...rule,
          slots: rule.slots.filter((_, s) => s !== slotIndex)
        } : rule
      )
    );
  };

  const addOverride = () => {
    const today = new Date().toISOString().split('T')[0];
    setOverrides([...overrides, { date: today, unavailable: true }]);
  };

  const removeOverride = (index: number) => {
    setOverrides(overrides.filter((_, i) => i !== index));
  };

  const updateOverrideDate = (index: number, date: string) => {
    setOverrides(overrides.map((o, i) => i === index ? { ...o, date } : o));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const payload = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
      weeklyRules: availabilityRules.map((rule) => ({
        day: rule.day.toLowerCase(),
        isEnabled: rule.enabled,
        slots: rule.slots.map((slot) => ({
          startTime: convertTo24Hour(slot.start),
          endTime: convertTo24Hour(slot.end)
        }))
      })),
      dateOverrides: overrides.map((o) => ({
        date: o.date,
        isAvailable: !o.unavailable,
        slots: []
      }))
    };

    try {
      setAvailability(payload);
      await api.post("/availability", payload);
      onNext();
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
        {/* Left Side: Rules */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Weekly Availability</h2>
              <p className="text-xs text-gray-400 mt-1">Set the times you are available for bookings each week.</p>
            </div>
            <div className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 uppercase tracking-tight">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>

          <div className="space-y-1">
            {availabilityRules.map((rule, dayIndex) => (
              <div
                key={rule.day}
                className={cn(
                  "group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 border border-transparent",
                  rule.enabled ? "bg-white hover:border-gray-100" : "bg-gray-50/40 opacity-70"
                )}
              >
                {/* Day Selector */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <button
                    onClick={() => toggleDay(dayIndex)}
                    className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center transition-all border",
                      rule.enabled
                        ? "bg-[#009366] border-[#009366] text-white shadow-sm"
                        : "bg-white border-gray-200 text-transparent"
                    )}
                  >
                    <FaCheck size={10} strokeWidth={3} />
                  </button>
                  <span className={cn(
                    "text-sm font-semibold transition-colors",
                    rule.enabled ? "text-gray-900" : "text-gray-400"
                  )}>
                    {rule.day}
                  </span>
                </div>

                {/* Slots Area */}
                <div className="flex-1 min-h-10 flex flex-wrap items-center gap-2">
                  {rule.enabled ? (
                    <>
                      {rule.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-lg border border-gray-100/50">
                          <select
                            value={slot.start}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, 'start', e.target.value)}
                            className="bg-transparent text-[11px] font-bold text-gray-700 outline-none cursor-pointer px-1 py-1 rounded hover:bg-white transition-colors"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <span className="text-[10px] text-gray-300 font-medium">to</span>
                          <select
                            value={slot.end}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, 'end', e.target.value)}
                            className="bg-transparent text-[11px] font-bold text-gray-700 outline-none cursor-pointer px-1 py-1 rounded hover:bg-white transition-colors"
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          {rule.slots.length > 1 && (
                            <button
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            >
                              <FaTimes size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addSlot(dayIndex)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 border-dashed text-gray-400 hover:text-[#009366] hover:border-[#009366] hover:bg-[#009366]/5 transition-all"
                        title="Add time slot"
                      >
                        <FaPlus size={10} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs italic text-gray-300">Unavailable</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Date Overrides</h3>
              <button
                onClick={addOverride}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
              >
                <FaPlus size={8} /> Add specific date
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {overrides.length === 0 && (
                <div className="col-span-full py-6 px-4 rounded-xl border border-dashed border-gray-200 text-center">
                  <p className="text-xs text-gray-400">No specific date overrides added yet.</p>
                </div>
              )}
              {overrides.map((override, i) => (
                <div key={i} className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                      <FaCalendarAlt size={12} />
                    </div>
                    <input
                      type="date"
                      value={override.date}
                      onChange={(e) => updateOverrideDate(i, e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-500/80 bg-red-50 px-2 py-0.5 rounded-full uppercase">Unavailable</span>
                    <button
                      onClick={() => removeOverride(i)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-600 rounded-lg hover:bg-gray-200/50 transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-6">
          <AvailabilityPreview availabilityRules={availabilityRules} overrides={overrides} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-12 bg-white/80 backdrop-blur-md sticky bottom-0 -mx-4 px-4 pb-4 sm:pb-0 z-20">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50"
        >
          <span className="text-lg">←</span> Back
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => console.log("Save draft")}
            className="text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors hidden sm:block"
          >
            Save draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#009366] hover:bg-[#007a55] text-white px-8 sm:px-12 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-green-500/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-40"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing
              </>
            ) : (
              <>
                <span>Continue</span>
                <span className="text-lg leading-none mt-0.5">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
