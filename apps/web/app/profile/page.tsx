"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import RoleGuard from "@/components/rbac/RoleGuard";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  interface ProfileResponse {
    email?: string;
    username?: string;
    fullName?: string;
    companyName?: string;
    bio?: string;
    location?: string;
    industry?: string;
    website?: string;
    isProfileComplete?: boolean;
    isVerified?: boolean;
  }

  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/get_profile");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <RoleGuard allowedRoles={["INFLUENCER"]}>
      <div className="p-10">
        <h1 className="text-2xl font-bold font-heading">My Profile</h1>
        <p className="text-gray-500">Account Role: <span className="font-bold text-emerald-600 uppercase">{user?.role}</span></p>

        {profile ? (
          <>
            <pre className="mt-6 bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm text-sm overflow-x-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>

            <button
              onClick={() => router.push("/profile-setup")}
              className="mt-8 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="mt-10 flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading profile data...</span>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
