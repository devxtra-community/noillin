"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleSignupClick = () => {
    router.push("/signup");
  }
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo SVG Placeholder */}
          <div className="w-8 h-8 text-emerald-500">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Noillin</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Influencers</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Gigs</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleLoginClick} className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors hover:cursor-pointer">
            Sign In
          </button>
          <button onClick={handleSignupClick} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors shadow-sm shadow-emerald-200 hover:cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Column - Text Content */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Book Trusted Influencers.<br />
            <span className="text-emerald-500">Pay Securely.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
            Discover, schedule, and collaborate with verified creators — all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button className="px-6 py-3 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-lg hover:cursor-pointer">
              Explore Gigs
            </button>
            <button className="px-6 py-3 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all shadow-sm hover:cursor-pointer">
              Become an Influencer
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                  <Image fill src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">Join 2,000+ creators today</span>
          </div>
        </div>

        {/* Right Column - Mockup Card */}
        <div className="relative w-full max-w-md mx-auto lg:ml-auto">
          {/* Decorative Green Background Shape */}
          <div className="absolute inset-0 bg-emerald-100 rounded-[2rem] transform rotate-3 translate-x-4 translate-y-4 -z-10"></div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">

            {/* Lock Icon */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-8 mt-2">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 relative">
                <Image fill src="https://i.pravatar.cc/150?img=5" alt="Sarah Jenkins" className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Sarah Jenkins</h3>
                <p className="text-xs text-gray-400 mb-2">Lifestyle & Beauty</p>
                <div className="flex gap-2 text-[10px] font-semibold">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">Instagram</span>
                  <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded">TikTok</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="mb-8">
              <p className="text-xs text-gray-400 font-medium mb-3">Select Availability</p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-gray-300 font-medium mb-1">{day}</div>
                ))}
                {['1', '2', '3'].map((date) => (
                  <div key={date} className="py-2 text-gray-400 font-medium">{date}</div>
                ))}
                {/* Active Date */}
                <div className="py-2 bg-emerald-500 text-white font-bold rounded-md shadow-sm shadow-emerald-200">4</div>
                {['5', '6', '7'].map((date) => (
                  <div key={date} className="py-2 text-gray-400 font-medium">{date}</div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 border-t border-gray-50 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-semibold text-gray-900">$150.00</span>
              </div>
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-emerald-500 text-lg">$150.00</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors hover:cursor-pointer">
              Confirm & Pay
            </button>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by brands and creators</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pt-4 md:pt-0">
            <p className="text-4xl font-bold text-gray-400 mb-1">1,000+</p>
            <p className="text-sm text-gray-400">Influencers</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-4xl font-bold text-gray-400 mb-1">$2M+</p>
            <p className="text-sm text-gray-400">Processed</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-4xl font-bold text-gray-400 mb-1">100%</p>
            <p className="text-sm text-gray-400">Secure</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50/50 py-24 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Noillin Works</h2>
            <p className="text-gray-500">A simple, secure process to connect brands with creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop (behind cards) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-10 transform -translate-y-12"></div>

            {/* Step 1 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Browse verified influencer gigs based on your niche and budget.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Book</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Select availability and packages that fit your campaign needs.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pay Securely</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Funds are held securely until deliverables are confirmed.</p>
            </div>

          </div>
        </div>
      </section>
      {/* Platform Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Platform Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Availability Booking", desc: "See real-time calendar slots before you book. No more back-and-forth emails.", icon: "calendar" },
            { title: "Secure Payments", desc: "Escrow-style protection ensures your money is safe until the job is done.", icon: "shield-check" },
            { title: "Direct Chat", desc: "Communicate directly with influencers or brands via our secure platform.", icon: "chat" },
            { title: "Transparent Pricing", desc: "No hidden fees. What you see is exactly what you pay.", icon: "cash" },
            { title: "Group Collabs", desc: "Book multiple influencers for the same campaign effortlessly.", icon: "users" },
            { title: "Fast Turnaround", desc: "Get confirmed bookings in minutes, not days.", icon: "lightning" },
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-6">
                {/* Simplified Icon mapping */}
                <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segmented Section: Brands & Creators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brands */}
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <h2 className="text-2xl font-bold mb-8">Built for Brands</h2>
          <ul className="space-y-4 mb-10">
            {["Filter influencers by niche, platform, and follower count", "Clear deliverables and transparent pricing packages", "Secure escrow-style payments protect your budget"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-black transition-colors hover:cursor-pointer">
            Explore Influencers
          </button>
        </div>

        {/* Creators */}
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <h2 className="text-2xl font-bold mb-8">Built for Creators</h2>
          <ul className="space-y-4 mb-10">
            {["Create single or group gigs with custom packages", "Manage availability like a pro calendar", "Get paid instantly once the brand confirms receipt"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-1 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors hover:cursor-pointer">
            Create a Gig
          </button>
        </div>
      </section>

      {/* Community Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Rivera",
              role: "Marketing Director, TechFlow",
              img: "https://i.pravatar.cc/150?img=11",
              quote: "Noillin streamlined our influencer outreach. We found the perfect micro-influencers within hours and the booking process was seamless."
            },
            {
              name: "Sarah Jenkins",
              role: "Lifestyle Creator",
              img: "https://i.pravatar.cc/150?img=5",
              quote: "Finally, a platform that treats creators as professionals. The calendar sync and secure payments give me peace of mind."
            },
            {
              name: "Michael Chen",
              role: "Founder, BloomSkincare",
              img: "https://i.pravatar.cc/150?img=8",
              quote: "The group collaboration feature is a game changer. We coordinated 10 influencers for a product launch in one afternoon."
            }
          ].map((story, i) => (
            <div key={i} className="bg-gray-50/50 p-8 rounded-2xl border border-gray-50">
              <div className="flex text-emerald-400 mb-4">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-gray-600 text-sm italic mb-8 leading-relaxed">{story.quote}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative">
                  <Image fill src={story.img} alt={story.name} className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{story.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-emerald-500 py-20 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Start Collaborating Today</h2>
          <p className="text-emerald-50 mb-10 text-lg">
            Join thousands of brands and creators building the future of influence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-colors hover:cursor-pointer">
              Find Influencers
            </button>
            <button className="px-8 py-3 bg-emerald-900/40 text-white font-bold rounded-xl border border-white/20 hover:bg-emerald-900/60 transition-colors hover:cursor-pointer">
              Join as Influencer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Noillin</span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-[11px] font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs">🔒</span>
              <span>SECURE PAYMENTS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs">✔</span>
              <span>VERIFIED PROFILES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs">💬</span>
              <span>REAL-TIME CHAT</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}




