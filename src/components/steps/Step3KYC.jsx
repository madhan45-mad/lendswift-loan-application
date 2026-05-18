import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '../../utils/schemas/step3Schema';
import useFormStore from '../../store/useFormStore';
import useVerification from '../../hooks/useVerification';
import MaskedInput from '../common/MaskedInput';
import Input from '../common/Input';
import StepNavigation from '../wizard/StepNavigation';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export default function Step3KYC() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();
  const loanType = formData.loanType || 'Personal';

  const panVerification = useVerification('PAN', loanType);
  const aadhaarVerification = useVerification('Aadhaar', loanType);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      pan: formData.pan || '',
      panVerified: formData.panVerified || false,
      aadhaar: formData.aadhaar || '',
      aadhaarVerified: formData.aadhaarVerified || false,
      aadhaarConsent: formData.aadhaarConsent || false,
      voterId: formData.voterId || '',
      passport: formData.passport || '',
    },
    mode: 'onTouched',
  });

  const watchPan = watch('pan');
  const watchAadhaar = watch('aadhaar');
  const watchPanVerified = watch('panVerified');
  const watchAadhaarVerified = watch('aadhaarVerified');

  // Handle PAN Verification
  useEffect(() => {
    const handlePanVerification = async () => {
      if (watchPan && watchPan.length === 10) {
        if (!watchPanVerified) {
          const isValidFormat = await panVerification.verify(watchPan);
          if (isValidFormat) {
            setValue('panVerified', true, { shouldValidate: true });
          } else {
            setValue('panVerified', false);
          }
        }
      } else {
        setValue('panVerified', false);
        panVerification.reset();
      }
    };
    handlePanVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPan]);

  // Handle Aadhaar Verification
  useEffect(() => {
    const handleAadhaarVerification = async () => {
      if (watchAadhaar && watchAadhaar.length === 12) {
        if (!watchAadhaarVerified) {
          const isValidFormat = await aadhaarVerification.verify(watchAadhaar);
          if (isValidFormat) {
            setValue('aadhaarVerified', true, { shouldValidate: true });
          } else {
            setValue('aadhaarVerified', false);
          }
        }
      } else {
        setValue('aadhaarVerified', false);
        aadhaarVerification.reset();
      }
    };
    handleAadhaarVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAadhaar]);

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const renderVerificationStatus = (verificationState, isFormVerified) => {
    if (verificationState.isVerifying) {
      return (
        <span className="flex items-center text-sm text-primary font-medium mt-2 bg-primary/10 px-3 py-1.5 rounded-md w-max">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Verifying with authority...
        </span>
      );
    }
    if (isFormVerified) {
      return (
        <span className="flex items-center text-sm text-accent font-medium mt-2 bg-accent/10 px-3 py-1.5 rounded-md w-max">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Verified successfully
        </span>
      );
    }
    if (verificationState.error) {
      return (
        <span className="flex items-center text-sm text-error font-medium mt-2">
          {verificationState.error}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Identity Verification (KYC)</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          {/* PAN Section */}
          <div className="space-y-2">
            <MaskedInput
              label="PAN Number"
              placeholder="e.g. ABCDE1234F"
              error={errors.pan}
              disabled={watchPanVerified}
              maxLength={10}
              className="uppercase"
              required
              {...register('pan', { 
                onChange: (e) => e.target.value = e.target.value.toUpperCase() 
              })}
            />
            {renderVerificationStatus(panVerification, watchPanVerified)}
            {errors.panVerified && !panVerification.isVerifying && !watchPanVerified && (
              <p className="text-sm text-error mt-1">{errors.panVerified.message}</p>
            )}
          </div>

          {/* Aadhaar Section */}
          <div className="space-y-2 border-t pt-6">
            <MaskedInput
              label="Aadhaar Number"
              placeholder="e.g. 123456789012"
              error={errors.aadhaar}
              disabled={watchAadhaarVerified}
              maxLength={12}
              required
              {...register('aadhaar')}
            />
            {renderVerificationStatus(aadhaarVerification, watchAadhaarVerified)}
            {errors.aadhaarVerified && !aadhaarVerification.isVerifying && !watchAadhaarVerified && (
              <p className="text-sm text-error mt-1">{errors.aadhaarVerified.message}</p>
            )}
            
            <div className="mt-4 flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center h-5">
                <input
                  id="aadhaarConsent"
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                  {...register('aadhaarConsent')}
                />
              </div>
              <div className="text-sm">
                <label htmlFor="aadhaarConsent" className="font-medium text-gray-800 cursor-pointer">
                  Aadhaar e-KYC Consent <span className="text-error">*</span>
                </label>
                <p className="text-gray-500 mt-1">
                  I hereby consent to LendSwift fetching my KYC details from UIDAI for the purpose of loan processing.
                </p>
                {errors.aadhaarConsent && (
                  <p className="text-error mt-1">{errors.aadhaarConsent.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Documents */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Documents (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Voter ID"
              placeholder="e.g. ABC1234567"
              error={errors.voterId}
              {...register('voterId', { 
                onChange: (e) => e.target.value = e.target.value.toUpperCase() 
              })}
            />
            
            {loanType === 'Home' && formData.loanAmount > 5000000 && (
              <Input
                label="Passport Number"
                placeholder="e.g. A1234567"
                error={errors.passport}
                helpText="Required for high-value home loans"
                {...register('passport', { 
                  onChange: (e) => e.target.value = e.target.value.toUpperCase() 
                })}
              />
            )}
          </div>
        </div>

        <StepNavigation 
          onPrev={prevStep}
          isFirstStep={false} 
          isLastStep={false}
          onSaveDraft={() => console.log('Draft save logic here')}
          disableNext={panVerification.isVerifying || aadhaarVerification.isVerifying}
        />
      </form>
    </div>
  );
}
