"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios.client";

export default function ProfilePage() {
  const router = useRouter();
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
      const res = await api.get("/profile/get_profile");
      setProfile(res.data.data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <pre className="mt-6 bg-gray-100 p-4 rounded">
        {JSON.stringify(profile, null, 2)}
      </pre>

      <button
        onClick={() => router.push("/profile-setup")}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}
