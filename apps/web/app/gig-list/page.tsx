"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios.client";
// ─── Types ───────────────────────────────────────────────────────────────────

type Platform = "IG" | "YT" | "TT" | "PT";
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

const platformColors: Record<Platform, string> = {
  IG: "bg-pink-100 text-pink-600",
  YT: "bg-red-100 text-red-600",
  TT: "bg-slate-100 text-slate-700",
  PT: "bg-orange-100 text-orange-600",
};

const platformIcons: Record<Platform, string> = {
  IG: "📸",
  YT: "▶",
  TT: "♪",
  PT: "📌",
};

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
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-200 w-full" />
      <div className="p-8 flex flex-col gap-4">
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
  const platforms: Platform[] = []; // Currently not stored in profile
  const availableFrom = undefined;
  const color = avatarColor(gig._id);

  const availableLabel = availableFrom
    ? new Date(availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Available";

  if (view === "list") {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden group flex items-center gap-6 px-8 py-6 hover:-translate-y-1">
        <div className="h-full w-1 rounded-full shrink-0 self-stretch" style={{ background: color }} />
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ background: color }}
        >
          {initials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="font-semibold text-gray-900 text-sm truncate">{name}</span>
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 truncate mb-0.5">{gig.title}</p>
          <p className="text-xs text-gray-400 truncate">{gig.shortDescription}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {platforms.map((p) => (
            <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded-md ${platformColors[p]}`}>
              {platformIcons[p]} {p}
            </span>
          ))}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">Starting at</p>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(gig.pricing.basePrice, gig.pricing.currency)}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {availableLabel}
        </div>
        <Link
          href={`/gig-details?id=${gig._id}`}
          className="shrink-0 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg"
        >
          View Gig
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden group flex flex-col h-full">
      <div className="h-1.5 w-full shrink-0" style={{ background: color }} />
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: color }}
          >
            {initials(name)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 text-sm">{name}</span>
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">{niche}</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{gig.title}</h3>
        <p className="text-[13px] text-slate-500 mb-5 leading-relaxed line-clamp-2">{gig.shortDescription}</p>

        <div className="flex gap-1.5 mb-4 flex-wrap">
          {platforms.length > 0
            ? platforms.map((p) => (
              <span key={p} className={`text-xs font-medium px-2 py-0.5 rounded-md ${platformColors[p]}`}>
                {platformIcons[p]} {p}
              </span>
            ))
            : (
              <span className="text-xs text-gray-300">—</span>
            )}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Starting at</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(gig.pricing.basePrice, gig.pricing.currency)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Next:{" "}
              <span className="font-semibold text-gray-600">{availableLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Booking confirmed
            <br />
            after payment
          </p>
          <Link
            href={`/gig-details?id=${gig._id}`}
            className="text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            View Gig
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAX_PRICE_LIMIT = 50000;

export default function ExploreGigs() {
  useAuthStore();
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [view, setView] = useState<ViewMode>("grid");
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  const handleSearchClear = () => {
    setSearch("");
    setCommittedSearch("");
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 text-emerald-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Noillin</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-10 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
            {[
              { name: "About", href: "#" },
              { name: "Influencers", href: "#" },
              { name: "Gigs", href: "/gig-list" },
              { name: "Support", href: "#" }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-emerald-600 transition-colors relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 font-semibold hover:text-emerald-600 hover:bg-emerald-50 transition-all px-6">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-lg shadow-emerald-200 rounded-lg">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          {/* Platform */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Platform</p>
            <ul className="space-y-1">
              {platformList.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => handlePlatformChange(p)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${activePlatform === p
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Category</p>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => handleCategoryChange(c)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${activeCategory === c
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Price Range</p>
            <input
              type="range"
              min={1000}
              max={MAX_PRICE_LIMIT}
              step={1000}
              value={maxPrice}
              onChange={handleMaxPriceChange}
              onMouseUp={handleMaxPriceCommit}
              onTouchEnd={handleMaxPriceCommit}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹1k</span>
              <span className={maxPrice < MAX_PRICE_LIMIT ? "text-emerald-600 font-medium" : "text-gray-400"}>
                {maxPrice >= MAX_PRICE_LIMIT ? "₹50k+" : `₹${(maxPrice / 1000).toFixed(0)}k`}
              </span>
            </div>
          </div>

          {/* Available toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setAvailableOnly(!availableOnly); setPage(1); }}
              className={`relative w-10 h-6 shrink-0 rounded-full transition-colors cursor-pointer ${availableOnly ? "bg-emerald-600" : "bg-gray-200"
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${availableOnly ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
            <span className="text-sm text-gray-600">Available this week</span>
          </div>
          {/* Active filters summary */}
          {(activeCategory || activePlatform || maxPrice < MAX_PRICE_LIMIT) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Filters</p>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setActivePlatform(null);
                    setMaxPrice(MAX_PRICE_LIMIT);
                    setCommittedMaxPrice(MAX_PRICE_LIMIT);
                    setPage(1);
                  }}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeCategory && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {activeCategory.split(" & ")[0]}
                    <button onClick={() => setActiveCategory(null)} className="hover:opacity-60">×</button>
                  </span>
                )}
                {activePlatform && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {activePlatform}
                    <button onClick={() => setActivePlatform(null)} className="hover:opacity-60">×</button>
                  </span>
                )}
                {maxPrice < MAX_PRICE_LIMIT && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ≤₹{(maxPrice / 1000).toFixed(0)}k
                    <button onClick={() => { setMaxPrice(MAX_PRICE_LIMIT); setCommittedMaxPrice(MAX_PRICE_LIMIT); }} className="hover:opacity-60">×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Influencer Gigs</h1>
            <p className="text-gray-500 mt-1 text-sm">Browse verified creators and book based on real availability.</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110 2.5a7.5 7.5 0 016.65 14.15z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, niche, or keyword… press Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
            {search && (
              <button
                onClick={handleSearchClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-gray-500">
              {loading ? (
                <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
              ) : pagination ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">{gigs.length}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">{pagination.total}</span>{" "}
                  verified gigs
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {/* Grid/List toggle */}
              <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <select
                value={sort}
                onChange={handleSortChange}
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5 flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={() => fetchGigs({ page, category: activeCategory, maxPrice: committedMaxPrice, sort, search: committedSearch })}
                className="text-sm font-medium bg-red-100 hover:bg-red-200 transition-colors px-3 py-1.5 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Cards */}
          <div
            className={`grid gap-8 ${view === "grid"
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
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F172A] pt-28 pb-16 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-20 border-b border-white/5">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 text-white bg-emerald-500 rounded-xl flex items-center justify-center transition-all group-hover:rotate-12">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight ">Noillin</span>
            </div>

            <div className="flex gap-16 text-[13px] font-bold uppercase tracking-widest">
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
      </footer>
    </div >
  );
}