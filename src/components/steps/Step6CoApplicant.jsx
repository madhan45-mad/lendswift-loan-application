import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStep6Schema } from '../../utils/schemas/step6Schema';
import useFormStore from '../../store/useFormStore';
import useVerification from '../../hooks/useVerification';
import Input from '../common/Input';
import Select from '../common/Select';
import MaskedInput from '../common/MaskedInput';
import SignatureCanvas from '../common/SignatureCanvas';
import StepNavigation from '../wizard/StepNavigation';
import { Users, Info, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Step6CoApplicant() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();
  
  const loanType = formData.loanType || 'Personal';
  const loanAmount = Number(formData.loanAmount) || 0;
  const maritalStatus = formData.maritalStatus || 'Single';

  const isRequired = useMemo(() => {
    if (loanType === 'Home') return true;
    if (loanType === 'Personal' && loanAmount > 500000) return true;
    if (loanType === 'Business' && loanAmount > 2000000) return true;
    return false;
  }, [loanType, loanAmount]);

  const step6Schema = useMemo(() => getStep6Schema(isRequired), [isRequired]);

  const panVerification = useVerification('PAN', loanType);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      hasCoApplicant: formData.hasCoApplicant || isRequired,
      coApplicantName: formData.coApplicantName || '',
      relationship: formData.relationship || (maritalStatus === 'Married' ? 'Spouse' : ''),
      coApplicantPan: formData.coApplicantPan || '',
      coApplicantPanVerified: formData.coApplicantPanVerified || false,
      coApplicantIncome: formData.coApplicantIncome || '',
      coApplicantConsent: formData.coApplicantConsent || false,
      coApplicantSignature: formData.coApplicantSignature || '',
    },
    mode: 'onTouched',
  });

  const watchPan = watch('coApplicantPan');
  const watchPanVerified = watch('coApplicantPanVerified');

  useEffect(() => {
    const handlePanVerification = async () => {
      if (watchPan && watchPan.length === 10) {
        if (!watchPanVerified) {
          const isValidFormat = await panVerification.verify(watchPan);
          if (isValidFormat) {
            setValue('coApplicantPanVerified', true, { shouldValidate: true });
          } else {
            setValue('coApplicantPanVerified', false);
          }
        }
      } else {
        setValue('coApplicantPanVerified', false);
        panVerification.reset();
      }
    };
    if (isRequired) {
      handlePanVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPan, isRequired]);

  const onSubmit = (data) => {
    updateFormData({ ...data, hasCoApplicant: isRequired });
    nextStep();
  };

  const renderVerificationStatus = () => {
    if (panVerification.isVerifying) {
      return (
        <span className="flex items-center text-sm text-primary font-medium mt-2 bg-primary/10 px-3 py-1.5 rounded-md w-max">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
        </span>
      );
    }
    if (watchPanVerified) {
      return (
        <span className="flex items-center text-sm text-accent font-medium mt-2 bg-accent/10 px-3 py-1.5 rounded-md w-max">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Verified
        </span>
      );
    }
    if (panVerification.error) {
      return <span className="flex items-center text-sm text-error font-medium mt-2">{panVerification.error}</span>;
    }
    return null;
  };

  if (!isRequired) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-blue-50 text-primary p-6 rounded-xl border border-blue-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <Info className="w-12 h-12 mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Co-Applicant Not Required</h2>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            Based on your selected loan type and amount, a co-applicant is not mandatory for this application. You can proceed to the next step.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepNavigation 
            onPrev={prevStep}
            isFirstStep={false} 
            isLastStep={false}
            onSaveDraft={() => console.log('Draft save logic here')} 
          />
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Co-Applicant Details</h2>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm text-gray-800">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p>A co-applicant is required for your {loanType} Loan of {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(loanAmount)}.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Co-Applicant Full Name" placeholder="e.g. Priya Sharma" error={errors.coApplicantName} required {...register('coApplicantName')} />
            <Select
              label="Relationship with Applicant"
              options={[
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Parent', label: 'Parent' },
                { value: 'Sibling', label: 'Sibling' },
                { value: 'Business Partner', label: 'Business Partner' },
              ]}
              error={errors.relationship}
              required
              {...register('relationship')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <MaskedInput
                label="Co-Applicant PAN"
                placeholder="e.g. ABCDE1234F"
                error={errors.coApplicantPan}
                disabled={watchPanVerified}
                maxLength={10}
                className="uppercase"
                required
                {...register('coApplicantPan', { onChange: (e) => e.target.value = e.target.value.toUpperCase() })}
              />
              {renderVerificationStatus()}
              {errors.coApplicantPanVerified && !panVerification.isVerifying && !watchPanVerified && (
                <p className="text-sm text-error mt-1">{errors.coApplicantPanVerified.message}</p>
              )}
            </div>

            <Input 
              label="Monthly Income (₹)" 
              type="number" 
              placeholder="e.g. 50000" 
              error={errors.coApplicantIncome} 
              helpText="Added to primary applicant for EMI calculation"
              required 
              {...register('coApplicantIncome')} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Consent & Signature</h3>
          
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center h-5">
              <input
                id="coApplicantConsent"
                type="checkbox"
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                {...register('coApplicantConsent')}
              />
            </div>
            <div className="text-sm">
              <label htmlFor="coApplicantConsent" className="font-medium text-gray-800 cursor-pointer">
                Co-Applicant Consent <span className="text-error">*</span>
              </label>
              <p className="text-gray-500 mt-1">
                I agree to be a co-applicant for this loan and authorise LendSwift to verify my PAN and credit information.
              </p>
              {errors.coApplicantConsent && (
                <p className="text-error mt-1">{errors.coApplicantConsent.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Controller
              name="coApplicantSignature"
              control={control}
              render={({ field }) => (
                <SignatureCanvas
                  label="Co-Applicant Signature"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.coApplicantSignature}
                  required
                />
              )}
            />
          </div>
        </div>

        <StepNavigation 
          onPrev={prevStep}
          isFirstStep={false} 
          isLastStep={false}
          onSaveDraft={() => console.log('Draft save logic here')} 
          disableNext={panVerification.isVerifying}
        />
      </form>
    </div>
  );
}
