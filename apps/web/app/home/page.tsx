"use client";
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import RoleGuard from "@/components/rbac/RoleGuard";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.replace("/admindashboard");
    }
  }, [user, router]);

  if (user?.role === "ADMIN") return null;

  return (
    <RoleGuard allowedRoles={["INFLUENCER", "BRAND"]}>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome {user?.email} ({user?.role})</p>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
          >
            View Profile
          </button>

          <button
            onClick={() => router.push("/gig-list")}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
          >
            Explore Gigs
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
