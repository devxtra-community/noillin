"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, Lock, EyeOff } from "lucide-react";
import NextImage from "next/image";

interface SecureMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    type: "image" | "video";
}

export function SecureMediaModal({ isOpen, onClose, url, type }: SecureMediaModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === "visible");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") { onClose(); return; }
            // Instantly hide content when PrintScreen or Mac screenshot keys pressed
            if (
                e.key === "PrintScreen" ||
                (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5"))
            ) {
                setIsVisible(false);
                setTimeout(() => setIsVisible(true), 2000);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("keydown", handleKeyDown);

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300 print:hidden">
            {/* Hide on print/screenshot attempt */}
            <style>{`@media print { body * { visibility: hidden !important; } }`}</style>

            {/* Top Bar */}
            <div className="w-full flex-shrink-0 h-20 px-8 flex items-center justify-between z-[100]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-tight">Secure Review Mode</h3>
                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Protected Deliverable</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
                >
                    <X className="w-6 h-6 text-white transition-transform group-hover:rotate-90" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="relative flex-1 w-full flex items-center justify-center px-6 pb-28 overflow-hidden">
                {!isVisible && (
                    <div className="absolute inset-0 z-[110] backdrop-blur-3xl bg-slate-950/90 flex flex-col items-center justify-center text-white gap-6 text-center px-6">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 animate-pulse">
                            <EyeOff className="w-10 h-10 text-rose-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Viewing Paused</h2>
                            <p className="text-slate-400 font-medium max-w-xs">Deliverable is hidden when focus is lost or unauthorized access is detected.</p>
                        </div>
                        <button
                            onClick={() => setIsVisible(true)}
                            className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Resume Preview
                        </button>
                    </div>
                )}

                {/* Repeating Watermark */}
                <div className="absolute inset-0 z-[105] pointer-events-none select-none opacity-[0.04] flex flex-wrap gap-x-24 gap-y-32 items-center justify-center overflow-hidden">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="text-6xl font-black text-white rotate-[-25deg] whitespace-nowrap uppercase tracking-tighter">
                            SECURE PREVIEW • DO NOT COPY
                        </div>
                    ))}
                </div>

                {/* Media Container — needs explicit dimensions so Next.js Image fill works */}
                <div
                    ref={containerRef}
                    className={`relative w-full h-full max-h-[75vh] transition-all duration-700 shadow-2xl rounded-sm overflow-hidden ${!isVisible ? 'scale-95 blur-2xl opacity-0' : 'scale-100 opacity-100'}`}
                >
                    {/* Transparent blocker to prevent right-click on media */}
                    <div className="absolute inset-0 z-[108] select-none cursor-default" onContextMenu={(e) => e.preventDefault()} />

                    {type === "image" ? (
                        <NextImage
                            src={url}
                            alt="Secure Preview"
                            fill
                            className="object-contain select-none"
                            onDragStart={(e: React.DragEvent) => e.preventDefault()}
                            unoptimized
                        />
                    ) : (
                        <video
                            src={url}
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            className="w-full h-full object-contain"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4 z-[100]">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-widest opacity-80">Encryption Active &amp; Watermarked</span>
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Noillin Secure Deliverable System</p>
            </div>
        </div>
    );
}
