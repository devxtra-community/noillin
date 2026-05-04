"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface BackButtonProps {
    label?: string;
    href?: string;
    className?: string;
}

export function BackButton({
    label = "Back to Dashboard",
    href,
    className
}: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 group",
                className
            )}
        >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{label}</span>
        </button>
    );
}
