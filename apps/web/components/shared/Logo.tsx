"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
    className?: string;
    iconSize?: string;
    textSize?: string;
    hideTextOnMobile?: boolean;
}

export default function Logo({
    className = "",
    iconSize = "w-8 h-8",
    textSize = "text-2xl",
    hideTextOnMobile = false
}: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2 group cursor-pointer ${className}`}>
            <div className={`${iconSize} text-emerald-500 flex-shrink-0`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>
            <span className={`${textSize} font-bold text-gray-900 tracking-tight transition-colors group-hover:text-black ${hideTextOnMobile ? "hidden sm:block" : ""}`}>
                Noillin
            </span>
        </Link>
    );
}
