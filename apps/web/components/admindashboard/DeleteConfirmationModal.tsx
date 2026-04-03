"use client";
import React, { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Remove Gig Listing?",
    description = "Are you sure you want to remove? This action cannot be undone and the influencer will be notified",
}: DeleteConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [animate, setAnimate] = useState(false);

    // Synchronize isVisible with isOpen state when it becomes true so it renders immediately
    if (isOpen && !isVisible) {
        setIsVisible(true);
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            timer = setTimeout(() => setAnimate(true), 10);
        } else {
            // Start exit animation and set cascade timeout
            timer = setTimeout(() => {
                setAnimate(false);
                setTimeout(() => setIsVisible(false), 300);
            }, 0);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
                    animate ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden transition-all duration-300 ease-out transform",
                    animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
                )}
            >
                <div className="p-8 sm:p-12 flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
                        <AlertCircle className="text-red-500 w-10 h-10" strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mb-4 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-gray-400 font-medium text-base sm:text-lg leading-relaxed max-w-sm">
                        {description}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-[#111827] font-bold hover:bg-gray-50 transition-all text-base shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-8 py-4 rounded-2xl bg-[#EF4444] text-white font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all text-base"
                    >
                        Yes, Remove Gig
                    </button>
                </div>

                {/* Optional Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
}
