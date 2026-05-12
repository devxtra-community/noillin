"use client";

import { useState } from "react";

import { StepIndicator } from "../gig-create/StepIndicator";
import { GigDetails } from "../gig-create/GigDetails";
import { Deliverables } from "../gig-create/Deliverables";
import { Pricing } from "../gig-create/Pricing";
import { ReviewAndPublish } from "../gig-create/ReviewAndPublish";

export default function GigWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const next = () => setCurrentStep((prev) => prev + 1);
  const back = () => setCurrentStep((prev) => prev - 1);

  return (
    <div>
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && <GigDetails onNext={next} />}
      {currentStep === 2 && <Deliverables onNext={next} onBack={back} />}
      {currentStep === 3 && <Pricing onNext={next} onBack={back} />}
      {currentStep === 4 && (
        <ReviewAndPublish
          onBack={back}
          onNext={next}
          goToStep={setCurrentStep}
        />
        
      )}
      {currentStep === 5 && (
        <div className="p-16 text-center">
          <h2>Gig Published Successfully!</h2>
        </div>
      )}
    </div>
  );
}