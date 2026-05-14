"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Menu, ArrowLeft } from "lucide-react";

import NoillinIcon from "./NoillinIcon";
import NotificationBell from "./NotificationBell";

import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";

interface DashboardHeaderProps {
    showSidebarToggle?: boolean;
    onSidebarToggle?: () => void;
    isFixed?: boolean;
    hideLogo?: boolean;
    showBackButton?: boolean;
    backHref?: string;
    children?: React.ReactNode;
    isPill?: boolean;
}

export default function DashboardHeader({
    showSidebarToggle = false,
    onSidebarToggle,
    isFixed = true,
    hideLogo = false,
    showBackButton = false,
    backHref = "/influencer-dashboard",
    children,
    isPill = false
}: DashboardHeaderProps) {
    const router = useRouter();
    const { user, clearAuth } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profile, setProfile] = useState<{ fullName?: string; profileImageUrl?: string } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Fetch real profile data
    useEffect(() => {
        setIsLoadingProfile(true);
        api.get("/profile/get_profile")
            .then((res) => setProfile(res.data.data))
            .catch(() => { })
            .finally(() => setIsLoadingProfile(false));
    }, []);

    const rawDisplayName = profile?.fullName || user?.fullName || user?.email?.split("@")[0] || "User";
    const displayName = rawDisplayName.trim() || "User";
    const profileImage = (profile?.profileImageUrl || user?.profileImageUrl || user?.profileImage || "").trim() || null;

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowLogoutModal(false);
            }
        }
        if (showLogoutModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLogoutModal]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            clearAuth();
            router.push("/login");
        }
    };

    const headerBaseStyles = isFixed ? 'fixed top-0 left-0 right-0' : 'relative';
    const pillStyles = isPill ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full shadow-2xl border border-gray-100 px-6 sm:px-10' : 'w-full border-b border-gray-100 px-4 sm:px-8';

    return (
        <header className={`${isFixed ? (isPill ? 'fixed top-4 left-1/2 -translate-x-1/2' : 'fixed top-0 left-0 right-0') : 'relative'} ${isPill ? 'w-[95%] max-w-7xl rounded-full shadow-2xl border border-gray-100 px-6 sm:px-10' : 'w-full border-b border-gray-100 px-4 sm:px-8'} bg-white h-16 flex items-center justify-between z-50 transition-all duration-300`}>
            <div className="flex items-center gap-4">
                {showSidebarToggle && (
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-900 p-2"
                        onClick={onSidebarToggle}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                {showBackButton && !hideLogo && (
                     <Link
                        href={backHref}
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group mr-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                    </Link>
                )}
                {!hideLogo && (
                    <div className="flex items-center">
                        <NoillinIcon />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                {children}

                {user && (
                    <NotificationBell />
                )}

                {!user ? (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-semibold transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowLogoutModal(!showLogoutModal)}
                            className="flex items-center gap-3 group focus:outline-none"
                        >
                            <div className="text-right hidden sm:block min-w-[80px]">
                                {isLoadingProfile ? (
                                    <div className="space-y-1">
                                        <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                                        <div className="h-3 w-16 bg-gray-50 animate-pulse rounded ml-auto"></div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{displayName}</p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {user?.role === "INFLUENCER" ? "Active Member" : "Brand User"}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm group-hover:shadow-md transition-all overflow-hidden relative text-sm">
                                {isLoadingProfile ? (
                                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                                ) : profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={displayName}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            const parent = (e.target as HTMLImageElement).parentElement;
                                            if (parent) {
                                                parent.innerText = displayName.charAt(0).toUpperCase();
                                            }
                                        }}
                                    />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>
                        </button>

                        {showLogoutModal && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{user?.email}</p>
                                </div>


                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
