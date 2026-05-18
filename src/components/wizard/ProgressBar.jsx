import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

const steps = [
  'Loan Info',
  'Personal',
  'KYC',
  'Address',
  'Employment',
  'Co-Applicant',
  'Documents',
  'Review',
];

export default function ProgressBar({ currentStep }) {
  // We'll skip some visual complexity on very small screens
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {/* Background line connecting all steps */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        
        {/* Active progress line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-accent transition-all duration-300 ease-in-out -z-10 -translate-y-1/2"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-300',
                  {
                    'bg-accent border-accent text-white': isCompleted,
                    'bg-primary border-primary text-white': isActive,
                    'bg-white border-gray-300 text-gray-400': !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : stepNumber}
              </div>
              <span 
                className={clsx(
                  'mt-2 text-xs font-medium hidden sm:block',
                  {
                    'text-gray-900': isActive || isCompleted,
                    'text-gray-400': !isActive && !isCompleted,
                  }
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Mobile step label */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-sm font-medium text-gray-900">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
