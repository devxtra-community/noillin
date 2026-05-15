"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Calendar, Search, Zap, X, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import api from "@/lib/axios.client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ─── Types ───────────────────────────────────────────────────────────────────


type SortOption = "recommended" | "price_asc" | "price_desc" | "next_available";

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
    fullName: string;
    profileImageUrl?: string;
    profileImage?: string;
    followersCount?: number;
    categories?: string[];
  };
  bannerUrl?: string;
  shortDescription: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  data: Gig[];
  pagination: Pagination;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 9;

// Replace with your actual API base URL
// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// Unused constants removed

const categories: string[] = [
  "Fashion & Beauty",
  "Tech & Gadgets",
  "Fitness & Health",
  "Lifestyle",
];

const platformList: string[] = ["Instagram", "YouTube", "TikTok"];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Next Available", value: "next_available" },
];



const initials = (name: string) => {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
};

const formatCurrency = (amount: number, currency = "INR") => {
  if (currency === "INR") return `₹${amount.toLocaleString("en-IN")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-200 w-full" />
      <div className="p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        <div className="flex gap-1.5">
          <div className="h-5 w-12 bg-gray-100 rounded-md" />
          <div className="h-5 w-12 bg-gray-100 rounded-md" />
        </div>
        <div className="flex justify-between items-end pt-1">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="h-7 w-16 bg-gray-100 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Gig Card ─────────────────────────────────────────────────────────────────

function GigCard({ gig }: { gig: Gig }) {
  const influencer = gig.primaryInfluencerId;
  const name = influencer?.fullName ?? "Unknown Creator";
  const niche = gig.category;
  const availableFrom = undefined;

  const availableLabel = availableFrom
    ? new Date(availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Available";

  const categoryImages: Record<string, string> = {
    "Fashion & Style": "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=600",
    "Tech & Gadgets": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    "Fitness & Health": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
    "Lifestyle & Vlog": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    "Beauty & Cosmetics": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    "Food & Beverage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    "default": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600"
  };

  const gigImage = gig.bannerUrl || categoryImages[gig.category] || categoryImages["default"];

  return (
    <Link
      href={`/gig-details?id=${gig._id}`}
      className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-100/30 hover:shadow-emerald-50/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col h-full cursor-pointer"
    >
      <div className="h-48 w-full relative overflow-hidden bg-slate-50">
        <Image
          fill
          unoptimized
          src={gigImage}
          alt={gig.title}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallback = categoryImages[gig.category] || categoryImages["default"];
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />
        <div className="absolute top-4 right-4 flex items-center gap-1.2 text-[9px] font-bold text-white bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full group-hover:bg-emerald-500/80 transition-colors">
          <Calendar className="w-3 h-3" />
          {availableLabel}
        </div>
      </div>
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-emerald-50 flex items-center justify-center font-bold text-emerald-600 text-[10px]">
              {(influencer?.profileImageUrl || influencer?.profileImage) ? (
                <>
                  <Image
                    fill
                    unoptimized
                    src={influencer.profileImageUrl || influencer.profileImage || ""}
                    alt={name}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="hidden w-full h-full items-center justify-center">{initials(name)}</span>
                </>
              ) : initials(name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">{name}</span>
                <div className="bg-emerald-500 rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">{niche}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
            {gig.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 opacity-80">
            {gig.shortDescription}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Starting at</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {formatCurrency(gig.pricing.basePrice, gig.pricing.currency)}
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-[-5deg] group-hover:scale-110 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAX_PRICE_LIMIT = 50000;

export default function ExploreGigs() {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [page, setPage] = useState<number>(1);

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── "committed" filters are what actually trigger API calls ──────────────
  // Draft filters (search, maxPrice) are local UI state only — no fetch until
  // the user finishes typing (blur / Enter) or stops dragging the slider.
  const [committedSearch, setCommittedSearch] = useState<string>("");
  const [committedMaxPrice, setCommittedMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const fetchGigs = useCallback(async (
    opts: {
      page: number;
      category: string | null;
      maxPrice: number;
      sort: SortOption;
      search: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(opts.page));
      params.set("limit", String(LIMIT));

      if (opts.category) params.set("category", opts.category);
      if (opts.maxPrice < MAX_PRICE_LIMIT) params.set("maxPrice", String(opts.maxPrice));
      if (opts.sort !== "recommended") params.set("sort", opts.sort);
      if (opts.search) params.set("search", opts.search);

      const res = await api.get(`/gigs?${params.toString()}`);
      const json: ApiResponse = res.data;
      setGigs(json.data);
      setPagination(json.pagination);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      if (errorObj.response?.data?.message) {
        setError(errorObj.response.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch when committed values or page/sort/category change
  useEffect(() => {
    fetchGigs({ page, category: activeCategory, maxPrice: committedMaxPrice, sort, search: committedSearch });
  }, [page, activeCategory, committedMaxPrice, sort, committedSearch, fetchGigs]);

  // ── Category: immediate commit (it's a click, not a drag/type) ────────────
  const handleCategoryChange = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setPage(1);
  };

  const handlePlatformChange = (p: string) => {
    setActivePlatform((prev) => (prev === p ? null : p));
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setSort(e.target.value as SortOption);
    setPage(1);
  };

  // ── Price slider: update display instantly, fetch only on mouse/touch release
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value)); // updates label only, no fetch
  };
  const handleMaxPriceCommit = () => {
    setCommittedMaxPrice(maxPrice);
    setPage(1);
  };

  // ── Search: update input instantly, fetch on Enter or blur ───────────────
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCommittedSearch(search);
      setPage(1);
    }
  };

  const handleSearchBlur = () => {
    if (search !== committedSearch) {
      setCommittedSearch(search);
      setPage(1);
    }
  };

  const handleSearchClick = () => {
    setCommittedSearch(search);
    setPage(1);
  };

  const totalPages = pagination?.totalPages ?? 1;

  const pageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pt-16 sm:pt-20">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-12">
          <div>
          <br />
            <h1 className="text-title-lg text-slate-900 mb-2 sm:mb-4">
              Explore Influencer Gigs
            </h1>
            <p className="text-slate-500 text-xs sm:text-base max-w-md">
              The world&apos;s most elite creators, verified and ready for your next campaign.
            </p>
          </div>
        </div>

        {/* Premium Minimal Filter System */}
        <div className={`sticky z-40 mb-12 transition-all duration-500 ${!isNavbarVisible ? "top-6" : "top-32"}`}>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Unified Search Bar */}
            <div className="relative flex-1 group">
              <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-all duration-300">
                <Search className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
              </div>
              <input
                type="text"
                placeholder="Search gigs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                className="w-full pl-10 md:pl-14 pr-24 md:pr-32 py-3.5 md:py-5 bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-3xl text-xs md:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => { setSearch(""); setCommittedSearch(""); setPage(1); }}
                      className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={handleSearchClick}
                  className="bg-emerald-500 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 md:px-8 py-3.5 md:py-5 rounded-2xl md:rounded-3xl border transition-all shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] justify-center ${
                isFilterOpen 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "bg-white/70 backdrop-blur-xl border-white text-slate-700 hover:border-emerald-500/20"
              }`}
            >
              <Filter className={`w-4 h-4 md:w-5 md:h-5 ${isFilterOpen ? "fill-white" : "text-emerald-500"}`} />
              <span className="text-xs md:text-sm font-bold hidden sm:inline">Filters</span>
              <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""} hidden sm:inline`} />
            </button>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-4 p-8 bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {/* Column 1: Categories */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niche & Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { setActiveCategory(null); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          !activeCategory 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleCategoryChange(c)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === c 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Platform & Status */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Preference</span>
                      </div>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                        <button
                          onClick={() => { setActivePlatform(null); setPage(1); }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            !activePlatform 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          All
                        </button>
                        {platformList.map((p) => (
                          <button
                            key={p}
                            onClick={() => handlePlatformChange(p)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              activePlatform === p 
                              ? "bg-white text-slate-900 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</span>
                      </div>
                      <button
                        onClick={() => { setAvailableOnly(!availableOnly); setPage(1); }}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
                          availableOnly 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500/30"
                        }`}
                      >
                        <Zap className={`w-4 h-4 ${availableOnly ? "fill-white" : "text-emerald-500"}`} />
                        <span className="text-xs font-bold">Show Live Gigs Only</span>
                      </button>
                    </div>
                  </div>

                  {/* Column 3: Budget & Sorting */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Budget</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 tabular-nums bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                          {maxPrice >= MAX_PRICE_LIMIT ? "Any" : `₹${(maxPrice / 1000).toFixed(0)}k`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1000}
                        max={MAX_PRICE_LIMIT}
                        step={1000}
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        onMouseUp={handleMaxPriceCommit}
                        onTouchEnd={handleMaxPriceCommit}
                        className="w-full accent-emerald-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort Results By</span>
                      </div>
                      <div className="relative">
                        <select
                          value={sort}
                          onChange={handleSortChange}
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                        >
                          {sortOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer of Dropdown */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
                   <p className="text-[10px] font-medium text-slate-400">
                    Adjust filters to refine your search results
                  </p>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                  >
                    Apply & Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* Stats Context Bar */}
        <div className="flex items-center justify-between mb-10 px-4 py-3 bg-white/20 rounded-2xl border border-white/40 backdrop-blur-sm">
          <div className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-slate-100 border-t-emerald-500 animate-spin" />
                Updating Catalog...
              </span>
            ) : pagination ? (
              <>Found <span className="text-slate-900 font-black">{pagination.total}</span> Matching Opportunities</>
            ) : null}
          </div>

          {(activeCategory || activePlatform || maxPrice < MAX_PRICE_LIMIT || availableOnly || search) && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                setSearch("");
                setCommittedSearch("");
                setActiveCategory(null);
                setActivePlatform(null);
                setMaxPrice(MAX_PRICE_LIMIT);
                setCommittedMaxPrice(MAX_PRICE_LIMIT);
                setPage(1);
              }}
              className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors group"
            >
              Reset All Filters
              <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          )}
        </div>


        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl px-8 py-5 mb-10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">⚠</div>
              <span className="text-sm font-bold">{error}</span>
            </div>
            <button
              onClick={() => fetchGigs({ page, category: activeCategory, maxPrice: committedMaxPrice, sort, search: committedSearch })}
              className="text-xs font-black bg-white border border-red-200 hover:bg-red-50 transition-all px-6 py-3 rounded-2xl uppercase tracking-widest"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : gigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
        </div>

        {/* Empty state */}
        {!loading && !error && gigs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No gigs found</h3>
            <p className="text-sm text-gray-400 mb-5">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setSearch("");
                setCommittedSearch("");
                setActiveCategory(null);
                setActivePlatform(null);
                setMaxPrice(MAX_PRICE_LIMIT);
                setCommittedMaxPrice(MAX_PRICE_LIMIT);
                setPage(1);
              }}
              className="text-sm font-medium bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            {pageNumbers().map((n, i) =>
              n === "…" ? (
                <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${n === page
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {n}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
