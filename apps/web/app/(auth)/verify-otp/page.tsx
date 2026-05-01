"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import api from "@/lib/axios.client";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verificationType = searchParams.get("type") || "reset";

  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Redirect back if no email is provided (only for reset flow)
  useEffect(() => {
    if (!email && verificationType === "reset") {
      router.push("/forget-Password");
    }
  }, [email, router, verificationType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (verificationType === "signup") {
        await api.post("/auth/verify-signup-otp", { email, otp });
        setSuccess(true);
      } else {
        const response = await api.post("/auth/verify-reset-otp", { email, otp });
        const resetSessionToken = response.data?.data?.resetSessionToken;

        if (resetSessionToken) {
          router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetSessionToken)}`);
        } else {
          setError("Invalid response from server. Missing token.");
        }
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
      if (verificationType === "signup") {
        await api.post("/auth/resend-signup-otp", { email });
      } else {
        await api.post("/auth/forgot-password", { email });
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative uppercase tracking-tight">
      <Link
        href="/forget-Password"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
      >
        <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium text-sm">Change Email</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >

        <h2 className="text-2xl font-black text-center mb-2 text-gray-900">
          {success ? "Success!" : "Verify OTP"}
        </h2>

        {success ? (
          <div className="text-center">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <div className="text-green-600 font-bold mb-2">
                Application Submitted
              </div>
              <p className="text-sm text-gray-600">
                Your email has been verified. Please wait for admin approval.
                We will notify you via email once your account is active.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter the 6-digit OTP sent to {email ? <span className="font-semibold text-gray-700">{email}</span> : "your email"}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {resendMessage && <div className="text-green-600 text-sm text-center">{resendMessage}</div>}

              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="Enter OTP"
                className="w-full px-4 text-center tracking-[1em] font-black text-2xl border border-gray-200 rounded-xl py-4 focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-gray-50/50"
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-8">
              Didn’t receive OTP?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-emerald-600 font-bold hover:underline bg-transparent border-none p-0 ml-1"
              >
                {resendLoading ? "Resending..." : "Resend"}
              </button>
            </p>
          </>
        )}

      </motion.div>
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