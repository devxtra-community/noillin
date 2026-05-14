"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    MessageSquare,
    Calendar,
    ArrowLeftRight,
    X
} from "lucide-react";

import RoleGuard from "@/components/rbac/RoleGuard";
import DashboardHeader from "@/components/DashboardHeader";
import { useDashboardStore } from "@/store/dashboard.store";

export default function BrandDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { counts, fetchCounts } = useDashboardStore();

    useEffect(() => {
        fetchCounts();
        // Set up interval to refresh counts every minute
        const interval = setInterval(fetchCounts, 60000);
        return () => clearInterval(interval);
    }, [fetchCounts]);

    const navItems = [
        { name: "Overview", href: "/brand-dashboard", icon: LayoutDashboard },
        { name: "Requests", href: "/brand-dashboard/requests", icon: Users, badge: counts.pendingRequestsCount > 0 ? counts.pendingRequestsCount.toString() : undefined },
        { name: "Bookings", href: "/brand-dashboard/bookings", icon: Briefcase },
        { name: "Messages", href: "/brand-dashboard/messages", icon: MessageSquare, badge: counts.unreadMessagesCount > 0 ? counts.unreadMessagesCount.toString() : undefined, badgeColor: "bg-rose-500 text-white shadow-lg shadow-rose-200" },
        { name: "Calendar", href: "/brand-dashboard/calendar", icon: Calendar },
        { name: "Transactions", href: "/brand-dashboard/transactions", icon: ArrowLeftRight },
    ];

    return (
        <RoleGuard allowedRoles={["BRAND"]}>
            <div className="flex h-[100dvh] bg-[#F8FAFC] overflow-hidden font-sans">

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col py-6 shrink-0 transition-transform duration-300 ease-in-out z-50 shadow-2xl lg:shadow-none lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex items-center justify-between px-8 mb-10">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-emerald-50 border border-emerald-100 group-hover:shadow-md group-hover:shadow-emerald-100 transition-all">
                                <Image src="/favicon.ico" alt="Noillin" width={22} height={22} className="object-contain" />
                            </div>
                            <span className="font-black text-slate-900 text-xl tracking-tight">Noillin</span>
                        </div>
                        <button className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-8 mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Menu</p>
                    </div>

                    <nav className="flex flex-col gap-1.5 flex-1 px-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group overflow-hidden ${isActive ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/10 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    )}
                                    <div className="flex items-center gap-3.5 relative z-10">
                                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-500"} transition-colors`} />
                                        <span className={`text-[14px] ${isActive ? "font-bold" : "font-semibold"}`}>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`relative z-10 ${item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-600")} text-[10px] font-black px-2.5 py-0.5 rounded-full`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                </aside>

                {/* Main Header & Content Area */}
                <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-slate-50/50">
                    {/* Dashboard Header */}
                    <DashboardHeader
                        isFixed={false}
                        showSidebarToggle={true}
                        hideLogo={true}
                        onSidebarToggle={() => setIsSidebarOpen(true)}
                    >
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link
                                href="/gig-list"
                                className="hidden md:flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
                            >
                                Explore Gigs
                            </Link>
                        </div>
                    </DashboardHeader>

                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 overflow-y-auto">
                            <div className="min-h-full pb-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </RoleGuard>
    );
}
