import React, { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStep5Schema } from '../../utils/schemas/step5Schema';
import useFormStore from '../../store/useFormStore';
import RadioGroup from '../common/RadioGroup';
import Input from '../common/Input';
import Select from '../common/Select';
import StepNavigation from '../wizard/StepNavigation';
import { Briefcase, Building2, UserCircle } from 'lucide-react';
import clsx from 'clsx';

export default function Step5Employment() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();
  const loanType = formData.loanType || 'Personal';
  
  const step5Schema = useMemo(() => getStep5Schema(loanType), [loanType]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      employmentType: formData.employmentType || '',
      companyName: formData.companyName || '',
      designation: formData.designation || '',
      monthlySalary: formData.monthlySalary || '',
      yearsOfExperience: formData.yearsOfExperience || '',
      businessName: formData.businessName || '',
      businessType: formData.businessType || '',
      annualTurnover: formData.annualTurnover || '',
      yearsInBusiness: formData.yearsInBusiness || '',
      monthlyIncome: formData.monthlyIncome || '',
      gstNumber: formData.gstNumber || '',
      officeAddress: formData.officeAddress || { addressLine1: '', city: '', state: '', pinCode: '' },
    },
    mode: 'onTouched',
  });

  const employmentType = watch('employmentType');

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const renderSalariedFields = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <UserCircle className="w-5 h-5" />
        <h3 className="font-semibold">Salaried Employee Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Company Name" placeholder="e.g. Acme Corp" error={errors.companyName} required {...register('companyName')} />
        <Input label="Designation" placeholder="e.g. Software Engineer" error={errors.designation} required {...register('designation')} />
        <Input label="Monthly Net Salary (₹)" type="number" placeholder="e.g. 75000" helpText="Min. ₹15,000" error={errors.monthlySalary} required {...register('monthlySalary')} />
        <Input label="Total Years of Experience" type="number" placeholder="e.g. 5" error={errors.yearsOfExperience} required {...register('yearsOfExperience')} />
      </div>
    </div>
  );

  const renderSelfEmployedFields = (isBusinessOwner) => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Building2 className="w-5 h-5" />
        <h3 className="font-semibold">{isBusinessOwner ? 'Business Owner Details' : 'Self-Employed / Professional Details'}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Business/Practice Name" placeholder="e.g. Sharma Associates" error={errors.businessName} required {...register('businessName')} />
        <Select
          label="Business Type"
          options={isBusinessOwner ? [
            { value: 'Proprietorship', label: 'Sole Proprietorship' },
            { value: 'Partnership', label: 'Partnership Firm' },
            { value: 'Private Limited', label: 'Private Limited Company' },
            { value: 'LLP', label: 'Limited Liability Partnership' },
          ] : [
            { value: 'Professional', label: 'Doctor/CA/Architect' },
            { value: 'Freelancer', label: 'Freelancer' },
            { value: 'Consultant', label: 'Consultant' },
            { value: 'Other', label: 'Other Services' },
          ]}
          error={errors.businessType}
          required
          {...register('businessType')}
        />
        <Input label="Annual Turnover (₹)" type="number" placeholder="e.g. 1500000" helpText="Last financial year" error={errors.annualTurnover} required {...register('annualTurnover')} />
        <Input label="Years in Business" type="number" placeholder="e.g. 3" helpText="Min. 2 years required" error={errors.yearsInBusiness} required {...register('yearsInBusiness')} />
        <Input label="Monthly Income (Net, ₹)" type="number" placeholder="e.g. 80000" error={errors.monthlyIncome} required {...register('monthlyIncome')} />
        
        {isBusinessOwner && (
          <Input 
            label="GST Number" 
            placeholder="e.g. 29ABCDE1234F1Z5" 
            error={errors.gstNumber} 
            className="uppercase"
            required 
            {...register('gstNumber', { onChange: (e) => e.target.value = e.target.value.toUpperCase() })} 
          />
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Office/Business Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Address Line 1" placeholder="Building/Street" error={errors.officeAddress?.addressLine1} required {...register('officeAddress.addressLine1')} />
          <Input label="PIN Code" type="number" placeholder="e.g. 560001" error={errors.officeAddress?.pinCode} required {...register('officeAddress.pinCode')} />
          <Input label="City" placeholder="e.g. Bengaluru" error={errors.officeAddress?.city} required {...register('officeAddress.city')} />
          <Input label="State" placeholder="e.g. Karnataka" error={errors.officeAddress?.state} required {...register('officeAddress.state')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Employment & Income Details</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <RadioGroup
            label="Employment Type"
            name="employmentType"
            options={[
              { value: 'Salaried', label: 'Salaried Employee' },
              { value: 'Self-Employed', label: 'Self-Employed Professional' },
              { value: 'Business Owner', label: 'Business Owner' },
            ]}
            layout="horizontal"
            error={errors.employmentType}
            required
            {...register('employmentType')}
          />
          {loanType === 'Business' && employmentType === 'Salaried' && (
            <p className="text-sm text-error mt-2">Note: Business loans require Self-Employed or Business Owner employment type.</p>
          )}
        </div>

        {employmentType && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            {employmentType === 'Salaried' && renderSalariedFields()}
            {employmentType === 'Self-Employed' && renderSelfEmployedFields(false)}
            {employmentType === 'Business Owner' && renderSelfEmployedFields(true)}
          </div>
        )}

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
