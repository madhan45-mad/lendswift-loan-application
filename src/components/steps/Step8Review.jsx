import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step8Schema } from '../../utils/schemas/step8Schema';
import useFormStore from '../../store/useFormStore';
import { calculateEMI, formatINR } from '../../utils/emiCalculator';
import StepNavigation from '../wizard/StepNavigation';
import { FileSignature, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Step8Review() {
  const { formData, updateFormData, prevStep, setStep } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      consentAccuracy: false,
      consentCreditCheck: false,
      consentTerms: false,
      consentCommunication: false,
    },
    mode: 'onTouched',
  });

  const loanAmount = Number(formData.loanAmount) || 0;
  const loanTenure = Number(formData.loanTenure) || 12;
  const loanType = formData.loanType || 'Personal';
  
  const financialDetails = useMemo(() => {
    return calculateEMI(loanAmount, loanTenure, loanType);
  }, [loanAmount, loanTenure, loanType]);

  const applicantIncome = Number(formData.monthlySalary || formData.monthlyIncome) || 0;
  const coApplicantIncome = formData.hasCoApplicant ? (Number(formData.coApplicantIncome) || 0) : 0;
  const totalIncome = applicantIncome + coApplicantIncome;
  
  const emiRatio = totalIncome > 0 ? (financialDetails.emi / totalIncome) * 100 : 0;
  const showEmiWarning = emiRatio > 50;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateFormData(data);
    setApplicationId(`LS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    setIsSuccess(true);
    setIsSubmitting(false);
    // In a real app, we would clear localstorage here
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-10 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="text-lg text-gray-600">
          Your {loanType} loan application has been successfully submitted for processing.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8 inline-block text-left shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Application Reference Number</p>
          <p className="text-2xl font-mono font-bold text-primary tracking-wider">{applicationId}</p>
        </div>
        <p className="text-sm text-gray-500">
          We will notify you about the credit decision within 24-48 hours.
        </p>
      </div>
    );
  }

  const renderSummaryRow = (label, value, onEditStep) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-900">{value}</span>
        {onEditStep && (
          <button 
            type="button" 
            onClick={() => setStep(onEditStep)}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileSignature className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Pre-Approval Summary</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Application Details</h3>
            {renderSummaryRow('Loan Type', formData.loanType, 1)}
            {renderSummaryRow('Applicant Name', formData.fullName, 2)}
            {renderSummaryRow('Mobile Number', formData.mobileNumber, 2)}
            {renderSummaryRow('Employment', formData.employmentType, 5)}
            {formData.hasCoApplicant && renderSummaryRow('Co-Applicant', formData.coApplicantName, 6)}
          </div>

          {formData.eSignature && (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Digital Signature</h3>
              <div className="border rounded bg-gray-50 p-2 w-max">
                <img src={formData.eSignature} alt="Applicant Signature" className="h-20" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Declarations & Consents</h3>
              
              <div className="space-y-3">
                {[
                  { id: 'consentAccuracy', label: 'I confirm all information provided is accurate.' },
                  { id: 'consentCreditCheck', label: 'I authorise LendSwift to check my credit score via CIBIL/Equifax.' },
                  { id: 'consentTerms', label: 'I agree to the Terms and Conditions and Key Fact Statement.' },
                  { id: 'consentCommunication', label: 'I consent to receive communications regarding this application via SMS/WhatsApp.' },
                ].map((consent) => (
                  <div key={consent.id} className="flex items-start gap-3">
                    <input
                      id={consent.id}
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                      {...register(consent.id)}
                    />
                    <div className="text-sm">
                      <label htmlFor={consent.id} className="font-medium text-gray-800 cursor-pointer">
                        {consent.label}
                      </label>
                      {errors[consent.id] && (
                        <p className="text-error mt-0.5">{errors[consent.id].message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <StepNavigation 
              onPrev={prevStep}
              isFirstStep={false} 
              isLastStep={true}
              isLoading={isSubmitting}
              onSaveDraft={() => console.log('Draft save logic here')} 
            />
          </form>
        </div>

        {/* Right Column: Pre-Approval Card */}
        <div className="lg:col-span-1">
          <div className="bg-primary text-white p-6 rounded-xl shadow-lg sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Pre-Approval Summary</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-primary-100 text-sm">Loan Amount</p>
                <p className="text-2xl font-bold">{formatINR(loanAmount)}</p>
              </div>
              
              <div className="flex justify-between items-end border-b border-primary-light pb-4">
                <div>
                  <p className="text-primary-100 text-sm">Tenure</p>
                  <p className="text-lg font-semibold">{loanTenure} Months</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-100 text-sm">Interest Rate</p>
                  <p className="text-lg font-semibold">{financialDetails.interestRate}% p.a.</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-accent text-sm font-medium">Estimated EMI</p>
                <p className="text-3xl font-bold text-accent">{formatINR(financialDetails.emi)}</p>
              </div>

              {showEmiWarning && (
                <div className="bg-warning/20 border border-warning/50 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                  <p className="text-xs text-warning-100">
                    High EMI to Income ratio ({emiRatio.toFixed(1)}%). Additional verification may be required.
                  </p>
                </div>
              )}

              <div className="space-y-2 mt-6 pt-4 border-t border-primary-light text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-100">Processing Fee (1%)</span>
                  <span>{formatINR(financialDetails.processingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Total Interest Payable</span>
                  <span>{formatINR(financialDetails.totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
