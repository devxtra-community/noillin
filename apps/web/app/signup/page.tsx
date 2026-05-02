"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios.client";
import { useAuthStore } from "@/store/auth.store";
import SetupNavbar from "@/components/SetupNavbar";

function SignupForm() {
  const [role, setRole] = useState<"BRAND" | "INFLUENCER">("BRAND");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
      };

      await api.post("/auth/signup", payload);

      // Store a pending user in auth store so profile-setup knows the role & name
      useAuthStore.getState().setAuth("", {
        id: "pending",
        email: formData.email,
        fullName: formData.fullName,
        role: role,
        status: "PENDING",
      });

      const targetEmail = encodeURIComponent(formData.email);
      router.push(`/verify-otp?email=${targetEmail}&type=signup`);
    } catch (err) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj.response?.data?.message || (err instanceof Error ? err.message : "Signup failed. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <SetupNavbar step={1} />
      
      <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 sm:m-0"
      >

        <div className="text-center mb-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Join as a Brand or Influencer</p>
        </div>

        {(
          <>
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8 relative">
              <motion.div
                layoutId="roleTabSignup"
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
                Brand <br /> <span className="text-[10px] opacity-60 font-normal">Find and book</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INFLUENCER")}
                className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10 ${role === "INFLUENCER" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Influencer <br /> <span className="text-[10px] opacity-60 font-normal">Create and get paid</span>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 bg-gray-50/50"
                  placeholder="John Doe"
                />
              </div>
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
                  required
                  className="w-full border border-gray-200 rounded-xl text-gray-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 bg-gray-50/50"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Password
                  </label>

                </div>

                <div className="relative group">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 text-gray-800 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 bg-gray-50/50 pr-12"
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 bg-gray-50/50"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </form>

            <p className="text-sm text-center text-gray-400 mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>

            <p className="text-[10px] text-center text-gray-300 mt-8 uppercase tracking-[0.2em] font-black">
              Secure login · Data protected
            </p>
          </>
        )}
      </motion.div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}