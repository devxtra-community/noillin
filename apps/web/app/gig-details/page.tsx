"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Star, CheckCircle2, ChevronRight, Heart,
    MessageSquare, Check,
    Share, ShieldCheck,
    BarChart, Users, Instagram, Info,
    AlertCircle, Loader2, Zap, Clock, X
} from "lucide-react";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";

interface GigData {
    _id: string;
    title: string;
    shortDescription: string;
    pricing: {
        basePrice: number;
        currency: string;
        deliveryTimeInDays: number;
        revisionsIncluded: number;
    };
    primaryInfluencerId: {
        _id: string;
        userId: string;
        fullName: string;
        username: string;
        profileImageUrl?: string;
        bio?: string;
        categories: string[];
        location?: string;
        isVerified: boolean;
        followersCount?: number;
    };
    category: string;
    deliverables: Array<{
        contentType: string;
        quantity: number;
    }>;
}

function GigDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");
    const { user, isInitialized } = useAuthStore();
    
    const [gig, setGig] = useState<GigData | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("No gig identified. Please select a gig from the catalog.");
            setLoading(false);
            return;
        }
        
        api.get(`/gigs/${id}`)
            .then(res => {
                setGig(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load gig details.");
                setLoading(false);
            });
    }, [id]);

    const handleRequestBooking = async () => {
        if (!isInitialized) return;

        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }
        if (!gig) return;

        setBookingLoading(true);
        try {
            await api.post("/connections/request", {
                influencerId: gig.primaryInfluencerId.userId,
                gigId: gig._id
            });
            
            setShowToast(true);
            setTimeout(() => {
                router.push(`/chat?to=${gig.primaryInfluencerId.userId}&gigId=${gig._id}`);
            }, 1500);
        } catch (err: unknown) {
            console.error(err);
            const errorResponse = err as { response?: { data?: { message?: string } } };
            if (errorResponse.response?.data?.message === "Connection already exists") {
                router.push(`/chat?to=${gig.primaryInfluencerId.userId}&gigId=${gig._id}`);
            } else {
                alert("Failed to send booking request.");
                setBookingLoading(false);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 text-[#0CAF60] animate-spin" />
             <p className="text-gray-500 font-medium">Loading gig details...</p>
        </div>
    );
    
    if (error || !gig) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
             <AlertCircle className="w-10 h-10 text-red-500" />
             <p className="text-gray-900 font-bold text-xl">{error || "Gig not found"}</p>
             <Link href="/gig-list" className="text-[#0CAF60] font-bold hover:underline">Back to Gigs</Link>
        </div>
    );

    const influencer = gig.primaryInfluencerId;
    const avatar = influencer.profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right duration-300">
                    <div className="bg-white border border-emerald-100 shadow-xl shadow-emerald-500/10 rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">Request Sent!</p>
                            <p className="text-xs text-gray-500 font-medium">Redirecting to chat...</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-auto text-gray-400 hover:text-gray-900">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#0CAF60] rounded flex items-center justify-center text-white font-bold text-xl">N</div>
                      <span className="text-2xl font-bold tracking-tight text-gray-900">Noillin</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="/gig-list" className="hover:text-gray-900 transition-colors">Find Influencers</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">How it Works</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">For Brands</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/brand-dashboard" className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-[#0CAF60]/10 transition-all">
                           <Image src={(user as { profileImage?: string }).profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} alt="User" width={40} height={40} />
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                            <Link href="/signup" className="bg-[#0CAF60] hover:bg-[#0A9652] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-8 font-medium">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href="/gig-list" className="hover:text-gray-900">Gigs</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900">{influencer.fullName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 relative items-start">
                    {/* Main Left Column */}
                    <div className="w-full lg:w-[65%] xl:w-[70%] space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-4 mb-5">
                                <Image src={avatar} alt={influencer.fullName} width={64} height={64} className="rounded-full object-cover border border-gray-100 shadow-sm" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900">{influencer.fullName}</h1>
                                        {influencer.isVerified && (
                                            <span className="bg-[#E6F6ED] text-[#0CAF60] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 fill-current" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-1 font-medium">
                                        <span>{influencer.categories.join(" & ")}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="flex items-center text-gray-700">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            <span className="font-bold mr-1">New Creator</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5 pr-8">
                                {gig.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    <Zap className="w-4 h-4 text-emerald-500 mr-2" />
                                    Fast Delivery Available
                                </span>
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300">
                                    <Heart className="w-4 h-4 text-gray-400 mr-2" />
                                    Save
                                </span>
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300">
                                    <Share className="w-4 h-4 text-gray-400 mr-2" />
                                    Share
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About this Gig</h3>
                            <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {gig.shortDescription}
                            </p>
                        </div>

                        {/* Deliverables */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Deliverables</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gig.deliverables.map((item, i) => (
                                    <div key={i} className="flex flex-col p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#0CAF60]/30 hover:shadow-md transition-all duration-300">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                            <Instagram className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.contentType}</h4>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">QUANTITY: {item.quantity}</p>
                                        <p className="text-sm font-medium text-gray-700 mt-auto flex items-center gap-1">
                                            <Check className="w-4 h-4 text-[#0CAF60]" /> Professional Edit
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Audience Insights</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                    <Users className="w-4 h-4 text-blue-600 mb-2" />
                                    <div className="text-2xl font-extrabold text-gray-900 mb-1">{(influencer.followersCount || 0).toLocaleString()}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">Followers</div>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
                                    <BarChart className="w-4 h-4 text-purple-600 mb-2" />
                                    <div className="text-2xl font-extrabold text-gray-900 mb-1">4.2%</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">Engagement</div>
                                </div>
                                <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100/50">
                                    <Heart className="w-4 h-4 text-pink-600 mb-2" />
                                    <div className="text-2xl font-extrabold text-gray-900 mb-1">12K</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">Avg Likes</div>
                                </div>
                                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50">
                                    <MessageSquare className="w-4 h-4 text-orange-600 mb-2" />
                                    <div className="text-2xl font-extrabold text-gray-900 mb-1">85%</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">Positive Sentiment</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (Sticky) */}
                    <div className="w-full lg:w-[35%] xl:w-[30%] lg:sticky lg:top-28">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-1 flex flex-col relative overflow-hidden">
                            <div className="flex border-b border-gray-100 p-1">
                                <button className="flex-1 py-3 text-sm font-bold text-[#0CAF60] border-b-2 border-[#0CAF60]">Package Details</button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-gray-900">{gig.pricing.currency === "INR" ? "₹" : "$"}{gig.pricing.basePrice.toLocaleString()}</span>
                                    <span className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Per Project</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                                        <Clock className="w-5 h-5 text-[#0CAF60]" />
                                        <span>{gig.pricing.deliveryTimeInDays} Days Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                                        <Check className="w-5 h-5 text-[#0CAF60]" />
                                        <span>{gig.pricing.revisionsIncluded} Revisions Included</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                                        <ShieldCheck className="w-5 h-5 text-[#0CAF60]" />
                                        <span>Full Commercial Rights</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        onClick={handleRequestBooking}
                                        disabled={bookingLoading || !isInitialized}
                                        className="w-full bg-[#0CAF60] hover:bg-[#0A9652] disabled:bg-gray-200 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-3 group"
                                    >
                                        {bookingLoading || !isInitialized ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                Request Booking
                                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    
                                    <p className="text-[11px] text-slate-500 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                        <Info className="w-4 h-4 text-emerald-500" />
                                        You&apos;ll chat before payment
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" /> Secure Escrow via Noillin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Loading Gig Experience...</span>
            </div>
        }>
            <GigDetailsContent />
        </Suspense>
    );
}
