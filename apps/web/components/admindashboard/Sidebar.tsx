"use client";
import React from "react";
import {
    LayoutDashboard,
    UserCheck,
    Briefcase,
    BookOpen,
    AlertCircle,
    Settings,
    X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admindashboard", roles: ["ADMIN", "SUPER_ADMIN"] },
    { icon: UserCheck, label: "User Verification", href: "/admindashboard/user-verification", badge: "12", roles: ["ADMIN", "SUPER_ADMIN"] },
    { icon: Briefcase, label: "Gigs Moderation", href: "/admindashboard/gig-moderation", roles: ["ADMIN", "SUPER_ADMIN"] },
    { icon: BookOpen, label: "Bookings & Payments", href: "/admindashboard/bookings-audit", roles: ["ADMIN", "SUPER_ADMIN"] },
    { icon: AlertCircle, label: "Disputes & Reports", href: "/admindashboard/disputes-reports", badge: 2, roles: ["ADMIN", "SUPER_ADMIN"] },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const filteredItems = menuItems.filter(item => {
        if (item.roles.includes("ADMIN")) return true;
        if (item.roles.includes("SUPER_ADMIN")) return user?.adminLevel === "SUPER";
        return false;
    });

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out flex flex-col w-[260px]",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo Section */}
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        N
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Noillin</span>
                    <button className="lg:hidden ml-auto text-gray-400" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {filteredItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-emerald-50/80 text-emerald-600 font-semibold shadow-sm shadow-emerald-100/50"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-900")} />
                                <span className="text-sm">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 mt-auto border-t border-gray-50 space-y-2">
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                        <Settings size={20} className="text-gray-400" />
                        <span className="text-sm">Settings</span>
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/50 mt-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
                            <Image unoptimized width={100} height={100} src={`https://ui-avatars.com/api/?name=${user?.email || "Admin"}&background=random`} alt="Admin" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-900 leading-tight truncate">{user?.email?.split('@')[0] || "Admin"}</span>
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                                {user?.adminLevel === "SUPER" ? "Super Admin" : "Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
