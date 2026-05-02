"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useAuthStore } from "@/store/auth.store";

interface SetupNavbarProps {
  step?: 1 | 2 | 3;
  mode?: "onboarding" | "reset";
}

export default function SetupNavbar({ step = 3, mode = "onboarding" }: SetupNavbarProps) {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const onboardingSteps = [
    { id: 1, label: "Account Details", width: "33%" },
    { id: 2, label: "Security Verification", width: "66%" },
    { id: 3, label: "Profile Completion", width: "100%" },
  ];

  const resetSteps = [
    { id: 1, label: "Email Verification", width: "33%" },
    { id: 2, label: "OTP Security", width: "66%" },
    { id: 3, label: "New Password", width: "100%" },
  ];

  const steps = mode === "onboarding" ? onboardingSteps : resetSteps;
  const currentStep = steps.find((s) => s.id === step) || steps[2];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-sm">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5 text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Noillin
              </span>
            </Link>
            <div className="hidden sm:block h-6 w-[1px] bg-gray-200"></div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Step {step}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{currentStep.label}</span>
            </div>
          </div>

          {/* User Section / Help */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900 leading-none mb-1">{user?.fullName || "Account Setup"}</span>
                <span className="text-[10px] text-gray-400 leading-none">{user?.email}</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Account Recovery</span>
              </div>
            )}
            
            <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
            
            {user ? (
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-all duration-200"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <div className="p-1.5 rounded-full group-hover:bg-red-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Back to Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100/50 overflow-hidden">
        <motion.div 
          className="h-full bg-linear-to-r from-emerald-400 via-teal-500 to-[#10B981] animate-progress-flow" 
          initial={{ width: 0 }}
          animate={{ width: currentStep.width }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
    </nav>
  );
}
