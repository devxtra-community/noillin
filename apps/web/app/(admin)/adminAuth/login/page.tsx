"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import AuthForm from "@/components/adminAuth/AuthForm";

export default function AdminLoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/auth/login", formData);
            const { accessToken, user } = response.data.data;

            if (accessToken) {
                // 1. Role Check: Must be ADMIN
                if (user.role !== "ADMIN") {
                    setError("Access denied: You do not have admin privileges.");
                    return;
                }

                // 2. Admin Level Check: If SUPER_ADMIN selected, verify it
                if (role === "SUPER_ADMIN" && user.adminLevel !== "SUPER") {
                    setError("Access denied: You do not have super admin privileges.");
                    return;
                }

                setAuth(accessToken, user);
                router.push("/admindashboard");
            } else {
                setError("Login failed: No access token returned.");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Login failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            type="login"
            role={role}
            setRole={setRole}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}
