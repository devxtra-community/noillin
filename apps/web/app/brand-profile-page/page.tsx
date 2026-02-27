
import {
    BadgeCheck,
    Globe,
    MessageSquare,
    Send,
    Megaphone,
    CheckCircle2,
    Star,
    ShieldCheck,
    RefreshCcw,
    Clock,
    Users,
    Calendar,
    MapPin,
    Bookmark,
    Share2,
    Flag,
    ChevronRight,
    ArrowRight,
    Instagram,
    Youtube,
    Video,
    FileImage,
    Building2
} from 'lucide-react';

export default function BrandProfilePage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-16">
            {/* Header Profile Section */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex w-20 h-20 bg-emerald-500 rounded-2xl items-center justify-center text-white text-3xl font-bold shadow-sm">
                                GC
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Glow Cosmetics Pvt Ltd</h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wide w-fit">
                                        <BadgeCheck className="w-3.5 h-3.5" /> Verified Brand
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                        </span>
                                        Beauty & Skincare
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" /> Member since Jan 2021
                                    </div>
                                </div>
                                <div>
                                    <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        <Globe className="w-4 h-4" /> www.glowcosmetics.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors cursor-pointer">
                                <MessageSquare className="w-4 h-4" /> Message Brand
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
                                <Send className="w-4 h-4" /> Send Collaboration Proposal
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Trust & Performance Metrics */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase px-1">Trust & Performance</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <Megaphone className="w-3.5 h-3.5 text-emerald-500" /> Campaigns Posted
                            </div>
                            <div className="text-2xl font-bold text-slate-800">47</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed Collabs
                            </div>
                            <div className="text-2xl font-bold text-slate-800">128</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <Star className="w-3.5 h-3.5 text-yellow-400" /> Avg. Rating
                            </div>
                            <div className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">4.8<span className="text-sm font-medium text-slate-400">/5</span></div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Payment Score
                            </div>
                            <div className="text-2xl font-bold text-emerald-500">98%</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <RefreshCcw className="w-3.5 h-3.5 text-emerald-500" /> Repeat Rate
                            </div>
                            <div className="text-2xl font-bold text-slate-800">72%</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Avg. Response
                            </div>
                            <div className="text-2xl font-bold text-slate-800">&lt;4h</div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About the Brand */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">About the Brand</h2>
                            <p className="text-slate-500 leading-relaxed text-[15px] mb-8">
                                Glow Cosmetics is a premium beauty and skincare brand dedicated to creating clean, sustainable, and effective products. We believe in empowering individuals through self-care and natural beauty. Our product line includes serums, moisturizers, and makeup essentials crafted with ethically sourced ingredients.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Users className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Company Size</h3>
                                        <p className="text-sm font-semibold text-slate-800">50-200 employees</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Years in Business</h3>
                                        <p className="text-sm font-semibold text-slate-800">6 years</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Headquarters</h3>
                                        <p className="text-sm font-semibold text-slate-800">Mumbai, India</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Active Campaigns */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Campaigns</h2>
                                <span className="text-xs font-semibold text-slate-400">3 open opportunities</span>
                            </div>

                            <div className="space-y-6">
                                {/* Campaign 1 */}
                                <div className="group border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-[15px] mb-2 group-hover:text-emerald-600 transition-colors cursor-pointer">Summer Glow Collection Launch</h3>
                                            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold">Skincare</span>
                                        </div>
                                        <div className="text-lg font-black text-emerald-600 whitespace-nowrap">
                                            ₹25K - ₹50K
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-5">
                                        <div className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-slate-400" /> 2 Reels + 3 Stories</div>
                                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> 2 weeks</div>
                                        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> 10K+ followers</div>
                                    </div>

                                    <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {/* Campaign 2 */}
                                <div className="group border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-[15px] mb-2 group-hover:text-emerald-600 transition-colors cursor-pointer">Vitamin C Serum Awareness</h3>
                                            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold">Beauty</span>
                                        </div>
                                        <div className="text-lg font-black text-emerald-600 whitespace-nowrap">
                                            ₹15K - ₹30K
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-5">
                                        <div className="flex items-center gap-1.5"><FileImage className="w-3.5 h-3.5 text-slate-400" /> 5 Feed Posts</div>
                                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> 1 month</div>
                                        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> 5K+ followers</div>
                                    </div>

                                    <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {/* Campaign 3 */}
                                <div className="group border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-[15px] mb-2 group-hover:text-emerald-600 transition-colors cursor-pointer">Sustainable Beauty Ambassador</h3>
                                            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold">Lifestyle</span>
                                        </div>
                                        <div className="text-lg font-black text-emerald-600 whitespace-nowrap">
                                            ₹50K - ₹1L
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-5">
                                        <div className="flex items-center gap-1.5"><RefreshCcw className="w-3.5 h-3.5 text-slate-400" /> Long-term partnership</div>
                                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> 3 months</div>
                                        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> 50K+ followers</div>
                                    </div>

                                    <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Past Collaborations */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Past Collaborations</h2>

                            <div className="space-y-4">
                                {/* Collab 1 */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Priya Sharma" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Priya Sharma <span className="text-slate-400 font-medium text-xs ml-1">@priyabeauty</span></h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Winter Skincare Routine Campaign</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-2">
                                        <div className="text-right">
                                            <div className="font-black text-slate-800 text-sm">₹35,000</div>
                                            <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">Completed</span>
                                    </div>
                                </div>

                                {/* Collab 2 */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                            <img src="https://i.pravatar.cc/150?img=11" alt="Rahul Verma" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Rahul Verma <span className="text-slate-400 font-medium text-xs ml-1">@rahullifestyle</span></h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Men's Grooming Essentials</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-2">
                                        <div className="text-right">
                                            <div className="font-black text-slate-800 text-sm">₹22,000</div>
                                            <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">Completed</span>
                                    </div>
                                </div>

                                {/* Collab 3 */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                            <img src="https://i.pravatar.cc/150?img=5" alt="Ananya Iyer" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Ananya Iyer <span className="text-slate-400 font-medium text-xs ml-1">@ananyaskincare</span></h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Anti-Aging Serum Review</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-2">
                                        <div className="text-right">
                                            <div className="font-black text-slate-800 text-sm">₹18,000</div>
                                            <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">Completed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button className="text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                                    View All 128 Collaborations <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Reviews from Influencers</h2>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5 text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm ml-1">4.8</span>
                                    <span className="text-xs font-semibold text-slate-400">(89 reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Review 1 */}
                                <div className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src="https://i.pravatar.cc/150?img=32" alt="Reviewer" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">Meera Kapoor</h4>
                                                <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400">2 weeks ago</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        "Amazing experience working with Glow Cosmetics! They were professional, clear about deliverables, and paid on time. The products were high quality and my audience loved them. Highly recommend collaborating with this brand!"
                                    </p>
                                </div>

                                {/* Review 2 */}
                                <div className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src="https://i.pravatar.cc/150?img=12" alt="Reviewer" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">Arjun Mehta</h4>
                                                <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                    {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                    <Star className="w-3 h-3 text-slate-200 fill-current" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400">1 month ago</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        "Great communication throughout the campaign. The team was responsive and provided all the creative assets I needed. Payment was processed within 48 hours of campaign completion. Will definitely work with them again!"
                                    </p>
                                </div>

                                {/* Review 3 */}
                                <div className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src="https://i.pravatar.cc/150?img=40" alt="Reviewer" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">Sneha Reddy</h4>
                                                <div className="flex gap-0.5 text-yellow-400 mt-0.5">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400">2 months ago</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        "One of the best brands I've collaborated with on Noillin. They value influencer creativity and give creative freedom. The escrow payment system gave me peace of mind. Looking forward to more campaigns!"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 text-center pt-2">
                                <button className="text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                                    View All 89 Reviews <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">

                        {/* Verification Section */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-5">Verification & Safety</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                                    <div className="mt-0.5 text-emerald-500 bg-white rounded-full p-1 shadow-sm">
                                        <BadgeCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">Business Verified</h4>
                                        <p className="text-[11px] text-slate-500">GST & PAN confirmed</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                                    <div className="mt-0.5 text-emerald-500 bg-white rounded-full p-1 shadow-sm">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">Company Registered</h4>
                                        <p className="text-[11px] text-slate-500">Pvt Ltd entity verified</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                                    <div className="mt-0.5 text-emerald-500 bg-white rounded-full p-1 shadow-sm">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">Secure Escrow</h4>
                                        <p className="text-[11px] text-slate-500">Protected payments</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100/50 mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <h4 className="text-xs font-bold text-emerald-900">Platform Protection</h4>
                                    </div>
                                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                                        All collaborations are protected by Noillin's secure payment system. Funds are held in escrow until you complete your deliverables.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-5">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm mb-4">
                                    <Send className="w-4 h-4" /> Send Proposal
                                </button>
                                <div className="w-full h-px bg-slate-100 w-full mb-4"></div>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-sm transition-colors">
                                    <Bookmark className="w-4 h-4" /> Save Brand
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-sm transition-colors">
                                    <Share2 className="w-4 h-4" /> Share Profile
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-500 font-semibold rounded-lg text-sm transition-colors mt-2">
                                    <Flag className="w-4 h-4" /> Report Brand
                                </button>
                            </div>
                        </section>

                        {/* Similar Brands */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-5">Similar Brands</h2>
                            <div className="space-y-4">
                                <a href="#" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-sm">RS</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Radiant Skin Co.</h4>
                                            <p className="text-[11px] text-slate-500">Beauty & Skincare</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </a>

                                <a href="#" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">PB</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Pure Botanics</h4>
                                            <p className="text-[11px] text-slate-500">Organic Beauty</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </a>

                                <a href="#" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">LH</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Luxe Herbals</h4>
                                            <p className="text-[11px] text-slate-500">Ayurvedic Skincare</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </a>
                            </div>
                        </section>

                    </div>

                </div>
            </main>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                        Noillin <span className="font-medium text-slate-400">© 2024. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
                    </div>
                </div>
            </div>

        </div>
    );
}
