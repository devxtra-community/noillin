"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Zap, Check, ArrowRight, Calendar, Filter, X } from "lucide-react";

import api from "@/lib/axios.client";
import DashboardHeader from "@/components/DashboardHeader";
import NotificationBell from "@/components/NotificationBell";
// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";
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
    followersCount?: number;
    categories?: string[];
  };
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

// Deterministic avatar color based on id string
const avatarColor = (id: string) => {
  const colors = [
    "#e8736c", "#5b8dee", "#4db89e", "#f0a500", "#b57bee", "#e06060",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

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

function GigCard({ gig, view }: { gig: Gig; view: ViewMode }) {
  const influencer = gig.primaryInfluencerId;
  const name = influencer?.fullName ?? "Unknown Creator";
  const niche = gig.category;
  const availableFrom = undefined;
  const color = avatarColor(gig._id);

  const availableLabel = availableFrom
    ? new Date(availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Available";

  if (view === "list") {
    return (
      <Link
        href={`/gig-details?id=${gig._id}`}
        className="bg-white rounded-[1.5rem] border border-slate-50 shadow-2xl shadow-slate-100/30 hover:shadow-emerald-50/50 transition-all duration-500 overflow-hidden group flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 px-5 sm:px-8 py-5 sm:py-6 hover:-translate-y-1 relative cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner shrink-0"
            style={{ background: color }}
          >
            {initials(name)}
          </div>
          <div className="flex-1 min-w-0 sm:hidden">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-slate-900 text-sm truncate">{name}</span>
              <div className="bg-emerald-500 rounded-full p-0.5 shrink-0">
                <Check className="w-2 h-2 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 truncate mb-1 group-hover:text-emerald-600 transition-colors">{gig.title}</h3>
          </div>
        </div>

        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-slate-900 text-lg truncate">{name}</span>
            <div className="bg-emerald-500 rounded-full p-0.5">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 truncate mb-1 group-hover:text-emerald-600 transition-colors">{gig.title}</h3>
          <p className="text-xs text-slate-400 truncate max-w-lg leading-relaxed">{gig.shortDescription}</p>
        </div>

        <div className="flex items-center justify-between sm:justify-end sm:px-8 sm:border-l border-slate-50 w-full sm:w-auto">
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5 sm:mb-1">Starting at</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(gig.pricing.basePrice, gig.pricing.currency)}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 sm:gap-4 ml-4">
            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
              <Calendar className="w-3 h-3" />
              {availableLabel}
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/gig-details?id=${gig._id}`}
      className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-100/30 hover:shadow-emerald-50/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col h-full cursor-pointer"
    >
      <div className="p-6 sm:p-8 lg:p-10 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0"
              style={{ background: color }}
            >
              {initials(name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">{name}</span>
                <div className="bg-emerald-500 rounded-full p-0.5">
                  <Check className="w-2 h-2 text-white" />
                </div>
              </div>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">{niche}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.2 text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
            <Calendar className="w-3 h-3" />
            {availableLabel}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
            {gig.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 opacity-80">
            {gig.shortDescription}
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
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
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [page, setPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── "committed" filters are what actually trigger API calls ──────────────
  // Draft filters (search, maxPrice) are local UI state only — no fetch until
  // the user finishes typing (blur / Enter) or stops dragging the slider.
  const [committedSearch, setCommittedSearch] = useState<string>("");
  const [committedMaxPrice, setCommittedMaxPrice] = useState<number>(MAX_PRICE_LIMIT);

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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pt-16 sm:pt-20">
      {/* Navbar */}
      <DashboardHeader>
        <div className="flex items-center gap-6">
          <NotificationBell />
        </div>
      </DashboardHeader>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 sm:mb-4">
              Explore Influencer Gigs
            </h1>
            <p className="text-slate-500 text-xs sm:text-base max-w-md">
              The world&apos;s most elite creators, verified and ready for your next campaign.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Grid/List Toggle */}
            <div className="flex bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 sm:p-2.5 rounded-xl transition-all ${view === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 sm:p-2.5 rounded-xl transition-all ${view === "list" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Modern Filter System - Sticky Glassmorphism Header */}
        <div className="sticky top-[64px] sm:top-20 z-30 -mx-4 px-4 py-3 sm:py-6 mb-4 sm:mb-10 bg-[#F1F5F9]/95 backdrop-blur-xl border-b border-slate-200/50 space-y-3 sm:space-y-6 shadow-sm sm:shadow-none">
          {/* Category & Platform Pills */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 scrollbar-none">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Niche:</span>
              <button
                onClick={() => { setActiveCategory(null); setPage(1); }}
                className={`shrink-0 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${!activeCategory ? "bg-slate-900 border-slate-900 text-white shadow-md sm:shadow-lg shadow-slate-900/20" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
              >
                All Gigs
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`shrink-0 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${activeCategory === c ? "bg-emerald-500 border-emerald-500 text-white shadow-md sm:shadow-lg shadow-emerald-500/20" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 scrollbar-none">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Platform:</span>
              {platformList.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePlatformChange(p)}
                  className={`shrink-0 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${activePlatform === p ? "bg-emerald-500 border-emerald-500 text-white shadow-md sm:shadow-lg shadow-emerald-500/20" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Utility Bar */}
          <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 w-full">
            <div className="relative flex-1 group w-full">
              <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110 2.5a7.5 7.5 0 016.65 14.15z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search creators or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                className="w-full pl-10 pr-4 py-2 sm:pl-14 sm:pr-6 sm:py-4 bg-white border border-slate-200 rounded-full sm:rounded-[2rem] text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            <div className="hidden sm:flex flex-row flex-nowrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <div className="bg-white border border-slate-200 rounded-full sm:rounded-[2rem] px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 flex-1 lg:flex-none">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 hidden sm:inline">Budget:</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 sm:hidden">Max:</span>
                <input
                  type="range"
                  min={1000}
                  max={MAX_PRICE_LIMIT}
                  step={1000}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  onMouseUp={handleMaxPriceCommit}
                  onTouchEnd={handleMaxPriceCommit}
                  className="w-full sm:w-32 accent-emerald-500 h-1 sm:h-1.5"
                />
                <span className="text-[10px] sm:text-xs font-bold text-slate-900 w-8 sm:w-12 text-right shrink-0">
                  {maxPrice >= MAX_PRICE_LIMIT ? "50k+" : `${(maxPrice / 1000).toFixed(0)}k`}
                </span>
              </div>

              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-white border border-slate-200 rounded-full sm:rounded-[2rem] px-3 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm flex-1 lg:flex-none appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.8rem' }}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Context Bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 px-2 border-b border-slate-200 pb-3 sm:pb-4">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wide uppercase">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
                Synchronizing...
              </span>
            ) : pagination ? (
              <>Found <span className="text-slate-900">{pagination.total}</span> Matches</>
            ) : null}
          </div>

          {(activeCategory || activePlatform || maxPrice < MAX_PRICE_LIMIT) && (
            <button
              onClick={() => {
                setActiveCategory(null);
                setActivePlatform(null);
                setMaxPrice(MAX_PRICE_LIMIT);
                setCommittedMaxPrice(MAX_PRICE_LIMIT);
                setPage(1);
              }}
              className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
            >
              Reset Search
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
        <div
          className={`grid gap-6 sm:gap-8 lg:gap-12 ${view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} view={view} />
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

      {/* Mobile Floating Filters Button */}
      <button
        onClick={() => setIsMobileFiltersOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:bg-slate-800 transition-all active:scale-95"
      >
        <Filter className="w-5 h-5" />
        <span className="text-sm font-bold tracking-wide">Filters</span>
        {(activeCategory || activePlatform || committedMaxPrice < MAX_PRICE_LIMIT || sort !== 'recommended') && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        )}
      </button>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] sm:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="bg-white w-full rounded-t-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* Category */}
              <div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Niche</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => { setActiveCategory(null); setPage(1); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${!activeCategory ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20" : "bg-white border-slate-200 text-slate-600"}`}
                  >
                    All Gigs
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCategoryChange(c)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeCategory === c ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-white border-slate-200 text-slate-600"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Platform</h3>
                <div className="flex flex-wrap gap-2.5">
                  {platformList.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePlatformChange(p)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${activePlatform === p ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-white border-slate-200 text-slate-600"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Max Budget</h3>
                  <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    {maxPrice >= MAX_PRICE_LIMIT ? "50k+" : `₹${(maxPrice / 1000).toFixed(0)}k`}
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
                  className="w-full accent-emerald-500 h-2 bg-slate-100 rounded-full appearance-none outline-none"
                />
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Sort By</h3>
                <div className="flex flex-col gap-2">
                  {sortOptions.map((o) => (
                    <label key={o.value} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${sort === o.value ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                      <input 
                        type="radio" 
                        name="sortMobile" 
                        value={o.value} 
                        checked={sort === o.value}
                        onChange={(e) => handleSortChange(e)}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      <span className={`text-sm font-bold ${sort === o.value ? 'text-emerald-700' : 'text-slate-600'}`}>{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply & Reset Footer */}
            <div className="p-5 border-t border-slate-100 flex gap-3 bg-white pb-8">
              <button 
                onClick={() => {
                  setActiveCategory(null);
                  setActivePlatform(null);
                  setMaxPrice(MAX_PRICE_LIMIT);
                  setCommittedMaxPrice(MAX_PRICE_LIMIT);
                  setSort("recommended");
                  setPage(1);
                }}
                className="flex-1 py-4 rounded-xl font-bold text-sm bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-[2] py-4 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0F172A] pt-28 pb-16 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-20 border-b border-white/5">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 text-white bg-[#10B981] rounded-xl flex items-center justify-center transition-all group-hover:rotate-12">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight ">Noillin</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-16 text-[13px] font-bold uppercase tracking-widest">
              {["About", "Support", "Privacy", "Terms"].map(l => (
                <a key={l} href="#" className="hover:text-emerald-500 transition-colors">{l}</a>
              ))}
            </div>

            <div className="flex items-center gap-8">
              {[
                { label: "SECURE PAYMENTS", icon: "🔒" },
                { label: "VERIFIED PROFILES", icon: "✔" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-black tracking-[.2em] opacity-80 group">
                  <span className="text-emerald-500 text-lg group-hover:scale-125 transition-transform">{badge.icon}</span>
                  <span className="text-slate-100">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold tracking-widest opacity-30">
            <p>&copy; 2026 NOILLIN INC. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-2">
              <Zap className="w-3 h-3 fill-white" />
              BUILT FOR THE FUTURE OF INFLUENCE
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
}