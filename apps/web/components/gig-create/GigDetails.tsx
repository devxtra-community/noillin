"use client";

import { useState } from "react";
import { FaInstagram, FaYoutube, FaTiktok, FaUser, FaUsers } from "react-icons/fa";

import api from "@/lib/axios.client";
import { useGigCreateStore } from "@/store/gigCreate.store";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SelectButton } from "@/components/ui/SelectButton";


interface GigDetailsProps {
    onNext: () => void;
}

type GigDetailsForm = {
    title: string;
    shortDescription: string;
    platform: string;
    gigType: string;
    category: string;
    tags: string[];
};

export function GigDetails({ onNext }: GigDetailsProps) {
    const { setGigId, setDetails, details } = useGigCreateStore();

    const [form, setForm] = useState<GigDetailsForm>({
        title: details.title || "",
        shortDescription: details.shortDescription || "",
        platform: details.platform || "instagram",
        gigType: details.gigType || "solo",
        category: details.category || "",
        tags: details.tags || []
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = <K extends keyof GigDetailsForm>(
        key: K,
        value: GigDetailsForm[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await api.post("gigs/create_gig", form);

            const gigId = response.data.data._id;

            setGigId(gigId);
            setDetails(form);

            onNext();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-8 sm:p-10 space-y-8">
            {/* Section: Basic Info */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Gig Basics</h2>

                <div className="grid gap-6">
                    <Input
                        label="Gig Title"
                        placeholder="e.g., Authentic Instagram Reel for Lifestyle Brands"
                        helperText="Keep it catchy and descriptive (Max 80 chars)"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="text-lg"
                    />

                    <Textarea
                        label="Short Description"
                        value={form.shortDescription}
                        onChange={(e) => handleChange("shortDescription", e.target.value)}
                        placeholder="Describe what you will deliver..."
                        className="min-h-30"
                    />
                </div>
            </div>

            {/* Section: Platform & Category */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Platform & Category</h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Platform</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectButton
                            label="Instagram"
                            icon={<FaInstagram className="w-5 h-5" />}
                            selected={form.platform === 'instagram'}
                            onClick={() => handleChange("platform", "instagram")}
                        />
                        <SelectButton
                            label="YouTube"
                            icon={<FaYoutube className="w-5 h-5" />}
                            selected={form.platform === 'youtube'}
                            onClick={() => handleChange("platform", 'youtube')}
                        />
                        <SelectButton
                            label="TikTok"
                            icon={<FaTiktok className="w-5 h-5" />}
                            selected={form.platform === 'tiktok'}
                            onClick={() => handleChange("platform", 'tiktok')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category / Niche</label>
                        <select className="w-full h-12 rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-shadow appearance-none cursor-pointer"
                            value={form.category}
                            onChange={(e) => handleChange("category", e.target.value)}>

                            <option value="">Select a Category</option>
                            <option value="fashion">Fashion & Style</option>
                            <option value="tech">Tech & Gadgets</option>
                            <option value="lifestyle">Lifestyle & Vlog</option>
                            <option value="beauty">Beauty & Cosmetics</option>
                            <option value="food">Food & Beverage</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gig Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectButton
                                label="solo Creator"
                                icon={<FaUser className="w-4 h-4" />}
                                selected={form.gigType === 'solo'}
                                onClick={() => handleChange("gigType", 'solo')}
                                className="justify-center"
                            />
                            <SelectButton
                                label="Group / Collab"
                                icon={<FaUsers className="w-4 h-4" />}
                                selected={form.gigType === 'group'}
                                onClick={() => handleChange("gigType", 'group')}
                                className="justify-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                <button type="button" className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors">
                    {/* Placeholder for Back button alignment if needed, or empty */}
                </button>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => console.log("Save as draft clicked")}
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
                            "Continue to Deliverables"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
