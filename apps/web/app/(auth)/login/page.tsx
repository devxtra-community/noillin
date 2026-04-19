"use client";

import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";



function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"BRAND" | "INFLUENCER">("BRAND");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const urlRole = searchParams.get("role")?.toUpperCase();
    if (urlRole === "INFLUENCER" || urlRole === "BRAND") {
      setRole(urlRole as "BRAND" | "INFLUENCER");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value

    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: role
      }

      const response = await api.post("/auth/login", payload);

      // Access token is now in response.data.data.accessToken
      if (response.data.data?.accessToken) {
        const { accessToken, user } = response.data.data
        setAuth(accessToken, user)
        router.push("/home");;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
      >
        <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium text-sm">Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 sm:m-0"
      >

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Log in to your Noillin account as{" "}
            <span className="font-medium capitalize">{role.toLowerCase()}</span>
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-8 relative">
          <motion.div
            layoutId="roleTab"
            className="absolute inset-y-1 bg-white rounded-lg shadow-sm"
            initial={false}
            animate={{
              x: role === "BRAND" ? 0 : "100%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "calc(50% - 4px)" }}
          />
          <button
            type="button"
            onClick={() => setRole("BRAND")}
            className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10 ${role === "BRAND" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            Brand
          </button>

          <button
            type="button"
            onClick={() => setRole("INFLUENCER")}
            className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10 ${role === "INFLUENCER" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            Influencer
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-gray-50/50"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <p

                className="text-sm text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >

                <Link href="/forget-Password">forgot password</Link>

              </p>
            </div>

            <div className="relative group">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all bg-gray-50/50 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-1"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={showPassword ? "eye" : "eye-off"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : `Sign In as ${role === "BRAND" ? "Brand" : "Influencer"}`}
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
            Create new account
          </Link>
        </p>

        <p className="text-[10px] text-center text-gray-300 mt-8 uppercase tracking-[0.2em] font-black">
          Secure login · Data protected
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
