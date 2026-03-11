"use client";

import React from "react";

interface RoleToggleProps {
    role: "ADMIN" | "SUPER_ADMIN";
    setRole: (role: "ADMIN" | "SUPER_ADMIN") => void;
}

export default function RoleToggle({ role, setRole }: RoleToggleProps) {
    return (
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`w-1/2 py-2 text-sm font-medium rounded-sm transition ${role === "ADMIN"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500"
                    }`}
            >
                Admin
            </button>
            <button
                type="button"
                onClick={() => setRole("SUPER_ADMIN")}
                className={`w-1/2 py-2 text-sm font-medium rounded-sm transition ${role === "SUPER_ADMIN"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500"
                    }`}
            >
                Super Admin
            </button>
        </div>
    );
}
