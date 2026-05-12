"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import AuthForm from "@/components/adminAuth/AuthForm";

export default function AdminSignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
    const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                role: "ADMIN",
                adminLevel: role === "SUPER_ADMIN" ? "SUPER" : "NORMAL",
                documents: "" // Required by backend validator
            };
            const response = await api.post("/auth/signup", payload);
            const { accessToken, user } = response.data.data;
            if (accessToken) {
                setAuth(accessToken, user);
                router.push("/admindashboard");
            } else {
                setError("Signup failed: No token returned.");
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            type="signup"
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
