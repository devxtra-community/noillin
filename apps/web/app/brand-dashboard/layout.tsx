"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    MessageSquare,
    Calendar,
    ArrowLeftRight,
    LogOut,
    Menu,
    X
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import RoleGuard from "@/components/rbac/RoleGuard";
import api from "@/lib/axios.client";

export default function BrandDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, clearAuth } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
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

    const navItems = [
        { name: "Overview", href: "/brand-dashboard", icon: LayoutDashboard },
        { name: "Requests", href: "/brand-dashboard/requests", icon: Users, badge: "12" },
        { name: "Bookings", href: "/brand-dashboard/bookings", icon: Briefcase },
        { name: "Messages", href: "/brand-dashboard/messages", icon: MessageSquare, badge: "3", badgeColor: "bg-rose-100 text-rose-600" },
        { name: "Calendar", href: "/brand-dashboard/calendar", icon: Calendar },
        { name: "Transactions", href: "/brand-dashboard/transactions", icon: ArrowLeftRight },
    ];

    return (
        <RoleGuard allowedRoles={["BRAND"]}>
            <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col py-6 shrink-0 transition-transform duration-300 z-50 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex items-center justify-between px-6 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200">
                                <img src="/favicon.ico" alt="Noillin" className="w-5 h-5 object-contain" />
                            </div>
                            <span className="font-bold text-gray-900 text-lg tracking-tight">Noillin</span>
                        </div>
                        <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1 flex-1 px-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-emerald-50 text-emerald-600 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`${item.badgeColor || "bg-emerald-100 text-emerald-600"} text-xs font-bold px-2 py-0.5 rounded-full`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Header & Content Area */}
                <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                    {/* Top Navbar */}
                    <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 lg:py-4 flex items-center justify-between shrink-0 z-30">
                        <button
                            className="lg:hidden text-gray-500 hover:text-gray-900"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-6 ml-auto">
                            {/* Explore Gigs Button - No icon as requested */}
                            <Link
                                href="/gig-list"
                                className="hidden md:flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                            >
                                Explore gigs
                            </Link>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowLogoutModal(!showLogoutModal)}
                                    className="flex items-center gap-3 group focus:outline-none"
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-gray-900">Brand Name</p>
                                        <p className="text-xs text-gray-500 font-medium">Brand User</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm group-hover:shadow-md transition-all">
                                        {user?.email?.charAt(0).toUpperCase() || "B"}
                                    </div>
                                </button>

                                {/* Logout Dropdown Modal */}
                                {showLogoutModal && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-sm text-gray-900 font-bold truncate">{user?.email}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Brand Dashboard</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 w-full overflow-y-auto pb-10">
                        {children}
                    </div>
                </main>

            </div>
        </RoleGuard>
    );
}
