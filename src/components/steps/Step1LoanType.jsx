import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../utils/schemas/step1Schema';
import useFormStore from '../../store/useFormStore';
import RadioGroup from '../common/RadioGroup';
import Input from '../common/Input';
import Select from '../common/Select';
import StepNavigation from '../wizard/StepNavigation';

export default function Step1LoanType() {
  const { formData, updateFormData, nextStep } = useFormStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      loanType: formData.loanType || '',
      loanAmount: formData.loanAmount || '',
      loanTenure: formData.loanTenure || '',
      loanPurpose: formData.loanPurpose || '',
      referralCode: formData.referralCode || '',
    },
    mode: 'onTouched', // Validate on blur
  });

  const loanType = watch('loanType');

  // Purpose options depend on loan type
  const purposeOptions = useMemo(() => {
    switch (loanType) {
      case 'Personal':
        return [
          { value: 'Medical', label: 'Medical Emergency' },
          { value: 'Wedding', label: 'Wedding Expenses' },
          { value: 'Travel', label: 'Travel/Vacation' },
          { value: 'Education', label: 'Higher Education' },
          { value: 'Other', label: 'Other Personal Reason' },
        ];
      case 'Home':
        return [
          { value: 'Purchase', label: 'Purchase New Property' },
          { value: 'Construction', label: 'Home Construction' },
          { value: 'Renovation', label: 'Home Renovation' },
          { value: 'BalanceTransfer', label: 'Balance Transfer' },
        ];
      case 'Business':
        return [
          { value: 'WorkingCapital', label: 'Working Capital' },
          { value: 'Equipment', label: 'Equipment Purchase' },
          { value: 'Expansion', label: 'Business Expansion' },
        ];
      default:
        return [];
    }
  }, [loanType]);

  // When loanType changes, we might want to clear purpose if it's invalid
  useEffect(() => {
    if (loanType) {
      setValue('loanPurpose', '');
      // We should also trigger validation for amount and tenure as bounds have changed
      if (formData.loanAmount) trigger('loanAmount');
      if (formData.loanTenure) trigger('loanTenure');
    }
  }, [loanType, setValue, trigger, formData.loanAmount, formData.loanTenure]);

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const getTenureHelpText = () => {
    if (loanType === 'Personal') return '12 to 60 months';
    if (loanType === 'Home') return '60 to 360 months';
    if (loanType === 'Business') return '12 to 120 months';
    return 'Select a loan type first';
  };

  const getAmountHelpText = () => {
    if (loanType === 'Personal') return '₹50,000 to ₹10,00,000';
    if (loanType === 'Home') return '₹50,000 to ₹1,00,00,000';
    if (loanType === 'Business') return '₹50,000 to ₹50,00,000';
    return 'Select a loan type first';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Requirements</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <RadioGroup
            label="What type of loan are you looking for?"
            name="loanType"
            options={[
              { value: 'Personal', label: 'Personal Loan' },
              { value: 'Home', label: 'Home Loan' },
              { value: 'Business', label: 'Business Loan' },
            ]}
            layout="vertical"
            error={errors.loanType}
            required
            {...register('loanType')}
          />
        </div>

        {loanType && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Loan Amount (₹)"
                type="number"
                placeholder="e.g. 500000"
                error={errors.loanAmount}
                helpText={getAmountHelpText()}
                required
                {...register('loanAmount')}
              />
              <Input
                label="Loan Tenure (Months)"
                type="number"
                placeholder="e.g. 36"
                error={errors.loanTenure}
                helpText={getTenureHelpText()}
                required
                {...register('loanTenure')}
              />
            </div>

            <Select
              label="Loan Purpose"
              options={purposeOptions}
              error={errors.loanPurpose}
              required
              {...register('loanPurpose')}
            />

            <Input
              label="Referral Code (Optional)"
              placeholder="e.g. REF12345"
              error={errors.referralCode}
              helpText="6-10 alphanumeric characters"
              {...register('referralCode')}
            />
          </div>
        )}

        <StepNavigation 
          isFirstStep={true} 
          isLastStep={false}
          onSaveDraft={() => console.log('Draft save logic here')} 
          disableNext={!isValid && false} // React Hook form handles submit validation, so we can let them click to see errors
        />
      </form>
    </div>
  );
}
