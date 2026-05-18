import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../utils/schemas/step2Schema';
import useFormStore from '../../store/useFormStore';
import Input from '../common/Input';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';
import StepNavigation from '../wizard/StepNavigation';

export default function Step2PersonalInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: formData.fullName || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || '',
      maritalStatus: formData.maritalStatus || '',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      email: formData.email || '',
      mobileNumber: formData.mobileNumber || '',
      alternateMobile: formData.alternateMobile || '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name (as per PAN)"
              placeholder="e.g. Rahul Sharma"
              error={errors.fullName}
              required
              {...register('fullName')}
            />
            
            <Input
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth}
              helpText="Must be between 21 and 65 years"
              required
              {...register('dateOfBirth')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RadioGroup
              label="Gender"
              name="gender"
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              layout="horizontal"
              error={errors.gender}
              required
              {...register('gender')}
            />

            <Select
              label="Marital Status"
              options={[
                { value: 'Single', label: 'Single' },
                { value: 'Married', label: 'Married' },
                { value: 'Divorced', label: 'Divorced' },
                { value: 'Widowed', label: 'Widowed' },
              ]}
              error={errors.maritalStatus}
              required
              {...register('maritalStatus')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Family Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Father's Name"
              placeholder="e.g. Ramesh Sharma"
              error={errors.fatherName}
              required
              {...register('fatherName')}
            />
            
            <Input
              label="Mother's Name"
              placeholder="e.g. Priya Sharma"
              error={errors.motherName}
              required
              {...register('motherName')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Details</h3>
          
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul.sharma@example.com"
            error={errors.email}
            required
            {...register('email')}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="e.g. 9876543210"
              error={errors.mobileNumber}
              required
              {...register('mobileNumber')}
            />
            
            <Input
              label="Alternate Mobile (Optional)"
              type="tel"
              placeholder="e.g. 8765432109"
              error={errors.alternateMobile}
              {...register('alternateMobile')}
            />
          </div>
        </div>

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
