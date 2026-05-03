"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Users,
  ShieldCheck,
  Calendar,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Star,
  Search,
  CreditCard,
  Zap,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Robust counting number component that animates from 0 to target when in view.
 * Uses spring physics for smooth acceleration and deceleration.
 */
function CountingNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Extract number from string (e.g., "1,000+" -> 1000)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);

  const springValue = useSpring(0, {
    duration: 2000,
    bounce: 0,
  });

  const displayValue = useTransform(springValue, (current) =>
    Math.floor(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, springValue, numericValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

/**
 * Robust 3-grid testimonial slider that automatically slides and responds to scroll.
 */
interface Testimonial {
  name: string;
  role: string;
  img: string;
  text: string;
}

function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Triple the testimonials for a seamless loop effect
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.2, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden py-12"
    >
      <motion.div
        animate={{ x: `-${(index + testimonials.length) * (100 / extendedTestimonials.length)}%` }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1
        }}
        className="flex"
        style={{ width: `${(extendedTestimonials.length * 100) / 3}%` }}
      >
        {extendedTestimonials.map((t, i) => (
          <div
            key={i}
            className="flex-none px-4"
            style={{ width: `${100 / extendedTestimonials.length}%` }}
          >
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group h-full flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-1000" />

              <div className="relative z-10">
                <div className="flex gap-1 text-emerald-400 mb-8">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-emerald-400" />)}
                </div>
                <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-10">
                  &quot;{t.text}&quot;
                </p>
              </div>

              <div className="flex items-center gap-5 mt-auto relative z-10 pt-6 border-t border-slate-50">
                <div className="w-14 h-14 rounded-full overflow-hidden relative border-4 border-white shadow-lg">
                  <Image fill src={`https://i.pravatar.cc/150?img=${t.img}`} alt={t.name || "Testimonial Avatar"} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                  <p className="text-[11px] font-black text-emerald-500 tracking-[0.2em] uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Glassy Shadow Fades for Premium Look */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-200 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-200 to-transparent pointer-events-none z-10" />

      {/* Navigation Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "bg-emerald-500 w-8" : "bg-slate-300 w-2 hover:bg-slate-400"
              }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const pathname = usePathname();
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
              { name: "Home", href: "/" },
              { name: "About", href: "#" },
              { name: "Influencers", href: "#" },
              { name: "Gigs", href: "/gig-list" },
              { name: "Support", href: "#" }
            ].map((item) => {
              const isActive = item.href !== "#" && pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`transition-colors relative group ${isActive ? "text-emerald-600" : "hover:text-emerald-600"}`}>
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
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

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center overflow-hidden">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="relative z-10"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-slate-900"
            >
              Book Trusted Influencers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Pay Securely.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed"
            >
              Discover, schedule, and collaborate with verified creators — all in one place.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-5 mb-12"
            >
              <Link href="/gig-list">
                <Button className="h-14 px-8 text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-xl shadow-emerald-200 group transition-all">
                  Explore Gigs
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/signup?role=INFLUENCER">
                <Button variant="outline" className="h-14 px-8 text-base font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
                  Become an Influencer
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-sm">
                    <Image fill src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">
                Join <span className="text-emerald-600">2,000+</span> creators building today
              </p>
            </motion.div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Background Accent */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-[3rem] -z-10 blur-3xl opacity-60 animate-pulse" />

            <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-100 p-8 relative overflow-hidden group">
              {/* Header Bar */}
              <div className="h-1 bg-slate-50 w-24 rounded-full mx-auto mb-8" />

              {/* Profile Card Overlay */}
              <div className="flex items-center gap-5 mb-10">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-50 relative border-4 border-white shadow-md">
                  <Image fill src="https://i.pravatar.cc/150?img=5" alt="Sarah" className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                    Sarah Jenkins
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  </h3>
                  <p className="text-sm text-slate-400 font-medium mb-3 tracking-wide">Lifestyle & Beauty</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg tracking-wider">Instagram</span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-lg tracking-wider">TikTok</span>
                  </div>
                </div>
                <div className="ml-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
              </div>

              {/* Mini Calendar mockup with scroll animations */}
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10 p-6 bg-slate-50/50 rounded-3xl border border-slate-50 shadow-inner"
              >
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Availability</p>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Calendar className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] text-slate-400 font-bold text-center">{d}</div>
                  ))}
                  {[1, 2, 3].map(d => (
                    <motion.div
                      key={d}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      viewport={{ once: true }}
                      transition={{ delay: d * 0.05 }}
                      className="h-10 text-[11px] flex items-center justify-center text-slate-300"
                    >
                      {d}
                    </motion.div>
                  ))}
                  <motion.div
                    whileInView={{ scale: [1, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="h-10 w-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center rounded-xl shadow-lg shadow-emerald-200"
                  >
                    4
                  </motion.div>
                  {[5, 6, 7].map(d => (
                    <motion.div
                      key={d}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      viewport={{ once: true }}
                      transition={{ delay: d * 0.05 }}
                      className="h-10 text-[11px] flex items-center justify-center text-slate-400 font-medium"
                    >
                      {d}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Price Details */}
              <div className="space-y-4 mb-8 px-2">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <span className="text-sm font-medium text-slate-400">Service Fee</span>
                  <span className="text-sm font-bold text-slate-900">$150.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-emerald-500 tracking-tight">$150.00</span>
                </div>
              </div>

              <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-100">
                Confirm & Pay
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-slate-50/50 py-20 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-16">Trusted by brand & creators</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:divide-x divide-slate-200">
              {[
                { label: "Influencers", value: "1,000+" },
                { label: "Processed", value: "$2M+" },
                { label: "Secure", value: "100%" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="text-center px-8"
                >
                  <h2 className="text-6xl font-black text-slate-900 mb-2">
                    <CountingNumber value={stat.value} suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''} />
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-28 relative overflow-hidden bg-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">How Noillin Works</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Connect brands with elite creators in three simple, secure steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Discover",
                  desc: "Browse verified influencer gigs based on your niche and budget.",
                  icon: <Search className="w-8 h-8" />,
                  color: "bg-blue-50 text-blue-500"
                },
                {
                  title: "Book",
                  desc: "Select availability and packages that fit your campaign needs.",
                  icon: <Calendar className="w-8 h-8" />,
                  color: "bg-emerald-50 text-emerald-500"
                },
                {
                  title: "Pay Securely",
                  desc: "Funds are held securely until deliverables are confirmed.",
                  icon: <CreditCard className="w-8 h-8" />,
                  color: "bg-indigo-50 text-indigo-500"
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center group transition-all"
                >
                  <div className={`p-6 rounded-2xl mb-8 group-hover:scale-110 transition-transform ${step.color}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-[1.6]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-28 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-extrabold text-slate-900">Platform Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Availability Booking", desc: "See real-time calendar slots before you book. No more back-and-forth emails.", icon: <Calendar className="w-5 h-5" /> },
                { title: "Secure Payments", desc: "Escrow-style protection ensures your money is safe until the job is done.", icon: <ShieldCheck className="w-5 h-5" /> },
                { title: "Direct Chat", desc: "Communicate directly with influencers or brands via our secure platform.", icon: <MessageCircle className="w-5 h-5" /> },
                { title: "Transparent Pricing", desc: "No hidden fees. What you see is exactly what you pay.", icon: <Star className="w-5 h-5" /> },
                { title: "Group Collabs", desc: "Book multiple influencers for the same campaign effortlessly.", icon: <Users className="w-5 h-5" /> },
                { title: "Fast Turnaround", desc: "Get confirmed bookings in minutes, not days.", icon: <Zap className="w-5 h-5" /> },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 bg-gray-200 hover:bg-gray rounded-3xl border border-transparent hover:border-black hover hover:shadow-2xl hover:shadow-emerald-50! transition-all relative group"
                >
                  <div className="w-12 h-12 bg-white text-emerald-500 rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand vs Creator */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Brand Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-slate-900 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl shadow-slate-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 transition-all group-hover:opacity-40" />
            <h2 className="text-3xl font-black text-white mb-10 leading-tight">Built for<br />Brands</h2>
            <ul className="space-y-6 mb-12">
              {[
                "Filter influencers by niche and platform",
                "Clear deliverables and transparent pricing packages",
                "Escrow-style payments protect your budget"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-6 h-6 bg-slate-800 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 font-black" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="h-16 w-full text-base font-bold bg-white text-slate-900 border-none hover:bg-slate-100 rounded-2xl shadow-xl transition-all">
              Explore Influencers
            </Button>
          </motion.div>

          {/* Creator Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white p-12 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group shadow-2xl shadow-slate-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-40 transition-all group-hover:opacity-60" />
            <h2 className="text-3xl font-black text-slate-900 mb-10 leading-tight">Built for<br />Creators</h2>
            <ul className="space-y-6 mb-12">
              {[
                "Create single or group gigs easily",
                "Manage availability like a pro",
                "Get paid instantly once job is confirmed"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-500 font-medium">
                  <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 font-black" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="h-16 w-full text-base font-bold bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100 transition-all">
              Create a Gig
            </Button>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-28 bg-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-extrabold text-slate-900">Community Stories</h2>
            </div>
            <TestimonialSlider testimonials={[
              { name: "Alex Rivera", role: "TECHFLOW DIRECTOR", img: "11", text: "Noillin streamlined our influencer outreach. We found the perfect micro-influencers within hours." },
              { name: "Sarah Jenkins", role: "LIFESTYLE CREATOR", img: "5", text: "Finally, a platform that treats creators as professionals. The calendar sync gives me peace of mind." },
              { name: "Michael Chen", role: "BLOOMSKINCARE FOUNDER", img: "8", text: "The group collaboration feature is a game changer. We coordinated 10 influencers in one afternoon." }
            ]} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto h-[500px] bg-emerald-500 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center text-center px-6 group">
            {/* Animated Circles */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"
            />

            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 max-w-2xl leading-tight relative mt-20">
              Start Collaborating Today
            </h2>
            <p className="text-emerald-50 text-xl font-medium mb-12 max-w-xl leading-relaxed relative opacity-90">
              Join thousands of brands and creators building the future of influence together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 relative mb-20">
              <Link href="/signup">
                <Button className="h-16 px-12 bg-white text-emerald-600 hover:bg-emerald-50 text-lg font-bold rounded-2xl shadow-2xl transition-all">
                  Find Influencers
                </Button>
              </Link>
              <Link href="/signup?role=INFLUENCER">
                <Button variant="outline" className="h-16 px-12 text-white border-white/20 hover:text-emerald-600 bg-white/10 text-lg font-bold rounded-2xl transition-all">
                  Join as Influencer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
}
