import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema } from '../../utils/schemas/step4Schema';
import useFormStore from '../../store/useFormStore';
import usePinCodeLookup from '../../hooks/usePinCodeLookup';
import Input from '../common/Input';
import Select from '../common/Select';
import StepNavigation from '../wizard/StepNavigation';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function Step4Address() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();
  const { lookup, isLoading: isPinLoading, error: pinError } = usePinCodeLookup();
  const [stateMismatchWarning, setStateMismatchWarning] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      currentAddress: formData.currentAddress || {
        addressLine1: '', addressLine2: '', pinCode: '', city: '', state: '', postOffice: ''
      },
      residenceType: formData.residenceType || '',
      rentAmount: formData.rentAmount || '',
      yearsAtAddress: formData.yearsAtAddress ?? '',
      isSameAsCurrent: formData.isSameAsCurrent ?? true,
      permanentAddress: formData.permanentAddress || {
        addressLine1: '', addressLine2: '', pinCode: '', city: '', state: '', postOffice: ''
      },
      previousAddress: formData.previousAddress || {
        addressLine1: '', addressLine2: '', pinCode: '', city: '', state: '', postOffice: ''
      },
    },
    mode: 'onTouched',
  });

  const residenceType = watch('residenceType');
  const yearsAtAddress = watch('yearsAtAddress');
  const isSameAsCurrent = watch('isSameAsCurrent');
  
  const currentPin = watch('currentAddress.pinCode');
  const currentState = watch('currentAddress.state');

  // Handle PIN code lookup for current address
  useEffect(() => {
    const fetchPinDetails = async () => {
      if (currentPin && currentPin.length === 6) {
        const details = await lookup(currentPin);
        if (details) {
          setValue('currentAddress.city', details.city, { shouldValidate: true });
          setValue('currentAddress.state', details.state, { shouldValidate: true });
          setValue('currentAddress.postOffice', details.postOffice);
          setStateMismatchWarning(null);
        }
      }
    };
    fetchPinDetails();
  }, [currentPin, lookup, setValue]);

  // Handle cross-validation warning for state mismatch
  useEffect(() => {
    const checkStateMismatch = async () => {
      if (currentPin && currentPin.length === 6 && currentState) {
        const details = await lookup(currentPin);
        if (details && details.state.toLowerCase() !== currentState.toLowerCase()) {
          setStateMismatchWarning(`Warning: State entered (${currentState}) does not match PIN code state (${details.state})`);
        } else {
          setStateMismatchWarning(null);
        }
      }
    };
    checkStateMismatch();
  }, [currentState, currentPin, lookup]);

  // Handle 'Same as permanent' logic
  useEffect(() => {
    if (isSameAsCurrent) {
      const current = watch('currentAddress');
      setValue('permanentAddress', current, { shouldValidate: true });
    }
  }, [isSameAsCurrent, watch, setValue]);

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const renderAddressFields = (prefix, label) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        {label}
      </h3>
      
      <Input
        label="Address Line 1"
        placeholder="House/Flat No., Building Name"
        error={errors[prefix]?.addressLine1}
        required
        {...register(`${prefix}.addressLine1`)}
      />
      
      <Input
        label="Address Line 2 (Optional)"
        placeholder="Street, Landmark, Area"
        error={errors[prefix]?.addressLine2}
        {...register(`${prefix}.addressLine2`)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <Input
            label="PIN Code"
            type="number"
            placeholder="e.g. 560001"
            error={errors[prefix]?.pinCode || (prefix === 'currentAddress' ? pinError : null)}
            required
            {...register(`${prefix}.pinCode`)}
          />
          {prefix === 'currentAddress' && isPinLoading && (
            <div className="absolute right-3 top-9">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>
        
        <Input
          label="City"
          placeholder="e.g. Bengaluru"
          error={errors[prefix]?.city}
          required
          {...register(`${prefix}.city`)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <Input
            label="State"
            placeholder="e.g. Karnataka"
            error={errors[prefix]?.state}
            required
            {...register(`${prefix}.state`)}
          />
          {prefix === 'currentAddress' && stateMismatchWarning && (
            <p className="text-sm text-warning flex items-start gap-1 mt-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {stateMismatchWarning}
            </p>
          )}
        </div>
        
        <Input
          label="Post Office (Auto-filled)"
          placeholder="e.g. Vidhana Soudha"
          error={errors[prefix]?.postOffice}
          readOnly
          className="bg-gray-50 text-gray-500"
          {...register(`${prefix}.postOffice`)}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          {renderAddressFields('currentAddress', 'Current Residential Address')}
          
          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Residence Type"
              options={[
                { value: 'Owned', label: 'Owned by Self/Spouse' },
                { value: 'Family', label: 'Owned by Parents/Family' },
                { value: 'Rented', label: 'Rented/Leased' },
                { value: 'Company', label: 'Company Provided' },
              ]}
              error={errors.residenceType}
              required
              {...register('residenceType')}
            />
            
            <Input
              label="Years at Current Address"
              type="number"
              placeholder="e.g. 5"
              error={errors.yearsAtAddress}
              required
              {...register('yearsAtAddress')}
            />
          </div>

          {residenceType === 'Rented' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                label="Monthly Rent Amount (₹)"
                type="number"
                placeholder="e.g. 15000"
                error={errors.rentAmount}
                required
                {...register('rentAmount')}
              />
            </div>
          )}
        </div>

        {/* Previous Address (if < 1 year) */}
        {Number(yearsAtAddress) === 0 && (
          <div className="bg-white p-6 rounded-xl border border-warning shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="bg-warning/10 text-warning-800 p-3 rounded-md text-sm mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Since you have lived at your current address for less than 1 year, please provide your previous address details.</p>
            </div>
            {renderAddressFields('previousAddress', 'Previous Address')}
          </div>
        )}

        {/* Permanent Address Toggle */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <input
              id="isSameAsCurrent"
              type="checkbox"
              className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary"
              {...register('isSameAsCurrent')}
            />
            <label htmlFor="isSameAsCurrent" className="font-medium text-gray-800 cursor-pointer">
              My permanent address is the same as my current address
            </label>
          </div>

          {!isSameAsCurrent && (
            <div className="border-t pt-6 animate-in fade-in duration-300">
              {renderAddressFields('permanentAddress', 'Permanent Address')}
            </div>
          )}
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
