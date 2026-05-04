"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const [profile, setProfile] = useState<{ fullName?: string; profileImageUrl?: string } | null>(null);

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
      window.location.href = "/login";
    }
  };

  const displayName = profile?.fullName || user?.fullName || user?.email?.split("@")[0] || "User";
  const profileImage = profile?.profileImageUrl || user?.profileImageUrl || user?.profileImage;
  const dashboardPath = user?.role === "INFLUENCER" ? "/influencer-dashboard" : "/brand-dashboard";


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Noillin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors hover:text-[#059669] ${isActive("/explore") ? "text-[#059669]" : "text-gray-600"
                }`}
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-[#059669] ${isActive("/how-it-works") ? "text-[#059669]" : "text-gray-600"
                }`}
            >
              How it Works
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-[#059669] ${isActive("/blog") ? "text-[#059669]" : "text-gray-600"
                }`}
            >
              Blog
            </Link>
            <Link
              href="/our-story"
              className={`text-sm font-medium transition-colors hover:text-[#059669] ${isActive("/our-story") ? "text-[#059669]" : "text-gray-600"
                }`}
            >
              Our Story
            </Link>
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-[#059669] px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-white shadow-sm overflow-hidden shrink-0">
                    {profileImage ? (
                      <Image src={profileImage} alt={displayName} width={36} height={36} className="w-full h-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">{displayName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Account</p>
                      <p className="text-sm text-gray-900 font-bold truncate">{user.email}</p>
                    </div>

                    <Link
                      href={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/explore"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/explore")
                ? "bg-green-50 text-[#059669]"
                : "text-gray-700 hover:text-[#059669] hover:bg-gray-50"
                }`}
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/how-it-works")
                ? "bg-green-50 text-[#059669]"
                : "text-gray-700 hover:text-[#059669] hover:bg-gray-50"
                }`}
            >
              How it Works
            </Link>
            <Link
              href="/blog"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/blog")
                ? "bg-green-50 text-[#059669]"
                : "text-gray-700 hover:text-[#059669] hover:bg-gray-50"
                }`}
            >
              Blog
            </Link>
            <Link
              href="/our-story"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/our-story")
                ? "bg-green-50 text-[#059669]"
                : "text-gray-700 hover:text-[#059669] hover:bg-gray-50"
                }`}
            >
              Our Story
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            {!user ? (
              <div className="flex flex-col px-4 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-3 border border-gray-200 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-[#10B981] hover:bg-[#059669]"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="px-4 space-y-3">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-white overflow-hidden shadow-sm">
                    {profileImage ? (
                      <Image src={profileImage} alt={displayName} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href={dashboardPath}
                  className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
