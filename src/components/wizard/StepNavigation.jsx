import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import clsx from 'clsx';

export default function StepNavigation({
  onPrev,
  onSaveDraft,
  isFirstStep,
  isLastStep,
  isLoading = false,
  nextLabel = 'Next',
  disableNext = false,
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-10 gap-4 pt-6 border-t border-gray-200">
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
      </div>

      <button
        type="submit"
        disabled={disableNext || isLoading}
        className={clsx(
          "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          {
            "bg-primary hover:bg-primary-dark": !disableNext && !isLoading,
            "bg-gray-400 cursor-not-allowed": disableNext || isLoading,
          }
        )}
      >
        {isLoading ? 'Processing...' : (isLastStep ? 'Submit Application' : nextLabel)}
        {!isLastStep && !isLoading && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
