"use client";

import React, { useState } from "react";
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
import NotificationBell from "@/components/NotificationBell";
import DashboardHeader from "@/components/DashboardHeader";

export default function BrandDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">

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
                                <Image src="/favicon.ico" alt="Noillin" width={20} height={20} className="object-contain" />
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
                    {/* Dashboard Header */}
                    <DashboardHeader
                        isFixed={false}
                        showSidebarToggle={true}
                        hideLogo={true}
                        onSidebarToggle={() => setIsSidebarOpen(true)}
                    >
                        <div className="flex items-center gap-6">
                            <Link
                                href="/gig-list"
                                className="hidden md:flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                            >
                                Explore gigs
                            </Link>
                            <NotificationBell />
                        </div>
                    </DashboardHeader>

                    <div className="flex-1 w-full overflow-y-auto pb-10">
                        {children}
                    </div>
                </main>

            </div>
        </RoleGuard>
    );
}
