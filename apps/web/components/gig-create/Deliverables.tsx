"use client";

import React, { useState } from "react";
import { FaImage, FaVideo, FaFileAlt } from "react-icons/fa";

import api from "@/lib/axios.client";
import { useGigCreateStore } from "@/store/gigCreate.store";
import { Input } from "@/components/ui/Input";
import { SelectButton } from "@/components/ui/SelectButton";

interface DeliverablesProps {
    onBack: () => void;
    onNext: () => void;
}

export function Deliverables({ onBack, onNext }: DeliverablesProps) {
    const { gigId, setDeliverables, deliverables } = useGigCreateStore();

    const initialDeliverable = deliverables[0] || {};
    const [contentType, setcontentType] = useState<
  "video" | "image" | "text"
>(
  (initialDeliverable.contentType as
    | "video"
    | "image"
    | "text") || "video"
);
    const [quantity, setQuantity] = useState<number>(initialDeliverable.quantity || 1);
    const [specification, setSpecification] = useState<string>(initialDeliverable.includedItems?.[0] || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!gigId || isLoading) {
            if (!gigId) console.error("Gig ID missing");
            return;
        }

        setIsLoading(true);
        const deliverablesPayload = [
            {
                contentType,
                quantity,
                includedItems: specification ? [specification] : []
            }
        ];

        try {
            await api.patch(
                `/gigs/${gigId}/deliverables`,
                deliverablesPayload
            );

            setDeliverables(deliverablesPayload);
            onNext();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-8 sm:p-10 space-y-8">
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">What will you deliver?</h2>
                <p className="text-sm text-gray-500">Define the specifics of your content deliverables.</p>

                {/* Deliverable Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Content Format</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectButton
                            label="Video"
                            icon={<FaVideo className="w-5 h-5" />}
                            selected={contentType === 'video'}
                            onClick={() => setcontentType('video')}
                        />
                        <SelectButton
                            label="Image / Photo"
                            icon={<FaImage className="w-5 h-5" />}
                            selected={contentType === 'image'}
                            onClick={() => setcontentType('image')}
                        />
                        <SelectButton
                            label="Story / Text"
                            icon={<FaFileAlt className="w-5 h-5" />}
                            selected={contentType === 'text'}
                            onClick={() => setcontentType('text')}
                        />
                    </div>
                </div>

                {/* Quantity & Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="1"
                        helperText="How many posts/stories?"
                    />
                    <Input
                        label="Duration / Size"
                        value={specification}
                        onChange={(e) => setSpecification(e.target.value)}
                        placeholder="e.g. 60 seconds, 1080x1350"
                        helperText="Specific requirements"
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                    ← Back to Details
                </button>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => console.log("Save draft")}
                        className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Continue to Pricing"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
