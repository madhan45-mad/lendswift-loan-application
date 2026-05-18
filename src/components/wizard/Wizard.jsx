import React from 'react';
import useFormStore from '../../store/useFormStore';
import ProgressBar from './ProgressBar';

// Placeholder step components until we build them
const Step1LoanType = React.lazy(() => import('../steps/Step1LoanType'));
const Step2PersonalInfo = React.lazy(() => import('../steps/Step2PersonalInfo'));
const Step3KYC = React.lazy(() => import('../steps/Step3KYC'));
const Step4Address = React.lazy(() => import('../steps/Step4Address'));
const Step5Employment = React.lazy(() => import('../steps/Step5Employment'));
const Step6CoApplicant = React.lazy(() => import('../steps/Step6CoApplicant'));
const Step7Documents = React.lazy(() => import('../steps/Step7Documents'));
const Step8Review = React.lazy(() => import('../steps/Step8Review'));

import useAutoSave from '../../hooks/useAutoSave';
import { Save } from 'lucide-react';

export default function Wizard() {
  const currentStep = useFormStore((state) => state.currentStep);
  const { lastSaved } = useAutoSave();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1LoanType />;
      case 2:
        return <Step2PersonalInfo />;
      case 3:
        return <Step3KYC />;
      case 4:
        return <Step4Address />;
      case 5:
        return <Step5Employment />;
      case 6:
        return <Step6CoApplicant />;
      case 7:
        return <Step7Documents />;
      case 8:
        return <Step8Review />;
      default:
        return <Step1LoanType />;
    }
  };

  return (
    <div className="relative">
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="absolute top-0 right-0 flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 shadow-sm animate-in fade-in duration-500">
          <Save className="w-3 h-3 text-accent" />
          Draft saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      <ProgressBar currentStep={currentStep} />
      <div className="mt-8">
        <React.Suspense fallback={<div className="p-10 text-center animate-pulse text-gray-500">Loading step...</div>}>
          {renderStep()}
        </React.Suspense>
      </div>
    </div>
  );
}
