"use client";

import React, { ChangeEvent, FormEvent } from "react";

import RoleToggle from "./RoleToggle";

interface AuthFormProps {
    type: "login" | "signup";
    role: "ADMIN" | "SUPER_ADMIN";
    setRole: (role: "ADMIN" | "SUPER_ADMIN") => void;
    formData: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    error: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function AuthForm({
    type,
    role,
    setRole,
    formData,
    setFormData,
    loading,
    error,
    onSubmit,
}: AuthFormProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    {type === "login" ? "Admin Login" : "Admin Sign Up"}
                </h1>
                {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
                <RoleToggle role={role} setRole={setRole} />
                <form className="space-y-4" onSubmit={onSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                        />
                    </div>
                    {/* Confirm password for signup */}
                    {type === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword ?? ""}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-50"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                    >
                        {type === "login" ? "Sign In" : "Create Account"}
                        {loading && <span className="ml-2">...</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
