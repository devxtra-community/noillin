"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios.client";
import { uploadToS3 } from "@/lib/s3-uploads";

export default function ProfileSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const user = useAuthStore((state) => state.user);

    const userType = user?.role as "INFLUENCER" | "BRAND" | undefined;

    const [commonData, setCommonData] = useState({
        profilePicture: null as File | null,
        bio: "",
        location: "",
        phoneNumber: "",
    });

    const [influencerData, setInfluencerData] = useState({
        fullName: "",
        username: "",
        niche: "",
        gender: "",
        dob: "",
        instagram: "",
        youtube: "",
        tiktok: "",
    });

    const [brandData, setBrandData] = useState({
        companyName: "",
        industry: "",
        website: "",
        companySize: "",
    });

    useEffect(() => {
        if (!userType) return;

        // If user is PENDING, we don't need to fetch from /profile/get_profile
        // but we should initialize with whatever we have from signup
        if (user?.status === "PENDING") {
            if (userType === "INFLUENCER") {
                setInfluencerData(prev => ({
                    ...prev,
                    fullName: user.fullName || "",
                }));
            } else if (userType === "BRAND") {
                setBrandData(prev => ({
                    ...prev,
                    companyName: user.fullName || "",
                }));
            }
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await api.get("/profile/get_profile");
                const data = res.data.data;

                if (userType === "INFLUENCER") {
                    setInfluencerData({
                        fullName: data.fullName || user?.fullName || "",
                        username: data.username || "",
                        niche: data.categories?.[0] || "",
                        gender: "",
                        dob: "",
                        instagram: data.instagramUrl || "",
                        youtube: data.youtubeUrl || "",
                        tiktok: data.tiktokUrl || "",
                    });

                    setCommonData((prev) => ({
                        ...prev,
                        bio: data.bio || "",
                        location: data.location || "",
                    }));
                }

                if (userType === "BRAND") {
                    setBrandData({
                        companyName: data.companyName || user?.fullName || "",
                        industry: data.industry || "",
                        website: data.website || "",
                        companySize: data.companySize || "",
                    });
                }
            } catch (err) {
                console.error(err);
                // On error, still try to populate with store data
                if (userType === "INFLUENCER") {
                    setInfluencerData(prev => ({ ...prev, fullName: user?.fullName || "" }));
                } else {
                    setBrandData(prev => ({ ...prev, companyName: user?.fullName || "" }));
                }
            }
        };

        fetchProfile();
    }, [userType, user]);

    const handleCommonChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCommonData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCommonData((prev) => ({ ...prev, profilePicture: e.target.files![0] }));
        }
    };

    const handleInfluencerChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setInfluencerData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBrandChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setBrandData((prev) => ({ ...prev, [name]: value }));
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!userType) return;
            
            let profileImageUrl = "";
            if (commonData.profilePicture) {
                profileImageUrl = await uploadToS3(commonData.profilePicture, "profiles");
            }
            
            const profileData = {
                bio: commonData.bio,
                location: commonData.location,
                phoneNumber: commonData.phoneNumber,
                profileImageUrl: profileImageUrl,
                ...(userType === "INFLUENCER" ? {
                    fullName: influencerData.fullName,
                    username: influencerData.username,
                    niche: influencerData.niche,
                    gender: influencerData.gender,
                    dob: influencerData.dob,
                    socialLinks: {
                        instagram: influencerData.instagram,
                        youtube: influencerData.youtube,
                        tiktok: influencerData.tiktok,
                    }
                } : {
                    companyName: brandData.companyName,
                    industry: brandData.industry,
                    website: brandData.website,
                    companySize: brandData.companySize,
                })
            };

            if (user?.status === "PENDING") {
                await api.post("/auth/pending-profile", {
                    email: user.email,
                    profileData
                });
                setShowSuccessModal(true);
                return;
            }

            await api.patch("/profile/update_profile", profileData);

            alert("Profile Updated Successfully");
            const dashboardPath = userType === "BRAND" ? "/brand-dashboard" : "/influencer-dashboard";
            router.push(dashboardPath);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="p-6">Loading profile...</div>;
    }


    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-green-100 selection:text-green-900">
            <Navbar />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}


                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-linear-to-r from-emerald-400 to-teal-500"></div>
                        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">

                            {/* Section: Basic Info */}
                            <div className="space-y-8">
                                <div className="border-b border-gray-100 pb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                                    <p className="mt-1 text-sm text-gray-500">This will be displayed on your public profile.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-8 items-start">
                                    {/* Avatar Upload */}
                                    <div className="shrink-0 group relative">
                                        <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 group-hover:border-[#10B981] transition-all duration-300 flex items-center justify-center">
                                            {commonData.profilePicture ? (
                                                <Image unoptimized width={200} height={200} src={URL.createObjectURL(commonData.profilePicture)} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[#10B981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="mt-1 block text-xs font-medium text-gray-500">Upload Photo</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                        </div>
                                    </div>

                                    {/* Basic Inputs */}
                                    <div className="flex-1 w-full grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                rows={3}
                                                value={commonData.bio}
                                                onChange={handleCommonChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow"
                                                placeholder="Tell potential collaborators about yourself..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={commonData.location}
                                                    onChange={handleCommonChange}
                                                    className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={commonData.phoneNumber}
                                                onChange={handleCommonChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Specific Info */}
                            {userType === "INFLUENCER" ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-900">Influencer Details</h2>
                                        <p className="mt-1 text-sm text-gray-500">Help brands find you by adding your details.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                                        {/* Full Name & Username */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={influencerData.fullName}
                                                onChange={handleInfluencerChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                            <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#10B981] focus-within:border-[#10B981]">
                                                <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 sm:text-sm border-r border-gray-200">
                                                    @
                                                </span>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    required
                                                    value={influencerData.username}
                                                    onChange={handleInfluencerChange}
                                                    className="flex-1 block w-full border-none focus:ring-0 sm:text-sm p-3"
                                                    placeholder="janedoe"
                                                />
                                            </div>
                                        </div>

                                        {/* Niche & Gender */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Niche / Category</label>
                                            <select
                                                name="niche"
                                                value={influencerData.niche}
                                                onChange={handleInfluencerChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow bg-white"
                                            >
                                                <option value="">Select a Niche</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="beauty">Beauty</option>
                                                <option value="tech">Tech</option>
                                                <option value="travel">Travel</option>
                                                <option value="fitness">Fitness</option>
                                                <option value="lifestyle">Lifestyle</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                            <select
                                                name="gender"
                                                value={influencerData.gender}
                                                onChange={handleInfluencerChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow bg-white"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                                <option value="prefer_not_to_say">Prefer not to say</option>
                                            </select>
                                        </div>

                                        {/* Social Media */}
                                        <div className="col-span-1 sm:col-span-2">
                                            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-4">Social Media Handles</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                                {['instagram', 'youtube', 'tiktok'].map((platform) => (
                                                    <div key={platform} className="relative rounded-md shadow-sm">
                                                        <input
                                                            type="text"
                                                            name={platform}
                                                            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                                            value={influencerData[platform as keyof typeof influencerData]}
                                                            onChange={handleInfluencerChange}
                                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow pl-10"
                                                        />
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <div className={`h-2 w-2 rounded-full ${influencerData[platform as keyof typeof influencerData] ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                    <div className="border-b border-gray-100 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-900">Brand Details</h2>
                                        <p className="mt-1 text-sm text-gray-500">Tell us about your company and what you are looking for.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                                        {/* Company Name */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                required
                                                value={brandData.companyName}
                                                onChange={handleBrandChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow"
                                                placeholder="Acme Corp"
                                            />
                                        </div>

                                        {/* Industry & Size */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                                            <select
                                                name="industry"
                                                value={brandData.industry}
                                                onChange={handleBrandChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow bg-white"
                                            >
                                                <option value="">Select Industry</option>
                                                <option value="retail">Retail & E-commerce</option>
                                                <option value="technology">Technology</option>
                                                <option value="health">Health & Wellness</option>
                                                <option value="fashion">Fashion & Apparel</option>
                                                <option value="food">Food & Beverage</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                                            <select
                                                name="companySize"
                                                value={brandData.companySize}
                                                onChange={handleBrandChange}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm p-3 border transition-shadow bg-white"
                                            >
                                                <option value="">Select Size</option>
                                                <option value="1-10">1-10 Employees</option>
                                                <option value="11-50">11-50 Employees</option>
                                                <option value="51-200">51-200 Employees</option>
                                                <option value="200+">200+ Employees</option>
                                            </select>
                                        </div>

                                        {/* Website */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                                            <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#10B981] focus-within:border-[#10B981]">
                                                <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 sm:text-sm border-r border-gray-200">
                                                    https://
                                                </span>
                                                <input
                                                    type="text"
                                                    name="website"
                                                    placeholder="www.example.com"
                                                    value={brandData.website}
                                                    onChange={handleBrandChange}
                                                    className="flex-1 block w-full border-none focus:ring-0 sm:text-sm p-3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-[#10B981] hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {loading ? "Updating..." : "Save Changes"}
                                </button>
                                <p className="mt-4 text-center text-sm text-gray-400">
                                    By clicking Create Profile, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Submitted!</h3>
                        <p className="text-gray-500 mb-8">
                            Your details are being reviewed by our team. We'll notify you once your account is verified.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push("/");
                            }}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center bg-white">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                        <span className="text-lg font-bold text-gray-900">Noillin</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2026 Noillin Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
