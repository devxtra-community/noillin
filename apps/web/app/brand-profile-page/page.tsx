"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import {
    BadgeCheck,
    Globe,
    MessageSquare,
    Send,
    MapPin,
    Users,
    Building2,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Twitter,
    Instagram,
    Linkedin,
    Calendar,
    ArrowUpRight
} from 'lucide-react';

import api from "@/lib/axios.client";
import DashboardHeader from "@/components/DashboardHeader";
import NoillinIcon from "@/components/NoillinIcon";

interface BrandData {
    _id: string;
    companyName: string;
    industry: string;
    website?: string;
    description?: string;
    headquarters?: string;
    companySize?: string;
    profileImageUrl?: string;
    isVerified: boolean;
    createdAt: string;
}

/**
 * Senior Dev Note: Abstracted sub-components for better readability and maintainability.
 */

const LoadingState = () => (
    <>
        <DashboardHeader />
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-emerald-500 pt-20">
            <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
            </div>
            <p className="text-slate-400 font-medium animate-pulse tracking-wide">Initializing Brand Experience...</p>
        </div>
    </>
);

const ErrorState = ({ message }: { message: string }) => (
    <>
        <DashboardHeader />
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 p-4 pt-20 text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-sm">
                <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">{message || "Profile Not Found"}</h1>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                    The requested brand profile could not be loaded. Please verify the link or try again later.
                </p>
            </div>
            <Link href="/influencer-dashboard" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Back to Dashboard
            </Link>
        </div>
    </>
);

function BrandProfileContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [brand, setBrand] = useState<BrandData | null>(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(id ? "" : "No brand identified.");

    useEffect(() => {
        if (!id) return;

        api.get(`/brands/${id}`)
            .then(res => {
                setBrand(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("[Profile Fetch Error]:", err);
                setError("Failed to load brand profile.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <LoadingState />;
    if (error || !brand) return <ErrorState message={error} />;

    const initials = brand.companyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <DashboardHeader />
            
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-8">
                
                {/* Hero Profile Section */}
                <section className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="shrink-0 group">
                        {brand.profileImageUrl ? (
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-100 relative transition-transform duration-500 group-hover:scale-105">
                                <img src={brand.profileImageUrl} alt={brand.companyName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-emerald-100 transition-transform duration-500 group-hover:scale-105">
                                {initials}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6 py-2">
                        <div className="space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{brand.companyName}</h1>
                                {brand.isVerified && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-wider mx-auto md:mx-0 w-fit ring-1 ring-emerald-100">
                                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-slate-500 font-bold text-sm md:text-base">
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-emerald-500" /> {brand.industry}
                                </span>
                                <span className="text-slate-200">|</span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" /> Joined {new Date(brand.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-1">
                            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                <MapPin className="w-4 h-4 text-rose-400" /> {brand.headquarters || "Global Headquarters"}
                            </div>
                            {brand.website && (
                                <a 
                                    href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1.5 text-emerald-600 text-sm font-black hover:text-emerald-700 transition-all hover:translate-x-1 group"
                                >
                                    <Globe className="w-4 h-4" /> Official Website <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <button className="px-10 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-2">
                                <Send className="w-4 h-4" /> Message Brand
                            </button>
                            <button className="px-10 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-emerald-100 active:scale-95 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Send Proposal
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                    {/* Left Column: About */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                About the Brand
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-base md:text-lg font-medium whitespace-pre-wrap">
                                {brand.description || "The brand has not provided a description yet. Reach out to them to learn more about their mission and values."}
                            </p>
                        </section>

                        <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-100 border border-emerald-400">
                            <div className="space-y-1 text-center md:text-left">
                                <h3 className="text-white font-black text-lg">Safe Collaboration</h3>
                                <p className="text-emerald-50 text-sm font-bold opacity-90">Every deal is protected by Noillin Escrow</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white font-black text-xs border border-white/20 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Secure
                                </div>
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white font-black text-xs border border-white/20 flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4" /> Verified
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Metadata */}
                    <aside className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-8 sticky top-28">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Key Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Industry</p>
                                        <p className="text-sm font-black text-slate-800">{brand.industry}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Scale</p>
                                        <p className="text-sm font-black text-slate-800">{brand.companySize || "Growth Stage"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">HQ Location</p>
                                        <p className="text-sm font-black text-slate-800">{brand.headquarters || "Global Presence"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-[11px] font-bold text-slate-500">Actively hiring creators</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-100 py-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-16">
                        <div className="md:col-span-1 space-y-6">
                            <NoillinIcon />
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                                Redefining the standard for influencer-brand collaborations through transparency and trust.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <Link href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all duration-300"><Twitter className="w-5 h-5" /></Link>
                                <Link href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all duration-300"><Instagram className="w-5 h-5" /></Link>
                                <Link href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all duration-300"><Linkedin className="w-5 h-5" /></Link>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Marketplace</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Influencers</Link></li>
                                <li><Link href="/gig-list" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Campaign Gigs</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Case Studies</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Company</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Our Story</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Career Board</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Contact Hub</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Resource</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Knowledge Base</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Safety Center</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors font-bold">Legal Portal</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>© 2026 Noillin Corp.</span>
                            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Built with <span className="text-rose-500">❤</span> for Creators
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function BrandProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-black text-emerald-500 animate-pulse">
                INITIALIZING...
            </div>
        }>
            <BrandProfileContent />
        </Suspense>
    );
}
