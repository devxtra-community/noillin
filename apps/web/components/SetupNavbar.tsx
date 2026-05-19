"use client";

import { motion } from "framer-motion";

import NoillinIcon from "./NoillinIcon";

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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
      <div className="mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <div className="flex items-center">
            <NoillinIcon />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100/50">
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
