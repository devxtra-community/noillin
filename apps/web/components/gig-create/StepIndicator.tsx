import React from 'react';
import { FaCheck } from 'react-icons/fa';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

const steps = [
    { id: 1, label: 'Details' },
    { id: 2, label: 'Deliverables' },
    { id: 3, label: 'Pricing' },
    { id: 4, label: 'Review' },
];

export function StepIndicator({ currentStep = 1 }: StepIndicatorProps) {
    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Circle & Label Container */}
                            <div className="relative flex flex-col items-center z-10">
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                                        isCompleted
                                            ? "bg-green-600 border-green-600 text-white"
                                            : isCurrent
                                                ? "bg-white border-green-600 text-green-600 ring-4 ring-green-50"
                                                : "bg-white border-gray-200 text-gray-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <FaCheck className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </div>

                                <span
                                    className={cn(
                                        "absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-200",
                                        isCurrent ? "text-green-700" : "text-gray-500"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connecting Line */}
                            {!isLast && (
                                <div className="flex-1 h-px mx-4 bg-gray-200">
                                    <div
                                        className="h-full bg-green-600 transition-all duration-300 ease-out"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
