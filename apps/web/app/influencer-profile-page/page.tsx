"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  MapPin,
  Star,
  MessageSquare,
  Lock,
  Instagram,
  Youtube,
  ArrowRight
} from 'lucide-react';

import api from "@/lib/axios.client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface GigData {
  _id: string;
  title: string;
  shortDescription?: string;
  pricing?: {
    currency: string;
    basePrice: number;
  };
  status?: string;
  category?: string;
  bannerUrl?: string;
}

interface ProfileData {
  fullName?: string;
  username?: string;
  bio?: string;
  profileImageUrl?: string;
  profileImage?: string;
  isVerified?: boolean;
  categories?: string[];
  instagramUrl?: string;
  youtubeUrl?: string;
  followersCount?: number;
  location?: string;
  ratingAvg?: number;
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<{ profile: ProfileData; gigs: GigData[] } | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) {
      return;
    }
    api.get(`/profile/influencer/${id}`)
      .then(res => {
        setData(res.data.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center font-medium text-lg text-slate-500">Loading profile...</div>;
  if (!data || !data.profile) return <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center font-medium text-lg text-red-500">Profile not found.</div>;

  const { profile, gigs } = data;
  const name = profile.fullName || profile.username || "Unknown Influencer";
  const bio = profile.bio || "No bio available.";
  const avatar = profile.profileImageUrl || profile.profileImage || null;

  const categoryImages: Record<string, string> = {
    "fashion": "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=600",
    "tech": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    "fitness": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
    "lifestyle": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    "beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    "food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    "default": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans sm:px-0">
      <Navbar />
      
      <div className="pt-24 sm:pt-32">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm relative bg-emerald-50 flex items-center justify-center font-bold text-emerald-600 text-4xl">
              {avatar ? (
                <>
                  <Image 
                    fill 
                    unoptimized
                    src={avatar} 
                    alt={name || "Influencer Avatar"} 
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <span className="hidden">{name.charAt(0).toUpperCase()}</span>
                </>
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            {profile.isVerified && (
              <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-4 border-white">
                <span className="flex items-center justify-center w-5 h-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-5 py-2">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{name}</h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50/80 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wide mx-auto md:mx-0 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-medium md:text-lg">{profile.categories?.join(" & ") || "Creator"}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
              {profile.instagramUrl && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                  <Instagram className="w-3.5 h-3.5" /> IG
                </div>
              )}
              {profile.youtubeUrl && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                  <Youtube className="w-3.5 h-3.5" /> YT
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                {(profile.followersCount || 0).toLocaleString()} Followers
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                <MapPin className="w-4 h-4" /> {profile.location || "Global"}
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">View Gigs</button>
                <button className="px-6 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">Message</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-center space-y-1">
            <div className="text-2xl font-bold text-slate-800">{gigs?.length || 0}</div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Active Gigs</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-center space-y-2">
            <div className="flex justify-center gap-0.5 text-yellow-400 pt-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <div className="text-xl font-bold text-slate-800">{profile.ratingAvg?.toFixed(1) || "New"}</div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Avg. Rating</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-center space-y-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-emerald-500">&lt; 2h</div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Response Time</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-center space-y-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-slate-800">68%</div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Repeat Brands</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">About</h2>
          <p className="text-slate-500 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
            {bio}
          </p>
        </div>

        {/* Performance & Demographics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-8">Platform Performance</h2>
            <div className="space-y-6">
              {/* Instagram */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">Instagram</p>
                    <p className="text-[11px] text-slate-400 font-medium">Reels & Stories</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-sm text-slate-800">{(profile.followersCount || 0).toLocaleString()} Followers</p>
                  <p className="text-[11px] text-emerald-500 font-bold">Good Engagement</p>
                </div>
              </div>

              {/* YouTube */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">YouTube</p>
                    <p className="text-[11px] text-slate-400 font-medium">Long-form Video</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-sm text-slate-800">Verified Subs</p>
                  <p className="text-[11px] text-emerald-500 font-bold">Good Engagement</p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-8">Audience Demographics</h2>

            <div className="space-y-8 flex-1">
              {/* Top Countries */}
              <div>
                <h3 className="text-[11px] text-slate-400 font-semibold mb-3">Top Countries</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">United States (45%)</span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">UK (15%)</span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">Canada (10%)</span>
                </div>
              </div>

              {/* Age Range */}
              <div>
                <h3 className="text-[11px] text-slate-400 font-semibold mb-3">Age Range</h3>
                <div className="h-1.5 bg-slate-100 rounded-full flex overflow-hidden">
                  <div className="w-[10%] bg-emerald-400 border-r border-white"></div>
                  <div className="w-[50%] bg-emerald-500 border-r border-white"></div>
                  <div className="w-[30%] bg-emerald-300 border-r border-white"></div>
                  <div className="w-[10%] bg-emerald-200"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                  <span className="w-1/4">18-24</span>
                  <span className="w-1/4">25-34 (Primary)</span>
                  <span className="w-1/4">35-44</span>
                  <span className="w-1/4 text-right">45+</span>
                </div>
              </div>

              {/* Gender Split */}
              <div>
                <h3 className="text-[11px] text-slate-400 font-semibold mb-3">Gender Split</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Female</span>
                      <span>68%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[68%] h-full bg-pink-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Male</span>
                      <span>32%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[32%] h-full bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Gigs Section */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Gigs</h2>
            <Link href="/gig-list" className="text-emerald-500 text-sm font-semibold hover:text-emerald-600 transition-colors">View all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gigs?.map((gig: GigData, idx: number) => (
              <div key={gig._id || idx} className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col relative group hover:border-emerald-200 transition-all cursor-pointer overflow-hidden">
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  <Image 
                    fill 
                    unoptimized
                    src={gig.bannerUrl || categoryImages[gig.category?.toLowerCase() || "default"] || categoryImages["default"]} 
                    alt={gig.title} 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = categoryImages[gig.category?.toLowerCase() || "default"] || categoryImages["default"];
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                  {gig.status === 'published' && <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-emerald-500/80 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{gig.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {gig.shortDescription || "Gig details currently unavailable."}
                  </p>
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium pb-0.5">Starting at</p>
                      <p className="text-lg font-black text-slate-800">
                        {gig.pricing?.currency === "INR" ? "₹" : "$"}
                        {gig.pricing?.basePrice?.toLocaleString("en-IN") || 0}
                      </p>
                    </div>
                  </div>
                  <Link href={`/gig-details?id=${gig._id}`} className="block text-center w-full py-2.5 border border-emerald-500 text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
                    View Gig
                  </Link>
                </div>
              </div>
            </div>
          ))}

            {(!gigs || gigs.length === 0) && (
              <p className="text-sm font-medium text-slate-500 col-span-3">No active gigs available for this creator.</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6 pt-2">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center font-bold text-sm text-slate-700">
                    <Image 
                      fill 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=100" 
                      alt="Glow Cosmetics" 
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    G
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Glow Cosmetics</h4>
                    <p className="text-[10px] text-slate-400">2 weeks ago</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                &quot;The content created was incredibly professional and delivered ahead of schedule. Highly recommended!&quot;
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center font-bold text-sm text-slate-700">
                    <Image 
                      fill 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100" 
                      alt="Mode Fashion" 
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Mode Fashion</h4>
                    <p className="text-[10px] text-slate-400">1 month ago</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                &quot;Great communication throughout the process. Our audience loved the styling tips incorporated into the post.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Availability & Safety Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-1 bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Availability</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Availability varies by gig. Check individual gig pages for specific dates.</p>
            <Link href="#" className="text-emerald-500 font-semibold text-xs flex items-center gap-1 hover:text-emerald-600 transition-colors">Check availability inside gig <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="lg:col-span-2 bg-emerald-50/50 rounded-3xl p-6 md:p-8 flex items-center justify-center border border-emerald-100/50">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Profile
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <Lock className="w-5 h-5 text-emerald-600" /> Secure Payments
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <MessageSquare className="w-5 h-5 text-emerald-600" /> Direct In-App Chat
              </div>
            </div>
          </div>
        </div>

      </main>
      </div>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center font-medium text-slate-500">Loading Configuration...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
