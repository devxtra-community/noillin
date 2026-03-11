"use client";

import RoleGuard from "./RoleGuard";

export const AdminGuard = ({ children, level }: { children: React.ReactNode; level?: "SUPER" | "NORMAL" }) => (
    <RoleGuard allowedRoles={["ADMIN"]} adminLevel={level}>
        {children}
    </RoleGuard>
);

export const BrandGuard = ({ children }: { children: React.ReactNode }) => (
    <RoleGuard allowedRoles={["BRAND"]} redirectTo="/login">
        {children}
    </RoleGuard>
);


export const InfluencerGuard = ({ children }: { children: React.ReactNode }) => (
    <RoleGuard allowedRoles={["INFLUENCER"]} redirectTo="/login">
        {children}
    </RoleGuard>
);
