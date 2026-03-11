"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/axios.client";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      // Axios error objects usually have err.response?.data?.message
      const errorObj = err as { response?: { data?: { message?: string } } };
      if (errorObj.response?.data?.message) {
        setError(errorObj.response.data.message);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-800 text-center mb-6">
          Enter your email to receive OTP
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-700 text-white py-2 rounded-lg transition cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-800"}`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          Remembered password?{" "}
          <Link href="/login" className="text-blue-600 cursor-pointer hover:underline">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}
