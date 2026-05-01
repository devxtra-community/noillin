"use client";

import React, { useState, useEffect, useRef } from "react";
import { EyeOff, ShieldCheck, Lock, Maximize2 } from "lucide-react";
import NextImage from "next/image";

import { SecureMediaModal } from "./SecureMediaModal";

interface SecureMediaPreviewProps {
    url: string;
    type?: "image" | "video";
}

export function SecureMediaPreview({ url, type = "image" }: SecureMediaPreviewProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Basic protection: Disable right click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Deter print screen / blur when focus lost
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("contextmenu", handleContextMenu);
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (container) {
                container.removeEventListener("contextmenu", handleContextMenu);
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <>
            <div
                ref={containerRef}
                onClick={() => setIsModalOpen(true)}
                className="relative group w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 cursor-zoom-in"
            >
                {!isVisible && (
                    <div className="absolute inset-0 z-50 backdrop-blur-3xl bg-slate-900/80 flex flex-col items-center justify-center text-white gap-4">
                        <EyeOff className="w-12 h-12 text-slate-500 animate-pulse" />
                        <p className="text-sm font-bold tracking-tight opacity-60">Preview paused for security</p>
                    </div>
                )}

                {/* Hover UI */}
                <div className="absolute inset-0 z-40 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3 scale-95 group-hover:scale-100 transition-all duration-300">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
                            <Maximize2 className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white text-xs font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-full border border-white/10">View Full Screen</span>
                    </div>
                </div>

                {/* Overlay to block direct interaction */}
                <div className="absolute inset-0 z-10 select-none pointer-events-none" />

                {/* Dynamic Watermark */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap gap-12 items-center justify-center opacity-[0.03]">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="text-4xl font-black rotate-[-30deg] uppercase tracking-tighter">
                            PREVIEW ONLY
                        </span>
                    ))}
                </div>

                <div className={`w-full h-full transition-all duration-700 ${!isVisible ? 'scale-105 blur-lg opacity-20' : 'opacity-100'}`}>
                    {type === "image" ? (
                        <NextImage
                            src={url}
                            alt="Secure Deliverable"
                            fill
                            className="object-contain pointer-events-none"
                            onDragStart={(e: React.DragEvent) => e.preventDefault()}
                            unoptimized
                        />
                    ) : (
                        <video
                            src={url}
                            controlsList="nodownload"
                            className="w-full h-full object-contain"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                {/* Bottom Security Badge */}
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">Protected Preview</span>
                </div>

                <div className="absolute top-4 right-4 z-30">
                    <div className="p-2 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 group-hover:bg-white/10 transition-all cursor-help" title="Downloads disabled during review phase">
                        <Lock className="w-4 h-4 text-white/40" />
                    </div>
                </div>
            </div>

            <SecureMediaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                url={url}
                type={type}
            />
        </>
    );
}
