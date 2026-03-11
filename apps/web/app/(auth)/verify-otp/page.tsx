"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import api from "@/lib/axios.client";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Redirect back if no email is provided
  useEffect(() => {
    if (!email) {
      router.push("/forget-Password");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-reset-otp", { email, otp });
      const resetSessionToken = response.data?.data?.resetSessionToken;
      
      if (resetSessionToken) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetSessionToken)}`);
      } else {
        setError("Invalid response from server. Missing token.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify OTP.";
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

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError("");
    setResendMessage("");
    try {
      await api.post("/auth/forgot-password", { email });
      setResendMessage("OTP resent successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend OTP.";
      const errorObj = err as { response?: { data?: { message?: string } } };
      if (errorObj.response?.data?.message) {
        setError(errorObj.response.data.message);
      } else {
        setError(errorMessage);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl text-black font-bold text-center mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit OTP sent to {email ? <span className="font-semibold text-gray-700">{email}</span> : "your email"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {resendMessage && <div className="text-green-600 text-sm text-center">{resendMessage}</div>}
          
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
            required
            placeholder="Enter OTP"
            className="w-full px-4 text-black py-2 text-center tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className={`w-full bg-green-700 text-white py-2 rounded-lg transition ${loading || otp.length < 6 ? "opacity-70 cursor-not-allowed" : "hover:bg-green-800"}`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Didn’t receive OTP?{" "}
          <button 
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            {resendLoading ? "Resending..." : "Resend"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}