"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  UserCheck,
  CalendarCheck,
  Clock,
  CircleDollarSign,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";

// Define the Gig interfaces similar to how gig-list works
interface GigPricing {
  basePrice: number;
  currency: string;
}

interface Gig {
  _id: string;
  title: string;
  category: string;
  pricing: GigPricing;
  primaryInfluencerId: {
    _id: string;
    displayName: string;
    profileImage?: string;
    availableFrom?: string;
    platforms?: ("IG" | "YT" | "TT" | "PT")[];
  };
}

const formatCurrency = (amount: number, currency = "INR") => {
  if (currency === "INR") return `₹${amount.toLocaleString("en-IN")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loadingGigs, setLoadingGigs] = useState(true);

  useEffect(() => {
    // Fetch a few gigs for the "Explore Gigs" section
    const fetchGigs = async () => {
      try {
        const res = await api.get("/gigs?limit=4");
        setGigs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      } finally {
        setLoadingGigs(false);
      }
    };

    fetchGigs();
  }, []);
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1800px] w-full mx-auto px-4 xl:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Noillin
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 h-full items-center">
            <Link
              href="#"
              className="text-sm font-semibold text-[#059669] border-b-2 border-[#059669] h-20 flex items-center"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors h-20 flex items-center"
            >
              Gigs
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors h-20 flex items-center"
            >
              Bookings
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors h-20 flex items-center"
            >
              Messages
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors h-20 flex items-center"
            >
              Transactions
            </Link>
          </div>


          {/* Right side nav */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {/* Show avatar or initials */}
                {user?.email?.charAt(0).toUpperCase() || "B"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {isAuthenticated ? (user?.email?.split('@')[0] || "Brand User") : "Guest User"}
                </p>
                <p className="text-xs text-gray-500">Brand</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1800px] w-full mx-auto px-4 xl:px-8 mt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your gigs, bookings, and requests
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Requests</h3>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <CalendarCheck className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Accepted Bookings
            </h3>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <Clock className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Pending Requests
            </h3>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <CircleDollarSign className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Transaction History
            </h3>
          </div>
        </div>

        {/* Middle Section: Requests & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Requests</h2>
            <div className="space-y-6 flex-grow">
              {/* Item 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-red-600 font-bold text-xl relative shrink-0">
                    N
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Aura Fashion
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Req: Fall Collection Reel
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md">
                    Pending
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    unoptimized
                    width={48}
                    height={48}
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop"
                    alt="GreenLife"
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      GreenLife Organics
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Req: Morning Routine Story
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                    Accepted
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
                View All Requests
              </button>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Messages
              </h2>
              <button className="text-sm font-medium text-[#059669] hover:text-[#047857]">
                Open Messages
              </button>
            </div>
            <div className="space-y-6 flex-grow">
              {/* Msg 1 */}
              <div className="flex gap-4">
                <div className="relative shrink-0">
                  <Image
                    unoptimized
                    width={48}
                    height={48}
                    src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop"
                    alt="Marcus"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      Marcus Chen (TechNova)
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      10m ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Hi Jane, I&apos;ve reviewed the script you sent over. Looks great! Just one small change regarding the intro...
                  </p>
                </div>
              </div>

              {/* Msg 2 */}
              <div className="flex gap-4">
                <div className="relative shrink-0">
                  <Image
                    unoptimized
                    width={48}
                    height={48}
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                    alt="Sarah"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      Sarah (Lumina)
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      1h ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Thanks for the quick delivery! The photos look amazing. We&apos;ll process the payment today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Gigs */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Explore Gigs</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Find recommended gigs based on your search
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingGigs ? (
              // Simple skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] h-64 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : gigs.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                No gigs available right now.
              </div>
            ) : (
              gigs.map((gig) => {
                const influencer = gig.primaryInfluencerId;
                const name = influencer?.displayName || "Unknown Creator";
                const platforms = influencer?.platforms || [];
                const availableLabel = influencer?.availableFrom
                  ? new Date(influencer.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Available";

                return (
                  <div key={gig._id} className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col h-full hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-1 line-clamp-1">
                            {name} <CheckCircle2 size={14} className="text-[#059669] fill-[#059669]/20" />
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{gig.category}</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-4 line-clamp-2">
                        {gig.title}
                      </h3>
                      {platforms.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {platforms.map(p => (
                            <div key={p} className="flex items-center gap-1 border border-gray-200 rounded px-2 py-0.5 text-[10px] text-gray-600 font-medium">
                              {p}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3 border-t border-gray-100 pt-4">
                        <span className="text-xs text-gray-500">Starting at</span>
                        <span className="font-bold text-gray-900">{formatCurrency(gig.pricing.basePrice, gig.pricing.currency)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-5">
                        <Calendar size={12} className="text-[#059669]" />
                        <span>Next available:</span>
                        <span className="font-semibold text-gray-900">{availableLabel}</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-gray-50">
                        <p className="text-[10px] text-gray-400 leading-tight w-24">
                          Booking confirmed after payment
                        </p>
                        <Link href={`/gig-details?id=${gig._id}`} className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Gig
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
