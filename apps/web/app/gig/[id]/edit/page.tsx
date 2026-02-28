"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaCheck } from "react-icons/fa";

import api from "@/lib/axios.client";
import Navbar from "@/components/Navbar";
import { StepIndicator } from "@/components/gig-create/StepIndicator";
import { GigDetails } from "@/components/gig-create/GigDetails";
import { Deliverables } from "@/components/gig-create/Deliverables";
import { Pricing } from "@/components/gig-create/Pricing";
import { Availability } from "@/components/gig-create/Availability";
import { ReviewAndPublish } from "@/components/gig-create/ReviewAndPublish";
import { useGigCreateStore } from "@/store/gigCreate.store";

export default function EditGigPage() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
    const setMode = useGigCreateStore((s) => s.setMode);
  const {
    setGigId,
    setDetails,
    setDeliverables,
    setPricing,
    setAvailability
  } = useGigCreateStore();
  
  useEffect(() => {
    setMode("edit");
    const fetchGig = async () => {
      const res = await api.get(`/gigs/${params.id}`);
      const gig = res.data;

      setGigId(gig._id);

      setDetails({
        title: gig.title,
        shortDescription: gig.shortDescription,
        category: gig.category,
        platform: gig.platform,
        tags: gig.tags
      });

      setDeliverables(gig.deliverables);
      setPricing(gig.pricing);
      console.log(gig.primaryInfluencerId)
      const influencerId =
      typeof gig.primaryInfluencerId === "string"
        ? gig.primaryInfluencerId
        : gig.primaryInfluencerId?._id;

    if (influencerId) {
      const availabilityRes = await api.get(
        `/availability/${influencerId}`
      );

      setAvailability(availabilityRes.data.data);
    }
    };

    fetchGig();
  }, [params.id]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Edit Gig
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-8 border-b border-gray-50 bg-white">
            <StepIndicator currentStep={currentStep} />
          </div>

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
              <Availability onBack={prevStep} onNext={nextStep} />
            )}
            {currentStep === 5 && (
              <ReviewAndPublish
                onBack={prevStep}
                onNext={nextStep}
                goToStep={goToStep}
              />
            )}
            {currentStep === 6 && (
                                        <div className="p-16 text-center space-y-6">
                                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FaCheck size={40} />
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900">Gig Published Successfully!</h2>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                Your gig is now live and visible to brands. You can manage it from your dashboard.
                                            </p>
                                            <button
                                                onClick={() => window.location.href = "/dashboard"}
                                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all mt-6"
                                            >
                                                Go to Dashboard
                                            </button>
                                        </div>
                                    )}
          </div>
        </div>
      </div>
    </div>
  );
}