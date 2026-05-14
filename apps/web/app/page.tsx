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
  Check,
  Menu,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import NoillinIcon from "@/components/NoillinIcon";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
  const [visibleCards, setVisibleCards] = useState(3);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Update visible cards on resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extended array for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Auto-slide logic
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden"
    >
      <motion.div
        animate={{ x: `-${(index) * (100 / extendedTestimonials.length)}%` }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          mass: 1
        }}
        className="flex"
        style={{ width: `${(extendedTestimonials.length * 100) / visibleCards}%` }}
      >
        {extendedTestimonials.map((t, i) => (
          <div
            key={i}
            className="flex-none px-3 sm:px-4"
            style={{ width: `${100 / extendedTestimonials.length}%` }}
          >
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 h-full flex flex-col">
              <div className="flex gap-0.5 text-yellow-400 mb-6">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              
              <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed mb-8 flex-1">
                &quot;{t.text}&quot;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-sm">
                  <Image fill src={`https://i.pravatar.cc/150?img=${t.img}`} alt={t.name} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Navigation Indicators */}
      <div className="flex justify-center gap-1.5 mt-10">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const baseIndex = Math.floor(index / testimonials.length) * testimonials.length;
              setIndex(baseIndex + i);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              (index % testimonials.length) === i ? "bg-emerald-500 w-6" : "bg-slate-200 w-1.5 hover:bg-slate-300"
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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main>
        {/* Modern Minimal Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg-v2.png"
              alt="Influencer & Brand Collaboration"
              fill
              className="object-cover scale-105"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-[#F1F5F9]" />
          </div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-10 shadow-2xl"
            >
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              The Future of Influence
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-white drop-shadow-2xl"
            >
              Book Trusted Influencers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Pay Securely.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Discover, schedule, and collaborate with verified creators — all in one seamless, high-performance ecosystem.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
            >
              <Link href="/gig-list" className="w-full sm:w-auto">
                <Button className="h-14 sm:h-16 w-full sm:px-10 text-base sm:text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] group transition-all">
                  Explore Gigs
                  <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/signup?role=INFLUENCER" className="w-full sm:w-auto">
                <Button variant="outline" className="h-14 sm:h-16 w-full sm:px-10 text-base sm:text-lg font-bold text-white bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 rounded-2xl transition-all">
                  Join as Creator
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-6 p-4 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 w-fit mx-auto"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-500/30 bg-slate-800 overflow-hidden relative shadow-lg">
                    <Image fill src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/70 font-semibold tracking-wide">
                Join <span className="text-emerald-400">2,000+</span> creators building the future
              </p>
            </motion.div>
          </motion.div>

          {/* Floating Glassmorphic Elements for Modern Feel */}
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </section>

        {/* Stats Section */}
        <section className="bg-slate-900 py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
            <p className="text-center text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-16 opacity-80">Empowering the Future Economy</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {[
                { label: "Active Creators", value: "1,000+" },
                { label: "Brand Partnerships", value: "$2M+" },
                { label: "Success Rate", value: "99.9%" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="text-center px-10 py-8 md:py-0"
                >
                  <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                    <CountingNumber value={stat.value} suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''} />
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 sm:py-32 relative overflow-hidden bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-24">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Simple Workflow</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">The Path to Success</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Experience a streamlined collaboration process designed for elite speed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Discover Talent",
                  desc: "Browse a curated list of verified creators across every niche imaginable.",
                  icon: <Search className="w-6 h-6" />,
                  color: "bg-blue-500"
                },
                {
                  title: "Instant Booking",
                  desc: "Check real-time availability and lock in your campaign with one click.",
                  icon: <Calendar className="w-6 h-6" />,
                  color: "bg-emerald-500"
                },
                {
                  title: "Secure Delivery",
                  desc: "Funds are released only when you're 100% satisfied with the results.",
                  icon: <CreditCard className="w-6 h-6" />,
                  color: "bg-indigo-500"
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group"
                >
                  <div className="absolute top-10 right-10 text-6xl font-black text-slate-200/50 group-hover:text-emerald-500/10 transition-colors">0{i + 1}</div>
                  <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-white shadow-lg ${step.color}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-24 sm:py-32 bg-slate-50 relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-24">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Cutting Edge</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Noillin Edge</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Live Booking", desc: "Real-time creator calendars integrated directly into the platform.", icon: <Calendar className="w-5 h-5" /> },
                { title: "Escrow Security", desc: "Your capital is safe in our automated escrow system until delivery.", icon: <ShieldCheck className="w-5 h-5" /> },
                { title: "Unified Messaging", desc: "No more Discord or Telegram leaks. Keep everything professional.", icon: <MessageCircle className="w-5 h-5" /> },
                { title: "Smart Contracts", desc: "Automated agreements that protect both brand and creator.", icon: <Star className="w-5 h-5" /> },
                { title: "Mass Outreach", desc: "Invite 50+ influencers to your campaign with a single click.", icon: <Users className="w-5 h-5" /> },
                { title: "Instant Payouts", desc: "Creators get paid the moment work is approved. Zero friction.", icon: <Zap className="w-5 h-5" /> },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 bg-white border border-slate-200/60 rounded-[2.5rem] hover:border-emerald-500/30 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.15)] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand vs Creator */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Brand Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-[100px] transition-all group-hover:bg-emerald-500/20" />
            <h2 className="text-4xl font-black text-white mb-8 leading-tight">Scale Your<br /><span className="text-emerald-500">Brand Reach</span></h2>
            <ul className="space-y-6 mb-14">
              {[
                "Advanced creator discovery engine",
                "Automated campaign management",
                "Full escrow budget protection"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-400 font-medium text-sm">
                  <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 font-bold" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="h-16 w-full text-base font-bold bg-white text-slate-900 border-none hover:bg-slate-100 rounded-2xl shadow-xl transition-all">
              Launch Brand Campaign
            </Button>
          </motion.div>

          {/* Creator Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-100 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-[100px] transition-all group-hover:bg-emerald-500/10" />
            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">Monetize Your<br /><span className="text-emerald-600">Influence</span></h2>
            <ul className="space-y-6 mb-14">
              {[
                "Professional gig creation suite",
                "Smart availability management",
                "Instant, verified payouts"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                  <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 font-bold" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="h-16 w-full text-base font-bold bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-2xl shadow-xl shadow-emerald-500/20 transition-all">
              Become a Noillin Creator
            </Button>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-24">
              <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Success Stories</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Community Voice</h2>
            </div>
            <TestimonialSlider testimonials={[
              { name: "Alex Rivera", role: "TECHFLOW DIRECTOR", img: "11", text: "Noillin streamlined our influencer outreach. We found the perfect micro-influencers within hours." },
              { name: "Sarah Jenkins", role: "LIFESTYLE CREATOR", img: "5", text: "Finally, a platform that treats creators as professionals. The calendar sync gives me peace of mind." },
              { name: "Michael Chen", role: "BLOOMSKINCARE FOUNDER", img: "8", text: "The group collaboration feature is a game changer. We coordinated 10 influencers in one afternoon." }
            ]} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-[1440px] mx-auto h-auto sm:h-[550px] bg-slate-900 rounded-[2.5rem] sm:rounded-[4.5rem] relative overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:px-8 group border border-slate-800 shadow-2xl py-20 sm:py-0">
            {/* High-End Background Effects */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 leading-[1.1] tracking-tighter">
                Ready to Join the <br/><span className="text-emerald-500">Future Economy?</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg md:text-xl font-medium mb-10 sm:mb-12 max-w-xl mx-auto leading-relaxed">
                Unlock elite partnerships and scale your presence with the world's most advanced influencer infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <Button className="h-16 px-10 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all border-none">
                    Start Collaborating
                  </Button>
                </Link>
                <Link href="/signup?role=INFLUENCER">
                  <Button variant="outline" className="h-16 px-10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 rounded-2xl transition-all font-bold text-lg">
                    Register as Creator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
