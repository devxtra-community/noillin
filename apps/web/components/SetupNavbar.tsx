"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import NoillinIcon from "./NoillinIcon";

import { useAuthStore } from "@/store/auth.store";


interface SetupNavbarProps {
  step?: 1 | 2 | 3;
  mode?: "onboarding" | "reset";
}

export default function SetupNavbar({ step = 3, mode = "onboarding" }: SetupNavbarProps) {
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
          <div className="flex items-center">
            <NoillinIcon />
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
