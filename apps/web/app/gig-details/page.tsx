"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Star, CheckCircle2, ChevronRight, Heart,
    MessageSquare, Check,
    ShieldCheck,
    BarChart, Users, Instagram, Info,
    AlertCircle, Loader2, Zap, Clock, X, Flag
} from "lucide-react";


import { ReportingModal } from "@/components/shared/ReportingModal";
import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import DashboardHeader from "@/components/DashboardHeader";
import NotificationBell from "@/components/NotificationBell";

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
    const [loading, setLoading] = useState(!!id);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(id ? "" : "No gig identified. Please select a gig from the catalog.");
    const [showToast, setShowToast] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRequestSuccess, setIsRequestSuccess] = useState(false);
    const [alreadyRequested, setAlreadyRequested] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        api.get(`/gigs/${id}`)
            .then(res => {
                setGig(res.data.data);
                setLoading(false);

                // Check if brand already sent a request for this gig
                if (user) {
                    api.get("/connections/my")
                        .then(connRes => {
                            const requests: Array<{ gigId: { _id: string } | string; status: string }> = connRes.data.data || [];
                            const exists = requests.some(r => {
                                const gigId = typeof r.gigId === "object" ? r.gigId._id : r.gigId;
                                return gigId === id;
                            });
                            if (exists) setAlreadyRequested(true);
                        })
                        .catch(err => console.error("Could not verify request state:", err));
                }
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load gig details.");
                setLoading(false);
            });
    }, [id, user]);

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
                gigId: gig._id,
                note: noteText
            });

            setIsRequestSuccess(true);
            setAlreadyRequested(true);
            setBookingLoading(false);
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to send booking request.");
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-[#0CAF60] animate-spin" />
            <p className="text-gray-500 font-medium">Loading gig details...</p>
        </div>
    );

    if (error || !gig) return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-gray-900 font-bold text-xl">{error || "Gig not found"}</p>
            <Link href="/gig-list" className="text-[#0CAF60] font-bold hover:underline">Back to Gigs</Link>
        </div>
    );

    const influencer = gig.primaryInfluencerId;
    const avatar = influencer.profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150";

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative flex flex-col">
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

            {/* Navbar */}
            <DashboardHeader>
                <div className="flex items-center gap-6">
                    <NotificationBell />
                </div>
            </DashboardHeader>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
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
                            <Link href={`/influencer-profile-page?id=${influencer._id}`} className="flex items-center gap-4 mb-5 hover:opacity-80 transition-opacity">
                                <Image src={avatar} alt={influencer.fullName || "Influencer"} width={64} height={64} className="rounded-full object-cover border border-gray-100 shadow-sm" />
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
                            </Link>

                            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5 pr-8">
                                {gig.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    <Zap className="w-4 h-4 text-emerald-500 mr-2" />
                                    Fast Delivery Available
                                </span>
                                {/* <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300">
                                    <Heart className="w-4 h-4 text-gray-400 mr-2" />
                                    Save
                                </span>
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300">
                                    <Share className="w-4 h-4 text-gray-400 mr-2" />
                                    Share
                                </span> */}
                                <span
                                    onClick={() => {
                                        if (!user) {
                                            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                            return;
                                        }
                                        setIsReportModalOpen(true);
                                    }}
                                    className="flex items-center text-rose-600 bg-rose-50/50 px-3 py-1.5 rounded-full border border-rose-100 cursor-pointer hover:bg-rose-100"
                                >
                                    <Flag className="w-4 h-4 mr-2" />
                                    Report
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About this Gig</h3>
                            <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {gig.shortDescription}
                            </p>
                        </div>

                        {/* Deliverables */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
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
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
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
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 hover:shadow-emerald-100/50 transition-shadow duration-500 overflow-hidden flex flex-col">
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
                                        onClick={() => {
                                            if (!user) {
                                                router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                                return;
                                            }
                                            setIsModalOpen(true);
                                        }}
                                        disabled={!isInitialized || alreadyRequested || isRequestSuccess}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 group"
                                    >
                                        {alreadyRequested ? "Already Requested" : "Request Booking"}
                                        {!alreadyRequested && <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
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

            {/* Footer */}
            <footer className="bg-[#0F172A] pt-28 pb-16 text-slate-400 mt-20">
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

            {/* Booking Modal */}
            {/* Booking Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in slide-in-from-bottom-4 duration-300">
                        {isRequestSuccess ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Request Sent!</h3>
                                <p className="text-slate-500 font-medium mb-8">
                                    Your booking request and note have been securely sent to {influencer.fullName}.
                                </p>
                                <div className="flex items-center gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setIsRequestSuccess(false);
                                        }}
                                        className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => router.push("/brand-dashboard/requests")}
                                        className="flex-1 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/30"
                                    >
                                        Go to Requests
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Request Booking</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-6">
                                    Write a brief note about your project to kickstart the conversation with {influencer.fullName}.
                                </p>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Hi, I'm looking for a shoutout video..."
                                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl outline-none resize-none text-slate-700 font-medium transition-all mb-8"
                                />
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={bookingLoading}
                                        className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRequestBooking}
                                        disabled={bookingLoading || !isInitialized}
                                        className="px-8 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Request"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <ReportingModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                entityId={gig._id}
                entityType="GIG"
            />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Loading Gig Experience...</span>
            </div>
        }>
            <GigDetailsContent />
        </Suspense>
    );
}
