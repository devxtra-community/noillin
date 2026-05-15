"use client";

import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

import { StepIndicator } from "@/components/gig-create/StepIndicator";
import DashboardHeader from "@/components/DashboardHeader";
import { GigDetails } from "@/components/gig-create/GigDetails";
import { Deliverables } from "@/components/gig-create/Deliverables";
import { Pricing } from "@/components/gig-create/Pricing";
import { ReviewAndPublish } from "@/components/gig-create/ReviewAndPublish";
import { useGigCreateStore } from "@/store/gigCreate.store";

export default function GigCreatePage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const reset = useGigCreateStore((s) => s.reset);
    const setMode = useGigCreateStore((s) => s.setMode);

    useEffect(() => {
        reset();
        setMode("create");
    }, [reset, setMode]);

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const goToStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    return (

        <div className="min-h-screen bg-gray-50/50">
            <DashboardHeader />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">

                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-title-lg text-gray-900">Create a New Gig</h1>
                    <p className="text-body-md text-gray-500 mt-2">
                        {currentStep === 1 && "Set up your gig details to start connecting with brands."}
                        {currentStep === 2 && "Define clearly what you will deliver to the client."}
                        {currentStep === 3 && "Set your pricing and packages."}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Progress Indicator Container */}
                    <div className="px-8 py-8 border-b border-gray-50 bg-white">
                        <StepIndicator currentStep={currentStep} />
                    </div>

                    {/* Main Form Content */}
                    <div>
                        {currentStep === 1 && (
                            <GigDetails onNext={nextStep} />
                        )}
                        {currentStep === 2 && (
                            <Deliverables onBack={prevStep} onNext={nextStep} />
                        )}
                        {currentStep === 3 && (
                            <Pricing onBack={prevStep} onNext={nextStep} />
                        )}
                        {currentStep === 4 && (
                            <ReviewAndPublish onBack={prevStep} onNext={nextStep} goToStep={goToStep} />
                        )}
                        {currentStep === 5 && (
                            <div className="p-16 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCheck size={40} />
                                </div>
                                <h2 className="text-title-lg text-gray-900">Gig Published Successfully!</h2>
                                <p className="text-body-md text-gray-500 max-w-md mx-auto">
                                    Your gig is now live and visible to brands. You can manage it from your dashboard.
                                </p>
                                <button
                                    onClick={() => window.location.href = "/influencer-dashboard"}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all mt-6"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                        {/* Future steps will go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}
