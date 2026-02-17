"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null; // Prevent render before redirect

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome {user.email}</p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          View Profile
        </button>
      </div>
    </div>
  );
  
}
