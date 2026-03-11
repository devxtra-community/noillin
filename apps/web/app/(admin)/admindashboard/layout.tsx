"use client";

import React, { useState } from "react";
import { Menu, Search, Bell, Download, Plus } from "lucide-react";

import { AdminGuard } from "@/components/rbac/Guards";
import Sidebar from "@/components/admindashboard/Sidebar";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#fcfcfd] flex">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main Content */}
                <main className="flex-1 lg:ml-[260px] min-w-0">
                    {/* Topbar */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={20} />
                            </button>
                            <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-w-[300px]">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl relative transition-all">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block" />
                            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                                <Download size={18} />
                                <span className="hidden md:inline">Export Report</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all">
                                <Plus size={18} />
                                <span className="hidden md:inline">New Announcement</span>
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
