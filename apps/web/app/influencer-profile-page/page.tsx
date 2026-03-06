
import Image from 'next/image';
import {
  CheckCircle2,
  MapPin,
  Star,
  MessageSquare,
  Lock,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans sm:px-0">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Noillin</span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center  gap-8 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">About</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Influencers</a>
            <div className="relative h-20 flex items-center">
              <a href="#" className="text-emerald-600 font-semibold">Gigs</a>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
            </div>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Support</a>
          </div>


          <div className="flex flex-row items-center gap-4 sm:gap-6 text-sm font-medium">
            <button className="text-slate-600 hover:text-slate-900 hidden sm:block">Sign In</button>
            <button className="px-4 py-2 sm:px-5 sm:py-2.5 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-semibold">Get Started</button>
          </div>
        </div>

      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm relative">
              <Image fill src="https://i.pravatar.cc/300?img=5" alt="Sarah Jenkins" className="object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-4 border-white">
              <span className="flex items-center justify-center w-5 h-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-5 py-2">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sarah Jenkins</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50/80 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wide mx-auto md:mx-0 w-fit">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-slate-500 font-medium md:text-lg">Lifestyle & Beauty Creator</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                <Instagram className="w-3.5 h-3.5" /> 245K
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                <Youtube className="w-3.5 h-3.5" /> 890K
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-700">
                1.2M
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                <MapPin className="w-4 h-4" /> Los Angeles, CA
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
            <div className="text-2xl font-bold text-slate-800">142</div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Collaborations</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-center space-y-2">
            <div className="flex justify-center gap-0.5 text-yellow-400 pt-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <div className="text-xl font-bold text-slate-800">4.8</div>
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
          <p className="text-slate-500 leading-relaxed text-sm md:text-base">
            Sarah is a professional content creator specializing in authentic lifestyle and beauty storytelling. With over 5 years of experience working with premium skincare and fashion brands, she creates high-quality visual content that drives engagement and conversions. Her audience trusts her recommendations because of her honest reviews and genuine connection. She specializes in Reels, TikToks, and long-form YouTube integration videos.
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
                  <p className="font-bold text-sm text-slate-800">245K Followers</p>
                  <p className="text-[11px] text-emerald-500 font-bold">4.2% Engagement</p>
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
                  <p className="font-bold text-sm text-slate-800">890K Subscribers</p>
                  <p className="text-[11px] text-emerald-500 font-bold">8.5% Engagement</p>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">TikTok</p>
                    <p className="text-[11px] text-slate-400 font-medium">Short-form Video</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-sm text-slate-800">1.2M Followers</p>
                  <p className="text-[11px] text-emerald-500 font-bold">6.1% Engagement</p>
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
            <button className="text-emerald-500 text-sm font-semibold hover:text-emerald-600 transition-colors">View all</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gig 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col relative group hover:border-emerald-200 transition-colors cursor-pointer">
              <span className="absolute top-5 right-5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Active</span>
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-5">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Brand Story Integration</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                2 Instagram Reels featuring your product in my daily routine.
              </p>
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium pb-0.5">Starting at</p>
                    <p className="text-lg font-black text-slate-800">$1,500</p>
                  </div>
                </div>
                <button className="w-full py-2.5 border border-emerald-500 text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors">View Gig</button>
              </div>
            </div>

            {/* Gig 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col relative group hover:border-emerald-200 transition-colors cursor-pointer">
              <span className="absolute top-5 right-5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Active</span>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-5">
                <Youtube className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Dedicated YouTube Review</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                Honest, in-depth review of your product with dedicated timestamp.
              </p>
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium pb-0.5">Starting at</p>
                    <p className="text-lg font-black text-slate-800">$3,200</p>
                  </div>
                </div>
                <button className="w-full py-2.5 border border-emerald-500 text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors">View Gig</button>
              </div>
            </div>

            {/* Gig 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col relative group hover:border-emerald-200 transition-colors cursor-pointer">
              <span className="absolute top-5 right-5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Active</span>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 mb-5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">TikTok Viral Campaign</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                3 TikTok videos optimized for trending sounds and formats.
              </p>
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium pb-0.5">Starting at</p>
                    <p className="text-lg font-black text-slate-800">$2,800</p>
                  </div>
                </div>
                <button className="w-full py-2.5 border border-emerald-500 text-emerald-600 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors">View Gig</button>
              </div>
            </div>
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
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-sm text-slate-700">
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
                &quot;Sarah was incredibly professional and delivered the content ahead of schedule. The Reels performed above our expectations.&quot;
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-sm text-slate-700">
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
                &quot;Great communication throughout the process. Our audience loved the styling tips she incorporated.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Availability & Safety Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-1 bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Availability</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Availability varies by gig. Check individual gig pages for specific dates.</p>
            <a href="#" className="text-emerald-500 font-semibold text-xs flex items-center gap-1 hover:text-emerald-600 transition-colors">Check availability inside gig <ArrowRight className="w-3.5 h-3.5" /></a>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 px-4 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Noillin</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                The professional marketplace for influencer-brand collaborations.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Browse Influencers</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Explore Gigs</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">How it Works</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Blog</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© 2024 Noillin. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
