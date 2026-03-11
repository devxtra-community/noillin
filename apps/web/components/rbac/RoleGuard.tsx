"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ("ADMIN" | "BRAND" | "INFLUENCER")[];
    adminLevel?: "SUPER" | "NORMAL";
    redirectTo?: string;
}

export default function RoleGuard({
    children,
    allowedRoles,
    adminLevel,
    redirectTo,
}: RoleGuardProps) {
    const router = useRouter();
    const { user, accessToken } = useAuthStore();

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!accessToken) {
            const loginPath = allowedRoles.includes("ADMIN") ? "/adminAuth/login" : "/login";
            router.push(loginPath);
            return;
        }

        // If authenticated but role not allowed
        if (user && !allowedRoles.includes(user.role)) {
            router.push(redirectTo || "/home");
            return;
        }

        // Specific Admin Level check if required
        if (user?.role === "ADMIN" && adminLevel && user.adminLevel !== adminLevel) {
            // If they are NORMAL admin but SUPER is required, just show restricted or redirect
            if (adminLevel === "SUPER" && user.adminLevel === "NORMAL") {
                router.push("/admindashboard"); // Redirect to main dashboard if they lack super powers
                return;
            }
        }
    }, [accessToken, user, allowedRoles, adminLevel, router, redirectTo]);

    if (!accessToken || !user || !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
                    <p className="text-gray-500 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Additional check for Admin Level before rendering
    if (user.role === "ADMIN" && adminLevel && user.adminLevel !== adminLevel) {
        return null; // Will handle in useEffect redirect
    }

    return <>{children}</>;
}
