import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStep7Schema } from '../../utils/schemas/step7Schema';
import useFormStore from '../../store/useFormStore';
import FileUpload from '../common/FileUpload';
import SignatureCanvas from '../common/SignatureCanvas';
import StepNavigation from '../wizard/StepNavigation';
import { FileUp, Info, ShieldCheck } from 'lucide-react';

export default function Step7Documents() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore();
  
  const loanType = formData.loanType || 'Personal';
  const employmentType = formData.employmentType || 'Salaried';
  const isPanVerified = formData.panVerified === true;

  const step7Schema = useMemo(
    () => getStep7Schema(loanType, employmentType, isPanVerified),
    [loanType, employmentType, isPanVerified]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      panCard: formData.panCard || null,
      aadhaarFront: formData.aadhaarFront || null,
      aadhaarBack: formData.aadhaarBack || null,
      bankStatements: formData.bankStatements || null,
      photograph: formData.photograph || null,
      eSignature: formData.eSignature || '',
      salarySlips: formData.salarySlips || null,
      itrDocuments: formData.itrDocuments || null,
      propertyDocuments: formData.propertyDocuments || null,
      businessRegistration: formData.businessRegistration || null,
      gstReturns: formData.gstReturns || null,
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const imageAndPdf = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'] };
  const pdfOnly = { 'application/pdf': ['.pdf'] };
  const imageOnly = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileUp className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload & E-Signature</h2>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-start gap-3 text-sm text-gray-800">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Important Instructions:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Images will be automatically compressed to save data.</li>
            <li>Ensure all documents are clear and legible.</li>
            <li>Maximum file sizes: Images (2MB), Standard PDFs (5MB), Bank/Property docs (10MB).</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Core Identity Documents */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Identity Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isPanVerified && (
              <Controller
                name="panCard"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="PAN Card Copy"
                    required
                    acceptedFileTypes={imageAndPdf}
                    maxSizeMB={5}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.panCard}
                  />
                )}
              />
            )}
            
            <Controller
              name="photograph"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Passport Size Photograph"
                  required
                  acceptedFileTypes={imageOnly}
                  maxSizeMB={2}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.photograph}
                />
              )}
            />

            <Controller
              name="aadhaarFront"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Aadhaar Card (Front)"
                  required
                  acceptedFileTypes={imageAndPdf}
                  maxSizeMB={5}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.aadhaarFront}
                />
              )}
            />

            <Controller
              name="aadhaarBack"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Aadhaar Card (Back)"
                  required
                  acceptedFileTypes={imageAndPdf}
                  maxSizeMB={5}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.aadhaarBack}
                />
              )}
            />
          </div>
        </div>

        {/* Financial Documents */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={employmentType === 'Salaried' ? "md:col-span-2" : ""}>
              <Controller
                name="bankStatements"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Bank Statements (Last 6 months)"
                    required
                    acceptedFileTypes={pdfOnly}
                    maxSizeMB={10}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.bankStatements}
                  />
                )}
              />
            </div>

            {employmentType === 'Salaried' && (
              <div className="md:col-span-2">
                <Controller
                  name="salarySlips"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      label="Salary Slips (Last 3 months)"
                      required
                      acceptedFileTypes={pdfOnly}
                      maxSizeMB={5}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.salarySlips}
                    />
                  )}
                />
              </div>
            )}

            {(employmentType === 'Self-Employed' || employmentType === 'Business Owner') && (
              <Controller
                name="itrDocuments"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="ITR Documents (Last 2 years)"
                    required
                    acceptedFileTypes={pdfOnly}
                    maxSizeMB={5}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.itrDocuments}
                  />
                )}
              />
            )}
            
            {loanType === 'Business' && (
              <>
                <Controller
                  name="businessRegistration"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      label="Business Registration Certificate"
                      required
                      acceptedFileTypes={pdfOnly}
                      maxSizeMB={5}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.businessRegistration}
                    />
                  )}
                />
                <Controller
                  name="gstReturns"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      label="GST Returns (Last 4 quarters)"
                      required
                      acceptedFileTypes={pdfOnly}
                      maxSizeMB={5}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.gstReturns}
                    />
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Loan Specific Documents */}
        {loanType === 'Home' && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Property Documents</h3>
            
            <Controller
              name="propertyDocuments"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Property Documents (Title Deed, Agreement, etc.)"
                  required
                  acceptedFileTypes={pdfOnly}
                  maxSizeMB={10}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.propertyDocuments}
                />
              )}
            />
          </div>
        )}

        {/* E-Signature */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Digital Signature</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide your signature below. This will be affixed to your loan application form.
          </p>
          
          <div className="max-w-md mx-auto">
            <Controller
              name="eSignature"
              control={control}
              render={({ field }) => (
                <SignatureCanvas
                  label="Applicant Signature"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.eSignature}
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
        />
      </form>
    </div>
  );
}
