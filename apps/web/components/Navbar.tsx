"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import NoillinIcon from "./NoillinIcon";
import { Button } from "./ui/button";

import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{ fullName?: string; profileImageUrl?: string } | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (user) {
      api.get("/profile/get_profile")
        .then((res) => setProfile(res.data.data))
        .catch(() => { });
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      clearAuth();
      router.push("/login");
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gigs", href: "/gig-list" },
    { name: "About", href: "#" },
    { name: "Support", href: "#" }
  ];

  const displayName = profile?.fullName || user?.fullName || user?.email?.split("@")[0] || "User";
  const profileImage = profile?.profileImageUrl || user?.profileImageUrl || user?.profileImage;
  const dashboardPath = user?.role === "INFLUENCER" ? "/influencer-dashboard" : "/brand-dashboard";

  return (
    <motion.nav
      layout
      initial={false}
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[95%] max-w-[1400px] z-50 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-500 ${isMenuOpen ? "rounded-[32px] overflow-hidden" : "rounded-full overflow-visible"
        } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"}`}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      <div className="mx-auto px-4 sm:px-8 h-[72px] sm:h-[84px] flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <NoillinIcon />
        </motion.div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          {navLinks.map((item) => {
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
          className="flex items-center gap-2 sm:gap-4"
        >
          {!user ? (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] hover:text-slate-900 hover:bg-slate-50 transition-all px-6">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.15em] px-8 py-6 rounded-full shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 group p-1 pr-3 sm:pr-4 rounded-full hover:bg-slate-50 transition-all border border-slate-100 bg-white/50 backdrop-blur-sm"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm overflow-hidden shrink-0">
                  {profileImage ? (
                    <Image src={profileImage} alt={displayName} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm">{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-left hidden xs:block">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate max-w-[80px] sm:max-w-[120px]">{displayName}</p>
                  <p className="text-[8px] sm:text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    {user.role === "INFLUENCER" ? "Influencer" : "Brand"}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-100 py-3 z-[100] origin-top-right overflow-hidden"
                  >
                    <div className="px-6 py-5 border-b border-slate-50 mb-2 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Account</p>
                      <p className="text-sm text-slate-900 font-bold truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                        {user.role} Account
                      </p>
                    </div>

                    <div className="px-2 space-y-1">
                      <Link
                        href={dashboardPath}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        Dashboard
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        Settings
                      </Link>

                      <div className="h-px bg-slate-50 mx-4 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                          <LogOut className="w-4 h-4" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-slate-100 rounded-b-[2rem] px-6"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-6 py-8"
            >
              {navLinks.map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -10 }
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-slate-100" />
              {!user ? (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-bold text-slate-900">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-bold text-slate-900"
                  >
                    <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-lg font-bold text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
