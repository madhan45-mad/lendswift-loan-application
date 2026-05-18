import { z } from 'zod';

// We just validate that a file object or truthy value exists for required docs
const requiredFile = z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Document is required');
const optionalFile = z.any().optional();

export const getStep7Schema = (loanType, employmentType, isPanVerified) => {
  return z.object({
    panCard: isPanVerified ? optionalFile : requiredFile,
    aadhaarFront: requiredFile,
    aadhaarBack: requiredFile,
    bankStatements: requiredFile,
    photograph: requiredFile,
    eSignature: z.string().min(10, 'E-Signature is required'),
    
    // Employment specific
    salarySlips: employmentType === 'Salaried' ? requiredFile : optionalFile,
    itrDocuments: (employmentType === 'Self-Employed' || employmentType === 'Business Owner') ? requiredFile : optionalFile,
    
    // Loan type specific
    propertyDocuments: loanType === 'Home' ? requiredFile : optionalFile,
    businessRegistration: loanType === 'Business' ? requiredFile : optionalFile,
    gstReturns: loanType === 'Business' ? requiredFile : optionalFile,
  });
};
