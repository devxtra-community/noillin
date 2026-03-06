import Image from "next/image";
import Link from "next/link";
import {
    Star, MapPin, CheckCircle2, ChevronRight, Play, Heart,
    MessageSquare, BarChart2, StarHalf, Check,
    Share, MoreHorizontal, ShieldCheck, Clock, CheckCircle,
    BarChart, Users, Instagram, Info
} from "lucide-react";

export default function GigDetailsPage() {
    const portfolio = [
        { type: 'video', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400' },
        { type: 'video', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400' },
        { type: 'video', src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=400' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1550614000-4b9015c9a09e?auto=format&fit=crop&q=80&w=400' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=400', count: "+12 More" },
    ];

    const reviews = [
        { name: "Mikaela Smith", time: "1 month ago", text: "Priya delivered exceptionally well. The content was highly engaging and resonated perfectly with our brand's audience. Cannot recommend her enough!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
        { name: "Ryan Carter", time: "2 months ago", text: "Incredible eye for detail! We were stunned by the quality of her videos. Will definitely rehire for upcoming campaigns.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
        { name: "Sophia Martinez", time: "3 months ago", text: "Great communication and very timely delivery. The reels were creative and brought in a lot of new followers for our page.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" }
    ];

    const similarGigs = [
        { name: "Emma Red", title: "I will create stunning Instagram reels for your fashion brand", price: "12,000", rating: "4.8", reviews: "124", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", type: "Instagram Reel" },
        { name: "Maya Patel", title: "Beauty product review and tutorial on Instagram", price: "18,500", rating: "4.9", reviews: "89", img: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=400", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100", type: "Story Post" },
        { name: "Zoe Miller", title: "Lifestyle product placement in my daily vlogs", price: "22,000", rating: "4.7", reviews: "210", img: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=400", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100", type: "Instagram Post" }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">Nollin</Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="#" className="hover:text-gray-900 transition-colors">Find Influencers</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">How it Works</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">For Brands</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                    <button className="bg-[#0CAF60] hover:bg-[#0A9652] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
                        Get Started
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-8 font-medium">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href="#" className="hover:text-gray-900">Beauty Influencers</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900">Priya Sharma</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 relative items-start">

                    {/* Main Left Column */}
                    <div className="w-full lg:w-[65%] xl:w-[70%] space-y-8">

                        {/* Header / Basic Info */}
                        <div>
                            <div className="flex items-center gap-4 mb-5">
                                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Priya Sharma" width={64} height={64} className="rounded-full object-cover border border-gray-100 shadow-sm" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900">Priya Sharma</h1>
                                        <span className="bg-[#E6F6ED] text-[#0CAF60] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 fill-current" />
                                            Verified
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-1 font-medium">
                                        <span>Fashion & Beauty | Vlogger</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="flex items-center text-gray-700">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            <span className="font-bold mr-1">4.9</span> (120 Reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5 pr-8">
                                I will promote your brand with 2 Instagram reels and story highlights
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                    Top Rated Influencer
                                </span>
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    <Heart className="w-4 h-4 text-gray-400 mr-2" />
                                    Save to favorites
                                </span>
                                <span className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    <Share className="w-4 h-4 text-gray-400 mr-2" />
                                    Share Gig
                                </span>
                            </div>
                        </div>

                        {/* About this Gig */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About this Gig</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Are you looking to skyrocket your brand's presence on Instagram? Look no further! I specialize in creating highly engaging, trendy, and authentic content tailored for the fashion and beauty industry. With over 245K active followers, I guarantee your product will be showcased to a vibrant and responsive audience.
                            </p>

                            <h4 className="font-bold text-gray-900 mt-6 mb-3">What You Will Receive:</h4>
                            <ul className="space-y-3 font-medium text-gray-600">
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0CAF60] shrink-0 mt-0.5" /><span>2 High-quality, professionally edited Instagram Reels featuring your product prominently.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0CAF60] shrink-0 mt-0.5" /><span>3 Story frames with interactive elements (polls/questions) to drive engagement.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0CAF60] shrink-0 mt-0.5" /><span>Story Highlight placement on my profile for 30 days.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#0CAF60] shrink-0 mt-0.5" /><span>Performance report with detailed analytics delivered 7 days after posting.</span></li>
                            </ul>

                            <h4 className="font-bold text-gray-900 mt-6 mb-3">Custom Offers:</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Need more reels or a long-term partnership? I am open to discussing custom packages that suit your brand's specific needs. Feel free to shoot me a message before placing an order to discuss your strategy and goals.
                            </p>
                        </div>

                        {/* Deliverables */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Deliverables</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: <Instagram className="w-6 h-6 text-pink-500" />, title: 'Instagram Video', platforms: 'Instagram, Facebook' },
                                    { icon: <Instagram className="w-6 h-6 text-pink-500" />, title: 'Story Posts', platforms: 'Instagram' },
                                    { icon: <Instagram className="w-6 h-6 text-pink-500" />, title: 'Carousel Posts', platforms: 'Instagram' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#0CAF60]/30 hover:shadow-md transition-all duration-300">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">DELIVERY PLATFORM</p>
                                        <p className="text-sm font-medium text-gray-700 mt-auto">{item.platforms}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio & Past Work */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Portfolio & Past Work</h3>
                                <Link href="#" className="text-[#0CAF60] font-bold text-sm hover:underline">View All</Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {portfolio.map((item, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer bg-gray-100">
                                        <Image src={item.src} alt="Portfolio item" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                    <Play className="w-4 h-4 text-gray-900 ml-1" />
                                                </div>
                                            </div>
                                        )}
                                        {item.count && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                                                <span className="font-bold text-gray-900">{item.count}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audience Insights */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Audience Insights</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Followers</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 mb-1">245K</div>
                                    <div className="text-xs font-bold text-[#0CAF60] flex items-center gap-1">+1.5% this month</div>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
                                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                                        <BarChart className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Engagement rate</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 mb-1">4.8%</div>
                                    <div className="text-xs font-medium text-gray-500">Above average</div>
                                </div>
                                <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100/50">
                                    <div className="flex items-center gap-2 text-pink-600 mb-2">
                                        <Heart className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Avg. Likes</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 mb-1">11.8K</div>
                                    <div className="text-xs font-medium text-gray-500">Per post average</div>
                                </div>
                                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50">
                                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Avg. Comments</span>
                                    </div>
                                    <div className="text-3xl font-extrabold text-gray-900 mb-1">487</div>
                                    <div className="text-xs font-medium text-gray-500">Per post average</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 mb-4">Top Countries</h4>
                                    <div className="space-y-4 font-medium text-sm">
                                        <div>
                                            <div className="flex justify-between mb-1"><span>United States</span><span className="font-bold">54%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#0CAF60] h-1.5 rounded-full" style={{ width: '54%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>United Kingdom</span><span className="font-bold">18%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#0CAF60] h-1.5 rounded-full" style={{ width: '18%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>India</span><span className="font-bold">11%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#0CAF60] h-1.5 rounded-full" style={{ width: '11%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>Australia</span><span className="font-bold">5%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#0CAF60] h-1.5 rounded-full" style={{ width: '5%' }}></div></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 mb-4">Age Range</h4>
                                    <div className="space-y-4 font-medium text-sm">
                                        <div>
                                            <div className="flex justify-between mb-1"><span>18-24</span><span className="font-bold">42%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>25-34</span><span className="font-bold">38%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '38%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>35-44</span><span className="font-bold">12%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '12%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1"><span>Under 18</span><span className="font-bold">8%</span></div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '8%' }}></div></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 mb-4">Gender Split</h4>
                                    <div className="flex h-4 rounded-full overflow-hidden mb-4">
                                        <div className="bg-pink-400 h-full" style={{ width: '68%' }}></div>
                                        <div className="bg-blue-400 h-full" style={{ width: '32%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-6 font-medium text-sm">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-400"></div> Female (68%)</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Male (32%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10">
                            <div className="w-full md:w-1/3">
                                <div className="text-5xl font-extrabold text-gray-900 mb-2">4.9</div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />)}
                                </div>
                                <div className="text-sm font-medium text-gray-500 mb-6">Based on 120 reviews</div>

                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((stars, i) => {
                                        const pct = stars === 5 ? 85 : stars === 4 ? 12 : 3;
                                        return (
                                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                                <div className="w-4 text-right">{stars}</div>
                                                <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#FACC15] rounded-full" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <div className="w-8 text-right text-xs">{pct}%</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 space-y-6">
                                {reviews.map((rev, i) => (
                                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Image src={rev.avatar} alt={rev.name} width={40} height={40} className="rounded-full object-cover" />
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        {rev.name}
                                                        <span className="bg-[#E6F6ED] text-[#0CAF60] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 mt-0.5">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED BUYER
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-medium text-gray-500">{rev.time}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-[#FACC15] text-[#FACC15]' : 'fill-gray-200 text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 font-medium text-sm leading-relaxed">{rev.text}</p>
                                    </div>
                                ))}
                                <div className="pt-2 text-center text-sm font-bold text-[#0CAF60] hover:underline cursor-pointer">
                                    View All Verified Reviews
                                </div>
                            </div>
                        </div>

                        {/* About the Influencer */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">About the Influencer</h3>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <p className="text-gray-600 font-medium leading-relaxed mb-6">
                                        A vibrant fashion and lifestyle content creator based in London. My mission is to empower individuals to express their authentic selves through style. I blend high-street finds with luxury statement pieces to create accessible yet aspirational looks. My content is bright, energetic, and highly interactive.
                                    </p>
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        I believe in genuine partnerships. When I recommend a product, it's because I truly use and love it, which reflects directly on the engagement and trust my audience places in my sponsored content. Let's create something beautiful together!
                                    </p>
                                </div>
                                <div className="md:w-64 space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">MEMBER SINCE</div>
                                        <div className="font-bold text-gray-900">May 12, 2021</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">LANGUAGES</div>
                                        <div className="font-bold text-gray-900">English, Hindi</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">RESPONSE RATE</div>
                                        <div className="font-bold text-gray-900">98% (Within 2 hrs)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Gigs */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Similar Gigs You May Like</h3>
                                <Link href="#" className="text-[#0CAF60] font-bold text-sm hover:underline">View All</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {similarGigs.map((gig, i) => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image src={gig.img} alt={gig.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                <Instagram className="w-3.5 h-3.5 text-pink-500" /> {gig.type}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Image src={gig.avatar} alt={gig.name} width={24} height={24} className="rounded-full object-cover" />
                                                <span className="text-sm font-bold text-gray-900">{gig.name}</span>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0CAF60] fill-current" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 leading-snug mb-4 line-clamp-2 h-11 group-hover:text-[#0CAF60] transition-colors">{gig.title}</h4>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                                                    <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" /> {gig.rating} <span className="text-gray-400 font-medium">({gig.reviews})</span>
                                                </div>
                                                <div className="font-extrabold text-gray-900">
                                                    <span className="text-xs text-gray-500 font-medium mr-1">From</span>
                                                    ₹{gig.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar (Sticky) */}
                    <div className="w-full lg:w-[35%] xl:w-[30%] lg:sticky lg:top-28">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 p-1 flex flex-col relative overflow-hidden">

                            {/* Tab headers */}
                            <div className="flex border-b border-gray-100 p-1">
                                <button className="flex-1 py-3 text-sm font-bold text-[#0CAF60] border-b-2 border-[#0CAF60]">Basic</button>
                                <button className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Standard</button>
                                <button className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Premium</button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-extrabold text-gray-900">₹15,000</span>
                                    <span className="text-gray-500 font-medium mb-1">/ project</span>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-6 text-sm">2x Reels & Story Shoutouts</h4>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <Check className="w-5 h-5 text-[#0CAF60]" />
                                        <span>Unlimited revisions before upload</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <Check className="w-5 h-5 text-[#0CAF60]" />
                                        <span>2 Days Delivery Period</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <Check className="w-5 h-5 text-[#0CAF60]" />
                                        <span>Story placement for 24h</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <Check className="w-5 h-5 text-[#0CAF60]" />
                                        <span>Detailed Analytics Report</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-6 border border-gray-100">
                                    <div className="font-bold text-sm text-gray-900">Total Deliverables</div>
                                    <div className="font-bold text-[#0CAF60] text-sm bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">Reels + Story</div>
                                </div>

                                <button className="w-full bg-[#0CAF60] hover:bg-[#0A9652] text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-[#0CAF60]/20 hover:shadow-[#0CAF60]/40 flex items-center justify-center gap-2 mb-4">
                                    Purchase Package <ChevronRight className="w-5 h-5" />
                                </button>

                                <button className="w-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-900 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-5 h-5" /> Message Influencer
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                                    <ShieldCheck className="w-4 h-4 text-gray-400" /> Secure payment handled by Nollin
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs font-medium text-gray-400 flex items-center justify-center gap-1.5">
                            <Info className="w-4 h-4" /> Report this Gig for policy violation
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#111827] text-white pt-16 pb-8 border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="text-2xl font-bold tracking-tight text-white mb-4">Nollin</div>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                                Connecting top brands with leading influencers to create authentic, engaging content that drives real results.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">For Brands</h4>
                            <ul className="space-y-3 text-sm font-medium text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Find Influencers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Post a Campaign</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">For Influencers</h4>
                            <ul className="space-y-3 text-sm font-medium text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Join Network</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Brand Guidelines</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Support</h4>
                            <ul className="space-y-3 text-sm font-medium text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm font-medium text-gray-400">
                        <div>© 2026 Nollin. All rights reserved.</div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
