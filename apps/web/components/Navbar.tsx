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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[95%] max-w-[1400px] z-50 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out overflow-hidden ${
        isMenuOpen ? "rounded-[2rem] h-auto" : "rounded-full h-[72px] sm:h-[84px]"
      }`}
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
                <Button variant="ghost" className="text-slate-600 text-xs font-bold hover:text-emerald-600 hover:bg-emerald-50 transition-all px-4">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-6 sm:px-8 py-5 sm:py-6 shadow-lg shadow-emerald-200 rounded-full">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group px-2 py-1 sm:py-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm overflow-hidden shrink-0">
                  {profileImage ? (
                    <Image src={profileImage} alt={displayName} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">{displayName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-3 z-50 origin-top-right"
                  >
                    <div className="px-5 py-4 border-b border-slate-50 mb-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm text-slate-900 font-bold truncate">{user.email}</p>
                    </div>

                    <Link
                      href={dashboardPath}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
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
            <div className="flex flex-col gap-6 py-8">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  {item.name}
                </Link>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
